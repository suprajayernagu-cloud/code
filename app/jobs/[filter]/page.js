import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllJobs } from '@/src/lib/jobs'
import PageMeta from '@/src/components/PageMeta'

export const dynamic = 'force-dynamic'

// Filter configuration with labels, descriptions, and filtering logic
const FILTER_CONFIG = {
  // Experience
  fresher: {
    label: 'Fresher Jobs 2026',
    description: 'Entry-level and fresher job openings in India for 2026. Perfect for recent graduates and people starting their career.',
    filter: (job) =>
      job.experience?.toLowerCase().includes('fresh') ||
      job.experience?.includes('0') ||
      job.title?.toLowerCase().includes('fresher') ||
      job.tags?.some((t) => t.toLowerCase?.().includes('fresher')),
  },
  experienced: {
    label: 'Experienced Professional Jobs',
    description: 'Mid and senior level tech jobs across India. Opportunities for professionals with 3+ years of experience.',
    filter: (job) =>
      !job.experience?.toLowerCase().includes('fresh') &&
      (job.experience?.match(/[3-9]|10|\d{2}/) ||
        job.tags?.some((t) => ['senior', 'lead', 'principal'].includes(t?.toLowerCase?.())) ||
        job.experience?.toLowerCase().includes('experience')),
  },
  internship: {
    label: 'Internship Opportunities 2026',
    description: 'Paid and unpaid internships at top companies in India. Great for students and early-career professionals.',
    filter: (job) =>
      job.type?.toLowerCase().includes('intern') ||
      job.title?.toLowerCase().includes('intern') ||
      job.tags?.some((t) => t.toLowerCase?.().includes('intern')),
  },

  // Work Type
  remote: {
    label: 'Remote Jobs India 2026',
    description: 'Work from home and remote job opportunities in India. Build your career without geographical boundaries.',
    filter: (job) =>
      job.remote === true ||
      job.location?.toLowerCase().includes('remote') ||
      job.tags?.some((t) => t.toLowerCase?.().includes('remote')),
  },
  office: {
    label: 'Work from Office Jobs',
    description: 'On-site office jobs at top companies in India. Opportunities requiring in-office presence.',
    filter: (job) =>
      (job.remote === false || !job.remote) &&
      !job.location?.toLowerCase().includes('remote') &&
      job.location,
  },
  hybrid: {
    label: 'Hybrid Jobs India',
    description: 'Hybrid work model jobs across India. Combine office and remote work flexibility.',
    filter: (job) =>
      job.workMode?.toLowerCase().includes('hybrid') ||
      job.tags?.some((t) => t.toLowerCase?.().includes('hybrid')),
  },

  // Year
  '2026': {
    label: 'Jobs Posted in 2026',
    description: 'Latest job openings posted in 2026 across India. Fresh opportunities from top companies.',
    filter: (job) => job.postedAt?.startsWith('2026'),
  },
  '2025': {
    label: 'Jobs Posted in 2025',
    description: 'Job openings posted in 2025 across India. Browse opportunities from the previous year.',
    filter: (job) => job.postedAt?.startsWith('2025'),
  },

  // Locations
  bangalore: {
    label: 'Tech Jobs in Bangalore 2026',
    description: 'Software and tech job openings in Bangalore, India. Home to India\'s tech startup ecosystem.',
    filter: (job) =>
      job.location?.toLowerCase().includes('bangalore') ||
      job.location?.toLowerCase().includes('bengaluru'),
  },
  hyderabad: {
    label: 'Jobs in Hyderabad 2026',
    description: 'Tech and IT job openings in Hyderabad, India. Growing tech hub with competitive opportunities.',
    filter: (job) => job.location?.toLowerCase().includes('hyderabad'),
  },
  mumbai: {
    label: 'Jobs in Mumbai 2026',
    description: 'Job openings in Mumbai and Navi Mumbai. Finance and tech opportunities in India\'s financial capital.',
    filter: (job) => job.location?.toLowerCase().includes('mumbai'),
  },
  delhi: {
    label: 'Jobs in Delhi NCR 2026',
    description: 'Tech jobs in Delhi, Noida, and Gurgaon. Growing tech and startup ecosystem in NCR region.',
    filter: (job) =>
      job.location?.toLowerCase().includes('delhi') ||
      job.location?.toLowerCase().includes('noida') ||
      job.location?.toLowerCase().includes('gurgaon') ||
      job.location?.toLowerCase().includes('gurugram'),
  },
  chennai: {
    label: 'Jobs in Chennai 2026',
    description: 'IT and tech job openings in Chennai, India. Strong manufacturing and IT presence.',
    filter: (job) => job.location?.toLowerCase().includes('chennai'),
  },
  india: {
    label: 'Pan India Jobs 2026',
    description: 'Job openings across all cities in India. Browse all opportunities from top companies nationwide.',
    filter: (job) => true,
  },
}

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

// All filter pills for navigation
const ALL_FILTERS = [
  { label: 'Fresher', href: '/jobs/fresher' },
  { label: 'Experienced', href: '/jobs/experienced' },
  { label: 'Internship', href: '/jobs/internship' },
  { label: 'Remote', href: '/jobs/remote' },
  { label: 'Office', href: '/jobs/office' },
  { label: 'Hybrid', href: '/jobs/hybrid' },
  { label: 'Bangalore', href: '/jobs/bangalore' },
  { label: 'Hyderabad', href: '/jobs/hyderabad' },
  { label: 'Mumbai', href: '/jobs/mumbai' },
  { label: 'Delhi', href: '/jobs/delhi' },
  { label: 'Chennai', href: '/jobs/chennai' },
  { label: 'Pan India', href: '/jobs/india' },
]

export async function generateMetadata({ params }) {
  const config = FILTER_CONFIG[params.filter]

  if (!config) {
    return {
      title: 'Jobs | HiringsToday',
      description: 'Browse jobs on HiringsToday.',
    }
  }

  return {
    title: `${config.label} | HiringsToday`,
    description: config.description,
    alternates: {
      canonical: `https://hiringstoday.in/jobs/${params.filter}`,
    },
    openGraph: {
      title: config.label,
      description: config.description,
      url: `https://hiringstoday.in/jobs/${params.filter}`,
    },
  }
}

export default async function FilteredJobsPage({ params }) {
  const config = FILTER_CONFIG[params.filter]

  if (!config) {
    notFound()
  }

  let allJobs = []
  try {
    allJobs = await getAllJobs(false)
  } catch (error) {
    console.error('Failed to fetch jobs:', error)
  }

  // Apply filter
  const filteredJobs = allJobs.filter(config.filter)

  // Generate schema for ItemList
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: filteredJobs.map((job, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: job.title,
      description: job.overview || job.title,
      url: `https://hiringstoday.in/job/${job.id}`,
    })),
  }

  return (
    <section className="space-y-8">
      <PageMeta
        title={`${config.label} | HiringsToday`}
        description={config.description}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        suppressHydrationWarning
      />

      {/* Header */}
      <div className="space-y-4">
        <Link href="/jobs" className="text-sm text-brand-700 hover:text-brand-800 font-semibold">
          ← Back to Browse
        </Link>
        <div className="space-y-2">
          <h1 className="font-display text-4xl font-bold text-ink-900 sm:text-5xl">
            {config.label}
          </h1>
          <p className="text-lg text-slate-600">
            {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''} available
          </p>
          <p className="text-slate-600">
            {config.description}
          </p>
        </div>
      </div>

      {/* Filter Navigation Pills */}
      <nav className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quick Filters</p>
        <div className="flex flex-wrap gap-2">
          {ALL_FILTERS.map((filter) => (
            <Link
              key={filter.href}
              href={filter.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                `/jobs/${params.filter}` === filter.href
                  ? 'bg-brand-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Jobs Grid or Empty State */}
      {filteredJobs.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
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
        <div className="surface-muted flex flex-col items-center justify-center rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-600 mb-4">
            No jobs found for this filter. Try a different filter or browse all jobs.
          </p>
          <Link
            href="/jobs/india"
            className="inline-flex items-center justify-center rounded-lg bg-brand-700 px-6 py-3 font-semibold text-white transition hover:bg-brand-800"
          >
            View All India Jobs →
          </Link>
        </div>
      )}

      {/* CTA Section */}
      <section className="surface space-y-4 rounded-2xl border border-slate-200 p-8 text-center">
        <h2 className="font-display text-2xl font-bold text-ink-900">
          Ready to make your next career move?
        </h2>
        <p className="text-slate-600">
          Apply to positions that match your skills and experience level.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/resources/salary-negotiation-guide"
            className="inline-flex items-center justify-center rounded-lg bg-brand-700 px-6 py-3 font-semibold text-white transition hover:bg-brand-800"
          >
            Salary Negotiation Guide
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-lg border border-brand-700 bg-white px-6 py-3 font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            Career Tips & Stories
          </Link>
        </div>
      </section>
    </section>
  )
}
