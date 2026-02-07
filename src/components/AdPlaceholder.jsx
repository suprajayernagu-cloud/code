// AdPlaceholder.jsx
// Reusable placeholder for AdSense integration
// Hidden in production, visible in development
import React from 'react'

export default function AdPlaceholder({ position }) {
  // Show placeholder only in development
  const isDev = process.env.NODE_ENV === 'development'

  if (!isDev) {
    // In production, render empty or minimal space
    return <div className="ad-space" style={{ minHeight: '90px' }} />
  }

  return (
    <div
      className="ad-placeholder"
      aria-label={`Ad placeholder for ${position}`}
      style={{
        minHeight: '90px',
        background: '#f1f5f9',
        color: '#94a3b8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '1rem 0',
        borderRadius: '0.375rem',
        border: '1px dashed #cbd5e1',
        fontSize: '0.85rem',
        fontWeight: '500',
      }}
    >
      <span style={{ opacity: 0.7 }}>Ad Space: {position}</span>
    </div>
  )
}
