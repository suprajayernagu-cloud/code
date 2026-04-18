import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import ReactMarkdown from 'react-markdown'
import { blogArticles } from '../data/blog'

export default function BlogDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const article = blogArticles.find(a => a.slug === slug)

  if (!article) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <h2 className="text-xl font-bold text-red-900">Article Not Found</h2>
        <p className="mt-2 text-red-700">The article you're looking for doesn't exist.</p>
        <Link to="/blog" className="mt-4 inline-block rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">
          Back to Blog
        </Link>
      </div>
    )
  }

  const relatedArticles = blogArticles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 3)

  const articleUrl = `https://hiringstoday.in/blog/${article.slug}`

  return (
    <>
      <Helmet>
        <title>{article.title} | HiringsToday Career Blog</title>
        <meta name="description" content={article.excerpt} />
        <meta name="keywords" content={`${article.category}, career advice, job search`} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:image" content={article.image} />
        <meta name="article:published_time" content={article.publishedDate} />
        <meta name="article:author" content={article.author} />
        <link rel="canonical" href={articleUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: article.title,
            description: article.excerpt,
            image: article.image,
            datePublished: article.publishedDate,
            author: {
              '@type': 'Organization',
              name: article.author,
            },
            url: articleUrl,
          })}
        </script>
      </Helmet>

      <article className="mx-auto max-w-4xl">
        {/* Hero */}
        <div className="mb-8">
          <Link to="/blog" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            ← Back to Blog
          </Link>

          <div className="mt-4">
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
              {article.category}
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">{article.title}</h1>

          <p className="mt-4 text-lg text-slate-600">{article.excerpt}</p>

          {/* Meta */}
          <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-slate-200 pb-6 text-sm text-slate-600">
            <div>
              <span className="font-semibold text-slate-900">{article.author}</span>
            </div>
            <span>•</span>
            <div>{new Date(article.publishedDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</div>
            <span>•</span>
            <div>{article.readTime} min read</div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8 overflow-hidden rounded-xl">
          <img
            src={article.image}
            alt={article.title}
            className="h-96 w-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="space-y-6 text-slate-700">
            {article.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('#')) {
                const level = paragraph.match(/^#+/)[0].length
                const text = paragraph.replace(/^#+\s/, '')
                const Component = `h${Math.min(level + 1, 6)}`
                return (
                  <Component key={idx} className={`font-bold text-slate-900 ${
                    level === 1 ? 'text-3xl mt-8' :
                    level === 2 ? 'text-2xl mt-6' :
                    'text-xl mt-4'
                  }`}>
                    {text}
                  </Component>
                )
              }
              if (paragraph.startsWith('-') || paragraph.startsWith('•')) {
                const items = paragraph.split('\n').filter(l => l.startsWith('-') || l.startsWith('•'))
                return (
                  <ul key={idx} className="ml-6 list-disc space-y-2">
                    {items.map((item, i) => (
                      <li key={i}>{item.replace(/^[-•]\s/, '')}</li>
                    ))}
                  </ul>
                )
              }
              if (paragraph.startsWith('✓') || paragraph.startsWith('✗')) {
                const items = paragraph.split('\n').filter(l => l.startsWith('✓') || l.startsWith('✗'))
                return (
                  <ul key={idx} className="space-y-2">
                    {items.map((item, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex-shrink-0 text-lg">{item[0]}</span>
                        <span>{item.replace(/^[✓✗]\s/, '')}</span>
                      </li>
                    ))}
                  </ul>
                )
              }
              if (paragraph.startsWith('```')) {
                const code = paragraph.replace(/```[\w]*\n?/g, '')
                return (
                  <pre key={idx} className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm">
                    <code className="text-slate-100">{code}</code>
                  </pre>
                )
              }
              if (paragraph.startsWith('🚩') || paragraph.startsWith('💡')) {
                return (
                  <div key={idx} className="rounded-lg bg-yellow-50 p-4 border-l-4 border-yellow-400">
                    <p className="text-slate-700">{paragraph}</p>
                  </div>
                )
              }
              return <p key={idx} className="leading-relaxed">{paragraph}</p>
            })}
          </div>
        </div>

        {/* Share */}
        <div className="mt-12 rounded-xl bg-slate-50 p-6">
          <h3 className="mb-4 font-semibold text-slate-900">Share this article</h3>
          <div className="flex flex-wrap gap-3">
            {/* Twitter/X */}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on Twitter"
              className="flex h-12 w-12 items-center justify-center rounded-lg bg-black text-white hover:bg-slate-800 transition"
            >
              𝕏
            </a>
            {/* LinkedIn */}
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on LinkedIn"
              className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-lg font-bold"
            >
              in
            </a>
            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on Facebook"
              className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition text-lg font-bold"
            >
              f
            </a>
            {/* WhatsApp */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + articleUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on WhatsApp"
              className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500 text-white hover:bg-green-600 transition text-lg"
            >
              💬
            </a>
            {/* Instagram */}
            <a
              href={`https://www.instagram.com/?url=${encodeURIComponent(articleUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on Instagram"
              className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition text-lg"
            >
              📸
            </a>
            {/* Copy Link */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(articleUrl)
                alert('Link copied to clipboard!')
              }}
              title="Copy article link"
              className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-300 text-slate-900 hover:bg-slate-400 transition text-lg"
            >
              🔗
            </button>
          </div>
        </div>

        {/* Author */}
        <div className="mt-8 rounded-xl bg-blue-50 p-6">
          <h3 className="font-semibold text-slate-900">About the Author</h3>
          <p className="mt-2 text-slate-700">
            {article.author} creates in-depth career content to help professionals land their dream jobs and advance their careers in tech.
          </p>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h3 className="mb-6 text-2xl font-bold text-slate-900">Related Articles</h3>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedArticles.map(related => (
                <Link
                  key={related.id}
                  to={`/blog/${related.slug}`}
                  className="group rounded-lg shadow-md ring-1 ring-slate-200 transition hover:shadow-lg"
                >
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                    <img
                      src={related.image}
                      alt={related.title}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-semibold text-blue-600">{related.category}</p>
                    <h4 className="mt-2 font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-600">
                      {related.title}
                    </h4>
                    <p className="mt-2 text-xs text-slate-500">{related.readTime} min read</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white">
          <h3 className="mb-3 text-2xl font-bold">Ready to find your perfect job?</h3>
          <p className="mb-6 text-blue-100">Explore thousands of curated job opportunities across India.</p>
          <Link to="/" className="inline-block rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50 transition">
            Browse Jobs Now
          </Link>
        </div>
      </article>
    </>
  )
}
