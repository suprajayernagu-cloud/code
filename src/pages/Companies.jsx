import React, { useEffect, useState } from 'react'
import { COMPANIES_URL } from '../config'

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function fetchCompanies() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(COMPANIES_URL, { signal: controller.signal })
        if (!response.ok) {
          throw new Error('Unable to load companies right now.')
        }

        const data = await response.json()
        setCompanies(Array.isArray(data) ? data : [])
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Unable to load companies right now.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()

    return () => controller.abort()
  }, [])

  if (loading) {
    return (
      <section className="surface p-6">
        <p className="text-sm text-slate-600">Loading companies...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="surface p-6">
        <p className="text-sm text-red-700">{error}</p>
      </section>
    )
  }

  return (
    <section className="space-y-5">
      <section className="surface p-6 sm:p-8">
        <h1 className="font-display text-4xl font-bold text-ink-900">Companies</h1>
        <p className="mt-2 text-sm text-slate-600">Popular employers currently posting on Hiringstoday.</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {companies.map((company) => (
          <article key={company.id} className="surface-muted p-5">
            <div className="flex items-center gap-3">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="h-12 w-12 rounded-2xl border border-white object-cover" />
              ) : (
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500 font-bold text-white">
                  {company.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}

              <div>
                <h2 className="font-display text-xl font-semibold text-ink-900">{company.name}</h2>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {company.industry || 'Industry not listed'}
                </p>
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-600">{company.location || 'Location not listed'}</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{company.about || 'No additional details available.'}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
