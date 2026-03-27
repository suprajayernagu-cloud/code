import React from 'react'
import { Link } from 'react-router-dom'

const values = [
  {
    title: 'Transparency first',
    description: 'We keep role data close to the original source and make it obvious when the final application should happen elsewhere.',
  },
  {
    title: 'Useful curation',
    description: 'We focus on structure, clarity, and practical comparison instead of pushing candidates through noisy funnels.',
  },
  {
    title: 'Candidate control',
    description: 'Search, save, compare, and verify jobs quickly so you can decide what fits your goals before you apply.',
  },
]

const principles = [
  'Hiringstoday is an independent aggregator, not a recruiting agency.',
  'All applications should be completed on official employer pages.',
  'We continuously improve data quality and remove stale listings when identified.',
]

const reviewStandards = [
  {
    title: 'Source clarity',
    description: 'We want every role to preserve the original company identity, location context, and application destination as clearly as possible.',
  },
  {
    title: 'Readable structure',
    description: 'A useful listing should be easy to scan. We standardize titles, metadata, and layout so comparisons take seconds instead of minutes.',
  },
  {
    title: 'Freshness signals',
    description: 'Posting dates matter. We highlight recency so candidates can prioritize openings that are more likely to still be active.',
  },
  {
    title: 'Safety reminders',
    description: 'We regularly reinforce that users should verify job details on official sites and avoid listings that ask for payment or sensitive data too early.',
  },
]

const originalValuePoints = [
  'A calmer interface for reviewing multiple opportunities without distracting clutter.',
  'Standardized cards that help you compare company, role, location, job type, and salary visibility at a glance.',
  'Saved-job tracking so you can shortlist roles before leaving the site.',
  'Editorial guidance that encourages verification, not blind trust.',
]

const roadmapItems = [
  'Improve duplicate detection so repeated postings are easier to spot.',
  'Add more role summaries and comparison-oriented guidance.',
  'Expand trust signals around freshness, source quality, and application safety.',
]

const supportAreas = [
  'Current openings from public sources',
  'Role comparison and quick scanning',
  'Saved jobs and shortlisting',
  'Listing issue reporting and support contact',
]

const publishingRules = [
  'We do not promise interviews, referrals, or hiring outcomes.',
  'We do not ask candidates to pay to access job listings.',
  'We encourage users to cross-check all final details on the employer site.',
  'We review reports of broken, duplicate, or suspicious listings when users contact us.',
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
            Hiringstoday collects job listings from public sources and turns them into a simpler, more comparable browsing experience. The goal is not to replace employer websites, but to help candidates spend less time sorting through noise and more time evaluating genuine opportunities.
          </p>
          <p className="text-sm leading-7 text-slate-600 sm:text-base">
            We believe a job board earns trust when it adds clarity, not confusion. That means cleaner structure, honest expectations, visible limitations, and repeated reminders to verify final details on official employer pages.
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
            <strong className="text-ink-900">2. Organize:</strong> We normalize role details so you can scan opportunities quickly and compare them across employers.
          </li>
          <li>
            <strong className="text-ink-900">3. Add context:</strong> We surface filtering, freshness, and safety guidance to make the browsing step more useful.
          </li>
          <li>
            <strong className="text-ink-900">4. Redirect:</strong> Applications always go to the employer’s official page or original source.
          </li>
        </ol>
      </section>

      <section className="surface p-6 sm:p-8">
        <h2 className="font-display text-3xl font-semibold text-ink-900">What we review in a strong listing</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {reviewStandards.map((item) => (
            <article key={item.title} className="surface-muted p-5">
              <h3 className="font-display text-xl font-semibold text-ink-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="surface p-6 sm:p-8">
          <h2 className="font-display text-3xl font-semibold text-ink-900">What makes this site different</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
            {originalValuePoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            In other words, the product value is not just that a job exists. The value is that you can understand faster whether it deserves your attention.
          </p>
        </article>

        <article className="surface p-6 sm:p-8">
          <h2 className="font-display text-3xl font-semibold text-ink-900">What we are improving</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
            {roadmapItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            We want Hiringstoday to become more useful over time through better curation and clearer signals, not through aggressive monetization or click pressure.
          </p>
        </article>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="surface p-6 sm:p-8">
          <h2 className="font-display text-3xl font-semibold text-ink-900">Who this platform is for</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            Hiringstoday is built for candidates who want a cleaner starting point before they move to the official employer site. That includes fresh graduates, early-career candidates, and experienced professionals who prefer a simpler comparison workflow.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
            {supportAreas.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="surface p-6 sm:p-8">
          <h2 className="font-display text-3xl font-semibold text-ink-900">Publishing principles</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
            {publishingRules.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            These rules help keep the site useful and realistic. We would rather be clear about limits than create false certainty around hiring.
          </p>
        </article>
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
