'use client'

import React, { useMemo, useState } from 'react'
import emailjs from '@emailjs/browser'
import { CONTACT_EMAIL } from '@/src/config'
import PageMeta from '@/src/components/PageMeta'

const EMAIL_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
const EMAIL_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
const EMAIL_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

function buildMailtoUrl({ name, email, message }) {
  const subject = encodeURIComponent(`Hiringstoday contact from ${name}`)
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })

  const canSendWithEmailJs = useMemo(
    () => Boolean(EMAIL_SERVICE_ID && EMAIL_TEMPLATE_ID && EMAIL_PUBLIC_KEY),
    []
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ type: 'error', message: 'Please complete all fields before sending.' })
      return
    }

    setLoading(true)
    setStatus({ type: '', message: '' })

    try {
      if (canSendWithEmailJs) {
        await emailjs.send(
          EMAIL_SERVICE_ID,
          EMAIL_TEMPLATE_ID,
          {
            from_name: formData.name.trim(),
            reply_to: formData.email.trim(),
            message: formData.message.trim(),
          },
          EMAIL_PUBLIC_KEY
        )

        setStatus({ type: 'success', message: 'Message sent successfully. We will get back to you soon.' })
      } else {
        window.location.href = buildMailtoUrl(formData)
        setStatus({
          type: 'info',
          message: 'We opened your email app so you can send us your message directly.',
        })
      }

      setFormData({ name: '', email: '', message: '' })
    } catch {
      setStatus({
        type: 'error',
        message: 'Unable to send your message right now. Please try again or email us directly.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <article className="surface space-y-8 p-6 sm:p-8">
        <PageMeta
          title="Contact Hiringstoday | Hiringstoday"
          description="Contact Hiringstoday for support questions, broken listings, duplicate posts, suspicious jobs, or general website feedback."
        />

        <div className="max-w-3xl">
          <span className="pill">Contact</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-ink-900 sm:text-5xl">Let's talk</h1>
          <p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg">
            Questions, suggestions, or partnership ideas? Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <section>
          <h2 className="font-display text-2xl font-semibold text-ink-900">Connect with us</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            Use this page for support questions, listing reports, feedback, business inquiries, or general website issues.
            The fastest way to help us review a problem is to include the job URL and a short explanation.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
            <li>Broken or expired listing links</li>
            <li>Duplicate job posts</li>
            <li>Suspicious or misleading openings</li>
            <li>General support and partnership questions</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-ink-900">What to include</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700 sm:text-base">
            <li>Your name and reply email</li>
            <li>The job title or company name</li>
            <li>The page URL if you are reporting a listing</li>
            <li>A brief explanation of the issue or request</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-ink-900">Send a message</h2>
          <form onSubmit={handleSubmit} className="mt-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>

              <label className="text-sm font-semibold text-slate-700">
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </label>
            </div>

            <label className="mt-4 block text-sm font-semibold text-slate-700">
              Message
              <textarea
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                className="mt-2 w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                placeholder="Write your message..."
              />
            </label>

            <button type="submit" className="primary-btn mt-5" disabled={loading}>
              {loading ? 'Sending...' : 'Send message'}
            </button>

            {status.message ? (
              <div
                className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                  status.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : status.type === 'error'
                      ? 'border-red-200 bg-red-50 text-red-700'
                      : 'border-brand-200 bg-brand-50 text-brand-700'
                }`}
              >
                {status.message}
              </div>
            ) : null}
          </form>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-ink-900">Other ways to reach us</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700 sm:text-base">
            <p>
              <span className="font-semibold text-ink-900">Email us directly:</span>{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-brand-700 hover:text-brand-800">
                {CONTACT_EMAIL}
              </a>
            </p>
            <p>
              <span className="font-semibold text-ink-900">Job reporting:</span> If you find a broken, duplicate, or
              suspicious listing, send the role link and tell us what looks wrong.
            </p>
            <p>
              <span className="font-semibold text-ink-900">Support model:</span> Hiringstoday is handled online, so
              messages are reviewed digitally in the order they arrive.
            </p>
            <p>
              <span className="font-semibold text-ink-900">Response time:</span> Most messages are answered within 1-2
              business days.
            </p>
          </div>
        </section>
      </article>
    </section>
  )
}
