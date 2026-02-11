import React from 'react'

const sampleSalaries = [
  { role: 'Frontend Engineer', avg: '₹8 LPA' },
  { role: 'Backend Engineer', avg: '₹10 LPA' },
  { role: 'Product Designer', avg: '₹7 LPA' },
]

export default function Salaries() {
  return (
    <section className="space-y-5">
      <section className="surface p-6 sm:p-8">
        <h1 className="font-display text-4xl font-bold text-ink-900">Salaries</h1>
        <p className="mt-2 text-sm text-slate-600">Sample salary snapshots by role.</p>
      </section>

      <section className="surface p-6 sm:p-8">
        <ul className="space-y-3">
          {sampleSalaries.map((salary) => (
            <li key={salary.role} className="surface-muted flex items-center justify-between px-4 py-3">
              <span className="font-medium text-ink-900">{salary.role}</span>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">{salary.avg}</span>
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}
