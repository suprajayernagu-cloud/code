import React from 'react'
import Link from 'next/link'
import PageMeta from '@/src/components/PageMeta'
import { blogArticles } from '@/src/data/blog'

export const metadata = {
  title: 'Rahul Kumar - Career & Interview Expert | Hiringstoday Blog',
  description: 'Rahul Kumar writes about career growth, interview preparation, and technical interview strategies on Hiringstoday.',
}

export default function RahulKumarProfile() {
  const authorArticles = blogArticles.filter((article) => article.author === 'Rahul Kumar')

  return (
    <section>
      <article className="surface space-y-8 p-6 sm:p-8 max-w-3xl mx-auto">
        <PageMeta
          title="Rahul Kumar - Career & Interview Expert | Hiringstoday Blog"
          description="Rahul Kumar writes about career growth, interview preparation, and technical interview strategies on Hiringstoday."
        />

        {/* Author Header */}
        <div className="text-center space-y-6 py-8 border-b border-slate-200">
          <div className="flex justify-center">
            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-brand-700 to-[#db2b39] flex items-center justify-center text-5xl font-bold text-white">
              RK
            </div>
          </div>
          <div>
            <h1 className="font-display text-4xl font-bold text-ink-900">Rahul Kumar</h1>
            <p className="text-lg text-brand-700 font-semibold">Career & Interview Expert</p>
          </div>
          <p className="max-w-2xl mx-auto text-slate-600 text-lg leading-relaxed">
            Rahul has mentored 500+ job seekers through their career transitions and interview preparation. With experience in tech interviews and career coaching, he shares practical, battle-tested strategies for landing your dream job.
          </p>
        </div>

        {/* Author Bio */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-ink-900">About Rahul</h2>
          <p className="text-slate-700 leading-relaxed">
            Rahul Kumar has spent the last 8 years helping professionals master their career journeys. After his own experience of failing 7 coding interviews before landing his first tech job at a leading startup, he became passionate about sharing what actually works—not generic advice, but real, tested strategies that get results.
          </p>
          <p className="text-slate-700 leading-relaxed">
            His articles focus on:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-slate-600">
            <li>Technical interview preparation and coding interview strategies</li>
            <li>Career transitions and skill-building</li>
            <li>Real-world lessons from successful and failed interviews</li>
            <li>Job search strategies for tech professionals</li>
          </ul>
        </div>

        {/* Connect */}
        <div className="bg-blue-50 rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-ink-900">Connect with Rahul</h3>
          <p className="text-slate-600 text-sm">
            Have a question or want to share your interview experience? Reach out through our contact page.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-800">
            Send Message →
          </Link>
        </div>

        {/* Articles */}
        <div className="space-y-6 py-8 border-t border-slate-200">
          <h2 className="font-display text-2xl font-bold text-ink-900">
            Articles by Rahul ({authorArticles.length})
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
            <h3 className="text-xl font-bold text-ink-900 mb-2">Ready to Master Your Interview?</h3>
            <p className="text-slate-600 mb-4">
              Explore our complete interview and career guides to land your next opportunity.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/resources/interview-prep-guide" className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-800">
                Interview Prep Guide →
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
