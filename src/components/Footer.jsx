import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="col">
          <h4>JobBoard</h4>
          <p className="muted">Find your next role — data served from a JSON file hosted on GitHub.</p>
        </div>

        <div className="col">
          <h5>Explore</h5>
          <ul>
            <li><Link to="/">Jobs</Link></li>
            <li><Link to="/companies">Companies</Link></li>
            <li><Link to="/salaries">Salaries</Link></li>
          </ul>
        </div>

        <div className="col">
          <h5>Company</h5>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/privacy">Privacy</Link></li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">© {new Date().getFullYear()} JobBoard</div>
    </footer>
  )
}
