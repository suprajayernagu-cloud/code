'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import PageMeta from '@/src/components/PageMeta'
import { blogArticles } from '@/src/data/blog'

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString))
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const sortedArticles = useMemo(
    () =>
      [...blogArticles].sort(
        (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
      ),
    []
  )

  const categories = useMemo(() => ['All', ...new Set(sortedArticles.map((article) => article.category))], [sortedArticles])

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'All') {
      return sortedArticles
    }

    return sortedArticles.filter((article) => article.category === selectedCategory)
  }, [selectedCategory, sortedArticles])

  const [featuredArticle, ...archiveArticles] = filteredArticles

  return (
    <>
      <PageMeta
        title="Career Blog - Hiringstoday"
        description="Read practical career advice from Hiringstoday on interviews, salary negotiation, fresher jobs, job search strategy, remote work, and career growth."
      />

      <section className="space-y-12">
        <div className="grid gap-8 border-b border-slate-200 pb-10 lg:grid-cols-[1fr_0.55fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-700">Hiringstoday blog</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-ink-900 sm:text-5xl">
              Career advice, interview stories, and job search playbooks.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              Browse practical articles for Indian job seekers, freshers, developers, remote workers,
              and professionals planning their next move.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h2 className="font-display text-lg font-bold text-ink-900">What we publish</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Long-form career guidance, real negotiation examples, interview preparation advice,
              and job-search lessons with clear takeaways.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={[
                'rounded-full border px-4 py-2 text-sm font-semibold transition',
                selectedCategory === category
                  ? 'border-brand-700 bg-brand-700 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-700',
              ].join(' ')}
            >
              {category}
            </button>
          ))}
        </div>

        {featuredArticle ? (
          <Link href={`/blog/${featuredArticle.slug}`} className="group block">
            <article className="grid overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:border-brand-300 hover:shadow-xl lg:grid-cols-[1.05fr_0.95fr]">
              <div className="min-h-[280px] overflow-hidden bg-slate-100">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-6 lg:p-8">
                <p className="text-sm font-semibold text-brand-700">{featuredArticle.category}</p>
                <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-ink-900 group-hover:text-brand-700 sm:text-4xl">
                  {featuredArticle.title}
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-600">{featuredArticle.excerpt}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 text-sm text-slate-500">
                  <span>By {featuredArticle.author}</span>
                  <span>{formatDate(featuredArticle.publishedDate)}</span>
                  <span>{featuredArticle.readTime} min read</span>
                </div>
              </div>
            </article>
          </Link>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {archiveArticles.map((article) => (
            <Link key={article.id} href={`/blog/${article.slug}`} className="group block h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl">
                <div className="h-44 overflow-hidden bg-slate-100">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-700">
                    {article.category}
                  </p>
                  <h2 className="mt-3 font-display text-xl font-bold leading-snug text-ink-900 group-hover:text-brand-700">
                    {article.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{article.excerpt}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
                    <span>{article.author}</span>
                    <span>{formatDate(article.publishedDate)}</span>
                    <span>{article.readTime} min read</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
