'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'

function getTagName(tag) {
  return typeof tag === 'string' ? tag : tag?.name
}

function formatDate(dateString) {
  if (!dateString) return 'New'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return 'New'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function formatSalary(salaryData) {
  if (typeof salaryData === 'string' && salaryData) {
    return salaryData.replace(' INR', '').trim()
  }

  if (salaryData && typeof salaryData === 'object') {
    if (salaryData.max) return `₹${salaryData.min}L - ₹${salaryData.max}L`
    if (salaryData.min) return `₹${salaryData.min}L+`
  }

  return null
}

function CompanyLogo({ company, logoUrl }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${company} logo`}
        loading="lazy"
        className="h-11 w-11 shrink-0 rounded-lg border border-slate-200 bg-white object-cover"
      />
    )
  }

  return (
    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-800 text-sm font-bold text-white">
      {company?.trim()?.charAt(0)?.toUpperCase() || 'H'}
    </div>
  )
}

function getMatchLabels(job, currentJob) {
  const labels = []
  const currentTags = Array.isArray(currentJob?.tags) ? currentJob.tags.map(getTagName).filter(Boolean) : []
  const jobTags = Array.isArray(job?.tags) ? job.tags.map(getTagName).filter(Boolean) : []

  if (job.company && job.company === currentJob?.company) labels.push('Same company')
  if (job.location && job.location === currentJob?.location) labels.push('Same location')

  const sharedTags = jobTags.filter((tag) => currentTags.includes(tag))
  if (sharedTags.length > 0) labels.push(`${sharedTags.length} shared skill${sharedTags.length > 1 ? 's' : ''}`)

  return labels.length > 0 ? labels.slice(0, 2) : ['Similar role']
}

export default function RelatedJobs({ currentJobId, allJobs = [] }) {
  const currentJob = allJobs.find((job) => String(job.id) === String(currentJobId))

  const relatedJobs = useMemo(() => {
    if (!currentJob || !allJobs.length) return []

    const currentTags = Array.isArray(currentJob.tags)
      ? currentJob.tags.map(getTagName).filter(Boolean)
      : []

    return allJobs
      .filter((job) => String(job.id) !== String(currentJob.id))
      .sort((a, b) => {
        let scoreA = 0
        let scoreB = 0

        if (a.company === currentJob.company) scoreA += 100
        if (b.company === currentJob.company) scoreB += 100

        if (a.location === currentJob.location) scoreA += 50
        if (b.location === currentJob.location) scoreB += 50

        const aTags = Array.isArray(a.tags) ? a.tags.map(getTagName).filter(Boolean) : []
        const bTags = Array.isArray(b.tags) ? b.tags.map(getTagName).filter(Boolean) : []

        scoreA += aTags.filter((tag) => currentTags.includes(tag)).length * 10
        scoreB += bTags.filter((tag) => currentTags.includes(tag)).length * 10

        return scoreB - scoreA
      })
      .slice(0, 6)
  }, [currentJob, allJobs])

  if (!relatedJobs.length) return null

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-orange-600">More jobs to explore</p>
          <h3 className="mt-1 font-display text-2xl font-bold text-ink-900">Related Opportunities</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Similar openings based on company, location, and skills from this job.
          </p>
        </div>
        <Link href="/jobs" className="text-sm font-bold text-brand-800 hover:text-orange-600">
          View all jobs →
        </Link>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {relatedJobs.map((job) => {
          const tags = Array.isArray(job.tags) ? job.tags.map(getTagName).filter(Boolean).slice(0, 3) : []
          const salary = formatSalary(job.salary)
          const matchLabels = getMatchLabels(job, currentJob)

          return (
            <Link key={job.id} href={`/job/${job.id}`} className="group block h-full">
              <article className="flex h-full min-w-0 flex-col rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-1 hover:border-orange-300 hover:bg-white hover:shadow-lg">
                <div className="flex items-start gap-3">
                  <CompanyLogo company={job.company} logoUrl={job.logoUrl} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      {matchLabels.map((label) => (
                        <span key={label} className="rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-orange-700">
                          {label}
                        </span>
                      ))}
                    </div>
                    <h4 className="mt-2 line-clamp-2 font-display text-base font-bold leading-snug text-ink-900 group-hover:text-brand-800">
                      {job.title}
                    </h4>
                    <p className="mt-1 truncate text-sm font-semibold text-slate-700">{job.company}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                  {job.location ? <p className="line-clamp-1">{job.location}</p> : <p>Location not listed</p>}
                  <p>{job.type || 'Full-time'} · {formatDate(job.postedAt)}</p>
                  {salary ? <p className="font-bold text-brand-800 sm:col-span-2">{salary}</p> : null}
                </div>

                {tags.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4 text-sm">
                  <span className="font-semibold text-slate-500">Similar job</span>
                  <span className="font-bold text-orange-600">View job →</span>
                </div>
              </article>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
