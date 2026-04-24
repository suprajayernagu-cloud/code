import React from 'react'
import Link from 'next/link'
import RelatedJobs from '@/src/components/RelatedJobs'
import RelatedArticles from '@/src/components/RelatedArticles'
import { notFound } from 'next/navigation'
import { getJobById, getAllJobs } from '@/src/lib/jobs'
import { SITE_URL } from '@/src/config'

// Force dynamic rendering for fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 3600

/**
 * Generate metadata for the job detail page
 * Critical for SEO and social sharing
 */
export async function generateMetadata({ params }) {
  const job = await getJobById(params.id)

  if (!job) {
    return {
      title: 'Job Not Found | HiringsToday',
      description: 'The job you are looking for does not exist.',
    }
  }

  const title = `${job.title} at ${job.company} | HiringsToday`
  const description = (job.overview || `Apply for ${job.title} position at ${job.company}`).slice(0, 160)
  const canonicalUrl = `${SITE_URL}/job/${params.id}`

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
      siteName: 'HiringsToday',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

/**
 * Generate JSON-LD for Google Jobs structured data
 */
function JobPostingSchema({ job }) {
  const schema = {
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
    ...(job.postedAt && { datePosted: job.postedAt }),
    employmentType: job.type?.toUpperCase() ?? 'FULL_TIME',
    directApply: true,
    ...(job.link && { url: job.link }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      suppressHydrationWarning
    />
  )
}

/**
 * Job detail page component
 * Server component that renders full job content for SEO
 */
export default async function JobDetailsPage({ params }) {
  // Fetch job directly without API call
  const job = await getJobById(params.id)

  // Return 404 if job not found
  if (!job) {
    notFound()
  }

  // Fetch all jobs for related jobs section
  let allJobs = []
  try {
    allJobs = await getAllJobs(true)
  } catch (error) {
    console.error('Failed to fetch related jobs:', error)
  }

  return (
    <>
      {/* JSON-LD Schema for Google Jobs */}
      <JobPostingSchema job={job} />

      <article className="mx-auto max-w-4xl space-y-8">
        {/* Back link */}
        <div>
          <Link href="/" className="text-sm text-brand-700 hover:text-brand-800">
            ← Back to Jobs
          </Link>
        </div>

        {/* Header with job title and company */}
        <header className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-ink-900">{job.title}</h1>
              <p className="mt-2 text-lg text-slate-600">{job.company}</p>
            </div>
          </div>

          {/* Job metadata badges */}
          <div className="flex flex-wrap gap-2">
            {job.location && (
              <span className="rounded-full bg-brand-100 px-3 py-1 text-sm text-brand-700">
                {job.location}
              </span>
            )}
            {job.type && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                {job.type}
              </span>
            )}
            {job.remote && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                Remote
              </span>
            )}
          </div>
        </header>

        {/* About the role section */}
        {job.overview && (
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-2xl font-bold text-ink-900">About This Role</h2>
            <p className="text-slate-700 leading-relaxed">{job.overview}</p>
          </section>
        )}

        {/* Responsibilities section */}
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

        {/* Skills section */}
        {job.skillsRequired && (
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-2xl font-bold text-ink-900">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(job.skillsRequired)
                ? job.skillsRequired.map((skill, i) => {
                    const skillName =
                      typeof skill === 'string' ? skill : skill.name
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

        {/* Salary & Benefits section */}
        {job.salaryInsights && (
          <section className="space-y-4 border-t pt-6">
            <h2 className="text-2xl font-bold text-ink-900">Salary & Benefits</h2>
            <p className="text-slate-700 leading-relaxed">{job.salaryInsights}</p>
          </section>
        )}

        {/* Why Apply section */}
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

        {/* Call to action */}
        <section className="border-t pt-6">
          <a
            href={job.link || job.applyLink || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-brand-700 px-6 py-3 font-semibold text-white transition hover:bg-brand-800"
          >
            Apply Now →
          </a>
        </section>

        {/* Related jobs */}
        {Array.isArray(allJobs) && allJobs.length > 0 && (
          <RelatedJobs currentJobId={job.id} allJobs={allJobs} />
        )}

        {/* Related articles */}
        <RelatedArticles />
      </article>
    </>
  )
}