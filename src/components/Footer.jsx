'use client'

import React from 'react'
import Link from 'next/link'
import { CONTACT_EMAIL } from '../config'
import PrivacySettingsButton from './PrivacySettingsButton'

const exploreLinks = [
  { href: '/jobs/fresher', label: 'Off Campus Drive' },
  { href: '/jobs/internship', label: 'Internships 2026' },
  { href: '/jobs/remote', label: 'Work From Home' },
  { href: '/jobs/experienced', label: 'Experienced Roles' },
  { href: '/resources', label: 'Career Resources' },
]

const batchLinks = [
  { href: '/jobs/2024', label: '2024 Batch Jobs' },
  { href: '/jobs/2025', label: '2025 Batch Jobs' },
  { href: '/jobs/2026', label: '2026 Batch Jobs' },
  { href: '/jobs/2027', label: '2027 Batch Jobs' },
]

const locationLinks = [
  { href: '/jobs/bangalore', label: 'Bangalore Jobs' },
  { href: '/jobs/hyderabad', label: 'Hyderabad Jobs' },
  { href: '/jobs/pune', label: 'Pune Jobs' },
  { href: '/jobs/chennai', label: 'Chennai Jobs' },
  { href: '/jobs/mumbai', label: 'Mumbai Jobs' },
]

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/disclaimer', label: 'Disclaimer' },
]

function FooterList({ title, links }) {
  return (
    <section>
      <h3 className="font-display text-base font-bold text-white">{title}</h3>
      <ul className="mt-3 space-y-2">
        {links.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-sm text-blue-100 hover:text-orange-300">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function Footer() {
  return (
    <footer className="border-t-4 border-orange-500 bg-brand-900 text-white">
      <div className="border-b border-white/10 bg-brand-800">
        <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-6 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-10">
          <div>
            <h2 className="font-display text-xl font-bold sm:text-2xl">Get Instant Job Alerts</h2>
            <p className="mt-2 text-sm leading-6 text-blue-100">
              Join freshers getting daily off-campus drives, internships, and WFH jobs.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/jobs" className="inline-flex justify-center rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-brand-900 hover:bg-orange-400">
              Browse Jobs
            </Link>
            <Link href="/blog" className="inline-flex justify-center rounded-lg border border-white/20 px-5 py-3 text-sm font-bold text-white hover:bg-white/10">
              Career Guides
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_0.8fr_1fr] lg:px-10">
        <section className="max-w-md min-w-0">
          <h2 className="font-display text-2xl font-bold text-white">
            Hiring<span className="text-orange-400">stoday</span>
          </h2>
          <p className="mt-3 text-sm leading-7 text-blue-100">
            India's daily job update portal for freshers and professionals. Find off-campus drives,
            internships, work-from-home roles, and practical placement prep.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-4 inline-flex max-w-full break-all text-sm font-semibold text-orange-300 hover:text-orange-200"
          >
            {CONTACT_EMAIL}
          </a>
        </section>

        <FooterList title="Explore Jobs" links={exploreLinks} />
        <FooterList title="Browse by Batch" links={batchLinks} />
        <FooterList title="Top Locations" links={locationLinks} />

        <section>
          <h3 className="font-display text-base font-bold text-white">Job Alerts</h3>
          <p className="mt-3 text-sm leading-7 text-blue-100">
            Get the latest drives and internships delivered through Hiringstoday updates.
          </p>
          <Link href="/contact" className="mt-3 inline-flex text-sm font-bold text-orange-300 hover:text-orange-200">
            Subscribe Free →
          </Link>
          <p className="mt-3 text-xs leading-6 text-blue-100/80">
            Always verify job details on official company sites before submitting personal information.
          </p>
        </section>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs leading-6 text-blue-100/85 sm:px-6 lg:px-10">
        <span className="block sm:inline">© {new Date().getFullYear()} Hiringstoday · India's daily job update blog</span>
        <span className="mx-2 hidden sm:inline">·</span>
        <span className="mt-2 inline-flex flex-wrap justify-center gap-x-3 gap-y-1 sm:mt-0">
          {legalLinks.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-orange-300">
              {item.label}
            </Link>
          ))}
          <PrivacySettingsButton className="hover:text-orange-300" />
        </span>
      </div>
    </footer>
  )
}
