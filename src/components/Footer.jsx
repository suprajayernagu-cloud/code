// Hiringstoday Footer Component
import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo" aria-label="Hiringstoday footer">
      <div className="container footer-grid">
        <div className="col">
          <h4>Hiringstoday</h4>
          <p className="muted">
            Discover the latest job opportunities updated daily. We aggregate opportunities from public sources to help you find your next career move.
          </p>
        </div>

        <div className="col">
          <h5>Resources</h5>
          <ul>
            <li><Link to="/">Latest Jobs</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="col">
          <h5>Legal</h5>
          <ul>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/disclaimer">Disclaimer</Link></li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        © {new Date().getFullYear()} Hiringstoday. All rights reserved. | 
        <Link to="/privacy" style={{ marginLeft: '0.5rem' }}>Privacy Policy</Link>
      </div>
    </footer>
  )
}
