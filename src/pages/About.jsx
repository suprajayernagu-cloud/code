// Hiringstoday - About Us Page
import React from 'react'

export default function About() {
  return (
    <main className="container" role="main" aria-label="About Hiringstoday">
      <article className="page-content">
        <h1 style={{ color: '#0F172A', marginBottom: '2rem' }}>About Hiringstoday</h1>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#38BDF8', fontSize: '1.5rem' }}>Our Mission</h2>
          <p style={{ color: '#64748b', lineHeight: '1.8' }}>
            Hiringstoday is dedicated to making job discovery simple, transparent, and accessible. We aggregate job opportunities from public sources and present them in an organized, user-friendly platform. Our goal is to help job seekers find genuine opportunities without misleading claims or exaggerated promises.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#38BDF8', fontSize: '1.5rem' }}>How It Works</h2>
          <p style={{ color: '#64748b', lineHeight: '1.8' }}>
            We collect job listings from verified public sources and display them with their original details. Every job posted on Hiringstoday links directly to the hiring company's application page. We do not modify, filter, or alter job postings — what you see is what companies are actually hiring for.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#38BDF8', fontSize: '1.5rem' }}>What We Believe In</h2>
          <ul style={{ color: '#64748b', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
            <li><strong>Transparency</strong> — All job information is accurate and unmodified</li>
            <li><strong>Honesty</strong> — We make no false promises about job availability or placement rates</li>
            <li><strong>Simplicity</strong> — A clean, distraction-free job search experience</li>
            <li><strong>Independence</strong> — We are not affiliated with any hiring company</li>
            <li><strong>User Trust</strong> — Your trust is our most valuable asset</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#38BDF8', fontSize: '1.5rem' }}>Important Notice</h2>
          <div style={{ 
            background: '#fef3c7', 
            border: '1px solid #fcd34d', 
            borderRadius: '0.5rem', 
            padding: '1.5rem',
            color: '#78350f'
          }}>
            <p>
              <strong>Hiringstoday is a job aggregator, not a recruitment agency.</strong> We do not employ anyone, conduct interviews, or make hiring decisions. We simply compile and display job opportunities from public sources. Always verify job details directly with the hiring company before applying.
            </p>
          </div>
        </section>

        <section>
          <h2 style={{ color: '#38BDF8', fontSize: '1.5rem' }}>Questions?</h2>
          <p style={{ color: '#64748b', lineHeight: '1.8' }}>
            Have questions about Hiringstoday? <a href="/contact" style={{ color: '#38BDF8', fontWeight: '600' }}>Contact us</a> — we'd love to hear from you.
          </p>
        </section>
      </article>
    </main>
  )
}
