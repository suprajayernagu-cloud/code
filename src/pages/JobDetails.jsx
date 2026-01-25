import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { JOBS_URL } from '../config'

function CompanyAvatar({ company, logoUrl, large }){
  if (logoUrl) {
    return <img src={logoUrl} alt={company} className={large ? 'company-logo large' : 'company-logo'} />
  }
  const initial = company ? company.trim()[0].toUpperCase() : '?'
  return <div className={large ? 'company-avatar large' : 'company-avatar'}>{initial}</div>
}

export default function JobDetails() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [otherJobs, setOtherJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch(JOBS_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then((data) => {
        if (!mounted) return
        const found = data.find((j) => String(j.id) === String(id))
        setJob(found || null)
        // show up to 3 other jobs
        const others = data.filter((j) => String(j.id) !== String(id)).slice(0,3)
        setOtherJobs(others)
      })
      .catch((err) => {
        if (mounted) setError(err.message)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => { mounted = false }
  }, [id])

  if (loading) return <div className="container">Loading job…</div>
  if (error) return <div className="container error">Failed to load job: {error}</div>
  if (!job) return <div className="container">Job not found. <Link to="/">Back to list</Link></div>

  return (
    <div className="container job-details">
      <div className="job-header">
  <CompanyAvatar company={job.company} logoUrl={job.logoUrl} large />
        <div className="job-header-body">
          <h1 className="job-title">{job.title}</h1>
          <div className="job-meta">{job.company} · {job.location} · <span className="tag">{job.type}</span></div>
        </div>
        
      </div>

      <section className="job-body">
        <h3>Job description</h3>
        <div className="job-desc">
          <p>{job.description}</p>
        </div>
      </section>

      {job.responsibilities && job.responsibilities.length > 0 && (
        <section className="job-section">
          <h3>Responsibilities</h3>
          <ul className="job-list">
            {job.responsibilities.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      {job.qualifications && job.qualifications.length > 0 && (
        <section className="job-section">
          <h3>Qualifications</h3>
          <ul className="job-list">
            {job.qualifications.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </section>
      )}

      {job.tags && job.tags.length > 0 && (
        <section className="job-section">
          <h3>Skills & Tags</h3>
          <div className="tag-list">
            {job.tags.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        </section>
      )}

      {/* Apply link button placed below the job content */}
      {job.applyUrl && (
        <div className="apply-below">
          <a className="apply-btn full" href={job.applyUrl} target="_blank" rel="noreferrer">Apply on company site</a>
        </div>
      )}

      {otherJobs.length > 0 && (
        <section className="related-jobs">
          <h3>Other jobs you may like</h3>
          <div className="jobs-grid small">
            {otherJobs.map((j) => (
              <article key={j.id} className="job-card compact">
                <div className="job-card-left"><CompanyAvatar company={j.company} logoUrl={j.logoUrl} /></div>
                <div className="job-card-body">
                  <Link to={`/jobs/${j.id}`} className="job-title-small">{j.title}</Link>
                  <div className="job-meta">{j.company} · {j.location}</div>
                </div>
                <div className="job-card-right"><Link to={`/jobs/${j.id}`} className="view-link">View</Link></div>
              </article>
            ))}
          </div>
        </section>
      )}

      <p className="mt"><Link to="/">Back to jobs</Link></p>
    </div>
  )
}
