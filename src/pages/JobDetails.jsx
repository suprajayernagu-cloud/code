import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { JOBS_URL } from '../config'
import AdPlaceholder from '../components/AdPlaceholder'
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

function InfoCard({ title, children }) {
  return (
    <motion.section
      className="surface p-6 sm:p-7"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.35 }}
    >
      <h2 className="font-display text-2xl font-semibold text-ink-900">{title}</h2>
      <div className="mt-4 text-sm leading-7 text-slate-700 sm:text-base">{children}</div>
    </motion.section>
  )
}

export default function JobDetails() {
  const { companySlug, titleSlug, companyOrId } = useParams()
  const location = useLocation()
  const selectedJobId = location.state?.jobId
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  const relatedJobs = useMemo(
    () => jobs.filter((item) => String(item.id) !== String(job?.id)).slice(0, 3),
    [jobs, job?.id]
  )

  if (loading) {
    return (
      <section className="surface p-8">
        <p className="text-sm font-medium text-slate-600">Loading job details...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="surface p-8">
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

      <AdPlaceholder position="job-details-top" />

      {job.description ? (
        <InfoCard title="Role overview">
          <p>{job.description}</p>
        </InfoCard>
      ) : null}

      {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 ? (
        <InfoCard title="Responsibilities">
          <ul className="list-disc space-y-2 pl-5">
            {job.responsibilities.map((responsibility) => (
              <li key={responsibility}>{responsibility}</li>
            ))}
          </ul>
        </InfoCard>
      ) : null}

      {Array.isArray(job.qualifications) && job.qualifications.length > 0 ? (
        <InfoCard title="Qualifications">
          <ul className="list-disc space-y-2 pl-5">
            {job.qualifications.map((qualification) => (
              <li key={qualification}>{qualification}</li>
            ))}
          </ul>
        </InfoCard>
      ) : null}

      {Array.isArray(job.tags) && job.tags.length > 0 ? (
        <InfoCard title="Skills and tags">
          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700">
                {tag}
              </span>
            ))}
          </div>
        </InfoCard>
      ) : null}

      <section className="surface border-amber-200/70 bg-amber-50/75 p-6 text-amber-900 sm:p-7">
        <h2 className="font-display text-xl font-semibold">Important reminder</h2>
        <p className="mt-3 text-sm leading-7 sm:text-base">
          Hiringstoday is a job aggregator. Verify role details directly on the official company website before applying.
        </p>
      </section>

      {job.applyUrl ? (
        <section className="surface p-6 sm:p-7">
          <h2 className="font-display text-xl font-semibold text-ink-900">Ready to apply?</h2>
          <p className="mt-2 text-sm text-slate-600">Continue to the official {job.company} site to submit your application.</p>
          <div className="mt-4 flex justify-center">
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

      <AdPlaceholder position="job-details-bottom" />

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

      <div className="pb-2">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800">
          ← Back to jobs
        </Link>
      </div>
    </section>
  )
}
