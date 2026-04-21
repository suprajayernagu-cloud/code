'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { fetchJobs, searchJobs } from '../utils/jobsApi'

export default function SearchBar() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [jobs, setJobs] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)

  // Load all jobs on mount for search
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await fetchJobs()
        setJobs(data)
      } catch (error) {
        console.error('Failed to load jobs for search:', error)
      }
    }

    loadJobs()
  }, [])

  // Handle search input and generate suggestions
  const handleSearch = async (value) => {
    setSearchTerm(value)

    if (value.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setLoading(true)
    try {
      const results = await searchJobs({
        title: value,
      })

      // Also search by company
      const byCompany = await searchJobs({
        company: value,
      })

      // Combine and deduplicate
      const combined = [...results, ...byCompany].filter(
        (job, idx, self) => self.findIndex(j => j.id === job.id) === idx
      )

      setSuggestions(combined.slice(0, 8))
      setShowSuggestions(true)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectJob = (job) => {
    navigate(`/job/${job.id}`)
    setShowSuggestions(false)
    setSearchTerm('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Navigate to jobs with search query
      navigate(`/?search=${encodeURIComponent(searchTerm)}`)
      setShowSuggestions(false)
    }
  }

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            type="search"
            value={searchTerm}
            onChange={e => handleSearch(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search jobs by title, company, or skill..."
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pl-4 pr-10 text-slate-900 placeholder-slate-500 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            aria-label="Search jobs"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700 transition"
            aria-label="Search"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full z-50 mt-2 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
            {suggestions.map(job => (
              <button
                key={job.id}
                type="button"
                onClick={() => handleSelectJob(job)}
                className="w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-blue-50 last:border-b-0"
              >
                <p className="font-semibold text-slate-900">{job.title}</p>
                <p className="text-xs text-slate-600">
                  {job.company} • {job.location}
                </p>
                {job.salary && <p className="text-xs font-medium text-blue-600 mt-1">{job.salary}</p>}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && searchTerm.length > 1 && (
          <div className="absolute top-full z-50 mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-center">
            <p className="text-sm text-slate-600">Searching...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && showSuggestions && searchTerm.length > 1 && suggestions.length === 0 && (
          <div className="absolute top-full z-50 mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-center">
            <p className="text-sm text-slate-600">No jobs found. Try another search term.</p>
          </div>
        )}
      </form>
    </div>
  )
}
