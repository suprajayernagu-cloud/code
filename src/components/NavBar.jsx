import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './NavBar.css'


export default function NavBar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="container header-inner">
        
        {/* Brand */}
        <Link to="/" className="brand">Fresh Hires</Link>

        {/* Desktop Nav */}
        <nav className="top-links">
          <Link to="/">Jobs</Link>
          <Link to="/companies">Companies</Link>
          <Link to="/resources">Resources</Link>
        </nav>

        {/* Hamburger (Mobile) */}
        <button
          className="menu-btn"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setOpen(false)}>Jobs</Link>
          <Link to="/companies" onClick={() => setOpen(false)}>Companies</Link>
          <Link to="/resources" onClick={() => setOpen(false)}>Resources</Link>

          <input
            className="mobile-search"
            placeholder="Search jobs..."
          />
        </div>
      )}
    </header>
  )
}
