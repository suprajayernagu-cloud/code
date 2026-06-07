import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllJobs } from '@/src/lib/jobs'
import PageMeta from '@/src/components/PageMeta'

export const dynamic = 'force-dynamic'

function getFieldText(value) {
  if (!value) return ''
  if (Array.isArray(value)) return value.map(getFieldText).join(' ')
  if (typeof value === 'object') return Object.values(value).map(getFieldText).join(' ')
  return String(value)
}

function getJobText(job, fields) {
  return fields.map((field) => getFieldText(job[field])).join(' ').toLowerCase()
}

function hasExperiencedYearSignal(text) {
  const plusMatch = text.match(/(?:^|[^\d])([2-9]|1\d)\s*\+?\s*(?:years?|yrs?)/i)
  if (plusMatch) return true

  const rangeMatch = text.match(/(?:^|[^\d])(\d{1,2})\s*-\s*(\d{1,2})\s*(?:years?|yrs?)?/i)
  if (!rangeMatch) return false

  const min = Number(rangeMatch[1])
  const max = Number(rangeMatch[2])
  return min >= 1 && max >= 3
}

function isEarlyCareerSignal(job) {
  const text = getJobText(job, ['title', 'type', 'experience', 'tags'])
  return (
    /intern|internship|fresher|freshers|entry[- ]?level|graduate trainee/.test(text) ||
    /\btrainee\b/.test(text) ||
    /(?:^|[^\d])0\s*-\s*\d{1,2}\s*(?:years?|yrs?)/i.test(text) ||
    /(?:^|[^\d])0\s*\+\s*(?:years?|yrs?)/i.test(text)
  )
}

function isExperiencedJob(job) {
  const titleAndTags = getJobText(job, ['title', 'tags'])
  const experienceText = getJobText(job, ['experience'])
  const searchableText = getJobText(job, [
    'title',
    'experience',
    'overview',
    'description',
    'qualifications',
    'officialDescription',
  ])

  const seniorSignal =
    /\b(senior|lead|principal|staff|manager|architect|experienced|professional)\b/.test(titleAndTags) ||
    /\bengineer\s+(ii|iii|iv)\b/.test(titleAndTags) ||
    /\b(sde|swe)\s+(ii|iii|iv)\b/.test(titleAndTags)

  if (isEarlyCareerSignal(job)) return false

  return (
    seniorSignal ||
    hasExperiencedYearSignal(experienceText) ||
    hasExperiencedYearSignal(searchableText)
  )
}

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
    filter: isExperiencedJob,
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
  'walk-in': {
    label: 'Walk-in Jobs and Direct Hiring Drives',
    description: 'Walk-in drives, direct interviews, and fast hiring opportunities for freshers and experienced candidates in India.',
    filter: (job) =>
      job.title?.toLowerCase().includes('walk-in') ||
      job.title?.toLowerCase().includes('walkin') ||
      job.description?.toLowerCase().includes('walk-in') ||
      job.description?.toLowerCase().includes('walkin') ||
      job.tags?.some((t) => t.toLowerCase?.().includes('walk')),
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
  pune: {
    label: 'Jobs in Pune 2026',
    description: 'Software, IT, product, support, and fresher job openings in Pune across established companies and growing teams.',
    filter: (job) => job.location?.toLowerCase().includes('pune'),
  },
  noida: {
    label: 'Jobs in Noida 2026',
    description: 'Latest Noida job openings for freshers, interns, software engineers, analysts, and support roles.',
    filter: (job) => job.location?.toLowerCase().includes('noida'),
  },
  gurgaon: {
    label: 'Jobs in Gurgaon and Gurugram 2026',
    description: 'Gurgaon and Gurugram job openings in technology, operations, consulting, finance, support, and product teams.',
    filter: (job) =>
      job.location?.toLowerCase().includes('gurgaon') ||
      job.location?.toLowerCase().includes('gurugram'),
  },
  kolkata: {
    label: 'Jobs in Kolkata 2026',
    description: 'Kolkata job openings for freshers and experienced candidates across technology, operations, and business roles.',
    filter: (job) => job.location?.toLowerCase().includes('kolkata'),
  },

  // Degree and candidate type
  btech: {
    label: 'B.E/B.Tech Jobs 2026',
    description: 'Engineering jobs for B.E, B.Tech, and related technical graduates across software, product, cloud, support, and analyst roles.',
    filter: (job) =>
      JSON.stringify([job.title, job.description, job.qualifications, job.overview])
        .toLowerCase()
        .match(/b\.?e|b\.?tech|engineering|engineer/),
  },
  mca: {
    label: 'BCA/MCA Jobs 2026',
    description: 'Freshers and experienced jobs for BCA, MCA, computer applications, and software-focused graduates.',
    filter: (job) =>
      JSON.stringify([job.title, job.description, job.qualifications, job.overview])
        .toLowerCase()
        .match(/bca|mca|computer applications/),
  },
  mba: {
    label: 'MBA Jobs 2026',
    description: 'MBA and management graduate jobs across consulting, business operations, sales, marketing, analytics, and program roles.',
    filter: (job) =>
      JSON.stringify([job.title, job.description, job.qualifications, job.overview])
        .toLowerCase()
        .match(/mba|management|business|sales|marketing|consulting/),
  },
  diploma: {
    label: 'Diploma Jobs 2026',
    description: 'Diploma and early-career technical jobs across support, engineering, operations, and trainee roles.',
    filter: (job) =>
      JSON.stringify([job.title, job.description, job.qualifications, job.overview])
        .toLowerCase()
        .includes('diploma'),
  },
  'any-degree': {
    label: 'Any Degree Jobs 2026',
    description: 'Openings where candidates from multiple degree backgrounds can apply, including support, operations, analyst, sales, and trainee roles.',
    filter: (job) =>
      JSON.stringify([job.title, job.description, job.qualifications, job.overview])
        .toLowerCase()
        .match(/any degree|any graduate|graduate|bachelor|degree/),
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
  { label: 'Walk-in', href: '/jobs/walk-in' },
  { label: 'Bangalore', href: '/jobs/bangalore' },
  { label: 'Hyderabad', href: '/jobs/hyderabad' },
  { label: 'Pune', href: '/jobs/pune' },
  { label: 'Mumbai', href: '/jobs/mumbai' },
  { label: 'Delhi', href: '/jobs/delhi' },
  { label: 'Chennai', href: '/jobs/chennai' },
  { label: 'Noida', href: '/jobs/noida' },
  { label: 'Gurgaon', href: '/jobs/gurgaon' },
  { label: 'B.E/B.Tech', href: '/jobs/btech' },
  { label: 'BCA/MCA', href: '/jobs/mca' },
  { label: 'MBA', href: '/jobs/mba' },
  { label: 'Any Degree', href: '/jobs/any-degree' },
  { label: 'Pan India', href: '/jobs/india' },
]

function getTagName(tag) {
  return typeof tag === 'string' ? tag : tag?.name
}

function getTopValues(items, limit = 8) {
  const counts = items.filter(Boolean).reduce((acc, item) => {
    const key = String(item).trim()
    if (!key) return acc
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }))
}

function buildCategoryInsights(jobs) {
  const companies = getTopValues(jobs.map((job) => job.company), 6)
  const locations = getTopValues(jobs.map((job) => job.location), 6)
  const skills = getTopValues(
    jobs.flatMap((job) => Array.isArray(job.tags) ? job.tags.map(getTagName) : []),
    10
  )
  const types = getTopValues(jobs.map((job) => job.type || (job.remote ? 'Remote' : 'Full-time')), 5)

  return { companies, locations, skills, types }
}

function InsightList({ title, items }) {
  if (!items.length) return null

  return (
    <div>
      <h3 className="font-semibold text-ink-900">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-slate-700">
        {items.map((item) => (
          <li key={item.label} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
            <span>{item.label}</span>
            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {item.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

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
  const insights = buildCategoryInsights(filteredJobs)
  const latestJob = filteredJobs[0]

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

      {/* Category Guide Content */}
      <section className="space-y-6 border-t border-slate-200 pt-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">Career Category Guide</p>
          <h2 className="font-display text-3xl font-bold text-ink-900">
            About {config.label}
          </h2>
          <p className="max-w-3xl text-slate-700 leading-7">
            This page collects {config.label.toLowerCase()} from the HiringsToday job database and keeps them grouped in one place for easier browsing. Use it to compare role titles, locations, salary or stipend mentions, required skills, eligibility notes, and application links before opening individual job posts.
          </p>
          <p className="max-w-3xl text-slate-700 leading-7">
            Every job detail page includes a source section, last checked date, application notes, selection process, documents to keep ready, preparation tips, and frequently asked questions. Candidates should still verify the official apply link before sharing personal information or attending any interview.
          </p>
        </div>

        <div className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-ink-900">How to use this page</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
              <li>Open roles that match your location, batch, degree, and skill set.</li>
              <li>Check the eligibility and source section before applying.</li>
              <li>Keep your resume, marksheets, ID proof, certificates, and project links ready.</li>
              <li>Apply early when the deadline is not mentioned, because links may close without notice.</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-ink-900">What to check before applying</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              <li>Role title and company name match the official application page.</li>
              <li>Salary, stipend, location, and work mode are acceptable for you.</li>
              <li>Your resume clearly mentions the required skills and projects.</li>
              <li>No recruiter or third party asks for payment to attend the hiring process.</li>
            </ul>
          </div>
        </div>

        {filteredJobs.length > 0 && (
          <div className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2 lg:grid-cols-4">
            <InsightList title="Top companies" items={insights.companies} />
            <InsightList title="Common locations" items={insights.locations} />
            <InsightList title="Popular skills" items={insights.skills} />
            <InsightList title="Job types" items={insights.types} />
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-display text-xl font-bold text-ink-900">
              Preparation focus for {config.label}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Start with the job description and identify the top three requirements. For technical roles, revise the listed programming languages, projects, debugging basics, and interview fundamentals. For analyst, operations, support, sales, or management roles, prepare examples around communication, ownership, reporting, problem-solving, and customer handling.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              If you are applying as a fresher, do not leave your resume empty. Add college projects, internships, certifications, hackathons, coursework, volunteer work, or any practical example that proves you can learn and execute.
            </p>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-display text-xl font-bold text-ink-900">
              Latest listing note
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              {latestJob
                ? `One recent listing in this category is ${latestJob.title} at ${latestJob.company}. Check the full job page for source details, eligibility, salary or stipend information, and documents required before applying.`
                : 'No live listing is available in this category right now. Use the quick filters above to browse related roles.'}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              HiringsToday groups job information to make comparison easier, but the final hiring decision, deadline, interview schedule, salary, and joining process always depend on the employer.
            </p>
          </section>
        </div>

        <section className="space-y-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-ink-900">
            FAQs about {config.label}
          </h2>
          <details className="border-t border-slate-100 pt-3">
            <summary className="cursor-pointer font-semibold text-ink-900">
              Are these jobs verified?
            </summary>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Each job detail page includes source and last checked fields from the available data. Applicants should still open the source link and confirm the employer, role, deadline, and form details before applying.
            </p>
          </details>
          <details className="border-t border-slate-100 pt-3">
            <summary className="cursor-pointer font-semibold text-ink-900">
              Can freshers apply from this page?
            </summary>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Freshers should check the experience and qualification fields on each job page. Some roles are open to 2026 or recent batches, while others require specific work experience.
            </p>
          </details>
          <details className="border-t border-slate-100 pt-3">
            <summary className="cursor-pointer font-semibold text-ink-900">
              What documents should I keep ready?
            </summary>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Keep an updated resume, government or college ID, marksheets, certificates, portfolio links, GitHub or LinkedIn profile, and any requested experience documents ready before submitting applications.
            </p>
          </details>
        </section>
      </section>

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
