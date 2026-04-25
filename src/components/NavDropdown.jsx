'use client'

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const filterCategories = {
  experience: {
    label: 'By Experience',
    filters: [
      { label: 'Fresher Jobs', href: '/jobs/fresher' },
      { label: 'Experienced Jobs', href: '/jobs/experienced' },
      { label: 'Internships', href: '/jobs/internship' },
    ],
  },
  workType: {
    label: 'By Work Type',
    filters: [
      { label: 'Remote Jobs', href: '/jobs/remote' },
      { label: 'Work from Office', href: '/jobs/office' },
      { label: 'Hybrid', href: '/jobs/hybrid' },
    ],
  },
  year: {
    label: 'By Year',
    filters: [
      { label: 'Jobs in 2026', href: '/jobs/2026' },
      { label: 'Jobs in 2025', href: '/jobs/2025' },
    ],
  },
  location: {
    label: 'By Location',
    filters: [
      { label: 'Bangalore', href: '/jobs/bangalore' },
      { label: 'Hyderabad', href: '/jobs/hyderabad' },
      { label: 'Mumbai', href: '/jobs/mumbai' },
      { label: 'Delhi/NCR', href: '/jobs/delhi' },
      { label: 'Chennai', href: '/jobs/chennai' },
      { label: 'Pan India', href: '/jobs/india' },
    ],
  },
}

export default function NavDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const pathname = usePathname()

  // Close dropdown when pathname changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const isActive = pathname.startsWith('/jobs/') || pathname === '/jobs' || pathname === '/jobs/fresher'

  // Highlight current active filter
  const currentFilter = pathname.split('/jobs/')[1] || 'fresher'

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={[
          'rounded-full px-4 py-2 text-sm font-semibold transition flex items-center gap-2',
          isActive
            ? 'bg-[#F3A713] text-brand-900'
            : 'text-blue-100 hover:bg-white/10 hover:text-[#F3A713]',
        ].join(' ')}
      >
        Browse
        <span className={`inline-block transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 rounded-2xl bg-white shadow-2xl border border-slate-200 p-4 z-50">
          <div className="space-y-4">
            {Object.values(filterCategories).map((category) => (
              <div key={category.label} className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 px-2">
                  {category.label}
                </p>
                <div className="space-y-1">
                  {category.filters.map((filter) => {
                    const filterName = filter.href.split('/jobs/')[1]
                    const isSelected = currentFilter === filterName
                    return (
                      <Link
                        key={filter.href}
                        href={filter.href}
                        className={`block rounded-lg px-3 py-2 text-sm font-semibold transition ${
                          isSelected
                            ? 'bg-brand-700 text-white'
                            : 'text-slate-700 hover:bg-brand-50 hover:text-brand-700'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {filter.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
