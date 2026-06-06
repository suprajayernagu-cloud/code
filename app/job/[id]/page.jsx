import React from 'react'
import Link from 'next/link'
import RelatedJobs from '@/src/components/RelatedJobs'
import RelatedArticles from '@/src/components/RelatedArticles'
import { notFound } from 'next/navigation'
import { getJobById, getAllJobs } from '@/src/lib/jobs'

export const dynamic = 'force-dynamic'

function formatPostedDate(dateString) {
  if (!dateString) return 'Posted date not listed'

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return 'Posted date not listed'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function formatOptionalDate(dateString) {
  if (!dateString) return null

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function hasListItems(value) {
  return Array.isArray(value) && value.filter(Boolean).length > 0
}

function objectItems(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return []
  return Object.values(value).filter(Boolean)
}

function getSkillName(skill) {
  return typeof skill === 'string' ? skill : skill?.name
}

export async function generateMetadata({ params }) {
  const job = await getJobById(params.id)

  if (!job) {
    return {
      title: 'Job Not Found | Hiringstoday',
      description: 'The job you are looking for does not exist.',
    }
  }

  const title = `${job.title} at ${job.company} | Hiringstoday`
  const description = (job.overview || `Apply for ${job.title} at ${job.company}`).slice(0, 155)
  const canonicalUrl = `https://hiringstoday.in/job/${params.id}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'Hiringstoday',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function JobDetailsPage({ params }) {
  const job = await getJobById(params.id)

  if (!job) {
    notFound()
  }

  let allJobs = []
  try {
    allJobs = await getAllJobs(false)
  } catch (error) {
    console.error('Failed to fetch related jobs:', error)
  }

  const applyUrl = job.link || job.applyUrl || job.applyLink
  const hasTrustDetails =
    job.sourceName ||
    job.sourceUrl ||
    job.lastCheckedAt ||
    job.applicationDeadline ||
    job.editorNote
  const hasApplicationDetails =
    hasListItems(job.selectionProcess) ||
    hasListItems(job.documentsRequired) ||
    hasListItems(job.whoShouldApply) ||
    hasListItems(job.whoShouldSkip)
  const eligibilityItems = objectItems(job.eligibilityDetailed)
  const prepItems = hasListItems(job.preparationTips) ? job.preparationTips : []
  const applySteps = hasListItems(job.howToApply) ? job.howToApply : []
  const faqItems = hasListItems(job.faq) ? job.faq : []

  const jobSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.overview || job.title,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
      ...(job.logoUrl && { logo: job.logoUrl }),
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
        ...(job.location && { addressLocality: job.location }),
      },
    },
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'India',
    },
    ...(job.postedAt && { datePosted: job.postedAt }),
    validThrough: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: job.type?.toUpperCase() ?? 'FULL_TIME',
    directApply: true,
    ...(applyUrl && { url: applyUrl }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
        suppressHydrationWarning
      />

      <article
        className="mx-auto max-w-4xl space-y-8"
        itemScope
        itemType="https://schema.org/JobPosting"
      >
        <div>
          <Link href="/" className="text-sm text-brand-700 hover:text-brand-800">
            ← Back to Jobs
          </Link>
        </div>

        <header className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-ink-900" itemProp="title">{job.title}</h1>
              <p className="mt-2 text-lg text-slate-600" itemProp="hiringOrganization">{job.company}</p>
            </div>
          </div>

          <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Posted Date</p>
              <p className="mt-1 text-sm font-semibold text-ink-900">
                <time dateTime={job.postedAt || undefined} itemProp="datePosted">
                  {formatPostedDate(job.postedAt)}
                </time>
              </p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Author</p>
              <p className="mt-1 text-sm font-semibold text-ink-900">Siddiq K</p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Location</p>
              <p className="mt-1 text-sm font-semibold text-ink-900">{job.location || 'Not listed'}</p>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Job Type</p>
              <p className="mt-1 text-sm font-semibold text-ink-900">
                {job.remote ? 'Remote' : job.type || 'Full-time'}
              </p>
            </div>
          </div>
        </header>

        {job.overview && (
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-2xl font-bold text-ink-900">About This Role</h2>
            <p className="text-slate-700 leading-relaxed" itemProp="description">{job.overview}</p>
          </section>
        )}

        {job.applicationAdvice && (
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-2xl font-bold text-ink-900">Before You Apply</h2>
            <p className="rounded-lg border border-slate-200 bg-white p-4 text-slate-700 leading-relaxed shadow-sm">
              {job.applicationAdvice}
            </p>
          </section>
        )}

        {hasTrustDetails && (
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-2xl font-bold text-ink-900">Source & Verification</h2>
            <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2">
              {job.sourceName && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Source</p>
                  <p className="mt-1 text-sm font-semibold text-ink-900">{job.sourceName}</p>
                </div>
              )}

              {job.lastCheckedAt && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Last Checked</p>
                  <p className="mt-1 text-sm font-semibold text-ink-900">{formatOptionalDate(job.lastCheckedAt)}</p>
                </div>
              )}

              {job.applicationDeadline && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Application Deadline</p>
                  <p className="mt-1 text-sm font-semibold text-ink-900">{formatOptionalDate(job.applicationDeadline)}</p>
                </div>
              )}

              {job.sourceUrl && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Official Link</p>
                  <a
                    href={job.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex text-sm font-semibold text-brand-700 hover:text-brand-800"
                  >
                    View source
                  </a>
                </div>
              )}
            </div>

            {job.editorNote && (
              <p className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm leading-6 text-slate-700">
                <span className="font-bold text-ink-900">Editor note: </span>
                {job.editorNote}
              </p>
            )}
          </section>
        )}

        {job.responsibilitiesDetailed && (
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-2xl font-bold text-ink-900">Responsibilities</h2>
            <ul className="space-y-2">
              {typeof job.responsibilitiesDetailed === 'object' &&
              !Array.isArray(job.responsibilitiesDetailed)
                ? Object.values(job.responsibilitiesDetailed).map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-brand-700 font-bold">•</span>
                      <div className="text-slate-700">
                        <p className="font-semibold">
                          {typeof item === 'string' ? item : item.responsibility}
                        </p>
                        {item.whatItMeans && (
                          <p className="text-sm text-slate-600 mt-1">{item.whatItMeans}</p>
                        )}
                      </div>
                    </li>
                  ))
                : Array.isArray(job.responsibilitiesDetailed)
                ? job.responsibilitiesDetailed.map((resp, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-brand-700 font-bold">•</span>
                      <span className="text-slate-700">{resp}</span>
                    </li>
                  ))
                : <p className="text-slate-700">{String(job.responsibilitiesDetailed)}</p>}
            </ul>
          </section>
        )}

        {eligibilityItems.length > 0 && (
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-2xl font-bold text-ink-900">Eligibility</h2>
            <ul className="space-y-3">
              {eligibilityItems.map((item, i) => (
                <li key={i} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="font-semibold text-ink-900">
                    {typeof item === 'string' ? item : item.requirement}
                  </p>
                  {item.whyRequired && (
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.whyRequired}</p>
                  )}
                  {item.howToMeet && (
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.howToMeet}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {job.skillsRequired && (
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-2xl font-bold text-ink-900">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(job.skillsRequired)
                ? job.skillsRequired.map((skill, i) => {
                    const skillName = getSkillName(skill)
                    return (
                      <span
                        key={i}
                        className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                      >
                        {skillName}
                      </span>
                    )
                  })
                : <p className="text-slate-700">{String(job.skillsRequired)}</p>}
            </div>
          </section>
        )}

        {job.salaryInsights && (
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-2xl font-bold text-ink-900">Salary & Benefits</h2>
            <p className="text-slate-700 leading-relaxed">{job.salaryInsights}</p>
          </section>
        )}

        {job.whyApply && (
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-2xl font-bold text-ink-900">Why Apply</h2>
            <div className="text-slate-700">
              {typeof job.whyApply === 'string' ? (
                <p className="leading-relaxed">{job.whyApply}</p>
              ) : Array.isArray(job.whyApply) ? (
                <ul className="space-y-2">
                  {job.whyApply.map((reason, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-brand-700 font-bold">✓</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        )}

        {hasApplicationDetails && (
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-2xl font-bold text-ink-900">Application Notes</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {hasListItems(job.whoShouldApply) && (
                <div>
                  <h3 className="font-semibold text-ink-900">Who should apply</h3>
                  <ul className="mt-2 space-y-2 text-sm text-slate-700">
                    {job.whoShouldApply.map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="font-bold text-brand-700">-</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {hasListItems(job.whoShouldSkip) && (
                <div>
                  <h3 className="font-semibold text-ink-900">Who may skip</h3>
                  <ul className="mt-2 space-y-2 text-sm text-slate-700">
                    {job.whoShouldSkip.map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="font-bold text-brand-700">-</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {hasListItems(job.selectionProcess) && (
                <div>
                  <h3 className="font-semibold text-ink-900">Expected selection process</h3>
                  <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-slate-700">
                    {job.selectionProcess.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ol>
                </div>
              )}

              {hasListItems(job.documentsRequired) && (
                <div>
                  <h3 className="font-semibold text-ink-900">Documents to keep ready</h3>
                  <ul className="mt-2 space-y-2 text-sm text-slate-700">
                    {job.documentsRequired.map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="font-bold text-brand-700">-</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {prepItems.length > 0 && (
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-2xl font-bold text-ink-900">Preparation Tips</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {prepItems.map((tip, i) => (
                <div key={i} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <h3 className="font-semibold text-ink-900">
                    {typeof tip === 'string' ? `Tip ${i + 1}` : tip.tip}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {typeof tip === 'string' ? tip : tip.description}
                  </p>
                  {tip.timeline && (
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {tip.timeline}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {applySteps.length > 0 && (
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-2xl font-bold text-ink-900">How To Apply</h2>
            <ol className="space-y-3">
              {applySteps.map((step, i) => (
                <li key={i} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="font-semibold text-ink-900">
                    {step.step ? `${step.step}. ` : `${i + 1}. `}
                    {typeof step === 'string' ? step : step.action}
                  </p>
                  {step.details && (
                    <p className="mt-2 text-sm leading-6 text-slate-700">{step.details}</p>
                  )}
                  {step.estimatedTime && (
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {step.estimatedTime}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}

        {job.aboutCompany?.aboutCompany && (
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-2xl font-bold text-ink-900">About {job.company}</h2>
            <p className="text-slate-700 leading-relaxed">{job.aboutCompany.aboutCompany}</p>
            <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2">
              {job.aboutCompany.headquarters && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Headquarters</p>
                  <p className="mt-1 text-sm font-semibold text-ink-900">{job.aboutCompany.headquarters}</p>
                </div>
              )}
              {job.aboutCompany.indianPresence && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">India Presence</p>
                  <p className="mt-1 text-sm font-semibold text-ink-900">{job.aboutCompany.indianPresence}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {faqItems.length > 0 && (
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-2xl font-bold text-ink-900">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <details key={i} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <summary className="cursor-pointer font-semibold text-ink-900">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <section className="border-t pt-6">
          {applyUrl ? (
            <a
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-brand-700 px-6 py-3 font-semibold text-white transition hover:bg-brand-800"
            >
              Apply Now →
            </a>
          ) : (
            <p className="text-slate-600 italic">Apply link not available at this time. Please check back later or contact the employer directly.</p>
          )}
        </section>

        {Array.isArray(allJobs) && allJobs.length > 0 && (
          <RelatedJobs currentJobId={job.id} allJobs={allJobs} />
        )}

        <RelatedArticles />
      </article>
    </>
  )
}
