import React from 'react'

export default function AdPlaceholder({ position = 'general' }) {
  if (!import.meta.env.DEV) {
    return <div className="min-h-[90px]" aria-hidden="true" />
  }

  return (
    <div
      className="surface-muted my-6 grid min-h-[90px] place-items-center px-4 py-3 text-center"
      aria-label={`Ad placeholder for ${position}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Ad Space: {position}</p>
    </div>
  )
}
