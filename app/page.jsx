import React from 'react'
import PageMeta from '@/src/components/PageMeta'
import JobsGrid from '@/src/components/JobsGrid'
import { JOBS_URL } from '@/src/config'

export const metadata = {
  title: 'Latest Jobs in India | Hiringstoday',
  description: 'Browse current job openings by role, company, skill, and location. Compare jobs faster and continue to official employer apply pages from Hiringstoday.',
}

// Server-side data fetching for SSR
async function fetchJobs() {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    const response = await fetch(JOBS_URL, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Failed to fetch jobs:', error)
    return []
  }
}

export default async function Home() {
  const jobs = await fetchJobs()

  return (
    <section className="space-y-8">
      <PageMeta
        title="Latest Jobs in India | Hiringstoday"
        description="Browse current job openings by role, company, skill, and location. Compare jobs faster and continue to official employer apply pages from Hiringstoday."
      />
      
      <JobsGrid initialJobs={jobs} />
    </section>
  )
}
