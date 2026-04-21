'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import PageMeta from '@/src/components/PageMeta'

const ITEMS_PER_PAGE = 9

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

function formatSalary(salaryData) {
  // Handle string format like "7,00,000 - 12,00,000 INR"
  if (typeof salaryData === 'string' && salaryData) {
    return salaryData.replace(' INR', '').trim()
  }

  // Handle object format like { min: 7, max: 12 }
  if (salaryData && typeof salaryData === 'object') {
    if (salaryData.max) {
      return `₹${salaryData.min}L - ₹${salaryData.max}L`
    } else if (salaryData.min) {
      return `₹${salaryData.min}L+`
    }
  }

  return null
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

export default function Home() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [remoteOnly, setRemoteOnly] = useState(false)

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -36])

  useEffect(() => {
    let isMounted = true

    async function fetchJobs() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch('/api/jobs', { method: 'GET' })
        if (!response.ok) {
          throw new Error('Unable to fetch latest jobs right now.')
        }

        const data = await response.json()
        if (isMounted) {
          setJobs(Array.isArray(data) ? data : [])
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message || 'Something went wrong while loading jobs.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchJobs()

    return () => {
      isMounted = false
    }
  }, [])

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
  const latestJobs = useMemo(() => sortedJobs.slice(0, 10), [sortedJobs])

  return (
    <section className="space-y-6">
      <PageMeta
        title="Latest Jobs in India | Hiringstoday"
        description="Browse current job openings by role, company, skill, and location. Compare jobs faster and continue to official employer apply pages from Hiringstoday."
      />

      <motion.section ref={heroRef} className="surface p-6 sm:p-8" style={{ y: heroY }}>
        <motion.div
          className="space-y-5"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div>
            <p className="text-sm font-semibold tracking-wide text-brand-700">Search Jobs</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
              Find jobs by role, company, skill, or location
            </h1>
          </div>

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
              Reset
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
      </motion.section>

      {error ? (
        <section className="surface p-6">
          <h2 className="font-display text-xl font-semibold text-red-700">Unable to load jobs</h2>
          <p className="mt-2 text-sm text-slate-600">{error}</p>
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <motion.section
          className="space-y-4"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.35 }}
        >
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="section-title">All Jobs</h2>
              <p className="mt-1 text-sm text-slate-600">{loading ? 'Syncing job feed...' : `${filteredJobs.length} roles found`}</p>
            </div>

            {!loading && filteredJobs.length > 0 ? (
              <p className="rounded-full border border-[#e7dfd6] bg-white px-3 py-1 text-sm font-medium text-slate-500">
                Page {page} of {totalPages}
              </p>
            ) : null}
          </header>

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => <JobSkeleton key={index} />)
            ) : currentJobs.length > 0 ? (
              currentJobs.map((job, index) => {
                return (
                  <motion.article
                    key={job.id || index}
                    className="surface-muted group relative flex flex-col gap-4 rounded-2xl border border-slate-200 p-6 transition hover:shadow-lg"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {/* Header with logo and apply button */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex-shrink-0">
                          <CompanyAvatar company={job.company} logoUrl={job.logoUrl} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/job/${job.id}`}>
                            <h3 className="font-display text-lg font-bold text-ink-900 transition group-hover:text-brand-700 line-clamp-2">
                              {job.title}
                            </h3>
                          </Link>
                          <p className="mt-1 text-sm font-medium text-slate-600">{job.company}</p>
                        </div>
                      </div>
                      <Link
                        href={`/job/${job.id}`}
                        className="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-800 whitespace-nowrap"
                      >
                        Apply Now
                      </Link>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {job.type || 'Full-time'}
                      </span>
                      {job.postedAt && (
                        <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                          {formatRelativeDate(job.postedAt)}
                        </span>
                      )}
                    </div>

                    {/* Location */}
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">Location:</span> {job.location || 'Remote'}
                    </div>

                    {/* Tags/Skills */}
                    {job.tags && Array.isArray(job.tags) && job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {job.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                          >
                            {typeof tag === 'string' ? tag : tag.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Posted date */}
                    <div className="border-t border-slate-200 pt-3 text-xs text-slate-500">
                      {job.postedAt && new Date(job.postedAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </motion.article>
                )
              })
            ) : (
              <div className="surface-muted flex flex-col items-center justify-center p-12 text-center">
                <p className="text-sm font-medium text-slate-600">No jobs match your search.</p>
              </div>
            )}
          </div>

          {!loading && totalPages > 1 ? (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage(1)}
                className="flex h-10 w-10 items-center justify-center rounded border border-slate-300 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ←
              </button>

              {visiblePages.map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`flex h-10 w-10 items-center justify-center rounded border text-sm font-medium transition ${
                    p === page
                      ? 'border-brand-700 bg-brand-700 text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage(totalPages)}
                className="flex h-10 w-10 items-center justify-center rounded border border-slate-300 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                →
              </button>
            </div>
          ) : null}
        </motion.section>

        <aside className="space-y-4">
          <section className="surface space-y-3 p-5">
            <h3 className="font-semibold text-ink-900">Latest Jobs</h3>
            <div className="space-y-0 divide-y divide-slate-200">
              {latestJobs.map((job, index) => {
                return (
                  <Link
                    key={job.id || index}
                    href={`/job/${job.id}`}
                    className="group flex gap-3 rounded-lg border border-transparent px-0 py-3 transition hover:bg-slate-50"
                  >
                    {/* Logo */}
                    <div className="flex-shrink-0">
                      {job.logoUrl ? (
                        <img
                          src={job.logoUrl}
                          alt={`${job.company} logo`}
                          loading="lazy"
                          className="h-10 w-10 rounded-lg border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-700 to-[#db2b39] text-xs font-bold text-white">
                          {job.company?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="line-clamp-1 text-sm font-semibold text-ink-900 group-hover:text-brand-700">
                        {job.title}
                      </h4>
                      <p className="text-xs text-slate-600">{job.company}</p>
                      
                      {/* Details row */}
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {job.location && (
                          <span className="text-xs text-slate-500">{job.location}</span>
                        )}
                        {job.type && (
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                            {job.type}
                          </span>
                        )}
                      </div>

                      {/* Salary & Tags */}
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {job.salary && (
                          <span className="text-xs font-semibold text-brand-700">{formatSalary(job.salary)}</span>
                        )}
                      </div>

                      {/* Posted date */}
                      {job.postedAt && (
                        <p className="mt-1 text-xs text-slate-400">
                          {formatRelativeDate(job.postedAt)}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        </aside>
      </section>
    </section>
  )
}
