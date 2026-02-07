// Hiringstoday Home Page
// Latest job updates with search, filter, and pagination
// Color Palette: Primary #0F172A, Secondary #38BDF8, Accent #22C55E
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { JOBS_URL } from '../config'
import './home.css'
import AdPlaceholder from '../components/AdPlaceholder'

const ITEMS_PER_PAGE = 6

function CompanyAvatar({ company, logoUrl }) {
  if (logoUrl) {
    return <img src={logoUrl} alt={`Logo of ${company}`} className="company-logo" />
  }
  const initial = company ? company.trim()[0].toUpperCase() : '?'
  return <div className="company-avatar" aria-label={`Company initial: ${initial}`}>{initial}</div>
}

export default function Home() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

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

  // Filter jobs by search query
  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE)
  const start = (page - 1) * ITEMS_PER_PAGE
  const currentJobs = filteredJobs.slice(start, start + ITEMS_PER_PAGE)

  // SEO Meta Tags (integrate with React Helmet in production)
  // <title>Hiringstoday - Latest Job Updates Daily</title>
  // <meta name="description" content="Discover the latest job opportunities updated daily on Hiringstoday. Search and filter jobs from top companies." />

  if (loading) return <div className="container">Loading jobs…</div>
  if (error) return <div className="container error">{error}</div>

  return (
    <main className="container" role="main" aria-label="Hiringstoday home page">
      {/* Hero Section */}
      <section
        className="hero"
        role="region"
        aria-labelledby="hero-title"
      >
        <h1 id="hero-title">Hiringstoday</h1>
        <p>Discover the latest job opportunities, updated daily. Your career starts here.</p>
        
        {/* Search Form */}
        <form
          className="search-form"
          role="search"
          aria-label="Job search"
          onSubmit={(e) => {
            e.preventDefault()
            setPage(1)
          }}
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

      {/* Ad Placeholder - Top 
      <AdPlaceholder position="home-top" />
*/}

      {/* Latest Jobs Grid */}
      <section className="jobs-grid" aria-label="Latest job listings">
        {currentJobs.length === 0 ? (
          <div style={{ color: '#0F172A', padding: '1rem', textAlign: 'center', gridColumn: '1/-1' }}>
            <p>No jobs found. Try adjusting your search or check back soon.</p>
          </div>
        ) : (
          currentJobs.map(job => (
            <article key={job.id} className="job-card" role="article" aria-label={`${job.title} at ${job.company}`}>
              <div style={{ flexShrink: 0 }}>
                <CompanyAvatar company={job.company} logoUrl={job.logoUrl} />
              </div>

              <div className="job-card-body">
                <h2 className="job-title">
                  <Link to={`/jobs/${job.id}`} style={{ color: '#0F172A' }}>{job.title}</Link>
                </h2>
                <div className="job-meta">
                  <span style={{ color: '#22C55E', fontWeight: '500' }}>{job.company}</span>
                  <span style={{ marginLeft: '1rem', color: '#0F172A' }}>{job.location}</span>
                </div>
                <div className="job-tags">
                  {job.type && <span className="tag">{job.type}</span>}
                  {job.postedAt && <span className="muted">Posted {job.postedAt}</span>}
                </div>
              </div>

              <Link to={`/jobs/${job.id}`} className="view-link" style={{ flexShrink: 0 }}>
                View
              </Link>
            </article>
          ))
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="pagination" role="navigation" aria-label="Job listings pagination">
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            aria-label="Previous page"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`page-btn ${page === i + 1 ? 'active' : ''}`}
              onClick={() => setPage(i + 1)}
              aria-label={`Go to page ${i + 1}`}
              aria-current={page === i + 1 ? 'page' : undefined}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="page-btn"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            aria-label="Next page"
          >
            Next
          </button>
        </nav>
      )}

      {/* Ad Placeholder - Bottom 
      <AdPlaceholder position="home-bottom" />
      */}
    </main>
  )
}
