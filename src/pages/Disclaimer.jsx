import React from 'react'
import { CONTACT_EMAIL } from '../config'

const lastUpdated = 'February 11, 2026'

const sections = [
  {
    title: '1. General disclaimer',
    paragraphs: [
      'Hiringstoday is a job listing and aggregation platform. Content is provided for informational purposes on an “as available” basis.',
      'We do not guarantee accuracy, completeness, or current availability of every listing.',
    ],
  },
  {
    title: '2. Source of listings',
    paragraphs: [
      'Job listings are gathered from public sources and may change without notice.',
      'Always verify title, location, compensation, and eligibility criteria on the employer’s official page before applying.',
    ],
  },
  {
    title: '3. No employer affiliation',
    paragraphs: ['Hiringstoday is independent and not affiliated with listed employers unless explicitly stated.'],
    list: [
      'We do not conduct interviews or assessments.',
      'We do not offer placements or hiring guarantees.',
      'We do not negotiate salary or employment terms on your behalf.',
    ],
  },
  {
    title: '4. User responsibility',
    paragraphs: ['You are responsible for evaluating opportunities and protecting your personal information.'],
    list: [
      'Research employer legitimacy before sharing sensitive details.',
      'Avoid roles that request payment to apply or onboard.',
      'Use caution with offers that appear unusually lucrative or urgent.',
    ],
  },
  {
    title: '5. Third-party websites',
    paragraphs: [
      'Links may redirect to external websites controlled by third parties. We are not responsible for external content, privacy practices, or security controls.',
    ],
  },
  {
    title: '6. Limitation of liability',
    paragraphs: [
      'To the fullest extent allowed by law, Hiringstoday is not liable for losses resulting from use of this platform, including reliance on external listings or third-party links.',
    ],
  },
  {
    title: '7. Changes to services',
    paragraphs: [
      'We may modify, suspend, or discontinue features at any time to improve reliability, compliance, or product direction.',
    ],
  },
  {
    title: '8. Acceptance of terms',
    paragraphs: [
      'By using Hiringstoday, you acknowledge this disclaimer and agree to verify job details independently before making decisions.',
    ],
  },
]

export default function Disclaimer() {
  return (
    <section className="space-y-6">
      <section className="surface relative overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-0 bg-mesh opacity-30" aria-hidden="true" />

        <div className="relative max-w-3xl">
          <span className="pill">Legal</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-ink-900 sm:text-5xl">Disclaimer</h1>
          <p className="mt-2 text-sm text-slate-600">Last updated: {lastUpdated}</p>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Review this page before using Hiringstoday. It explains boundaries of responsibility and safe usage practices.
          </p>
        </div>
      </section>

      <article className="surface space-y-8 p-6 sm:p-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-2xl font-semibold text-ink-900">{section.title}</h2>

            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-sm leading-7 text-slate-700 sm:text-base">
                {paragraph}
              </p>
            ))}

            {section.list?.length ? (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <section className="rounded-2xl border border-red-200 bg-red-50/80 p-4 sm:p-5">
          <h2 className="font-display text-xl font-semibold text-red-800">Employment scam warning</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-red-800 sm:text-base">
            <li>Legitimate employers do not ask for upfront payment.</li>
            <li>Do not share bank or government ID details before proper verification.</li>
            <li>Report suspicious listings to the company and relevant authorities.</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm leading-7 text-amber-900 sm:p-5 sm:text-base">
          Questions about this disclaimer can be sent to <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline">{CONTACT_EMAIL}</a>.
        </section>
      </article>
    </section>
  )
}
