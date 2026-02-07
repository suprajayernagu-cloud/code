// Hiringstoday NavBar - Primary #0F172A, Secondary #38BDF8, Accent #22C55E
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './NavBar.css'

export default function NavBar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header" role="banner" aria-label="Hiringstoday header">
      <div className="container header-inner">
        {/* Brand */}
        <Link to="/" className="brand" aria-label="Hiringstoday - go to home">
          <span className="brand-text">Hiringstoday</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="top-links" role="navigation" aria-label="Main navigation">
          <Link to="/">Jobs</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy</Link>
        </nav>

        {/* Hamburger (Mobile) */}
        <button
          className="menu-btn"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <nav className="mobile-menu" role="navigation" aria-label="Mobile navigation">
          <Link to="/" onClick={() => setOpen(false)}>Jobs</Link>
          <Link to="/about" onClick={() => setOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
          <Link to="/privacy" onClick={() => setOpen(false)}>Privacy</Link>
        </nav>
      )}
    </header>
  )
}
