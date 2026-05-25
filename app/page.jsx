import React from 'react'
import Link from 'next/link'
import PageMeta from '@/src/components/PageMeta'
import { blogArticles } from '@/src/data/blog'
import { getAllJobs } from '@/src/lib/jobs'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Daily Job Updates in India | Hiringstoday Career Blog',
  description:
    'Find daily updated fresher jobs, off-campus drives, internships, remote jobs, and career guides for Indian job seekers.',
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

function getTagName(tag) {
  return typeof tag === 'string' ? tag : tag?.name
}

function matchesText(job, values) {
  const haystack = [
    job.title,
    job.company,
    job.location,
    job.type,
    job.workMode,
    job.experience,
    ...(Array.isArray(job.tags) ? job.tags.map(getTagName) : []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return values.some((value) => haystack.includes(value.toLowerCase()))
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

function SectionHeader({ kicker, title, description, href, linkLabel }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-orange-600">{kicker}</p>
        <h2 className="mt-2 font-display text-2xl font-bold leading-tight text-ink-900 sm:text-3xl">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>
      {href ? (
        <Link href={href} className="inline-flex text-sm font-bold text-brand-800 hover:text-orange-600">
          {linkLabel}
        </Link>
      ) : null}
    </div>
  )
}

function JobCard({ job }) {
  const tags = Array.isArray(job.tags) ? job.tags.map(getTagName).filter(Boolean).slice(0, 2) : []
  const salary = formatSalary(job.salary)

  return (
    <Link href={`/job/${job.id}`} className="group block h-full">
      <article className="flex h-full min-w-0 flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl sm:p-5">
        <div className="flex items-start gap-3">
          <CompanyLogo company={job.company} logoUrl={job.logoUrl} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-500">
              <span className="rounded-full bg-orange-50 px-2.5 py-1 text-orange-700">
                {job.type || 'Off Campus'}
              </span>
              <span>{formatDate(job.postedAt)}</span>
            </div>
            <h3 className="mt-2 line-clamp-2 font-display text-lg font-bold leading-snug text-ink-900 group-hover:text-brand-800">
              {job.title}
            </h3>
            <p className="mt-1 truncate text-sm font-semibold text-slate-700">{job.company}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          {job.location ? <p className="line-clamp-1">{job.location}</p> : null}
          {salary ? <p className="font-bold text-brand-800">{salary}</p> : null}
        </div>

        {tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-sm">
          <span className="font-semibold text-slate-500">Verified listing</span>
          <span className="font-bold text-orange-600">Apply Now →</span>
        </div>
      </article>
    </Link>
  )
}

function FeatureTile({ href, title, description, count, tone = 'blue' }) {
  const toneClass = tone === 'orange' ? 'bg-orange-50 text-orange-700' : 'bg-brand-50 text-brand-800'

  return (
    <Link href={href} className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold text-ink-900 group-hover:text-brand-800">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <span className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-bold ${toneClass}`}>
          {count}
        </span>
      </div>
    </Link>
  )
}

function ArticleCard({ article }) {
  return (
    <Link href={`/blog/${article.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl">
        <div className="h-36 overflow-hidden bg-slate-100 sm:h-40">
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-orange-600">{article.category}</p>
          <h3 className="mt-3 font-display text-lg font-bold leading-snug text-ink-900 group-hover:text-brand-800">
            {article.title}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{article.excerpt}</p>
          <p className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
            {article.author} / {article.readTime} min read
          </p>
        </div>
      </article>
    </Link>
  )
}

function NewsTicker({ items }) {
  const tickerItems = items.length > 0
    ? items
    : [
        'Wipro Off Campus 2026',
        'TCS Hiring Freshers',
        'Google Product Support',
        'Infosys Batch Openings',
        'Remote Roles',
      ]

  const tickerContent = [...tickerItems, ...tickerItems]

  return (
    <div className="news-ticker border-t border-white/10 bg-[#02263a]/35 px-4 py-3 text-xs font-semibold leading-6 text-blue-100 sm:px-8 sm:text-sm lg:px-10">
      <div className="news-ticker__track" aria-label="Latest job updates">
        {tickerContent.map((item, index) => (
          <span key={`${item}-${index}`} className="news-ticker__item">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default async function Home() {
  let jobs = []

  try {
    jobs = await getAllJobs(false)
  } catch (error) {
    console.error('Failed to load homepage jobs:', error.message)
  }

  const sortedJobs = [...jobs].sort((a, b) => {
    const dateA = a.postedAt ? new Date(a.postedAt).getTime() : 0
    const dateB = b.postedAt ? new Date(b.postedAt).getTime() : 0
    return dateB - dateA
  })

  const latestJobs = sortedJobs.slice(0, 8)
  const latestArticles = [...blogArticles]
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, 6)

  const locations = [
    { title: 'Bangalore', href: '/jobs/bangalore', values: ['bangalore', 'bengaluru'] },
    { title: 'Hyderabad', href: '/jobs/hyderabad', values: ['hyderabad'] },
    { title: 'Pune', href: '/jobs/pune', values: ['pune'] },
    { title: 'Chennai', href: '/jobs/chennai', values: ['chennai'] },
    { title: 'Mumbai', href: '/jobs/mumbai', values: ['mumbai'] },
    { title: 'Work From Home', href: '/jobs/remote', values: ['remote', 'work from home', 'wfh'] },
  ].map((item) => ({
    ...item,
    count: jobs.filter((job) => matchesText(job, item.values)).length,
  }))

  const jobTypes = [
    { title: 'Off Campus Drive', href: '/jobs/fresher', description: 'Latest drives for freshers and recent graduates.', values: ['fresher', 'graduate', 'entry level', '2026'] },
    { title: 'Internships', href: '/jobs/internship', description: 'Intern roles for students and early-career talent.', values: ['intern', 'internship'] },
    { title: 'Work From Home', href: '/jobs/remote', description: 'Remote and flexible openings across India.', values: ['remote', 'work from home', 'wfh'] },
    { title: 'Walk-in Drives', href: '/jobs/walk-in', description: 'Direct walk-ins and fast hiring opportunities.', values: ['walk-in', 'walkin'] },
    { title: 'Experienced Roles', href: '/jobs/experienced', description: 'Openings for candidates with prior experience.', values: ['senior', 'lead', 'experienced', '3 years'] },
    { title: 'Hybrid Jobs', href: '/jobs/hybrid', description: 'Office plus remote roles for flexible teams.', values: ['hybrid'] },
  ].map((item) => ({
    ...item,
    count: jobs.filter((job) => matchesText(job, item.values)).length,
  }))

  const topCompanies = Object.values(
    jobs.reduce((acc, job) => {
      if (!job.company) return acc
      if (!acc[job.company]) {
        acc[job.company] = {
          company: job.company,
          logoUrl: job.logoUrl,
          count: 0,
        }
      }
      acc[job.company].count += 1
      return acc
    }, {})
  )
    .sort((a, b) => b.count - a.count)
    .slice(0, 12)

  const tickerItems = latestJobs.slice(0, 8).map((job) => {
    const company = job.company ? `${job.company} ` : ''
    return `${company}${job.title}`
  })

  return (
    <section className="space-y-12">
      <PageMeta
        title="Daily Job Updates in India | Hiringstoday Career Blog"
        description="Find daily updated fresher jobs, off-campus drives, internships, remote jobs, and career guides for Indian job seekers."
      />

      <section className="overflow-hidden rounded-lg border border-brand-900 bg-brand-900 text-white shadow-xl shadow-brand-900/20">
        <div className="grid gap-7 px-4 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-12">
          <div className="min-w-0">
            <p className="inline-flex max-w-full rounded-full bg-white/10 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-orange-200 sm:px-4 sm:text-xs">
              India's daily job update blog
            </p>
            <h1 className="mt-5 font-display text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Find Your Dream Job Before the Campus Does
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-blue-100 sm:text-lg sm:leading-8">
              Daily off-campus drives, internships, work-from-home jobs, location-wise openings,
              and practical career guides for 2024-2027 batch candidates.
            </p>

            <form action="/jobs" className="mt-7 flex w-full max-w-2xl flex-col gap-3 rounded-lg border border-white/15 bg-white p-3 shadow-2xl sm:flex-row">
              <input
                type="search"
                name="q"
                placeholder="Search jobs, company, skill, or location"
                className="min-h-12 min-w-0 flex-1 rounded-md border border-slate-200 px-4 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
              <button type="submit" className="min-h-12 rounded-md bg-orange-500 px-6 text-sm font-bold text-brand-900 transition hover:bg-orange-400 sm:shrink-0">
                Search Jobs
              </button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { href: '/jobs/fresher', label: 'Software Engineer' },
                { href: '/jobs/remote', label: 'Work From Home' },
                { href: '/jobs/internship', label: 'Internship 2026' },
                { href: '/jobs/bangalore', label: 'Bangalore Jobs' },
                { href: '/jobs/2026', label: '2026 Batch' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:border-orange-300 hover:text-orange-200 sm:px-4 sm:text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <aside className="min-w-0 rounded-lg border border-white/15 bg-white/10 p-4 sm:p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-orange-200 sm:text-sm">Get instant job alerts</p>
            <h2 className="mt-3 font-display text-xl font-bold text-white sm:text-2xl">Join readers checking new drives every day.</h2>
            <p className="mt-3 text-sm leading-7 text-blue-100">
              Bookmark Hiringstoday for verified openings, direct apply guidance, and interview prep in one place.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { value: jobs.length || 'Daily', label: 'Jobs posted' },
                { value: topCompanies.length || 'Top', label: 'Companies' },
                { value: '2024-27', label: 'Batch focus' },
                { value: blogArticles.length, label: 'Guides' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg bg-white p-4 text-brand-900">
                  <p className="font-display text-2xl font-bold">{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
        <NewsTicker items={tickerItems} />
      </section>

      <section className="space-y-6">
        <SectionHeader
          kicker="Latest off-campus drives"
          title="Freshest openings updated every day"
          description="Apply quickly with job cards built for scanning company, location, role type, and posting date."
          href="/jobs"
          linkLabel="View All Drives →"
        />

        {latestJobs.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {latestJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600 shadow-sm">
            Latest jobs are being refreshed. Please check again shortly.
          </div>
        )}
      </section>

      <section className="space-y-6">
        <SectionHeader
          kicker="Jobs by location"
          title="Explore opportunities in your city"
          href="/jobs/india"
          linkLabel="View All Cities →"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <FeatureTile
              key={location.href}
              href={location.href}
              title={location.title}
              description="Browse daily openings for this location."
              count={`${location.count} jobs`}
            />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader
          kicker="Browse by job type"
          title="Find openings matching your work preference"
          href="/jobs"
          linkLabel="All Types →"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobTypes.map((type) => (
            <FeatureTile
              key={type.href}
              href={type.href}
              title={type.title}
              description={type.description}
              count={`${type.count}+`}
              tone="orange"
            />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader
          kicker="Top hiring companies"
          title="Direct paths to active openings"
          href="/jobs"
          linkLabel="All Companies →"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topCompanies.map((item) => (
            <Link
              key={item.company}
              href="/jobs"
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
            >
              <CompanyLogo company={item.company} logoUrl={item.logoUrl} />
              <div className="min-w-0">
                <p className="truncate font-bold text-ink-900">{item.company}</p>
                <p className="text-xs font-semibold text-slate-500">{item.count} openings</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader
          kicker="Career advice and placement prep"
          title="Interview tips, resume guides, and hiring news"
          href="/blog"
          linkLabel="Read All →"
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {latestArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-orange-200 bg-orange-50 p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-orange-700 sm:text-sm">Never miss a job alert</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-ink-900 sm:text-3xl">Get new drives, internships, and career guides in one place.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700">
              Hiringstoday keeps job discovery simple with active openings, direct apply information,
              category pages, and clear resources for candidates.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/jobs" className="inline-flex justify-center rounded-lg bg-brand-900 px-5 py-3 text-sm font-bold text-white hover:bg-brand-800">
              Browse All Jobs
            </Link>
            <Link href="/blog" className="inline-flex justify-center rounded-lg border border-orange-300 bg-white px-5 py-3 text-sm font-bold text-orange-700 hover:bg-orange-100">
              Read Guides
            </Link>
          </div>
        </div>
      </section>
    </section>
  )
}
