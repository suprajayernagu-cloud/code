import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { blogArticles } from '../data/blog'
import PageMeta from '../components/PageMeta'

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = React.useState('All')

  const categories = ['All', ...new Set(blogArticles.map(a => a.category))]

  const filteredArticles =
    selectedCategory === 'All' ? blogArticles : blogArticles.filter(a => a.category === selectedCategory)

  return (
    <>
      <Helmet>
        <title>Career Blog - Interview Tips, Salary Negotiation & Job Search | HiringsToday</title>
        <meta
          name="description"
          content="Expert career advice, interview preparation guides, salary negotiation tips, and job search strategies for tech professionals."
        />
        <meta
          name="keywords"
          content="career advice, interview tips, salary negotiation, job search, tech careers, career growth"
        />
        <link rel="canonical" href="https://hiringstoday.in/blog" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'HiringsToday Career Blog',
            url: 'https://hiringstoday.in/blog',
            description:
              'Expert career advice, interview preparation, salary negotiation, and job search guides for tech professionals.',
          })}
        </script>
      </Helmet>

      <article className="mx-auto max-w-6xl">
        {/* Header */}
        <section className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl">Career & Job Search Insights</h1>
          <p className="mb-8 text-xl text-slate-600">
            Expert tips on interviews, salary negotiation, career growth, and finding your perfect job.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Articles Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map(article => (
            <Link
              key={article.id}
              to={`/blog/${article.slug}`}
              className="group overflow-hidden rounded-xl shadow-md ring-1 ring-slate-200 transition hover:shadow-lg hover:ring-blue-200"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-3 left-3 inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  {article.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h2 className="mb-2 text-lg font-bold text-slate-900 line-clamp-2 transition group-hover:text-blue-600">
                  {article.title}
                </h2>

                <p className="mb-4 text-sm text-slate-600 line-clamp-2">{article.excerpt}</p>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                  <div className="text-xs text-slate-500">
                    <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>{article.readTime} min read</span>
                  </div>
                  <span className="font-semibold text-blue-600 transition group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="rounded-lg bg-slate-50 py-12 text-center">
            <p className="text-lg text-slate-600">No articles found in this category.</p>
          </div>
        )}
      </article>
    </>
  )
}
