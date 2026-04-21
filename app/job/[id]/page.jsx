'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import PageMeta from '@/src/components/PageMeta'
import RelatedJobs from '@/src/components/RelatedJobs'
import RelatedArticles from '@/src/components/RelatedArticles'

export default function JobDetailsPage() {
  const params = useParams()
  const jobId = params?.id

  const [job, setJob] = useState(null)
  const [allJobs, setAllJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Fetch all jobs for related jobs, but with full details for main job
        const response = await fetch('/api/jobs?details=true')
        if (!response.ok) throw new Error('Failed to fetch jobs')
        const data = await response.json()
        setAllJobs(data || [])

        // Find the job by ID - handle both string and number IDs
        const foundJob = data?.find((j) => {
          return String(j.id) === String(jobId) || j.id === parseInt(jobId)
        })

        if (!foundJob) {
          setError('Job not found')
          return
        }

        setJob(foundJob)
      } catch (err) {
        setError(err.message || 'Failed to load job details')
      } finally {
        setLoading(false)
      }
    }

    if (jobId) {
      fetchJobs()
    }
  }, [jobId])

  if (loading) {
    return <JobDetailsSkeleton />
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-4xl rounded-lg bg-red-50 p-6 text-center">
        <h2 className="text-xl font-bold text-red-900">Error Loading Job</h2>
        <p className="mt-2 text-red-700">{error || 'Job not found'}</p>
        <Link href="/" className="mt-4 inline-block rounded bg-brand-700 px-4 py-2 text-white hover:bg-brand-800">
          Back to Jobs
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageMeta
        title={`${job.title} at ${job.company}`}
        description={job.overview || `Apply for ${job.title} position at ${job.company}`}
      />

      <div>
        <Link href="/" className="text-sm text-brand-700 hover:text-brand-800">
          ← Back to Jobs
        </Link>
      </div>

      <header className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ink-900">{job.title}</h1>
            <p className="mt-2 text-lg text-slate-600">{job.company}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {job.location && (
            <span className="rounded-full bg-brand-100 px-3 py-1 text-sm text-brand-700">{job.location}</span>
          )}
          {job.type && <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{job.type}</span>}
          {job.remote && <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">Remote</span>}
        </div>
      </header>

      {job.overview && (
        <section className="space-y-4 border-t pt-6">
          <h2 className="text-2xl font-bold text-ink-900">About This Role</h2>
          <p className="text-slate-700">{job.overview}</p>
        </section>
      )}

      {job.responsibilitiesDetailed && (
        <section className="space-y-4 border-t pt-6">
          <h2 className="text-2xl font-bold text-ink-900">Responsibilities</h2>
          <ul className="space-y-2">
            {typeof job.responsibilitiesDetailed === 'object' && !Array.isArray(job.responsibilitiesDetailed)
              ? Object.values(job.responsibilitiesDetailed).map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-brand-700">•</span>
                    <div className="text-slate-700">
                      <p className="font-semibold">{typeof item === 'string' ? item : item.responsibility}</p>
                      {item.whatItMeans && <p className="text-sm text-slate-600 mt-1">{item.whatItMeans}</p>}
                    </div>
                  </li>
                ))
              : Array.isArray(job.responsibilitiesDetailed)
              ? job.responsibilitiesDetailed.map((resp, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-brand-700">•</span>
                    <span className="text-slate-700">{resp}</span>
                  </li>
                ))
              : <p className="text-slate-700">{String(job.responsibilitiesDetailed)}</p>}
          </ul>
        </section>
      )}

      {job.skillsRequired && (
        <section className="space-y-4 border-t pt-6">
          <h2 className="text-2xl font-bold text-ink-900">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(job.skillsRequired)
              ? job.skillsRequired.map((skill, i) => {
                  const skillName = typeof skill === 'string' ? skill : skill.name;
                  return (
                    <span key={i} className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                      {skillName}
                    </span>
                  );
                })
              : <p className="text-slate-700">{String(job.skillsRequired)}</p>}
          </div>
        </section>
      )}

      {job.salaryInsights && (
        <section className="space-y-4 border-t pt-6">
          <h2 className="text-2xl font-bold text-ink-900">Salary & Benefits</h2>
          <p className="text-slate-700">{job.salaryInsights}</p>
        </section>
      )}

      {job.whyApply && (
        <section className="space-y-4 border-t pt-6">
          <h2 className="text-2xl font-bold text-ink-900">Why Apply</h2>
          <div className="prose prose-sm max-w-none text-slate-700">
            {typeof job.whyApply === 'string' ? (
              <p>{job.whyApply}</p>
            ) : Array.isArray(job.whyApply) ? (
              <ul className="space-y-2">
                {job.whyApply.map((reason, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-brand-700">✓</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      )}

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

      {Array.isArray(allJobs) && allJobs.length > 0 && <RelatedJobs currentJobId={job.id} allJobs={allJobs} />}
      <RelatedArticles />
    </div>
  )
}

function JobDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="h-8 w-1/3 animate-pulse rounded bg-slate-200" />
      <div className="h-6 w-1/2 animate-pulse rounded bg-slate-200" />
      <div className="space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  )
}
