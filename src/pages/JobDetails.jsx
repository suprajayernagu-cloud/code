// Hiringstoday Job Details Page
// Displays detailed job information with original content, disclaimers, and apply CTA
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { JOBS_URL } from '../config'
import './JobDetails.css'
import AdPlaceholder from '../components/AdPlaceholder'

function CompanyAvatar({ company, logoUrl, large }){
  if (logoUrl) {
    return <img src={logoUrl} alt={`${company} logo`} className={large ? 'company-logo large' : 'company-logo'} />
  }
  const initial = company ? company.trim()[0].toUpperCase() : '?'
  return <div className={large ? 'company-avatar large' : 'company-avatar'} aria-label={`${company} initial`}>{initial}</div>
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
        if (!res.ok) throw new Error('Failed to fetch job details')
        return res.json()
      })
      .then((data) => {
        if (!mounted) return
        const found = data.find((j) => String(j.id) === String(id))
        setJob(found || null)
        // Show up to 3 related jobs
        const others = data.filter((j) => String(j.id) !== String(id)).slice(0, 3)
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

  if (loading) return <div className="container">Loading job details…</div>
  if (error) return <div className="container error">Failed to load job: {error}</div>
  if (!job) return <div className="container">Job not found. <Link to="/">Return to jobs</Link></div>

  return (
    <main className="container job-details" role="main" aria-label="Job details">
      {/* Hero Section with Job Info */}
      <section className="job-header" aria-labelledby="job-title">
        <CompanyAvatar company={job.company} logoUrl={job.logoUrl} large />
        <div className="job-header-body">
          <h1 id="job-title" className="job-title">{job.title}</h1>
          <div className="job-sub-meta">
            <span className="company-name"><strong>{job.company}</strong></span>
            <span className="location">{job.location}</span>
            {job.type && <span className="job-type"><strong>{job.type}</strong></span>}
            {job.postedAt && <span className="posted-date">Posted: {job.postedAt}</span>}
          </div>
        </div>
      </section>

      {/* Ad Placeholder - Top 
      <AdPlaceholder position="job-details-top" />
      */}

      {/* Job Description */}
      {job.description && (
        <section className="job-body" aria-labelledby="job-description-heading">
          <h2 id="job-description-heading" style={{ color: '#38BDF8' }}>Job Description</h2>
          <div className="job-desc">
            <p>{job.description}</p>
          </div>
        </section>
      )}

      {/* Responsibilities */}
      {job.responsibilities && job.responsibilities.length > 0 && (
        <section className="job-body" aria-labelledby="responsibilities-heading">
          <h2 id="responsibilities-heading" style={{ color: '#38BDF8' }}>Responsibilities</h2>
          <ul className="job-list">
            {job.responsibilities.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Qualifications */}
      {job.qualifications && job.qualifications.length > 0 && (
        <section className="job-body" aria-labelledby="qualifications-heading">
          <h2 id="qualifications-heading" style={{ color: '#38BDF8' }}>Qualifications</h2>
          <ul className="job-list">
            {job.qualifications.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Skills & Tags */}
      {job.tags && job.tags.length > 0 && (
        <section className="job-body" aria-labelledby="skills-heading">
          <h2 id="skills-heading" style={{ color: '#38BDF8' }}>Skills & Tags</h2>
          <div className="tag-list">
            {job.tags.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="disclaimer" aria-labelledby="disclaimer-heading">
        <h3 id="disclaimer-heading">Important Disclaimer</h3>
        <p>
          <strong>Hiringstoday</strong> is a job aggregator. This job information is sourced from public data and we are not affiliated with the hiring company. 
          Please verify job details directly on the company's official website before applying. We recommend contacting the employer directly to confirm the role is still active.
        </p>
      </section>

      {/* Apply Button */}
      {job.applyUrl && (
        <div className="apply-below">
          <a 
            className="apply-btn full" 
            href={job.applyUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label={`Apply for ${job.title} at ${job.company}`}
          >
            Apply on Company Website
          </a>
        </div>
      )}

      {/* Ad Placeholder - Bottom 
      <AdPlaceholder position="job-details-bottom" />
      */}

      {/* Related Jobs */}
      {otherJobs.length > 0 && (
        <section className="related-jobs" aria-labelledby="related-heading">
          <h2 id="related-heading" style={{ color: '#38BDF8' }}>Related Jobs You Might Like</h2>
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

      <p className="mt"><Link to="/">← Back to Jobs</Link></p>
    </main>
  )
}
