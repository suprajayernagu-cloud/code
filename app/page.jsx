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

function SkeletonCard() {
  return (
    <div className="surface-muted animate-pulse flex flex-col gap-3 rounded-2xl border border-slate-200 p-5">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 rounded-2xl bg-slate-300"></div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-5 bg-slate-300 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-7 w-20 bg-slate-300 rounded-full"></div>
        <div className="h-7 w-24 bg-slate-300 rounded-full"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-slate-300 rounded-full"></div>
        <div className="h-6 w-20 bg-slate-300 rounded-full"></div>
        <div className="h-6 w-14 bg-slate-300 rounded-full"></div>
      </div>
    </div>
  )
}

function formatSalary(salaryData) {
  if (typeof salaryData === 'string' && salaryData) {
    return salaryData.replace(' INR', '').trim()
  }

  if (salaryData && typeof salaryData === 'object') {
    if (salaryData.max) {
      return `₹${salaryData.min}L - ₹${salaryData.max}L`
    } else if (salaryData.min) {
      return `₹${salaryData.min}L+`
    }
  }

  return null
}

export default function Home() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [selectedJobType, setSelectedJobType] = useState('All')
  const [remoteOnly, setRemoteOnly] = useState(false)

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

  // Sort jobs by latest first
  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => {
      const dateA = a.postedAt ? new Date(a.postedAt).getTime() : 0
      const dateB = b.postedAt ? new Date(b.postedAt).getTime() : 0
      return dateB - dateA
    })
  }, [jobs])

  // Filter by search query and filters
  const filteredJobs = useMemo(() => {
    let filtered = sortedJobs
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (job) =>
          job.title?.toLowerCase().includes(query) ||
          job.company?.toLowerCase().includes(query) ||
          job.location?.toLowerCase().includes(query) ||
          (job.tags &&
            Array.isArray(job.tags) &&
            job.tags.some((tag) =>
              (typeof tag === 'string' ? tag : tag.name)
                .toLowerCase()
                .includes(query)
            ))
      )
    }
    
    // Apply job type filter
    if (selectedJobType !== 'All') {
      filtered = filtered.filter((job) => job.type === selectedJobType)
    }
    
    // Apply remote only filter
    if (remoteOnly) {
      filtered = filtered.filter((job) => job.location?.toLowerCase().includes('remote'))
    }
    
    return filtered
  }, [sortedJobs, searchQuery, selectedJobType, remoteOnly])

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
        title="Latest Jobs in India | Hiringstoday"
        description="Browse current job openings by role, company, skill, and location. Compare jobs faster and continue to official employer apply pages from Hiringstoday."
      />

      {/* Search Card */}
      <div className="surface rounded-2xl border border-slate-200 p-4 sm:p-6 md:p-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-slate-600">Search Jobs</p>
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-ink-900">
              Find jobs by role, company, skill, or location
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search role, company, skill, or location"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-transparent"
            />
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedJobType('All')
                setRemoteOnly(false)
                setPage(1)
              }}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-slate-800 text-white font-semibold text-sm sm:text-base hover:bg-slate-900 transition whitespace-nowrap"
            >
              Reset
            </button>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-start sm:items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => {
                  setRemoteOnly(e.target.checked)
                  setPage(1)
                }}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded border-slate-300 text-brand-700"
              />
              <span className="text-xs sm:text-sm font-medium text-slate-700">Remote only</span>
            </label>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs sm:text-sm font-medium text-slate-700 whitespace-nowrap">Type:</span>
              <select
                value={selectedJobType}
                onChange={(e) => {
                  setSelectedJobType(e.target.value)
                  setPage(1)
                }}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-700"
              >
                <option value="All">All</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Jobs Section */}
      <div className="space-y-6">
        <h2 className="font-display text-3xl font-bold text-ink-900">
          Latest Jobs
        </h2>

        {/* Job Results Grid */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : currentJobs.length > 0 ? (
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
                        ]
                        const colorClass = colors[i % colors.length]
                        return (
                          <span
                            key={i}
                            className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold border transition hover:shadow-md ${colorClass}`}
                          >
                            <span className="mr-1">✦</span>
                            {typeof tag === 'string' ? tag : tag.name}
                          </span>
                        )
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
              <div className="mt-16 flex justify-center">
                <div className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 shadow-sm">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(1)}
                    className="rounded-full border-2 border-slate-300 bg-white px-5 py-1.5 text-sm font-semibold text-slate-500 transition duration-200 hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:text-slate-300"
                  >
                    Previous
                  </button>

                  <div className="mx-2 flex items-center gap-1">
                    {pageNumbers.map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition duration-200 ${
                          p === page
                            ? 'bg-brand-700 text-white shadow-md'
                            : 'border-2 border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:shadow-sm'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(totalPages)}
                    className="rounded-full border-2 border-slate-300 bg-white px-5 py-1.5 text-sm font-semibold text-slate-500 transition duration-200 hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:text-slate-300"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : !loading ? (
          <div className="surface-muted flex flex-col items-center justify-center rounded-2xl border border-slate-200 p-12 text-center">
            <p className="text-slate-600">No jobs found matching your search.</p>
            <Link href="/jobs" className="mt-4 font-semibold text-brand-700 hover:text-brand-800">
              Browse all jobs by category →
            </Link>
          </div>
        ) : null}
      </div>

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
            href="/jobs"
            className="inline-flex items-center justify-center rounded-lg bg-brand-700 px-6 py-3 font-semibold text-white transition hover:bg-brand-800"
          >
            Browse by Category
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
