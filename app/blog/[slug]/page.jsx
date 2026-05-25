import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageMeta from '@/src/components/PageMeta'
import { SITE_URL } from '@/src/config'
import { blogArticles } from '@/src/data/blog'

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString))
}

function getArticle(slug) {
  return blogArticles.find((article) => article.slug === slug)
}

function renderInline(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g)

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-ink-900">
          {part.slice(2, -2)}
        </strong>
      )
    }

    return <React.Fragment key={index}>{part}</React.Fragment>
  })
}

function isOrderedList(block) {
  return block.split('\n').every((line) => /^\d+\.\s+/.test(line.trim()))
}

function isUnorderedList(block) {
  return block.split('\n').every((line) => /^-\s+/.test(line.trim()))
}

function ArticleContent({ content }) {
  return (
    <div className="mt-10 space-y-6">
      {content.split('\n\n').map((block, index) => {
        const trimmed = block.trim()

        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={index} className="pt-4 font-display text-2xl font-bold leading-tight text-ink-900 sm:text-3xl">
              {trimmed.replace('## ', '')}
            </h2>
          )
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={index} className="pt-2 font-display text-xl font-bold leading-tight text-ink-900">
              {trimmed.replace('### ', '')}
            </h3>
          )
        }

        if (isOrderedList(trimmed)) {
          const lines = trimmed.split('\n')
          const firstNumber = Number.parseInt(lines[0].match(/^(\d+)\./)?.[1] || '1', 10)

          return (
            <ol key={index} start={firstNumber} className="list-decimal space-y-2 pl-6 text-base leading-8 text-slate-700">
              {lines.map((line) => (
                <li key={line}>{renderInline(line.replace(/^\d+\.\s+/, ''))}</li>
              ))}
            </ol>
          )
        }

        if (isUnorderedList(trimmed)) {
          return (
            <ul key={index} className="list-disc space-y-2 pl-6 text-base leading-8 text-slate-700">
              {trimmed.split('\n').map((line) => (
                <li key={line}>{renderInline(line.replace(/^-\s+/, ''))}</li>
              ))}
            </ul>
          )
        }

        return (
          <p key={index} className="text-base leading-8 text-slate-700">
            {renderInline(trimmed)}
          </p>
        )
      })}
    </div>
  )
}

export function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }))
}

export function generateMetadata({ params }) {
  const article = getArticle(params.slug)

  if (!article) {
    return {
      title: 'Article Not Found - Hiringstoday',
      description: 'This Hiringstoday article could not be found.',
    }
  }

  return {
    title: `${article.title} - Hiringstoday`,
    description: article.excerpt,
    alternates: {
      canonical: `${SITE_URL}/blog/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedDate,
      authors: [article.author],
      images: [article.image],
    },
  }
}

export default function BlogDetailPage({ params }) {
  const article = getArticle(params.slug)

  if (!article) {
    notFound()
  }

  const formattedDate = formatDate(article.publishedDate)
  const headings = article.content
    .split('\n')
    .filter((line) => line.startsWith('## '))
    .map((line) => line.replace('## ', ''))
  const sameTopicArticles = blogArticles
    .filter((candidate) => candidate.category === article.category && candidate.id !== article.id)
    .slice(0, 3)
  const relatedArticles =
    sameTopicArticles.length > 0
      ? sameTopicArticles
      : blogArticles.filter((candidate) => candidate.id !== article.id).slice(0, 3)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    datePublished: article.publishedDate,
    dateModified: article.publishedDate,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hiringstoday',
      url: SITE_URL,
    },
    mainEntityOfPage: `${SITE_URL}/blog/${article.slug}`,
  }

  return (
    <>
      <PageMeta
        title={`${article.title} - Hiringstoday`}
        description={article.excerpt}
        canonicalPath={`/blog/${article.slug}`}
        ogType="article"
        jsonLd={jsonLd}
      />

      <article className="mx-auto max-w-6xl">
        <Link href="/blog" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
          Back to blog
        </Link>

        <header className="mt-6 grid gap-8 border-b border-slate-200 pb-10 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-700">{article.category}</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-ink-900 sm:text-5xl">
              {article.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">{article.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="font-semibold text-slate-700">By {article.author}</span>
              <span>{formattedDate}</span>
              <span>{article.readTime} min read</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            <img src={article.image} alt={article.title} className="h-full min-h-[280px] w-full object-cover" />
          </div>
        </header>

        <div className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            <ArticleContent content={article.content} />

            <section className="mt-12 rounded-lg border border-slate-200 bg-slate-50 p-6">
              <h2 className="font-display text-xl font-bold text-ink-900">About this article</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Hiringstoday publishes practical career guidance for readers comparing jobs,
                preparing for interviews, negotiating offers, and planning career moves in India.
              </p>
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            {headings.length > 0 ? (
              <section className="rounded-lg border border-slate-200 bg-white p-5">
                <h2 className="font-display text-lg font-bold text-ink-900">In this article</h2>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  {headings.slice(0, 8).map((heading) => (
                    <li key={heading}>{heading}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="font-display text-lg font-bold text-ink-900">More from this topic</h2>
              <div className="mt-4 space-y-4">
                {relatedArticles.map((related) => (
                  <Link key={related.id} href={`/blog/${related.slug}`} className="group block">
                    <p className="text-sm font-semibold leading-6 text-ink-900 group-hover:text-brand-700">
                      {related.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{related.readTime} min read</p>
                  </Link>
                ))}
              </div>
              <Link href="/blog" className="mt-5 inline-block text-sm font-semibold text-brand-700 hover:text-brand-800">
                View all articles
              </Link>
            </section>

            <section className="rounded-lg border border-brand-100 bg-brand-50 p-5">
              <h2 className="font-display text-lg font-bold text-ink-900">Ready to apply?</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Browse job listings after you prepare with the guide.
              </p>
              <Link
                href="/jobs"
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
              >
                Browse jobs
              </Link>
            </section>
          </aside>
        </div>
      </article>
    </>
  )
}
