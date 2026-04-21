'use client'

import React from 'react'
import Link from 'next/link'
import { blogArticles } from '../data/blog'

export default function RelatedArticles({ category }) {
  // Get related articles based on category (max 4)
  const relatedArticles = blogArticles
    .filter(a => a.category === category)
    .slice(0, 4)

  // If no exact category match, get general career articles
  const articles = relatedArticles.length > 0 
    ? relatedArticles 
    : blogArticles.slice(0, 4)

  return (
    <div className="mt-8 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border border-blue-100">
      <h3 className="text-lg font-bold text-slate-900 mb-4">📚 Related Career Tips</h3>
      
      <div className="space-y-3">
        {articles.map(article => (
          <Link
            key={article.id}
            href={`/blog/${article.slug}`}
            className="block group"
          >
            <div className="flex gap-3 p-3 rounded-lg hover:bg-white transition-colors">
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {article.title}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {article.readTime} min read • {article.category}
                </p>
              </div>
              <div className="text-lg">→</div>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/blog"
        className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
      >
        View all articles →
      </Link>
    </div>
  )
}
