'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import PageMeta from '@/src/components/PageMeta'
import { blogArticles } from '@/src/data/blog'

export default function BlogDetailPage() {
  const params = useParams()
  const slug = params?.slug

  const article = blogArticles.find((a) => a.slug === slug)

  if (!article) {
    return (
      <>
        <PageMeta title="Article Not Found - Hiringstoday" description="This article could not be found." />
        <div className="min-h-screen bg-white">
          <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-10">
            <div className="text-center">
              <h1 className="font-display text-4xl font-bold text-ink-900">Article Not Found</h1>
              <p className="mt-4 text-lg text-slate-600">The article you're looking for doesn't exist.</p>
              <Link
                href="/blog"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-700 px-6 py-3 font-semibold text-white transition hover:bg-brand-800"
              >
                ← Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  const formattedDate = new Date(article.publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <PageMeta
        title={`${article.title} - Hiringstoday`}
        description={article.excerpt}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section with Image */}
        <div className="relative h-96 w-full overflow-hidden bg-slate-100 sm:h-[500px]">
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="px-4 py-12 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-3xl">
            {/* Back Button */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-brand-700 transition hover:text-brand-800 font-semibold"
            >
              ← Back to Blog
            </Link>

            {/* Category & Meta */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-700">
                {article.category}
              </span>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>{article.author}</span>
                <span>•</span>
                <span>{formattedDate}</span>
                <span>•</span>
                <span>{article.readTime} min read</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="mt-6 font-display text-4xl font-bold text-ink-900 sm:text-5xl">
              {article.title}
            </h1>

            {/* Content */}
            <div className="prose prose-slate mt-10 max-w-none">
              {article.content.split('\n\n').map((paragraph, index) => {
                // Handle headings
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="mt-8 mb-4 font-display text-2xl font-bold text-ink-900">
                      {paragraph.replace('## ', '')}
                    </h2>
                  )
                }

                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="mt-6 mb-3 font-display text-xl font-bold text-ink-900">
                      {paragraph.replace('### ', '')}
                    </h3>
                  )
                }

                // Handle bold text
                const renderedText = paragraph
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .split('<strong>')
                  .map((part, i) => {
                    if (i === 0) return part
                    const [strong, rest] = part.split('</strong>')
                    return (
                      <span key={i}>
                        <strong className="font-semibold text-ink-900">{strong}</strong>
                        {rest}
                      </span>
                    )
                  })

                return (
                  <p key={index} className="mb-4 text-base leading-relaxed text-slate-700">
                    {renderedText}
                  </p>
                )
              })}
            </div>

            {/* Author Bio */}
            <div className="mt-12 border-t border-slate-200 pt-8">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-400 to-brand-700" />
                <div>
                  <h4 className="font-semibold text-ink-900">{article.author}</h4>
                  <p className="text-sm text-slate-600">
                    Career mentor and tech industry professional sharing real experiences and insights.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 rounded-xl bg-brand-50 p-8 text-center">
              <h3 className="font-display text-xl font-bold text-ink-900">
                Get more career insights
              </h3>
              <p className="mt-2 text-slate-600">
                Subscribe for weekly tips on interviews, negotiations, and job hunting.
              </p>
              <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-700 px-6 py-3 font-semibold text-white transition hover:bg-brand-800">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
