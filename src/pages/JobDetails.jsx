import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { JOBS_URL, SITE_URL } from '../config'
import PageMeta from '../components/PageMeta'
import { getJobPath, hasCompanySlug, hasJobSlugs } from '../utils/jobRoute'

function parseDate(dateString) {
  const date = new Date(dateString)
  return Number.isNaN(date.getTime()) ? null : date
}

function formatDate(dateString) {
  if (!dateString) return 'Date unavailable'
  const date = parseDate(dateString)
  if (!date) return dateString

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function isRemoteJob(job) {
  if (job?.remote) return true
  return /remote/i.test(job?.location || '')
}

function buildJobMetaDescription(job) {
  if (!job) {
    return 'View job details, requirements, and official apply links on Hiringstoday.'
  }

  const parts = [
    `${job.title} at ${job.company}`,
    job.location ? `in ${job.location}` : '',
    job.experience ? `for ${job.experience}` : '',
  ].filter(Boolean)

  return `${parts.join(' ')}. Review responsibilities, qualifications, and continue to the official company application page from Hiringstoday.`
}

function buildJobPostingSchema(job, canonicalUrl) {
  if (!job) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description || buildJobMetaDescription(job),
    datePosted: job.postedAt,
    employmentType: job.type || 'Full-time',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
      sameAs: job.applyUrl || canonicalUrl,
    },
    identifier: {
      '@type': 'PropertyValue',
      name: 'Hiringstoday',
      value: String(job.id || canonicalUrl),
    },
    url: canonicalUrl,
  }

  if (job.location) {
    schema.jobLocation = {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
      },
    }
  }

  if (isRemoteJob(job)) {
    schema.jobLocationType = 'TELECOMMUTE'
  }

  return schema
}

function CompanyAvatar({ company, logoUrl, large = false }) {
  const sizeClass = large ? 'h-16 w-16 rounded-2xl text-xl' : 'h-10 w-10 rounded-xl text-sm'

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${company} logo`}
        className={`${sizeClass} border border-white object-cover shadow-sm`}
      />
    )
  }

  return (
    <div
      className={`${sizeClass} grid place-items-center bg-gradient-to-br from-brand-500 to-emerald-500 font-bold text-white`}
      aria-label={`${company} initial`}
      role="img"
    >
      {company?.trim()?.charAt(0)?.toUpperCase() || '?'}
    </div>
  )
}

function ShareIcon({ name }) {
  switch (name) {
    case 'whatsapp':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M20.52 3.48A11.82 11.82 0 0 0 12.12 0C5.58 0 .24 5.28.24 11.82c0 2.1.54 4.14 1.62 5.94L0 24l6.42-1.68a11.9 11.9 0 0 0 5.7 1.44h.06c6.54 0 11.88-5.28 11.88-11.82 0-3.18-1.26-6.12-3.54-8.46Zm-8.4 18.3h-.06a9.9 9.9 0 0 1-5.04-1.38l-.36-.18-3.78.96 1.02-3.66-.24-.36a9.8 9.8 0 0 1-1.56-5.34c0-5.46 4.5-9.9 10.02-9.9 2.7 0 5.16 1.02 7.02 2.88a9.79 9.79 0 0 1 2.88 7.02c0 5.46-4.5 9.96-9.9 9.96Zm5.46-7.44c-.3-.12-1.8-.9-2.1-.96-.24-.12-.42-.12-.6.12s-.72.96-.9 1.14c-.12.18-.3.18-.6.06-.3-.12-1.26-.48-2.34-1.5-.84-.78-1.44-1.8-1.62-2.1-.18-.3 0-.42.12-.54.12-.12.3-.3.42-.48.12-.12.18-.24.3-.42.06-.18 0-.36-.06-.48-.06-.12-.6-1.5-.84-2.04-.18-.54-.42-.48-.6-.48h-.48c-.18 0-.48.06-.72.3-.24.3-.96.96-.96 2.28s.96 2.64 1.08 2.82c.18.18 1.92 3 4.68 4.14 2.76 1.2 2.76.78 3.24.78.48-.06 1.56-.66 1.8-1.32.24-.6.24-1.2.18-1.32-.06-.12-.24-.18-.54-.36Z" />
        </svg>
      )
    case 'telegram':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M21.96 4.32c.3-1.14-.42-1.62-1.38-1.26L2.1 10.2c-1.14.42-1.08 1.08-.18 1.38l4.74 1.5 10.98-6.9c.54-.3 1.02-.12.6.24l-8.88 8.04-.36 5.22c.54 0 .78-.24 1.08-.54l2.58-2.52 5.34 3.96c.96.54 1.68.24 1.92-.96l3.06-14.7Z" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M4.98 3.5A2.49 2.49 0 0 0 2.5 6c0 1.38 1.08 2.5 2.48 2.5h.06A2.5 2.5 0 1 0 4.98 3.5ZM3 9.5h4v11H3Zm7 0h3.84V11h.06c.54-1.02 1.86-2.1 3.84-2.1 4.08 0 4.8 2.64 4.8 6.12v5.48h-4v-4.86c0-1.2 0-2.7-1.68-2.7s-1.92 1.32-1.92 2.64v4.92h-4Z" />
        </svg>
      )
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M13.5 21v-7.56h2.52l.42-2.94H13.5V8.64c0-.84.24-1.44 1.5-1.44h1.62V4.56c-.3-.06-1.2-.12-2.28-.12-2.28 0-3.84 1.38-3.84 3.9v2.16H8v2.94h2.52V21h2.98Z" />
        </svg>
      )
    case 'x':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
          <path d="M18.9 2H21l-6.6 7.56L22.2 22h-6.12l-4.8-6.3L5.82 22H3.66l7.08-8.1L1.26 2h6.3l4.38 5.82L18.9 2Zm-1.08 18.18h1.14L6.96 3.74H5.76Z" />
        </svg>
      )
    case 'share':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 12v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-6M12 3v12M8.5 6.5 12 3l3.5 3.5" />
        </svg>
      )
    case 'copy':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
          <rect x="9" y="9" width="10" height="10" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 9V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
        </svg>
      )
    default:
      return null
  }
}

export default function JobDetails() {
  const { companySlug, titleSlug, companyOrId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const selectedJobId = location.state?.jobId
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [shareStatus, setShareStatus] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function fetchJobs() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(JOBS_URL, { signal: controller.signal })
        if (!response.ok) {
          throw new Error('Unable to load this job right now.')
        }

        const data = await response.json()
        setJobs(Array.isArray(data) ? data : [])
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Unable to load this job right now.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()

    return () => controller.abort()
  }, [])

  const job = useMemo(() => {
    if (companySlug && titleSlug) {
      const byCompanyAndTitle = jobs.filter((item) => hasJobSlugs(item, companySlug, titleSlug))
      if (byCompanyAndTitle.length === 0) return null

      const selectedWithinMatches = byCompanyAndTitle.find((item) => String(item.id) === String(selectedJobId))
      if (selectedWithinMatches) return selectedWithinMatches

      return [...byCompanyAndTitle].sort((left, right) => {
        const leftPostedAt = parseDate(left.postedAt)?.getTime() || 0
        const rightPostedAt = parseDate(right.postedAt)?.getTime() || 0

        if (rightPostedAt !== leftPostedAt) return rightPostedAt - leftPostedAt
        return Number(right.id || 0) - Number(left.id || 0)
      })[0]
    }

    const legacyIdMatch = jobs.find((item) => String(item.id) === String(companyOrId))
    if (legacyIdMatch) return legacyIdMatch

    const byCompanySlug = jobs.filter((item) => hasCompanySlug(item, companyOrId))
    if (byCompanySlug.length === 0) return null

    const selectedWithinCompany = byCompanySlug.find((item) => String(item.id) === String(selectedJobId))
    if (selectedWithinCompany) return selectedWithinCompany

    return [...byCompanySlug].sort((left, right) => {
      const leftPostedAt = parseDate(left.postedAt)?.getTime() || 0
      const rightPostedAt = parseDate(right.postedAt)?.getTime() || 0

      if (rightPostedAt !== leftPostedAt) return rightPostedAt - leftPostedAt
      return Number(right.id || 0) - Number(left.id || 0)
    })[0]
  }, [companyOrId, companySlug, jobs, selectedJobId, titleSlug])

  const sortedJobs = useMemo(
    () =>
      [...jobs].sort((left, right) => {
        const leftPostedAt = parseDate(left.postedAt)?.getTime() || 0
        const rightPostedAt = parseDate(right.postedAt)?.getTime() || 0

        if (rightPostedAt !== leftPostedAt) return rightPostedAt - leftPostedAt
        return Number(right.id || 0) - Number(left.id || 0)
      }),
    [jobs]
  )

  const latestJobs = useMemo(
    () => sortedJobs.filter((item) => String(item.id) !== String(job?.id)).slice(0, 10),
    [job?.id, sortedJobs]
  )

  const canonicalJobPath = useMemo(() => (job ? getJobPath(job) : ''), [job])
  const canonicalJobUrl = useMemo(
    () => (canonicalJobPath ? `${SITE_URL}${canonicalJobPath}` : ''),
    [canonicalJobPath]
  )
  const jobMetaDescription = useMemo(() => buildJobMetaDescription(job), [job])
  const jobStructuredData = useMemo(
    () => (job && canonicalJobUrl ? buildJobPostingSchema(job, canonicalJobUrl) : null),
    [canonicalJobUrl, job]
  )

  const relatedJobs = useMemo(
    () => jobs.filter((item) => String(item.id) !== String(job?.id)).slice(0, 3),
    [jobs, job?.id]
  )

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return window.location.href
  }, [location.pathname])

  const shareText = useMemo(() => {
    if (!job) return ''
    return `${job.title} at ${job.company} | Hiringstoday`
  }, [job])

  const encodedShareUrl = encodeURIComponent(shareUrl)
  const encodedShareText = encodeURIComponent(shareText)

  const shareLinks = useMemo(
    () => [
      {
        label: 'WhatsApp',
        icon: 'whatsapp',
        className: 'border-[#d8f5de] bg-[#effcf2] text-[#1fa855] hover:border-[#1fa855] hover:text-[#178244]',
        href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      },
      {
        label: 'Telegram',
        icon: 'telegram',
        className: 'border-[#d6ebff] bg-[#eef7ff] text-[#249bd7] hover:border-[#249bd7] hover:text-[#1f7fb0]',
        href: `https://t.me/share/url?url=${encodedShareUrl}&text=${encodedShareText}`,
      },
      {
        label: 'LinkedIn',
        icon: 'linkedin',
        className: 'border-[#d9e7ff] bg-[#f2f7ff] text-[#0a66c2] hover:border-[#0a66c2] hover:text-[#084c91]',
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`,
      },
      {
        label: 'Facebook',
        icon: 'facebook',
        className: 'border-[#dbe5ff] bg-[#f3f6ff] text-[#1877f2] hover:border-[#1877f2] hover:text-[#1259b4]',
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`,
      },
      {
        label: 'X',
        icon: 'x',
        className: 'border-slate-300 bg-slate-50 text-slate-900 hover:border-slate-900 hover:text-black',
        href: `https://twitter.com/intent/tweet?text=${encodedShareText}&url=${encodedShareUrl}`,
      },
    ],
    [encodedShareText, encodedShareUrl, shareText, shareUrl]
  )

  async function handleCopyLink() {
    if (typeof navigator === 'undefined' || !shareUrl) return

    try {
      await navigator.clipboard.writeText(shareUrl)
      setShareStatus('Link copied')
    } catch {
      setShareStatus('Unable to copy link')
    }
  }

  async function handleNativeShare() {
    if (typeof navigator === 'undefined' || typeof navigator.share !== 'function' || !shareUrl) return

    try {
      await navigator.share({
        title: shareText,
        text: shareText,
        url: shareUrl,
      })
      setShareStatus('')
    } catch {
      setShareStatus('')
    }
  }

  useEffect(() => {
    if (!job || !canonicalJobPath || location.pathname === canonicalJobPath) return

    navigate(canonicalJobPath, {
      replace: true,
      state: { jobId: job.id },
    })
  }, [canonicalJobPath, job, location.pathname, navigate])

  if (loading) {
    return (
      <section className="surface p-8">
        <PageMeta
          title="Loading job details | Hiringstoday"
          description="Loading the selected job listing on Hiringstoday."
          canonicalPath={location.pathname}
          robots="noindex,follow"
        />
        <p className="text-sm font-medium text-slate-600">Loading job details...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="surface p-8">
        <PageMeta
          title="Unable to load job details | Hiringstoday"
          description="Hiringstoday could not load this job listing right now."
          canonicalPath={location.pathname}
          robots="noindex,follow"
        />
        <h1 className="font-display text-2xl font-bold text-red-700">Unable to load job details</h1>
        <p className="mt-2 text-sm text-slate-600">{error}</p>
        <Link to="/" className="primary-btn mt-6">
          Back to Jobs
        </Link>
      </section>
    )
  }

  if (!job) {
    return (
      <section className="surface p-8 text-center">
        <PageMeta
          title="Job not found | Hiringstoday"
          description="This job listing may have been removed or the URL is incorrect."
          canonicalPath={location.pathname}
          robots="noindex,follow"
        />
        <h1 className="font-display text-3xl font-bold text-ink-900">Job not found</h1>
        <p className="mt-2 text-sm text-slate-600">This role may have been removed or the URL is incorrect.</p>
        <Link to="/" className="primary-btn mt-6">
          Browse latest jobs
        </Link>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <PageMeta
        title={`${job.title} at ${job.company} | Hiringstoday`}
        description={jobMetaDescription}
        canonicalPath={canonicalJobPath}
        ogType="article"
        jsonLd={jobStructuredData}
      />

      <section className="surface relative overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-0 bg-mesh opacity-40" aria-hidden="true" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4 sm:gap-5">
            <CompanyAvatar company={job.company} logoUrl={job.logoUrl} large />

            <div>
              <p className="pill w-fit">{job.type || 'Opportunity'}</p>
              <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-ink-900 sm:text-4xl">{job.title}</h1>

              <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
                <span className="rounded-full bg-white/85 px-3 py-1">{job.company}</span>
                <span className="rounded-full bg-white/85 px-3 py-1">{job.location || 'Location not listed'}</span>
                {job.experience ? <span className="rounded-full bg-white/85 px-3 py-1">{job.experience}</span> : null}
                <span className="rounded-full bg-white/85 px-3 py-1">Posted {formatDate(job.postedAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
            {job.salary ? (
              <div className="rounded-2xl border border-brand-200 bg-brand-50/90 px-4 py-2 text-sm font-semibold text-brand-700">
                {job.salary}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <div className="space-y-6">
          <motion.section
            className="surface p-6 sm:p-7"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.35 }}
          >
            <div className="space-y-6 text-sm leading-7 text-slate-700 sm:text-base">
              {job.description ? (
                <section>
                  <h2 className="font-display text-2xl font-semibold text-ink-900">Role overview</h2>
                  <div className="mt-4">
                    <p>{job.description}</p>
                  </div>
                </section>
              ) : null}

              {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 ? (
                <section className="pt-1">
                  <h2 className="font-display text-2xl font-semibold text-ink-900">Responsibilities</h2>
                  <ul className="mt-4 list-disc space-y-2 pl-5">
                    {job.responsibilities.map((responsibility) => (
                      <li key={responsibility}>{responsibility}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {Array.isArray(job.qualifications) && job.qualifications.length > 0 ? (
                <section className="pt-1">
                  <h2 className="font-display text-2xl font-semibold text-ink-900">Qualifications</h2>
                  <ul className="mt-4 list-disc space-y-2 pl-5">
                    {job.qualifications.map((qualification) => (
                      <li key={qualification}>{qualification}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {Array.isArray(job.tags) && job.tags.length > 0 ? (
                <section className="pt-1">
                  <h2 className="font-display text-2xl font-semibold text-ink-900">Skills and tags</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="pt-1">
                <h2 className="font-display text-2xl font-semibold text-ink-900">Important reminder</h2>
                <p className="mt-4 text-amber-900">
                  Hiringstoday is a job aggregator. Verify role details directly on the official company website before applying.
                </p>
              </section>

              {job.applyUrl ? (
                <section className="pt-1">
                  <h2 className="font-display text-2xl font-semibold text-ink-900">Ready to apply?</h2>
                  <p className="mt-2 text-slate-600">Continue to the official {job.company} site to submit your application.</p>
                  <div className="mt-4 flex justify-start">
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="primary-btn"
                      aria-label={`Apply for ${job.title} at ${job.company}`}
                    >
                      Apply on company site
                    </a>
                  </div>
                </section>
              ) : null}

              <section className="pt-1">
                <h2 className="font-display text-2xl font-semibold text-ink-900">Share with your friends</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {shareLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      title={item.label}
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${item.className}`}
                    >
                      <ShareIcon name={item.icon} />
                      <span className="sr-only">{item.label}</span>
                    </a>
                  ))}
                  {typeof navigator !== 'undefined' && typeof navigator.share === 'function' ? (
                    <button
                      type="button"
                      onClick={handleNativeShare}
                      aria-label="Share"
                      title="Share"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-300 bg-brand-50 text-brand-700 transition hover:border-brand-500 hover:text-brand-800"
                    >
                      <ShareIcon name="share" />
                      <span className="sr-only">Share</span>
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    aria-label="Copy link"
                    title="Copy link"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-300 bg-brand-50 text-brand-700 transition hover:border-brand-500 hover:text-brand-800"
                  >
                    <ShareIcon name="copy" />
                    <span className="sr-only">Copy link</span>
                  </button>
                </div>
                {shareStatus ? <p className="mt-3 text-sm text-brand-700">{shareStatus}</p> : null}
              </section>
            </div>
          </motion.section>

          {relatedJobs.length > 0 ? (
            <section className="surface p-6 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-2xl font-semibold text-ink-900">Related roles</h2>
                <Link to="/" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
                  See all jobs
                </Link>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {relatedJobs.map((relatedJob) => (
                  <article key={relatedJob.id} className="surface-muted flex h-full flex-col p-4">
                    <div className="flex items-start gap-3">
                      <CompanyAvatar company={relatedJob.company} logoUrl={relatedJob.logoUrl} />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{relatedJob.company}</p>
                        <h3 className="mt-1 font-display text-base font-semibold text-ink-900">
                          <Link to={getJobPath(relatedJob)} state={{ jobId: relatedJob.id }} className="hover:text-brand-700">
                            {relatedJob.title}
                          </Link>
                        </h3>
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-slate-600">{relatedJob.location || 'Location not listed'}</p>
                    <Link to={getJobPath(relatedJob)} state={{ jobId: relatedJob.id }} className="outline-btn mt-4 text-xs">
                      Open role
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        {latestJobs.length > 0 ? (
          <motion.aside
            className="xl:sticky xl:top-24"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            <section className="surface p-6">
              <h2 className="font-display text-2xl font-semibold text-ink-900">Latest Jobs</h2>
              <div className="mt-4 space-y-4">
                {latestJobs.map((latestJob) => (
                  <article key={latestJob.id} className="border-b border-[#efe6db] pb-4 last:border-b-0 last:pb-0">
                    <h3 className="text-sm font-semibold leading-6 text-ink-900">
                      <Link to={getJobPath(latestJob)} state={{ jobId: latestJob.id }} className="hover:text-brand-700">
                        {latestJob.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-xs font-medium text-brand-700">{latestJob.company || 'Company'}</p>
                    <p className="mt-1 text-xs text-slate-500">{latestJob.location || 'Location not listed'}</p>
                  </article>
                ))}
              </div>
            </section>
          </motion.aside>
        ) : null}
      </section>

      <div className="pb-2">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800">
          ← Back to jobs
        </Link>
      </div>
    </section>
  )
}
