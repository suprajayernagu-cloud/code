'use client'

import React, { useState } from 'react'

function FAQAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-sm font-semibold tracking-wide text-brand-700">Frequently Asked</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
          Common Questions About Hiringstoday
        </h1>
        <p className="mt-4 text-slate-600">
          Can't find what you're looking for?{' '}
          <a href="/contact" className="font-semibold text-brand-700 hover:text-brand-800">
            Contact us
          </a>
        </p>
      </div>

      {faqs.map((section, sectionIndex) => (
        <section key={sectionIndex} className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-ink-900">{section.category}</h2>

          <div className="space-y-2 divide-y divide-slate-200 border-y border-slate-200">
            {section.questions.map((faq, qIndex) => {
              const globalIndex = `${sectionIndex}-${qIndex}`
              const isOpen = openIndex === globalIndex

              return (
                <div key={qIndex} className="py-4">
                  <button
                    onClick={() => toggleAccordion(globalIndex)}
                    className="group flex w-full items-center justify-between text-left transition hover:text-brand-700"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${globalIndex}`}
                  >
                    <h3 className="flex-1 font-semibold text-ink-900 group-hover:text-brand-700">
                      {faq.q}
                    </h3>
                    <span
                      className={`ml-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-600 transition duration-300 group-hover:bg-brand-50 group-hover:text-brand-700 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    >
                      ▼
                    </span>
                  </button>

                  {/* Answer always rendered in DOM (SSR-safe, SEO-friendly) */}
                  {/* Hidden via CSS when closed, never unmounted */}
                  <div
                    id={`faq-answer-${globalIndex}`}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="mt-4 text-slate-600 space-y-2">
                      <p>{faq.a}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}

      <section className="surface space-y-4 rounded-2xl border border-slate-200 p-8 text-center">
        <h2 className="font-display text-2xl font-semibold text-ink-900">Still have questions?</h2>
        <p className="text-slate-600">
          Reach out to us directly. We're here to help and respond to all messages within 1-2 business days.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-6 py-3 font-semibold text-white transition hover:bg-brand-800"
        >
          Contact Us
        </a>
      </section>
    </div>
  )
}

export default FAQAccordion
