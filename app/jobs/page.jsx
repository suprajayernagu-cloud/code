'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import PageMeta from '@/src/components/PageMeta'

const ITEMS_PER_PAGE = 9

function parseDate(dateString) {
  if (!dateString) return null
  const date = new Date(dateString)
  return Number.isNaN(date.getTime()) ? null : date
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

  return `Posted on ${new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)}`
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

export default function BrowseJobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [browseType, setBrowseType] = useState('type') // 'type' or 'location'

  useEffect(() => {
    let isMounted = true

    async function fetchJobs() {
      setLoading(true)

      try {
        const response = await fetch('/api/jobs', { method: 'GET' })
        if (!response.ok) {
          throw new Error('Unable to fetch jobs')
        }

        const data = await response.json()
        if (isMounted) {
          setJobs(Array.isArray(data) ? data : [])
          setPage(1)
        }
      } catch (error) {
        if (isMounted) {
          setJobs([])
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

  // Extract unique job types and locations
  const jobTypes = useMemo(
    () => [...new Set(jobs.map((job) => job.type).filter(Boolean))].sort(),
    [jobs]
  )

  const locations = useMemo(
    () => [...new Set(jobs.map((job) => job.location).filter(Boolean))].sort(),
    [jobs]
  )

  const categories = browseType === 'type' ? jobTypes : locations
  const selectedCategory = categories[0] || null

  const filteredJobs = useMemo(() => {
    if (!selectedCategory) return []
    return jobs.filter((job) => {
      if (browseType === 'type') {
        return job.type === selectedCategory
      } else {
        return job.location === selectedCategory
      }
    })
  }, [jobs, browseType, selectedCategory])

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / ITEMS_PER_PAGE))
  const start = (page - 1) * ITEMS_PER_PAGE
  const currentJobs = filteredJobs.slice(start, start + ITEMS_PER_PAGE)

  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    const start = Math.max(1, page - 2)
    return start + i
  }).filter((p) => p <= totalPages)

  return (
    <section className="space-y-8">
      <PageMeta
        title="Browse Jobs by Category - Hiringstoday"
        description="Browse all job listings by job type or location. Filter full-time, contract, and remote positions across Indian cities."
      />

      <div className="text-center space-y-3">
        <p className="text-sm font-semibold tracking-wide text-brand-700">Browse Jobs</p>
        <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
          Find Jobs by Category or Location
        </h1>
        <p className="text-slate-600">
          {loading ? 'Loading jobs...' : `${filteredJobs.length} positions available`}
        </p>
      </div>

      {/* Browse Type Toggle */}
      <div className="surface flex items-center justify-center gap-3 rounded-2xl border border-slate-200 p-4">
        <button
          onClick={() => {
            setBrowseType('type')
            setPage(1)
          }}
          className={`rounded-lg px-6 py-2 font-semibold transition ${
            browseType === 'type'
              ? 'bg-brand-700 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          By Job Type
        </button>
        <button
          onClick={() => {
            setBrowseType('location')
            setPage(1)
          }}
          className={`rounded-lg px-6 py-2 font-semibold transition ${
            browseType === 'location'
              ? 'bg-brand-700 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          By Location
        </button>
      </div>

      {/* Category Buttons */}
      <div className="surface space-y-4 rounded-2xl border border-slate-200 p-6">
        <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
          {browseType === 'type' ? 'Job Types' : 'Locations'}
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setPage(1)
              }}
              className={`rounded-full px-4 py-2 font-semibold transition ${
                selectedCategory === category
                  ? 'bg-brand-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {category} ({filteredJobs.length})
            </button>
          ))}
        </div>
      </div>

      {/* Job Results Grid */}
      {!loading && currentJobs.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentJobs.map((job) => (
              <Link
                key={job.id}
                href={`/job/${job.id}`}
                className="surface-muted group relative flex flex-col gap-3 rounded-2xl border border-slate-200 p-5 transition hover:shadow-xl hover:border-brand-300 hover:-translate-y-1"
              >
                {/* Header */}
                <div className="flex items-start gap-3">
                  <CompanyAvatar company={job.company} logoUrl={job.logoUrl} />
                  <div className="flex-1 min-w-0">
                    <h3 className="line-clamp-2 font-display font-bold text-ink-900 group-hover:text-brand-700">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-600">{job.company}</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 border border-blue-200">
                    <span className="mr-1">💼</span>
                    {job.type || 'Full-time'}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs text-slate-600">
                  {job.location && (
                    <p className="flex items-center gap-2">
                      <span className="text-slate-400">📍</span>
                      {job.location}
                    </p>
                  )}
                  {job.salary && (
                    <p className="font-semibold text-brand-700 flex items-center gap-2">
                      <span>💰</span>
                      {formatSalary(job.salary)}
                    </p>
                  )}
                </div>

                {/* Skills/Tags */}
                {job.tags && Array.isArray(job.tags) && job.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {job.tags.slice(0, 4).map((tag, i) => {
                      const colors = [
                        'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-purple-200',
                        'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200',
                        'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200',
                        'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-orange-200',
                      ];
                      const colorClass = colors[i % colors.length];
                      return (
                        <span
                          key={i}
                          className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border transition hover:shadow-md ${colorClass}`}
                        >
                          <span className="mr-1">✦</span>
                          {typeof tag === 'string' ? tag : tag.name}
                        </span>
                      );
                    })}
                    {job.tags.length > 4 && (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200">
                        +{job.tags.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="border-t border-slate-200 pt-3 mt-auto">
                  <p className="text-xs text-slate-500">{formatRelativeDate(job.postedAt)}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(1)}
                className="flex h-10 w-10 items-center justify-center rounded border border-slate-300 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ←
              </button>

              {pageNumbers.map((p) => (
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
          )}
        </>
      ) : !loading ? (
        <div className="surface-muted flex flex-col items-center justify-center rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-600">No jobs found in this category.</p>
          <Link href="/" className="mt-4 font-semibold text-brand-700 hover:text-brand-800">
            Browse all jobs →
          </Link>
        </div>
      ) : null}

      {/* CTA */}
      <section className="surface space-y-4 rounded-2xl border border-slate-200 p-8 text-center">
        <h2 className="font-display text-xl font-semibold text-ink-900">
          Ready to find your next opportunity?
        </h2>
        <p className="text-slate-600">
          Start your job search or explore our career guides for interview prep and resume tips.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-brand-700 px-6 py-3 font-semibold text-white transition hover:bg-brand-800"
          >
            Search All Jobs
          </Link>
          <Link
            href="/resources"
            className="inline-flex items-center justify-center rounded-lg border border-brand-700 bg-white px-6 py-3 font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            Career Guides
          </Link>
        </div>
      </section>
    </section>
  )
}
