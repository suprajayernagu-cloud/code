import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const links = [
  { to: '/', label: 'Jobs' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy', label: 'Privacy' },
]

function NavItem({ to, label, mobile = false }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          mobile
            ? 'block rounded-xl px-3 py-2 text-base font-semibold transition'
            : 'rounded-full px-4 py-2 text-sm font-semibold transition',
          isActive
            ? 'bg-[#F3A713] text-brand-900'
            : 'text-blue-100 hover:bg-white/10 hover:text-[#F3A713]',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  )
}

export default function NavBar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-50 border-b-4 border-[#F3A713] bg-brand-800 shadow-lg shadow-brand-900/25">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link to="/" className="group inline-flex items-center" aria-label="Hiringstoday home">
          <span className="relative inline-flex flex-col">
            <span className="font-display text-xl font-bold tracking-tight text-brand-100 sm:text-2xl">
              Hirings
              <motion.span
                className="text-[#F3A713]"
                animate={{ opacity: [1, 0.78, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                today
              </motion.span>
            </span>

            <span className="absolute -bottom-0.5 left-0 h-[2px] w-full rounded-full bg-brand-200/30" />
            <motion.span
              className="pointer-events-none absolute -bottom-0.5 left-0 h-[2px] w-16 rounded-full bg-gradient-to-r from-transparent via-[#F3A713] to-transparent"
              animate={{ x: [-28, 132] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {links.map((link) => (
            <NavItem key={link.to} to={link.to} label={link.label} />
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-300/35 bg-brand-700/50 text-brand-100 transition hover:text-[#F3A713] md:hidden"
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
            className="border-t border-brand-700 bg-brand-900 px-4 pb-4 pt-3 md:hidden"
            aria-label="Mobile navigation"
          >
            <div className="space-y-1">
              {links.map((link) => (
                <NavItem key={link.to} to={link.to} label={link.label} mobile />
              ))}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
