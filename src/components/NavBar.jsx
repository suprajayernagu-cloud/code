'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import NavDropdown from './NavDropdown'

const links = [
  { href: '/jobs/fresher', label: 'Off Campus Drive 2026' },
  { href: '/jobs/remote', label: 'Work From Home' },
  { href: '/jobs/internship', label: 'Internships' },
  { href: '/blog', label: 'Career Advice' },
]

function NavItem({ href, label, mobile = false, isActive = false }) {
  return (
    <Link
      href={href}
      className={[
        mobile
          ? 'block rounded-lg px-3 py-2 text-base font-semibold transition'
          : 'rounded-md px-3 py-2 text-sm font-semibold transition',
        isActive
          ? 'bg-orange-50 text-orange-700'
          : 'text-slate-700 hover:bg-slate-100 hover:text-brand-800',
      ].join(' ')}
    >
      {label}
    </Link>
  )
}

export default function NavBar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="bg-brand-900 px-3 py-2 text-center text-[11px] font-semibold leading-5 text-blue-100 sm:px-6 sm:text-xs">
        Get instant job alerts for off-campus drives, internships, and WFH jobs
      </div>
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
        <Link href="/" className="group inline-flex items-center" aria-label="Hiringstoday home">
          <span className="relative inline-flex flex-col">
            <span className="font-display text-xl font-bold tracking-tight text-brand-900 sm:text-2xl">
              Hirings
              <motion.span
                className="text-orange-500"
                animate={{ opacity: [1, 0.78, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                today
              </motion.span>
            </span>

            <span className="absolute -bottom-0.5 left-0 h-[2px] w-full rounded-full bg-slate-200" />
            <motion.span
              className="pointer-events-none absolute -bottom-0.5 left-0 h-[2px] w-16 rounded-full bg-gradient-to-r from-transparent via-orange-500 to-transparent"
              animate={{ x: [-28, 132] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          <NavItem href="/" label="Home" isActive={pathname === '/'} />
          {links.map((link) => (
            <NavItem key={link.href} href={link.href} label={link.label} isActive={pathname === link.href} />
          ))}
          <NavDropdown />
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-brand-900 transition hover:border-orange-300 hover:text-orange-600 lg:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span className="sr-only">Toggle navigation</span>
          <span className="space-y-1">
            <span
              className={`block h-0.5 w-5 bg-current transition ${open ? 'translate-y-1.5 rotate-45' : ''}`}
            />
            <span className={`block h-0.5 w-5 bg-current transition ${open ? 'opacity-0' : 'opacity-100'}`} />
            <span
              className={`block h-0.5 w-5 bg-current transition ${open ? '-translate-y-1.5 -rotate-45' : ''}`}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="max-h-[calc(100vh-6.75rem)] overflow-y-auto border-t border-slate-200 bg-white px-4 pb-4 pt-3 shadow-lg lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="space-y-1">
              <NavItem href="/" label="Home" mobile isActive={pathname === '/'} />
              {links.map((link) => (
                <NavItem key={link.href} href={link.href} label={link.label} mobile isActive={pathname === link.href} />
              ))}
              <div className="mb-2 border-b border-slate-200 pb-2">
                <p className="px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-500">Job categories</p>
                <div className="space-y-1 mt-1 pl-2">
                  <Link href="/jobs/fresher" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-brand-800">Fresher Jobs</Link>
                  <Link href="/jobs/experienced" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-brand-800">Experienced</Link>
                  <Link href="/jobs/remote" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-brand-800">Remote</Link>
                  <Link href="/jobs/bangalore" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-brand-800">Bangalore</Link>
                  <Link href="/jobs/india" className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-brand-800">Pan India</Link>
                </div>
              </div>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
