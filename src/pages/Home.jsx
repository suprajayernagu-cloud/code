// Hiringstoday Home Page
// Latest job updates with search, filter, pagination & date sorting
// Color Palette: Primary #0F172A, Secondary #38BDF8, Accent #22C55E

import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { JOBS_URL } from '../config'
import './home.css'
import AdPlaceholder from '../components/AdPlaceholder'

const ITEMS_PER_PAGE = 8

function CompanyAvatar({ company, logoUrl }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`Logo of ${company}`}
        className="company-logo"
        loading="lazy"
      />
    )
  }

  const initial = company ? company.trim()[0].toUpperCase() : '?'
  return (
    <div
      className="company-avatar"
      aria-label={`Company initial ${initial}`}
      role="img"
    >
      {initial}
    </div>
  )
}

function JobSkeleton() {
  return (
    <article className="job-card skeleton" aria-hidden="true">
      <div className="skeleton-avatar" />
      <div className="job-card-body">
        <div className="skeleton-line title" />
        <div className="skeleton-line meta" />
        <div className="skeleton-line tag" />
      </div>
      <div className="skeleton-btn" />
    </article>
  )
}

export default function Home() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [savedJobs, setSavedJobs] = useState(() => new Set())

  useEffect(() => {
    fetch(JOBS_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch jobs')
        return res.json()
      })
      .then(setJobs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const toggleSave = useCallback((jobId) => {
    setSavedJobs((prev) => {
      const next = new Set(prev)
      next.has(jobId) ? next.delete(jobId) : next.add(jobId)
      return next
    })
  }, [])

  /* -------------------------------
     SORT: Latest jobs first
     postedAt format: YYYY-MM-DD
  -------------------------------- */
  const sortedJobs = useMemo(() => {
    return [...jobs].sort(
      (a, b) => new Date(b.postedAt) - new Date(a.postedAt)
    )
  }, [jobs])

  const filteredJobs = useMemo(() => {
    const q = search.toLowerCase()
    return sortedJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q)
    )
  }, [sortedJobs, search])

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE)
  const start = (page - 1) * ITEMS_PER_PAGE
  const currentJobs = filteredJobs.slice(start, start + ITEMS_PER_PAGE)

  if (error) {
    return (
      <div className="container error" role="alert">
        {error}
      </div>
    )
  }

  return (
    <main className="container" role="main" aria-label="Hiringstoday home page">
            {/* Hero */}
       <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title">Hiringstoday</h1>
        <p>
          Discover the latest job opportunities, updated daily.
          Your career starts here.
        </p>

        <form
          className="search-form"
          role="search"
          aria-label="Search jobs"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder="Search jobs or companies"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            aria-label="Search jobs or companies"
          />
        </form>
      </section> 
      {/* Jobs */}
      <section className="jobs-grid" aria-label="Latest job listings">
        {loading &&
          Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <JobSkeleton key={i} />
          ))}

        {!loading && currentJobs.length === 0 && (
          <div
            style={{
              gridColumn: '1/-1',
              textAlign: 'center',
              padding: '1rem',
              color: '#0F172A'
            }}
          >
            <p>No jobs found. Try adjusting your search.</p>
          </div>
        )}

        {!loading &&
          currentJobs.map((job) => {
            const isSaved = savedJobs.has(job.id)

            return (
              <article
                key={job.id}
                className="job-card"
                aria-label={`${job.title} at ${job.company}`}
              >
                <CompanyAvatar
                  company={job.company}
                  logoUrl={job.logoUrl}
                />

                <div className="job-card-body">
                  <h2 className="job-title">
                    <Link to={`/jobs/${job.id}`}>
                      {job.title}
                    </Link>
                  </h2>

                  <div className="job-meta">
                    <span style={{ color: '#22C55E', fontWeight: 500 }}>
                      {job.company}
                    </span>
                    <span>{job.location}</span>
                  </div>

                  <div className="job-tags">
                    {job.type && <span className="tag">{job.type}</span>}
                    {job.postedAt && (
                      <span className="muted">
                        Posted {job.postedAt}
                      </span>
                    )}
                  </div>
                </div>

                <div className="job-actions">
                  <button
                    className={`bookmark-btn ${isSaved ? 'saved' : ''}`}
                    onClick={() => toggleSave(job.id)}
                    aria-pressed={isSaved}
                    aria-label={
                      isSaved
                        ? 'Remove job from saved'
                        : 'Save job'
                    }
                  >
                    ★
                  </button>

                  <Link
                    to={`/jobs/${job.id}`}
                    className="view-link"
                  >
                    View
                  </Link>
                </div>
              </article>
            )
          })}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="pagination" aria-label="Pagination">
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            aria-label="Previous page"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`page-btn ${page === i + 1 ? 'active' : ''}`}
              onClick={() => setPage(i + 1)}
              aria-current={page === i + 1 ? 'page' : undefined}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="page-btn"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            aria-label="Next page"
          >
            Next
          </button>
        </nav>
      )}
    </main>
  )
}
