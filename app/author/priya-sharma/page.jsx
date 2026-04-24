import React from 'react'
import Link from 'next/link'
import PageMeta from '@/src/components/PageMeta'
import { blogArticles } from '@/src/data/blog'

export const metadata = {
  title: 'Priya Sharma - Career Growth & Negotiation Expert | Hiringstoday Blog',
  description: 'Priya Sharma writes about salary negotiation, career growth, and workplace success strategies on Hiringstoday.',
}

export default function PriyaSharmaProfile() {
  const authorArticles = blogArticles.filter((article) => article.author === 'Priya Sharma')

  return (
    <section>
      <article className="surface space-y-8 p-6 sm:p-8 max-w-3xl mx-auto">
        <PageMeta
          title="Priya Sharma - Career Growth & Negotiation Expert | Hiringstoday Blog"
          description="Priya Sharma writes about salary negotiation, career growth, and workplace success strategies on Hiringstoday."
        />

        {/* Author Header */}
        <div className="text-center space-y-6 py-8 border-b border-slate-200">
          <div className="flex justify-center">
            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-5xl font-bold text-white">
              PS
            </div>
          </div>
          <div>
            <h1 className="font-display text-4xl font-bold text-ink-900">Priya Sharma</h1>
            <p className="text-lg text-brand-700 font-semibold">Career Growth & Negotiation Expert</p>
          </div>
          <p className="max-w-2xl mx-auto text-slate-600 text-lg leading-relaxed">
            Priya has helped 300+ professionals negotiate better salaries and plan successful career transitions. Her data-driven approach to salary negotiation and career development has resulted in her readers securing over ₹50 Crore in cumulative salary increases.
          </p>
        </div>

        {/* Author Bio */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-ink-900">About Priya</h2>
          <p className="text-slate-700 leading-relaxed">
            Priya Sharma is a career strategist and salary negotiation expert with over 10 years of experience in talent management and career coaching. She negotiated her own compensation from ₹25 LPA to ₹37.5 LPA and has since developed a proven methodology that helps professionals across industries secure better compensation and growth opportunities.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Her articles focus on:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-slate-600">
            <li>Salary negotiation tactics with real numbers and outcomes</li>
            <li>Career growth strategies and advancement planning</li>
            <li>Work culture navigation and workplace success</li>
            <li>Career transitions and skill-building investments</li>
            <li>Negotiating benefits, flexibility, and long-term career value</li>
          </ul>
        </div>

        {/* Credentials */}
        <div className="bg-green-50 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-ink-900">Expertise</h3>
          <div className="space-y-2 text-slate-700 text-sm">
            <p>✓ 10+ years in talent management and career development</p>
            <p>✓ 300+ professionals coached on salary negotiation</p>
            <p>✓ ₹50+ Crore in cumulative salary increases negotiated</p>
            <p>✓ Expertise across tech, finance, and management sectors</p>
            <p>✓ Proven methodology for career advancement and compensation optimization</p>
          </div>
        </div>

        {/* Connect */}
        <div className="bg-blue-50 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-ink-900">Connect with Priya</h3>
          <p className="text-slate-600 text-sm">
            Have a negotiation question or want to share your career story? Reach out through our contact page.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-800">
            Send Message →
          </Link>
        </div>

        {/* Articles */}
        <div className="space-y-6 py-8 border-t border-slate-200">
          <h2 className="font-display text-2xl font-bold text-ink-900">
            Articles by Priya ({authorArticles.length})
          </h2>
          <div className="space-y-4">
            {authorArticles.length > 0 ? (
              authorArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group block p-6 rounded-lg border border-slate-200 hover:border-brand-300 hover:shadow-lg transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-semibold text-ink-900 group-hover:text-brand-700 transition">
                        {article.title}
                      </h3>
                      <p className="mt-2 text-slate-600 text-sm">{article.excerpt}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
                          {article.category}
                        </span>
                        <span>{article.readTime} min read</span>
                        <span>{new Date(article.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-24 w-24 rounded object-cover flex-shrink-0"
                    />
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-slate-600">No articles yet. Check back soon!</p>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 pt-8 border-t border-slate-200 space-y-6 text-center">
          <div>
            <h3 className="text-xl font-bold text-ink-900 mb-2">Ready to Grow Your Career?</h3>
            <p className="text-slate-600 mb-4">
              Learn salary negotiation, career planning, and advancement strategies from Priya's guides and articles.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/resources/salary-negotiation-guide" className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-800">
                Salary Negotiation Guide →
              </Link>
              <Link href="/blog" className="inline-flex items-center gap-2 rounded-full border border-brand-700 px-6 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">
                All Articles →
              </Link>
            </div>
          </div>
        </div>
      </article>
    </section>
  )
}
