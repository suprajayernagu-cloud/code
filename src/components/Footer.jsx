import React from 'react'
import { Link } from 'react-router-dom'
import { CONTACT_EMAIL } from '../config'

const quickLinks = [
  { to: '/', label: 'Latest Jobs' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const legalLinks = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/disclaimer', label: 'Disclaimer' },
]

export default function Footer() {
  return (
    <footer className="border-t-4 border-[#F3A713] bg-brand-800 text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-10">
        <section>
          <h2 className="font-display text-2xl font-bold text-white">
            Hiring<span className="text-[#F3A713]">stoday</span>
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-7 text-blue-100">
            Job discovery for modern candidates. We aggregate opportunities from public sources and link directly to company application pages.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-4 inline-flex text-sm font-semibold text-[#F3A713] hover:text-[#ffbc7d]"
          >
            {CONTACT_EMAIL}
          </a>
        </section>

        <section>
          <h3 className="font-display text-lg font-semibold text-white">Explore</h3>
          <ul className="mt-3 space-y-2">
            {quickLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-sm text-blue-100 hover:text-[#F3A713]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="font-display text-lg font-semibold text-white">Legal</h3>
          <ul className="mt-3 space-y-2">
            {legalLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-sm text-blue-100 hover:text-[#F3A713]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-6 text-blue-100/80">
            Always verify job details on official company sites before submitting personal information.
          </p>
        </section>
      </div>

      <div className="border-t border-white/20 px-4 py-4 text-center text-xs text-blue-100/85 sm:px-6 lg:px-10">
        © {new Date().getFullYear()} Hiringstoday. All rights reserved.
      </div>
    </footer>
  )
}
