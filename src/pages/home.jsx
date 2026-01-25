import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { JOBS_URL } from '../config'
import './home.css'

const ITEMS_PER_PAGE = 6

function CompanyAvatar({ company, logoUrl }) {
  if (logoUrl) {
    return <img src={logoUrl} alt={company} className="company-logo" />
  }
  const initial = company ? company.trim()[0].toUpperCase() : '?'
  return <div className="company-avatar">{initial}</div>
}

export default function Home() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetch(JOBS_URL)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch jobs')
        return res.json()
      })
      .then(setJobs)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="container">Loading jobs…</div>
  if (error) return <div className="container error">{error}</div>

  const totalPages = Math.ceil(jobs.length / ITEMS_PER_PAGE)
  const start = (page - 1) * ITEMS_PER_PAGE
  const currentJobs = jobs.slice(start, start + ITEMS_PER_PAGE)

  return (
    <div className="container">
      <h1 className="page-title">Latest Jobs</h1>

      <div className="jobs-grid">
        {currentJobs.map(job => (
          <article key={job.id} className="job-card">
            <CompanyAvatar company={job.company} logoUrl={job.logoUrl} />

            <div className="job-card-body">
              <h3 className="job-title">
                <Link to={`/jobs/${job.id}`}>{job.title}</Link>
              </h3>
              <div className="job-meta">
                {job.company} · {job.location}
              </div>
              <div className="job-tags">
                <span className="tag">{job.type}</span>
                {job.postedAt && <span className="muted">Posted {job.postedAt}</span>}
              </div>
            </div>

            <Link to={`/jobs/${job.id}`} className="view-link">
              View
            </Link>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          className="page-btn"
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`page-btn ${page === i + 1 ? 'active' : ''}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="page-btn"
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}
