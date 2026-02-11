import React from 'react'

const resources = [
  {
    title: 'Resume playbook',
    description: 'A practical checklist for writing a role-focused resume that gets interviews.',
  },
  {
    title: 'Interview prep framework',
    description: 'Structured preparation workflow for technical and behavioral rounds.',
  },
  {
    title: 'Salary negotiation basics',
    description: 'How to discuss compensation using data and role expectations.',
  },
]

export default function Resources() {
  return (
    <section className="space-y-5">
      <section className="surface p-6 sm:p-8">
        <h1 className="font-display text-4xl font-bold text-ink-900">Resources</h1>
        <p className="mt-2 text-sm text-slate-600">Helpful guides to support your job search.</p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {resources.map((resource) => (
          <article key={resource.title} className="surface-muted p-5">
            <h2 className="font-display text-xl font-semibold text-ink-900">{resource.title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">{resource.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
