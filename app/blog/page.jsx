'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import PageMeta from '@/src/components/PageMeta'
import { blogArticles } from '@/src/data/blog'

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(blogArticles.map((a) => a.category))]
    return cats
  }, [])

  // Filter articles by category
  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'All') {
      return blogArticles
    }
    return blogArticles.filter((a) => a.category === selectedCategory)
  }, [selectedCategory])

  return (
    <>
      <PageMeta 
        title="Blog - Hiringstoday" 
        description="Real career advice from real professionals. Interview tips, salary negotiation, job search strategies, and more."
      />
      
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="surface-muted px-4 py-16 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="font-display text-5xl font-bold text-ink-900">
              Career & Job Search Insights
            </h1>
            <p className="mt-4 text-xl text-slate-600">
              Expert tips on interviews, salary negotiation, career growth, and finding your perfect job.
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="border-b border-slate-200 px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-6 py-2 font-semibold transition ${
                    selectedCategory === category
                      ? 'bg-brand-700 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="px-4 py-12 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <Link key={article.id} href={`/blog/${article.slug}`}>
                  <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-lg hover:border-brand-300 cursor-pointer h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                      {/* Category Badge on Image */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-block rounded-full bg-brand-700 px-3 py-1 text-xs font-semibold text-white">
                          {article.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-6">
                      {/* Title */}
                      <h2 className="mb-3 line-clamp-2 font-display text-lg font-bold text-ink-900 transition group-hover:text-brand-700">
                        {article.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="mb-4 flex-1 line-clamp-2 text-sm text-slate-600">
                        {article.excerpt}
                      </p>

                      {/* Meta Info and Arrow */}
                      <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-500">
                        <div className="flex gap-3">
                          <span>{new Date(article.publishedDate).toLocaleDateString('en-GB', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric' 
                          })}</span>
                          <span>•</span>
                          <span>{article.readTime} min read</span>
                        </div>
                        <span className="text-brand-700 font-semibold">→</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

