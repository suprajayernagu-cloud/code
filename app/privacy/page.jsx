'use client'

import React from 'react'
import { CONTACT_EMAIL } from '@/src/config'
import PageMeta from '@/src/components/PageMeta'

const lastUpdated = 'March 27, 2026'

const sections = [
  {
    title: '1. Introduction',
    paragraphs: [
      'Hiringstoday ("we," "us," or "our") respects your privacy. This policy explains how information is collected, used, and protected when you use our website.',
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
      'Hiringstoday may display ads from providers such as Google AdSense. Google and its partners may use cookies, IP addresses, or similar identifiers to serve and measure ads on this site.',
      'You can manage personalized ad preferences at https://adssettings.google.com.',
      'Learn how Google uses information from sites or apps that use its services: https://policies.google.com/technologies/partner-sites.',
    ],
  },
  {
    title: '4. Analytics',
    paragraphs: [
      'We do not currently run a separate analytics platform on Hiringstoday.',
      'If analytics features are added later, this policy will be updated before those tools are enabled.',
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
      'Cookies are small files stored on your browser. Hiringstoday may use essential cookies and advertising-related cookies depending on enabled features.',
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
    title: '10. Children and sensitive data',
    paragraphs: [
      'Hiringstoday is intended for general job-search audiences and is not designed for children under the age required by applicable law to consent to data processing on their own.',
      'Please avoid submitting highly sensitive personal information through the contact form or through any third-party job application page.',
    ],
  },
  {
    title: '11. International use',
    paragraphs: [
      'Hiringstoday may be accessed from multiple countries. By using the site, you understand that data handling may occur in jurisdictions with different legal requirements.',
      'If you access the site from a region with specific privacy rights, contact us and we will review your request in line with applicable obligations.',
    ],
  },
  {
    title: '12. Online policy only',
    paragraphs: [
      'This Privacy Policy applies to information collected through the website and associated online interactions.',
      'It does not apply to third-party services, employer websites, or offline communications that are not controlled by Hiringstoday.',
    ],
  },
  {
    title: '13. Policy Updates',
    paragraphs: [
      'We may update this policy as laws, tools, or product features change. The latest version will always be posted on this page.',
      `Current version date: ${lastUpdated}.`,
    ],
  },
]

export default function PrivacyPage() {
  return (
    <section className="space-y-6">
      <PageMeta
        title="Privacy Policy | Hiringstoday"
        description="Read the Hiringstoday privacy policy, including information about cookies, contact submissions, advertising features, and user privacy choices."
      />

      <section className="surface relative overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-0 bg-mesh opacity-30" aria-hidden="true" />

        <div className="relative max-w-3xl">
          <span className="pill">Legal</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-ink-900 sm:text-5xl">Privacy Policy</h1>
          <p className="mt-2 text-sm text-slate-600">Last updated: {lastUpdated}</p>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            This page explains how Hiringstoday handles information across job browsing, advertising, and contact interactions.
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

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 sm:p-5 sm:text-base">
          <h2 className="font-display text-xl font-semibold text-ink-900">Privacy choices</h2>
          <p className="mt-3">
            You can manage browser cookies through your browser settings. If a Google consent message is active on this site, use the privacy and cookie settings link in the footer to review or change your ad consent choices.
          </p>
        </section>

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
