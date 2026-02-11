import React from 'react'
import { Link } from 'react-router-dom'

const values = [
  {
    title: 'Transparency first',
    description: 'We keep role data close to the original source and clearly show where the opportunity comes from.',
  },
  {
    title: 'No fake urgency',
    description: 'No inflated claims or placement guarantees. You get direct links and clear context.',
  },
  {
    title: 'Candidate control',
    description: 'Search, save, and compare jobs quickly so you can decide what fits your career path.',
  },
]

const principles = [
  'Hiringstoday is an independent aggregator, not a recruiting agency.',
  'All applications should be completed on official employer pages.',
  'We continuously improve data quality and remove stale listings when identified.',
]

export default function About() {
  return (
    <section className="space-y-6">
      <section className="surface relative overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-0 bg-mesh opacity-40" aria-hidden="true" />
        <div className="relative max-w-3xl space-y-4">
          <span className="pill">About Hiringstoday</span>
          <h1 className="font-display text-4xl font-bold text-ink-900 sm:text-5xl">Built to make job discovery less noisy</h1>
          <p className="text-base leading-7 text-slate-600 sm:text-lg">
            Hiringstoday collects job listings from public sources and surfaces them in a cleaner, faster interface. The goal is simple: help candidates spend less time searching and more time applying.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {values.map((value) => (
          <article key={value.title} className="surface-muted p-5">
            <h2 className="font-display text-xl font-semibold text-ink-900">{value.title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">{value.description}</p>
          </article>
        ))}
      </section>

      <section className="surface p-6 sm:p-8">
        <h2 className="font-display text-3xl font-semibold text-ink-900">How the platform works</h2>
        <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-700 sm:text-base">
          <li>
            <strong className="text-ink-900">1. Collect:</strong> We source listings from publicly available channels.
          </li>
          <li>
            <strong className="text-ink-900">2. Organize:</strong> We normalize role details so you can scan opportunities quickly.
          </li>
          <li>
            <strong className="text-ink-900">3. Redirect:</strong> Applications always go to the employer’s official page.
          </li>
        </ol>
      </section>

      <section className="surface border-amber-200/70 bg-amber-50/80 p-6 sm:p-8">
        <h2 className="font-display text-2xl font-semibold text-amber-900">Important notice</h2>
        <p className="mt-3 text-sm leading-7 text-amber-900/90 sm:text-base">
          Hiringstoday does not hire candidates directly, conduct interviews, or make employment decisions.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-amber-900/90 sm:text-base">
          {principles.map((principle) => (
            <li key={principle}>{principle}</li>
          ))}
        </ul>
      </section>

      <section className="surface p-6 sm:p-8">
        <h2 className="font-display text-2xl font-semibold text-ink-900">Questions?</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
          Reach out if you need help, want to report a listing issue, or have partnership questions.
        </p>
        <Link to="/contact" className="primary-btn mt-5">
          Contact us
        </Link>
      </section>
    </section>
  )
}
