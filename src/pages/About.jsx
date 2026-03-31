import React from 'react'
import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'

export default function About() {
  return (
    <section>
      <article className="surface space-y-8 p-6 sm:p-8">
        <PageMeta
          title="About Hiringstoday | Hiringstoday"
          description="Learn how Hiringstoday organizes public job listings into a cleaner, easier-to-compare job discovery experience."
        />

        <div className="max-w-3xl">
          <span className="pill">About</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-ink-900 sm:text-5xl">
            A simpler way to go through job listings
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg">
            Hiringstoday is for people who want to scan jobs without opening ten tabs just to understand the basics.
            We try to put the useful parts up front: role, company, location, job type, salary when available, and the
            original source link.
          </p>
          <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg">
            This site is not trying to replace the employer page. It is meant to make the first step easier. You can
            compare roles here, then go to the company or source page to apply properly.
          </p>
        </div>

        <section>
          <h2 className="font-display text-2xl font-semibold text-ink-900">Why this exists</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
            Finding jobs online is not the hard part anymore. The annoying part is figuring out which listings are still
            active, which ones are worth your time, and where the real application page actually is.
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
            Hiringstoday tries to make that first pass less messy. The goal is simple: let you skim faster, compare
            better, and avoid wasting time on vague or broken listings.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-ink-900">What we actually do</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-700 sm:text-base">
            <li>We collect public job listings from available sources.</li>
            <li>We clean up the structure so titles, companies, locations, and other basics are easier to read.</li>
            <li>We show freshness and comparison details when that information is available.</li>
            <li>We send you to the original employer or source page for the final application step.</li>
          </ul>
        </section>

        <section>
          <div className="max-w-3xl">
            <h2 className="font-display text-2xl font-semibold text-ink-900">What makes a listing useful here</h2>
            <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
              Not every listing online is equally helpful. We try to keep the board more readable by focusing on a few
              basics that matter when you are comparing roles quickly.
            </p>
          </div>

          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700 sm:text-base">
            <p>
              <span className="font-semibold text-ink-900">Clear source:</span> You should be able to tell who is hiring
              and where the listing came from without guessing.
            </p>
            <p>
              <span className="font-semibold text-ink-900">Useful basics first:</span> Role title, company, location,
              work style, and salary should be easy to spot when that data exists.
            </p>
            <p>
              <span className="font-semibold text-ink-900">Fresh enough to matter:</span> Older listings can still be
              real, but freshness helps people decide where to spend their time first.
            </p>
            <p>
              <span className="font-semibold text-ink-900">Straight path to apply:</span> The last step should always be
              the original application page, not a confusing chain of redirects.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-ink-900">A few important things to know</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700 sm:text-base">
            <p>Hiringstoday is a job discovery site, not a recruiting agency.</p>
            <p>We do not promise interviews, callbacks, or hiring outcomes.</p>
            <p>You should always verify the final details on the official company or source page before applying.</p>
            <p>If you spot a broken, duplicate, or suspicious listing, please report it so it can be reviewed.</p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-ink-900">Need help?</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
            If a link is broken, a listing looks wrong, or you just want to reach out, use the contact page. Including
            the job title or URL helps a lot.
          </p>
          <Link to="/contact" className="primary-btn mt-5">
            Contact us
          </Link>
        </section>
      </article>
    </section>
  )
}
