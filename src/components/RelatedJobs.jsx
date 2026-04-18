import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'

export default function RelatedJobs({ currentJob, allJobs = [] }) {
  const relatedJobs = useMemo(() => {
    if (!currentJob || !allJobs.length) return []

    return allJobs
      .filter(job => job.id !== currentJob.id)
      .sort((a, b) => {
        // Score based on relevance
        let scoreA = 0,
          scoreB = 0

        // Same company (highest priority)
        if (a.company === currentJob.company) scoreA += 100
        if (b.company === currentJob.company) scoreB += 100

        // Same location
        if (a.location === currentJob.location) scoreA += 50
        if (b.location === currentJob.location) scoreB += 50

        // Shared skills/tags
        const currentTags = currentJob.tags || []
        const aTags = a.tags || []
        const bTags = b.tags || []

        scoreA += aTags.filter(t => currentTags.includes(t)).length * 10
        scoreB += bTags.filter(t => currentTags.includes(t)).length * 10

        return scoreB - scoreA
      })
      .slice(0, 5)
  }, [currentJob, allJobs])

  if (!relatedJobs.length) return null

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h3 className="font-bold text-slate-900 mb-4">Related Opportunities</h3>
      <div className="space-y-3">
        {relatedJobs.map(job => (
          <Link
            key={job.id}
            to={`/job/${job.id}`}
            className="block rounded-lg p-3 hover:bg-slate-50 transition"
          >
            <p className="font-medium text-slate-900 text-sm">{job.title}</p>
            <p className="text-xs text-slate-600 mt-1">{job.company}</p>
            <p className="text-xs text-slate-500 mt-1">{job.location}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
