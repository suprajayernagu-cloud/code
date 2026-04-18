import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import PageMeta from '../components/PageMeta'
import RelatedJobs from '../components/RelatedJobs'

export default function JobDetailsEnhanced() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/src/Untitled-1.json')
        if (!response.ok) throw new Error('Failed to fetch jobs')
        const data = await response.json()
        setJobs(data)

        // Find the job by ID
        const currentJob = data.find(j => j.id === parseInt(jobId))
        if (!currentJob) {
          setError('Job not found')
          return
        }

        setJob(currentJob)
      } catch (err) {
        setError(err.message || 'Failed to load job details')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [jobId])

  if (loading) {
    return <JobDetailsSkeleton />
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-4xl rounded-lg bg-red-50 p-6 text-center">
        <h2 className="text-xl font-bold text-red-900">Error Loading Job</h2>
        <p className="mt-2 text-red-700">{error || 'Job not found'}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Back to Jobs
        </button>
      </div>
    )
  }

  const jobUrl = `${window.location.origin}/job/${job.id}`
  const metaTitle = `${job.title} at ${job.company} - ₹${job.salary} | HiringsToday`
  const metaDescription = job.overview?.substring(0, 160) || job.description || ''

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${job.tags?.join(', ')}, jobs, ${job.location}`} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={jobUrl} />
        <meta property="og:image" content={job.logoUrl} />
        <link rel="canonical" href={jobUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'JobPosting',
            title: job.title,
            description: job.overview || job.description,
            datePosted: job.postedAt,
            validThroughDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            employmentType: job.type || 'FULL_TIME',
            hiringOrganization: {
              '@type': 'Organization',
              name: job.company,
              logo: job.logoUrl,
            },
            jobLocation: {
              '@type': 'Place',
              address: {
                '@type': 'PostalAddress',
                addressLocality: job.location,
                addressCountry: 'IN',
              },
            },
            baseSalary: {
              '@type': 'PriceSpecification',
              currency: 'INR',
              value: job.salary,
            },
            url: jobUrl,
          })}
        </script>
      </Helmet>

      <article className="mx-auto max-w-5xl space-y-8">
        {/* Hero Section */}
        <section className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-4">
              <img
                src={job.logoUrl}
                alt={`${job.company} logo`}
                className="h-20 w-20 rounded-xl object-cover shadow-md"
                loading="lazy"
              />
              <div>
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">{job.company}</p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">{job.title}</h1>
                <div className="mt-3 flex flex-wrap gap-3">
                  <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm">
                    📍 {job.location}
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm">
                    💰 {job.salary}
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm">
                    📅 {job.experience}
                  </div>
                  {job.remote && (
                    <div className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm">
                      🌍 Remote
                    </div>
                  )}
                </div>
              </div>
            </div>
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700"
            >
              Apply Now →
            </a>
          </div>
        </section>

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.tags.map(tag => (
              <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Overview */}
        {job.overview && (
          <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">Overview</h2>
            <p className="whitespace-pre-wrap text-lg leading-relaxed text-slate-700">{job.overview}</p>
          </section>
        )}

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Responsibilities */}
            {job.responsibilitiesDetailed && Object.keys(job.responsibilitiesDetailed).length > 0 && (
              <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="mb-4 text-2xl font-bold text-slate-900">Responsibilities</h2>
                <div className="space-y-4">
                  {Object.values(job.responsibilitiesDetailed).map((resp, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                      <h3 className="font-semibold text-slate-900">{resp.responsibility}</h3>
                      <p className="mt-2 text-slate-700">{resp.whatItMeans}</p>
                      <p className="mt-1 text-sm italic text-slate-600">💡 {resp.whyItMatters}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Eligibility */}
            {job.eligibilityDetailed && Object.keys(job.eligibilityDetailed).length > 0 && (
              <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="mb-4 text-2xl font-bold text-slate-900">Eligibility Requirements</h2>
                <div className="space-y-3">
                  {Object.values(job.eligibilityDetailed).map((qual, idx) => (
                    <div key={idx} className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                      <h3 className="font-semibold text-slate-900">{qual.requirement}</h3>
                      <p className="mt-2 text-slate-700">{qual.whyRequired}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {job.skillsRequired && job.skillsRequired.length > 0 && (
              <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="mb-4 text-2xl font-bold text-slate-900">Skills Required</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {job.skillsRequired.map((skill, idx) => (
                    <div key={idx} className="rounded-lg bg-indigo-50 p-4 border border-indigo-200">
                      <h3 className="font-semibold text-slate-900">{skill.name}</h3>
                      <p className="text-xs text-slate-600 mt-1">
                        <strong>Level:</strong> {skill.proficiencyLevel}
                      </p>
                      <p className="mt-2 text-sm text-slate-700">{skill.why}</p>
                      <p className="mt-2 text-xs italic text-slate-600">📚 {skill.howToBuild}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Salary Insights */}
            {job.salaryInsights && (
              <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="mb-4 text-2xl font-bold text-slate-900">💰 Salary & Compensation</h2>
                <p className="whitespace-pre-wrap leading-relaxed text-slate-700">{job.salaryInsights}</p>
              </section>
            )}

            {/* Why Apply */}
            {job.whyApply && (
              <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="mb-4 text-2xl font-bold text-slate-900">✨ Why You Should Apply</h2>
                <div className="space-y-3">
                  {job.whyApply.split('\n\n').map((reason, idx) => (
                    <div key={idx} className="flex gap-3">
                      <span className="text-2xl">✓</span>
                      <p className="text-slate-700">{reason}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Preparation Tips */}
            {job.preparationTips && job.preparationTips.length > 0 && (
              <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="mb-4 text-2xl font-bold text-slate-900">🎓 Interview Preparation Tips</h2>
                <div className="space-y-4">
                  {job.preparationTips.map((tip, idx) => (
                    <details key={idx} className="group border-l-4 border-purple-500 bg-purple-50 p-4 rounded cursor-pointer">
                      <summary className="font-semibold text-slate-900 cursor-pointer flex items-center gap-2">
                        <span className="inline-block transition group-open:rotate-90">▶</span>
                        {tip.tip}
                      </summary>
                      <p className="mt-2 text-slate-700 ml-6">{tip.description}</p>
                      <p className="mt-2 text-xs text-slate-600 ml-6">⏱️ {tip.timeline}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* How to Apply */}
            {job.howToApply && job.howToApply.length > 0 && (
              <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="mb-4 text-2xl font-bold text-slate-900">📝 How to Apply</h2>
                <div className="space-y-4">
                  {job.howToApply.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                        {step.step}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{step.action}</h3>
                        <p className="mt-1 text-slate-700">{step.details}</p>
                        <p className="mt-1 text-xs text-slate-600">⏱️ {step.estimatedTime}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 block w-full rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white shadow-lg transition hover:bg-blue-700"
                >
                  Start Your Application Now
                </a>
              </section>
            )}

            {/* About Company */}
            {job.aboutCompany && (
              <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="mb-4 text-2xl font-bold text-slate-900">About {job.company}</h2>
                <p className="whitespace-pre-wrap text-slate-700 leading-relaxed mb-4">
                  {job.aboutCompany.aboutCompany}
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  {job.aboutCompany.foundedYear && (
                    <div className="rounded bg-slate-50 p-3">
                      <p className="text-xs font-semibold text-slate-600 uppercase">Founded</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">{job.aboutCompany.foundedYear}</p>
                    </div>
                  )}
                  {job.aboutCompany.headquarters && (
                    <div className="rounded bg-slate-50 p-3">
                      <p className="text-xs font-semibold text-slate-600 uppercase">Headquarters</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">{job.aboutCompany.headquarters}</p>
                    </div>
                  )}
                  {job.aboutCompany.indianPresence && (
                    <div className="rounded bg-slate-50 p-3 md:col-span-2">
                      <p className="text-xs font-semibold text-slate-600 uppercase">India Presence</p>
                      <p className="mt-1 text-slate-900">{job.aboutCompany.indianPresence}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* FAQ */}
            {job.faq && job.faq.length > 0 && (
              <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="mb-4 text-2xl font-bold text-slate-900">❓ Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {job.faq.map((item, idx) => (
                    <details key={idx} className="group cursor-pointer">
                      <summary className="flex items-center justify-between rounded-lg bg-slate-50 p-4 font-semibold text-slate-900 hover:bg-slate-100">
                        <span>{item.question}</span>
                        <span className="inline-block transition group-open:rotate-180">▼</span>
                      </summary>
                      <p className="mt-2 ml-4 text-slate-700">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Quick Info */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase">Job Type</p>
                  <p className="mt-1 text-slate-900 font-medium">{job.type}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase">Experience</p>
                  <p className="mt-1 text-slate-900 font-medium">{job.experience}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-600 uppercase">Posted</p>
                  <p className="mt-1 text-slate-900 font-medium">{new Date(job.postedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Related Jobs */}
            <RelatedJobs currentJob={job} allJobs={jobs} />
          </aside>
        </div>
      </article>
    </>
  )
}

function JobDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="h-40 rounded-2xl bg-gradient-to-r from-slate-200 to-slate-300 animate-pulse" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-48 rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-32 rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
