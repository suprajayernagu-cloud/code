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

function toSentenceList(items = []) {
  const cleanItems = items.filter(Boolean)

  if (cleanItems.length === 0) return ''
  if (cleanItems.length === 1) return cleanItems[0]
  if (cleanItems.length === 2) return `${cleanItems[0]} and ${cleanItems[1]}`

  return `${cleanItems.slice(0, -1).join(', ')}, and ${cleanItems[cleanItems.length - 1]}`
}

const EMPTY_EXTENDED_CONTENT = {
  companyOverview: [],
  jobDescription: [],
  eligibilityIntro: '',
  eligibilityItems: [],
  salaryInsights: [],
  salaryChecks: [],
  selectionIntro: '',
  selectionSteps: [],
  preparationIntro: '',
  preparationTips: [],
}

function toTrimmedText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function toTrimmedStringArray(items = []) {
  if (!Array.isArray(items)) return []

  return items
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
}

function toSelectionSteps(items = [], fallbackSteps = []) {
  if (!Array.isArray(items)) return fallbackSteps

  const normalized = items
    .map((item, index) => {
      const fallbackStep = fallbackSteps[index] || {}

      if (typeof item === 'string' && item.trim()) {
        return {
          title: item.trim(),
          body: fallbackStep.body || '',
        }
      }

      if (!item || typeof item !== 'object') return null

      const title = toTrimmedText(item.title) || fallbackStep.title || `Step ${index + 1}`
      const body = toTrimmedText(item.body) || fallbackStep.body || ''

      if (!title && !body) return null

      return { title, body }
    })
    .filter(Boolean)

  return normalized.length > 0 ? normalized : fallbackSteps
}

function toPreparationTips(items = [], fallbackTips = []) {
  if (!Array.isArray(items)) return fallbackTips

  const normalized = items
    .map((item, index) => {
      const fallbackTip = fallbackTips[index] || {}

      if (typeof item === 'string' && item.trim()) {
        return {
          title: fallbackTip.title || `Tip ${index + 1}`,
          body: item.trim(),
        }
      }

      if (!item || typeof item !== 'object') return null

      const title = toTrimmedText(item.title) || fallbackTip.title || `Tip ${index + 1}`
      const body = toTrimmedText(item.body) || fallbackTip.body || ''

      if (!title && !body) return null

      return { title, body }
    })
    .filter(Boolean)

  return normalized.length > 0 ? normalized : fallbackTips
}

function formatSourceType(value) {
  const text = toTrimmedText(value)
  if (!text) return ''

  return text
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function getRoleContext(job) {
  const text = [job?.title, job?.company, job?.experience, ...(job?.tags || [])].join(' ').toLowerCase()

  if (/(developer|engineer|software|frontend|backend|full stack|mern|python|java|react|node|data|ai|cloud|technical)/i.test(text)) {
    return {
      family: 'technical',
      focus: 'problem solving, implementation quality, and tool familiarity',
      selectionSteps: [
        'Application and profile screening',
        'Skill or aptitude assessment',
        'Technical discussion with the team',
        'Final conversation with hiring or HR',
      ],
      prepAreas: [
        'refresh the core tools, languages, or frameworks named in the listing',
        'prepare to explain how you would approach a real task or bug',
        'review projects that show ownership, debugging, or delivery',
        'be ready to discuss learning speed and collaboration style',
      ],
    }
  }

  if (/(finance|audit|account|bank|banking|m&a|analyst|tax|billing|cfo|sox|investment)/i.test(text)) {
    return {
      family: 'finance',
      focus: 'accuracy, commercial thinking, reporting discipline, and analytical judgement',
      selectionSteps: [
        'Resume shortlist and role-fit check',
        'Functional or aptitude round',
        'Role discussion with the business team',
        'HR or final approval round',
      ],
      prepAreas: [
        'revise the finance, audit, reporting, or analysis basics tied to the role',
        'prepare examples that show attention to detail and clean documentation',
        'be ready to discuss Excel, numbers, reconciliation, or research workflows',
        'understand why the company may be hiring for this function right now',
      ],
    }
  }

  if (/(sales|relationship|business development|telesales|customer|retail banking)/i.test(text)) {
    return {
      family: 'sales',
      focus: 'communication, follow-up discipline, product understanding, and customer handling',
      selectionSteps: [
        'Initial profile screening',
        'Communication or role-fit round',
        'Manager discussion on targets and customer handling',
        'HR round and offer discussion',
      ],
      prepAreas: [
        'practice a clear introduction and a confident explanation of your background',
        'prepare examples of persuasion, follow-up, or customer support situations',
        'learn the basics of the product, service, or category you may discuss',
        'show that you understand targets, discipline, and responsiveness',
      ],
    }
  }

  return {
    family: 'professional',
    focus: 'clarity, reliability, domain understanding, and ability to learn quickly',
    selectionSteps: [
      'Application review',
      'Shortlisting or screening call',
      'Role-specific evaluation',
      'Final HR or manager discussion',
    ],
    prepAreas: [
      'review the main duties listed on the page and connect them to your experience',
      'prepare simple examples that show ownership and consistency',
      'study the company page so your answers do not feel generic',
      'double-check location, schedule, and eligibility details before the interview',
    ],
  }
}

function buildExtendedContent(job) {
  if (!job) {
    return EMPTY_EXTENDED_CONTENT
  }

  const tags = Array.isArray(job?.tags) ? job.tags.filter(Boolean).slice(0, 4) : []
  const responsibilities = Array.isArray(job?.responsibilities)
    ? job.responsibilities.filter(Boolean).slice(0, 4)
    : []
  const qualifications = Array.isArray(job?.qualifications)
    ? job.qualifications.filter(Boolean).slice(0, 4)
    : []
  const context = getRoleContext(job)
  const locationText = job?.location || 'the listed work location'
  const workModeText = isRemoteJob(job)
    ? `The listing also suggests some level of remote flexibility, so candidates should still confirm whether the role is fully remote, hybrid, or tied to a city after joining.`
    : `Because the role is tied to ${locationText}, it is worth confirming reporting expectations, relocation rules, and whether travel or office presence is part of the day-to-day setup.`
  const skillText = tags.length > 0 ? toSentenceList(tags) : 'the core responsibilities listed above'
  const responsibilityText =
    responsibilities.length > 0
      ? `From the listed responsibilities, the job appears to focus on ${toSentenceList(responsibilities)}.`
      : `The listing points to a role where candidates will need to understand the work quickly, communicate clearly, and handle day-to-day execution with consistency.`
  const qualificationsText =
    qualifications.length > 0
      ? `The formal entry points mentioned include ${toSentenceList(qualifications)}.`
      : `The final eligibility should still be checked on the employer page because some openings update education, experience, or documentation rules after publishing.`
  const salaryParagraph = job?.salary
    ? /\d/.test(job.salary)
      ? `${job.salary} is shown on this page, which is helpful because many listings do not share compensation upfront. Even then, candidates should confirm whether the amount reflects fixed pay only or includes bonus, incentives, training period terms, or variable components.`
      : `The listing mentions compensation as "${job.salary}", which gives a direction but not a full structure. Before applying, confirm whether there is fixed pay, performance-linked pay, allowances, probation adjustments, or location-based differences.`
    : `The listing does not show a clear salary band, so compensation should not be assumed from the title alone. Before spending time on tests or interviews, it is smart to ask whether the package, variable pay, and location expectations match your target range.`

  return {
    companyOverview: [
      `${job.company} is hiring for the ${job.title} role, and the information available on this page makes the first review much easier than scanning a raw listing. You can already see the role title, location, experience level, work type, and important skills before moving to the employer page.`,
      `For job seekers, that matters because a role like this is usually evaluated on fit, timing, and clarity. Based on the listing signals, this appears to be a ${context.family} opening that values ${context.focus}. ${workModeText}`,
    ],
    jobDescription: [
      `${job.description || `This opening is presented as a ${job.type || 'professional'} opportunity with ${job.company}.`} ${responsibilityText} That gives candidates a better sense of whether the role is hands-on, analytical, customer-facing, or execution-heavy.`,
      `In practical terms, a strong applicant for this role is likely someone who can work with ${skillText}, communicate clearly, and stay dependable when instructions or priorities shift. The employer page should still be the final source, but the listing already suggests what kind of profile may stand out early in screening.`,
    ],
    eligibilityIntro: `Before applying, it helps to read the eligibility in a practical way instead of only scanning the title. ${qualificationsText} You should also compare the required skills, location, and work style with your actual profile so you do not waste time on a role that looks attractive but is not a true match.`,
    eligibilityItems: [
      ...qualifications,
      job?.experience ? `Experience expectation: ${job.experience}` : 'Review whether the role expects freshers, entry-level candidates, or prior domain exposure.',
      tags.length > 0 ? `Comfort with ${skillText} will strengthen your profile.` : 'Role-relevant tools or domain basics should be revised before applying.',
      `Make sure you can work from ${locationText} or meet the listed work-style expectations.`,
    ].slice(0, 6),
    salaryInsights: [
      salaryParagraph,
      `Salary should also be judged in context, not just by headline numbers. Compare the location, role scope, learning value, and progression path. A slightly lower package can still be worthwhile if the role gives stronger brand value, better training, or a clearer route into the kind of work you want next.`,
    ],
    salaryChecks: [
      'fixed pay versus incentives or bonus',
      'probation period salary changes',
      'work location costs and relocation needs',
      'shift timing, travel, or other hidden expectations',
    ],
    selectionIntro: `The exact hiring flow may differ by employer, but roles like this usually follow a predictable path. The main thing is to prepare for both basic screening and one role-specific evaluation, because most candidates lose momentum when they only prepare for HR questions and skip the functional part.`,
    selectionSteps: context.selectionSteps.map((step, index) => ({
      title: step,
      body:
        index === 0
          ? `Your resume, keywords, location fit, and eligibility are usually checked first. If your profile lines up with the title, experience level, and skills shown on this page, your chances of moving forward improve immediately.`
          : index === 1
            ? `This stage often checks whether you actually understand the basics needed for the job. Depending on the role, that can mean aptitude, domain questions, communication assessment, or a short practical exercise.`
            : index === 2
              ? `Expect deeper discussion on the work itself. Interviewers often look for examples, clarity, and whether you understand what success in the role would look like after joining.`
              : `The last stage usually confirms compensation fit, notice period or joining readiness, work location comfort, and overall seriousness. This is also the right time to verify anything that looked vague in the original listing.`,
    })),
    preparationIntro: `Preparation matters more than most candidates think, especially for listings that attract a high number of applicants in a short time. A little role-specific prep can make your answers sharper, your resume more relevant, and your application much more believable.`,
    preparationTips: [
      {
        title: 'Match your resume to the role',
        body: `Rework the top part of your resume so it reflects the job title, skills, and responsibilities shown here. If the role emphasizes ${skillText}, your projects, internships, coursework, or prior work should make that connection obvious within a few seconds.`,
      },
      {
        title: 'Prepare for the first screening round',
        body: `Have a short introduction ready that explains who you are, what kind of roles you are targeting, and why this opening fits. Avoid generic answers. A focused response usually performs much better than saying you are open to anything.`,
      },
      {
        title: 'Revise the role-specific basics',
        body: `Use the listing as a study guide. Review the responsibilities and the most visible skills, then prepare one or two examples that show how you have used similar concepts before. ${context.prepAreas[0]}.`,
      },
      {
        title: 'Verify details before investing time',
        body: `Before taking an assessment or submitting documents, confirm the apply link, salary structure, location expectations, and any degree or experience cutoffs. That final check saves time and helps you focus on roles that genuinely fit your goals.`,
      },
    ],
  }
}

function JobDetailsSkeleton({ path }) {
  return (
    <section className="space-y-6">
      <PageMeta
        title="Loading job details | Hiringstoday"
        description="Loading the selected job listing on Hiringstoday."
        canonicalPath={path}
        robots="noindex,follow"
      />

      <section className="surface p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="skeleton-shimmer h-16 w-16 rounded-2xl" />
            <div className="space-y-3">
              <div className="skeleton-shimmer h-7 w-24 rounded-full" />
              <div className="skeleton-shimmer h-10 w-72 max-w-[80vw] rounded-2xl" />
              <div className="flex flex-wrap gap-2">
                <div className="skeleton-shimmer h-8 w-28 rounded-full" />
                <div className="skeleton-shimmer h-8 w-32 rounded-full" />
                <div className="skeleton-shimmer h-8 w-24 rounded-full" />
              </div>
            </div>
          </div>
          <div className="skeleton-shimmer h-12 w-44 rounded-2xl" />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <section className="surface p-6 sm:p-7">
          <div className="space-y-6">
            {[0, 1, 2, 3, 4].map((block) => (
              <div key={block} className="space-y-3">
                <div className="skeleton-shimmer h-8 w-48 rounded-xl" />
                <div className="space-y-2">
                  <div className="skeleton-shimmer h-4 w-full rounded" />
                  <div className="skeleton-shimmer h-4 w-full rounded" />
                  <div className="skeleton-shimmer h-4 w-4/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="surface p-6">
          <div className="skeleton-shimmer h-8 w-32 rounded-xl" />
          <div className="mt-5 space-y-4">
            {[0, 1, 2, 3, 4].map((item) => (
              <div key={item} className="space-y-2 border-b border-[#efe6db] pb-4 last:border-b-0 last:pb-0">
                <div className="skeleton-shimmer h-4 w-full rounded" />
                <div className="skeleton-shimmer h-3 w-28 rounded" />
                <div className="skeleton-shimmer h-3 w-24 rounded" />
              </div>
            ))}
          </div>
        </aside>
      </section>
    </section>
  )
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
  const extendedContent = useMemo(() => (job ? buildExtendedContent(job) : null), [job])
  const hasOverview = Boolean(job?.overview)
  const hasWhoShouldApply = Array.isArray(job?.whoShouldApply) && job.whoShouldApply.length > 0
  const hasPrepTips = Array.isArray(job?.prepTips) && job.prepTips.length > 0
  const hasSelectionProcess = Array.isArray(job?.selectionProcess) && job.selectionProcess.length > 0
  const hasApplicationAdvice = Boolean(job?.applicationAdvice)
  const hasSourceType = Boolean(job?.sourceType)
  const fallbackContent = extendedContent || EMPTY_EXTENDED_CONTENT
  const overviewParagraphs = hasOverview ? [job.overview].map((item) => item.trim()).filter(Boolean) : fallbackContent.companyOverview
  const whoShouldApplyItems = hasWhoShouldApply ? toTrimmedStringArray(job.whoShouldApply) : fallbackContent.eligibilityItems
  const preparationTipsToRender = hasPrepTips ? toPreparationTips(job.prepTips, fallbackContent.preparationTips) : fallbackContent.preparationTips
  const selectionStepsToRender = hasSelectionProcess ? toSelectionSteps(job.selectionProcess, fallbackContent.selectionSteps) : fallbackContent.selectionSteps
  const sourceTypeLabel = hasSourceType ? formatSourceType(job.sourceType) : ''
  const applicationAdviceText = hasApplicationAdvice ? toTrimmedText(job.applicationAdvice) : ''

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
    return <JobDetailsSkeleton path={location.pathname} />
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
                {hasSourceType ? <span className="rounded-full bg-white/85 px-3 py-1">Source: {sourceTypeLabel}</span> : null}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
            {job.salary ? (
              <div className="rounded-2xl border border-brand-200 bg-brand-50/90 px-4 py-2 text-sm font-semibold text-brand-700">
                <div>{job.salary}</div>
                {job.isSalaryEstimated ? <div className="mt-1 text-xs font-medium text-brand-600">Estimated salary</div> : null}
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
                <h2 className="font-display text-2xl font-semibold text-ink-900">Company Overview</h2>
                <div className="mt-4 space-y-4">
                  {overviewParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>

              <section className="pt-1">
                <h2 className="font-display text-2xl font-semibold text-ink-900">Job Description</h2>
                <div className="mt-4 space-y-4">
                  {fallbackContent.jobDescription.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="font-display text-xl font-semibold text-ink-900">What this role seems to prioritize</h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
                    {(Array.isArray(job.responsibilities) && job.responsibilities.length > 0
                      ? job.responsibilities
                      : ['Role ownership', 'Clear communication', 'Execution quality']
                    )
                      .slice(0, 4)
                      .map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                  </ul>
                </div>
              </section>

              <section className="pt-1">
                <h2 className="font-display text-2xl font-semibold text-ink-900">
                  {hasWhoShouldApply ? 'Who Should Apply' : 'Eligibility Criteria'}
                </h2>
                <p className="mt-4">{hasWhoShouldApply ? 'This role is likely to fit candidates who match most of the points below.' : fallbackContent.eligibilityIntro}</p>
                <ul className="mt-4 list-disc space-y-2 pl-5">
                  {whoShouldApplyItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="pt-1">
                <h2 className="font-display text-2xl font-semibold text-ink-900">Salary Insights</h2>
                <div className="mt-4 space-y-4">
                  {fallbackContent.salaryInsights.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {job.isSalaryEstimated ? (
                    <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                      The salary shown for this role appears to be estimated. Confirm the final compensation structure on the employer page before you apply.
                    </p>
                  ) : null}
                </div>

                <div className="mt-5 rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5">
                  <h3 className="font-display text-xl font-semibold text-ink-900">What to confirm on the employer page</h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
                    {fallbackContent.salaryChecks.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="pt-1">
                <h2 className="font-display text-2xl font-semibold text-ink-900">Selection Process</h2>
                <p className="mt-4">
                  {hasSelectionProcess
                    ? 'The source listing already gives a clearer picture of the expected hiring flow. Use it as the primary sequence, then prepare for deeper role-fit questions as needed.'
                    : fallbackContent.selectionIntro}
                </p>

                <div className="mt-5 space-y-4">
                  {selectionStepsToRender.map((step, index) => (
                    <article key={step.title} className="rounded-3xl border border-slate-200 bg-white p-5">
                      <h3 className="font-display text-xl font-semibold text-ink-900">
                        {index + 1}. {step.title}
                      </h3>
                      {step.body ? <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">{step.body}</p> : null}
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-amber-200 bg-amber-50/70 p-5 sm:p-6">
                <h2 className="font-display text-2xl font-semibold text-ink-900">Preparation Tips</h2>
                <p className="mt-4">
                  {hasPrepTips
                    ? 'Use these preparation points from the latest dataset first, then match them against the job description and responsibilities shown above.'
                    : fallbackContent.preparationIntro}
                </p>

                <div className="mt-5 space-y-4">
                  {preparationTipsToRender.map((tip) => (
                    <article key={tip.title} className="rounded-3xl border border-amber-200/80 bg-white/75 p-4 sm:p-5">
                      <h3 className="font-display text-xl font-semibold text-ink-900">{tip.title}</h3>
                      {tip.body ? <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">{tip.body}</p> : null}
                    </article>
                  ))}
                </div>
              </section>

              {hasApplicationAdvice ? (
                <section className="pt-1">
                  <h2 className="font-display text-2xl font-semibold text-ink-900">Application Advice</h2>
                  <p className="mt-4">{applicationAdviceText}</p>
                </section>
              ) : null}

              <section className="pt-1">
                <h2 className="font-display text-2xl font-semibold text-ink-900">Important reminder</h2>
                <p className="mt-4 text-amber-900">
                  Hiringstoday is a job aggregator. Verify role details directly on the official company website before applying.
                </p>
                {hasSourceType ? <p className="mt-2 text-sm text-slate-600">Current source type: {sourceTypeLabel}.</p> : null}
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
