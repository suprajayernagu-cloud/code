import React from 'react'
import Link from 'next/link'
import { getAllJobs } from '@/src/lib/jobs'
import PageMeta from '@/src/components/PageMeta'

export const metadata = {
  title: 'Browse Jobs by Filter - Fresher, Remote, Experience Level | HiringsToday',
  description: 'Browse job opportunities filtered by experience level, work type, location, and posted date. Find fresher jobs, remote positions, and opportunities across India.',
}

export const dynamic = 'force-dynamic'

// Helper to format salary
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

// Helper to format relative date
function formatRelativeDate(dateString) {
  if (!dateString) return 'New listing'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return 'New listing'

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

// Company avatar helper
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

const filterCategories = [
  { label: 'Fresher Jobs', href: '/jobs/fresher', emoji: '🚀' },
  { label: 'Experienced Jobs', href: '/jobs/experienced', emoji: '⭐' },
  { label: 'Internships', href: '/jobs/internship', emoji: '📚' },
  { label: 'Remote Jobs', href: '/jobs/remote', emoji: '🏠' },
  { label: 'Office Jobs', href: '/jobs/office', emoji: '🏢' },
  { label: 'Hybrid Jobs', href: '/jobs/hybrid', emoji: '🔄' },
  { label: 'Bangalore Jobs', href: '/jobs/bangalore', emoji: '🌆' },
  { label: 'Hyderabad Jobs', href: '/jobs/hyderabad', emoji: '🌃' },
  { label: 'Mumbai Jobs', href: '/jobs/mumbai', emoji: '🏙️' },
  { label: 'Delhi Jobs', href: '/jobs/delhi', emoji: '🏛️' },
  { label: 'Chennai Jobs', href: '/jobs/chennai', emoji: '🌴' },
  { label: 'Pan India Jobs', href: '/jobs/india', emoji: '🇮🇳' },
]

export default async function BrowseJobsHubPage() {
  let allJobs = []
  try {
    allJobs = await getAllJobs(false)
  } catch (error) {
    console.error('Failed to fetch jobs:', error)
  }

  const recentJobs = allJobs.slice(0, 9)

  // Generate schema for ItemList
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: recentJobs.map((job, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: job.title,
      description: job.overview || job.title,
      url: `https://hiringstoday.in/job/${job.id}`,
    })),
  }

  return (
    <section className="space-y-12">
      <PageMeta
        title="Browse Jobs by Filter - Fresher, Remote, Experience Level | HiringsToday"
        description="Browse job opportunities filtered by experience level, work type, location, and posted date. Find fresher jobs, remote positions, and opportunities across India."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        suppressHydrationWarning
      />

      {/* Hero Section */}
      <div className="text-center space-y-4">
        <p className="text-sm font-semibold tracking-wide text-brand-700">Browse by Filter</p>
        <h1 className="font-display text-4xl font-bold text-ink-900 sm:text-5xl">
          Find Your Perfect Job
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Browse thousands of verified job opportunities across India. Filter by experience level, work type, location, or posting date to find roles that match your career goals.
        </p>
      </div>

      {/* Filter Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filterCategories.map((category) => (
          <Link
            key={category.href}
            href={category.href}
            className="surface group rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-brand-300 transition hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{category.emoji}</span>
              <h3 className="font-semibold text-ink-900 group-hover:text-brand-700">
                {category.label}
              </h3>
            </div>
            <p className="text-sm text-slate-600 mt-2">Browse →</p>
          </Link>
        ))}
      </div>

      {/* Featured Jobs Section */}
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900">
            Recently Posted ({allJobs.length} total)
          </h2>
          <p className="text-slate-600 mt-2">
            Latest opportunities from top companies
          </p>
        </div>

        {recentJobs.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentJobs.map((job) => (
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
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600">No jobs available at the moment. Please check back soon!</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="surface space-y-4 rounded-2xl border border-slate-200 p-8 text-center">
        <h2 className="font-display text-2xl font-bold text-ink-900">
          Ready to land your next role?
        </h2>
        <p className="text-slate-600">
          Explore filtered job opportunities or get expert guidance with our career resources.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/jobs/fresher"
            className="inline-flex items-center justify-center rounded-lg bg-brand-700 px-6 py-3 font-semibold text-white transition hover:bg-brand-800"
          >
            Explore Fresher Roles
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
