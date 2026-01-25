import React, { useEffect, useState } from 'react'
import { COMPANIES_URL } from '../config'

export default function Companies(){
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch(COMPANIES_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then((data) => { if (mounted) setCompanies(data) })
      .catch((err) => { if (mounted) setError(err.message) })
      .finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [])

  if (loading) return <div className="container">Loading companies…</div>
  if (error) return <div className="container error">Failed to load companies: {error}</div>

  return (
    <div className="container">
      <h1>Companies</h1>
      <p className="muted">Top companies hiring right now</p>

      <div className="companies-grid">
        {companies.map((c) => (
          <div className="company-card" key={c.id}>
            <div className="company-card-left">
              {c.logoUrl ? (
                <img src={c.logoUrl} alt={c.name} className="company-logo" />
              ) : (
                <div className="company-avatar">{c.name[0]}</div>
              )}
            </div>
            <div className="company-card-body">
              <h3>{c.name}</h3>
              <p className="muted">{c.industry} · {c.location}</p>
              <p>{c.about}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
