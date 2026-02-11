import React from 'react'
import { CONTACT_EMAIL } from '../config'

const lastUpdated = 'February 11, 2026'

const sections = [
  {
    title: '1. Introduction',
    paragraphs: [
      'Hiringstoday (“we,” “us,” or “our”) respects your privacy. This policy explains how information is collected, used, and protected when you use our website.',
      'By using Hiringstoday, you agree to the practices described in this Privacy Policy.',
    ],
  },
  {
    title: '2. Information We Collect',
    paragraphs: ['We may collect information in these ways:'],
    list: [
      'Automatically collected technical data such as device type, browser, approximate location, pages visited, and referral source.',
      'Contact form submissions, including name, email, and message content.',
      'Cookie and similar tracking data used for performance and advertising features.',
    ],
  },
  {
    title: '3. Advertising and Ad Partners',
    paragraphs: [
      'Hiringstoday may display ads from providers such as Google AdSense. Ad providers may use cookies or identifiers to show relevant ads and measure ad performance.',
      'You can manage personalized ad preferences at https://adssettings.google.com.',
    ],
  },
  {
    title: '4. Analytics',
    paragraphs: [
      'We use analytics tools to understand traffic, engagement patterns, and performance issues. This helps us improve site quality and user experience.',
      'Analytics data is generally aggregated and not used to identify you directly.',
    ],
  },
  {
    title: '5. How We Use Information',
    list: [
      'Operate, maintain, and improve Hiringstoday.',
      'Respond to support requests and inquiries.',
      'Detect abuse, suspicious activity, and security incidents.',
      'Provide and measure advertising when enabled.',
      'Comply with legal obligations.',
    ],
  },
  {
    title: '6. Cookies',
    paragraphs: [
      'Cookies are small files stored on your browser. We use essential, analytics, and advertising cookies depending on enabled features.',
      'You can disable or delete cookies through browser settings, but some parts of the site may not work as expected.',
    ],
  },
  {
    title: '7. Third-Party Links',
    paragraphs: [
      'Job listings may redirect you to external employer sites. We are not responsible for the privacy or security practices of those sites.',
      'Review third-party privacy policies before submitting personal information.',
    ],
  },
  {
    title: '8. Data Security',
    paragraphs: [
      'We apply reasonable safeguards to protect data. However, no internet-based service can guarantee absolute security.',
      'If we identify a major security issue affecting personal data, we will act promptly to investigate and mitigate impact.',
    ],
  },
  {
    title: '9. Your Rights',
    paragraphs: ['Depending on your location, you may have rights to access, correct, delete, or restrict processing of your personal data.'],
    list: [
      'Request access to the personal data we hold about you.',
      'Request deletion or correction when legally applicable.',
      'Object to certain processing or withdraw consent where required.',
    ],
  },
  {
    title: '10. Policy Updates',
    paragraphs: [
      'We may update this policy as laws, tools, or product features change. The latest version will always be posted on this page.',
      `Current version date: ${lastUpdated}.`,
    ],
  },
]

export default function Privacy() {
  return (
    <section className="space-y-6">
      <section className="surface relative overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-0 bg-mesh opacity-30" aria-hidden="true" />

        <div className="relative max-w-3xl">
          <span className="pill">Legal</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-ink-900 sm:text-5xl">Privacy Policy</h1>
          <p className="mt-2 text-sm text-slate-600">Last updated: {lastUpdated}</p>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            This page explains how Hiringstoday handles information across job browsing, analytics, and contact interactions.
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

        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm leading-7 text-emerald-900 sm:p-5 sm:text-base">
          For privacy requests or questions, contact us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline">
            {CONTACT_EMAIL}
          </a>
          .
        </section>
      </article>
    </section>
  )
}
