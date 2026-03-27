import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { JOBS_URL } from '../config'
import AdPlaceholder from '../components/AdPlaceholder'
import { getJobPath } from '../utils/jobRoute'

const ITEMS_PER_PAGE = 9
const SAVED_JOBS_KEY = 'hiringstoday:saved-jobs'

function parseDate(dateString) {
  if (!dateString) return null
  const date = new Date(dateString)
  return Number.isNaN(date.getTime()) ? null : date
}

function formatDate(dateString) {
  const date = parseDate(dateString)
  if (!date) return dateString || 'Date unavailable'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function formatRelativeDate(dateString) {
  const date = parseDate(dateString)
  if (!date) return 'New listing'

  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays <= 0) return 'Posted today'
  if (diffInDays === 1) return 'Posted yesterday'
  if (diffInDays < 7) return `Posted ${diffInDays} days ago`

  return `Posted on ${formatDate(dateString)}`
}

function getAgeInDays(dateString) {
  const date = parseDate(dateString)
  if (!date) return null

  const diffInMs = Date.now() - date.getTime()
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24))
}

function isRemote(job) {
  if (job.remote) return true
  return /remote/i.test(job.location || '')
}

function getVisiblePages(page, totalPages) {
  const windowSize = 5
  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, start + windowSize - 1)
  const adjustedStart = Math.max(1, end - windowSize + 1)

  return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index)
}

function CompanyAvatar({ company, logoUrl }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${company} logo`}
        loading="lazy"
        className="h-12 w-12 rounded-2xl border border-white object-cover shadow-sm"
      />
    )
  }

  const letter = company?.trim()?.charAt(0)?.toUpperCase() || '?'

  return (
    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-700 to-[#db2b39] text-sm font-bold text-white shadow-md shadow-brand-800/25">
      {letter}
    </div>
  )
}

function JobSkeleton() {
  return (
    <div className="surface-muted animate-pulse p-5">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-2xl bg-slate-200" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-2/3 rounded bg-slate-200" />
          <div className="h-3 w-1/2 rounded bg-slate-200" />
          <div className="h-3 w-1/3 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  )
}

const searchTips = [
  {
    title: 'Start with freshness',
    description: 'Prioritize roles posted in the last week, then verify the employer page still shows the same opening.',
  },
  {
    title: 'Compare before you click',
    description: 'Use the role, company, location, and job type filters together so you can eliminate weak matches fast.',
  },
  {
    title: 'Verify the final step',
    description: 'Treat every listing as a lead, not a guarantee. Confirm compensation, location, and eligibility on the official site.',
  },
]

const trustChecks = [
  'Clear company name, role title, and location.',
  'A working apply link that points to the employer or original source.',
  'Recent posting date and no exaggerated urgency language.',
  'Enough context to understand seniority, work style, or core skills.',
]

const trustSignals = [
  'About, Privacy, Contact, and Disclaimer pages are publicly available.',
  'Applications continue to official employer or original source pages.',
  'Users can report broken, duplicate, or suspicious listings.',
  'The site focuses on discovery and comparison rather than placement promises.',
]

export default function Home() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [savedJobs, setSavedJobs] = useState(() => {
    if (typeof window === 'undefined') return new Set()

    try {
      const saved = JSON.parse(localStorage.getItem(SAVED_JOBS_KEY) || '[]')
      return new Set(Array.isArray(saved) ? saved : [])
    } catch {
      return new Set()
    }
  })

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -36])

  useEffect(() => {
    const controller = new AbortController()

    async function fetchJobs() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(JOBS_URL, { signal: controller.signal })
        if (!response.ok) {
          throw new Error('Unable to fetch latest jobs right now.')
        }

        const data = await response.json()
        setJobs(Array.isArray(data) ? data : [])
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Something went wrong while loading jobs.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()

    return () => controller.abort()
  }, [])

  useEffect(() => {
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify([...savedJobs]))
  }, [savedJobs])

  const toggleSave = (jobId) => {
    setSavedJobs((previous) => {
      const next = new Set(previous)
      if (next.has(jobId)) {
        next.delete(jobId)
      } else {
        next.add(jobId)
      }
      return next
    })
  }

  const sortedJobs = useMemo(
    () =>
      [...jobs].sort((a, b) => {
        const left = parseDate(a.postedAt)?.getTime() || 0
        const right = parseDate(b.postedAt)?.getTime() || 0
        return right - left
      }),
    [jobs]
  )

  const jobTypes = useMemo(
    () => [...new Set(jobs.map((job) => job.type).filter(Boolean))].sort(),
    [jobs]
  )

  const filteredJobs = useMemo(() => {
    const query = search.toLowerCase().trim()

    return sortedJobs.filter((job) => {
      const searchable = [
        job.title,
        job.company,
        job.location,
        ...(Array.isArray(job.tags) ? job.tags : []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const matchesQuery = !query || searchable.includes(query)
      const matchesType = typeFilter === 'all' || job.type === typeFilter
      const matchesRemote = !remoteOnly || isRemote(job)

      return matchesQuery && matchesType && matchesRemote
    })
  }, [remoteOnly, search, sortedJobs, typeFilter])

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / ITEMS_PER_PAGE))

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const start = (page - 1) * ITEMS_PER_PAGE
  const currentJobs = filteredJobs.slice(start, start + ITEMS_PER_PAGE)
  const visiblePages = getVisiblePages(page, totalPages)
  const feedSnapshot = useMemo(() => {
    const recentRoles = jobs.filter((job) => {
      const ageInDays = getAgeInDays(job.postedAt)
      return ageInDays !== null && ageInDays <= 7
    }).length

    const hiringCompanies = new Set(jobs.map((job) => job.company).filter(Boolean)).size
    const remoteRoles = jobs.filter(isRemote).length
    const salaryVisibleRoles = jobs.filter((job) => Boolean(job.salary)).length

    return [
      { label: 'Open roles tracked', value: jobs.length },
      { label: 'Hiring companies', value: hiringCompanies },
      { label: 'Remote-friendly roles', value: remoteRoles },
      { label: 'Posted in last 7 days', value: recentRoles },
      { label: 'Roles with salary info', value: salaryVisibleRoles },
    ]
  }, [jobs])

  const topLocations = useMemo(() => {
    const counts = new Map()

    jobs.forEach((job) => {
      const location = job.location?.trim()
      if (!location) return
      counts.set(location, (counts.get(location) || 0) + 1)
    })

    return [...counts.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 3)
      .map(([location, count]) => `${location} (${count})`)
  }, [jobs])
  const topCompanies = useMemo(() => {
    const counts = new Map()

    jobs.forEach((job) => {
      const company = job.company?.trim()
      if (!company) return
      counts.set(company, (counts.get(company) || 0) + 1)
    })

    return [...counts.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 4)
      .map(([company]) => company)
  }, [jobs])

  return (
    <section className="space-y-8">
      <motion.section ref={heroRef} className="relative py-2 sm:py-4" style={{ y: heroY }}>
        <div className="relative">
          <motion.div
            className="max-w-4xl space-y-5"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-sm font-semibold tracking-wide text-brand-700">Calm, focused job discovery</p>

            <h1 className="hero-title text-brand-800">Find better opportunities with a natural browsing flow</h1>

            <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Search quickly, compare roles, and apply through verified company links without distracting UI.
            </p>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <label htmlFor="job-search" className="sr-only">
                Search jobs
              </label>
              <input
                id="job-search"
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                placeholder="Search role, company, skill, or location"
                className="w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm text-ink-900 shadow-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              />

              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl border border-brand-700 bg-brand-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
                onClick={() => {
                  setSearch('')
                  setTypeFilter('all')
                  setRemoteOnly(false)
                  setPage(1)
                }}
              >
                Reset filters
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1.5 text-sm font-medium text-brand-700">
                <input
                  type="checkbox"
                  checked={remoteOnly}
                  onChange={(event) => {
                    setRemoteOnly(event.target.checked)
                    setPage(1)
                  }}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
                />
                Remote only
              </label>

              <label className="inline-flex items-center gap-2 text-sm font-medium text-brand-700">
                Type:
                <select
                  value={typeFilter}
                  onChange={(event) => {
                    setTypeFilter(event.target.value)
                    setPage(1)
                  }}
                  className="rounded-full border border-brand-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                >
                  <option value="all">All</option>
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 
        <AdPlaceholder position="home-top" />
        Uncomment this after ads are approved.
      */}

      {error ? (
        <section className="surface p-6">
          <h2 className="font-display text-xl font-semibold text-red-700">Unable to load jobs</h2>
          <p className="mt-2 text-sm text-slate-600">{error}</p>
        </section>
      ) : null}

      <motion.section
        className="space-y-4"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.35 }}
      >
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="section-title">Latest opportunities</h2>
            <p className="mt-1 text-sm text-slate-600">
              {loading ? 'Syncing job feed...' : `${filteredJobs.length} roles found`}
            </p>
          </div>

          {!loading && filteredJobs.length > 0 ? (
            <p className="rounded-full border border-[#e7dfd6] bg-white px-3 py-1 text-sm font-medium text-slate-500">
              Page {page} of {totalPages}
            </p>
          ) : null}
        </header>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <JobSkeleton key={index} />
            ))}
          </div>
        ) : null}

        {!loading && filteredJobs.length === 0 ? (
          <div className="surface p-8 text-center">
            <h3 className="font-display text-2xl font-semibold text-ink-900">No matches found</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">Try another keyword, turn off filters, or search by company name.</p>
          </div>
        ) : null}

        {!loading && currentJobs.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {currentJobs.map((job, index) => {
              const saved = savedJobs.has(job.id)
              const remote = isRemote(job)
              const tags = Array.isArray(job.tags) ? job.tags.slice(0, 3) : []

              return (
                <motion.article
                  key={job.id}
                  className="surface-muted flex h-full flex-col p-5"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.14 }}
                  transition={{ delay: index * 0.03, duration: 0.35 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <CompanyAvatar company={job.company} logoUrl={job.logoUrl} />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{job.company || 'Company'}</p>
                        <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-ink-900">
                          <Link to={getJobPath(job)} state={{ jobId: job.id }} className="hover:text-brand-700">
                            {job.title}
                          </Link>
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSave(job.id)}
                      aria-label={saved ? 'Remove job from saved list' : 'Save job'}
                      aria-pressed={saved}
                      className={`grid h-9 w-9 place-items-center rounded-full border text-sm transition ${
                        saved
                          ? 'border-brand-300 bg-brand-100 text-brand-700'
                          : 'border-[#e7dfd6] bg-white text-slate-500 hover:border-brand-300 hover:text-brand-700'
                      }`}
                    >
                      ★
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    {job.type ? <span className="pill">{job.type}</span> : null}
                    {remote ? <span className="pill border-emerald-200 bg-emerald-50 text-emerald-700">Remote</span> : null}
                    {job.experience ? <span className="pill border-[#f1d7b3] bg-[#fff3df] text-[#9a5f17]">{job.experience}</span> : null}
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>
                      <span className="font-semibold text-slate-800">Location:</span> {job.location || 'Not listed'}
                    </p>
                    {job.salary ? (
                      <p>
                        <span className="font-semibold text-slate-800">Salary:</span> {job.salary}
                      </p>
                    ) : null}
                    <p className="text-xs font-medium text-brand-700">{formatRelativeDate(job.postedAt)}</p>
                  </div>

                  {tags.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-5 flex items-center justify-between gap-3 pt-3">
                    <p className="text-xs text-slate-500">{formatDate(job.postedAt)}</p>
                    <Link to={getJobPath(job)} state={{ jobId: job.id }} className="primary-btn px-4 py-2 text-xs">
                      View role
                    </Link>
                  </div>
                </motion.article>
              )
            })}
          </div>
        ) : null}
      </motion.section>

      {!loading && totalPages > 1 ? (
        <motion.nav
          className="surface flex flex-wrap items-center justify-center gap-2 p-4"
          aria-label="Pagination"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 0.3 }}
        >
          <button
            type="button"
            onClick={() => setPage((previous) => Math.max(1, previous - 1))}
            disabled={page === 1}
            className="outline-btn disabled:cursor-not-allowed disabled:opacity-45"
          >
            Previous
          </button>

          {visiblePages.map((number) => (
            <button
              type="button"
              key={number}
              onClick={() => setPage(number)}
              aria-current={number === page ? 'page' : undefined}
              className={`h-10 w-10 rounded-full text-sm font-semibold transition ${
                number === page
                  ? 'bg-brand-700 text-white shadow-md shadow-brand-700/20'
                  : 'border border-[#e7dfd6] bg-white text-slate-700 hover:border-brand-300 hover:text-brand-700'
              }`}
            >
              {number}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}
            disabled={page === totalPages}
            className="outline-btn disabled:cursor-not-allowed disabled:opacity-45"
          >
            Next
          </button>
        </motion.nav>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="surface p-6 sm:p-8">
          <span className="pill">Welcome</span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink-900">What you can expect from this site</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            This site is built to help you discover openings, compare them quickly, and decide which ones deserve a closer look. We do not present ourselves as an employer, recruiter, or placement agency.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
            {trustSignals.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="surface-muted p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Popular in the current feed</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {topCompanies.length > 0
              ? `Frequent companies in the current feed include ${topCompanies.join(', ')}.`
              : 'As the feed updates, this section highlights recurring employers and activity patterns.'}
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {topLocations.length > 0
              ? `High-activity locations right now include ${topLocations.join(', ')}.`
              : 'Location trends appear here as soon as enough listings are available.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/about" className="outline-btn text-xs">
              About the platform
            </Link>
            <Link to="/privacy" className="outline-btn text-xs">
              Privacy policy
            </Link>
            <Link to="/disclaimer" className="outline-btn text-xs">
              Disclaimer
            </Link>
            <Link to="/contact" className="outline-btn text-xs">
              Contact us
            </Link>
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="surface p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <span className="pill">Original insight</span>
              <h2 className="mt-3 font-display text-3xl font-semibold text-ink-900">What today’s feed actually tells you</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Hiringstoday is most useful when it helps you decide where to spend attention. Instead of treating every listing the same, use freshness, source clarity, and role details to narrow the field before you open application pages.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                {topLocations.length > 0
                  ? `The most active locations in the current feed are ${topLocations.join(', ')}. That makes it easier to compare nearby opportunities instead of scanning job boards one post at a time.`
                  : 'As new listings arrive, this section summarizes the current feed so you can spot patterns faster than a basic job list allows.'}
              </p>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-2 xl:max-w-xl">
              {feedSnapshot.map((item) => (
                <div key={item.label} className="rounded-2xl border border-[#eadfce] bg-[#fffaf1] px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-ink-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="surface-muted p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-ink-900">How to use this board well</h2>
          <div className="mt-4 space-y-4">
            {searchTips.map((tip) => (
              <div key={tip.title}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-700">{tip.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{tip.description}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="surface p-6 sm:p-8">
          <span className="pill">Application safety</span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink-900">Before you apply, check these first</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
            {trustChecks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            The fastest way to waste time is applying before verifying the basics. Spend one extra minute on the employer page and you avoid most dead links, duplicate listings, and expired openings.
          </p>
        </article>

        <article className="surface p-6 sm:p-8">
          <span className="pill">Why Hiringstoday</span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink-900">What we add beyond the source listing</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            We are not trying to replace the employer page. The goal is to make the discovery step calmer by standardizing role details, surfacing freshness, and helping you compare openings from different companies in one view.
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            That means the value of this site is not only the feed itself. It is also the filtering, the cleaner structure, the saved-role workflow, and the practical guidance around verifying listings before you commit time to an application.
          </p>
          <Link to="/about" className="primary-btn mt-5">
            Learn how we review listings
          </Link>
        </article>
      </section>
    </section>
  )
}
