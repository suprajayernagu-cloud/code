import React from 'react'
import Link from 'next/link'
import PageMeta from '@/src/components/PageMeta'

export const metadata = {
  title: 'About Hiringstoday | Meet Our Founders',
  description: 'Learn about Hiringstoday\'s mission to help Indian job seekers discover better opportunities. Founded by career professionals dedicated to simplifying job search.',
}

export default function AboutPage() {
  return (
    <section>
      <article className="surface space-y-8 p-6 sm:p-8 max-w-3xl mx-auto">
        <PageMeta
          title="About Hiringstoday | Meet Our Founders"
          description="Learn about Hiringstoday's mission to help Indian job seekers discover better opportunities. Founded by career professionals dedicated to simplifying job search."
        />

        <div>
          <span className="pill">About</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-ink-900 sm:text-5xl">
            Making Job Search Less Frustrating
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg">
            Hiringstoday was built to solve a real problem: job hunting is unnecessarily complex and time-consuming. We curate and verify thousands of job listings to help you focus on what matters—finding opportunities that match your skills and ambitions.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Our Mission</h2>
          <p className="text-slate-700 leading-relaxed">
            We believe that finding your next job shouldn't require opening 20 tabs, cross-referencing multiple sites, or guessing whether listings are still active. Our mission is to be the trusted platform where Indian job seekers discover verified, current opportunities from leading employers—quickly, easily, and confidently.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Meet the Founders</h2>
          
          <div className="border-l-4 border-brand-700 pl-6 space-y-3">
            <div>
              <h3 className="font-display text-lg font-bold text-ink-900">Siddiq Kolimi</h3>
              <p className="text-sm text-brand-700 font-semibold">Founder & CEO</p>
              <p className="mt-2 text-slate-700 leading-relaxed">
                Siddiq built Hiringstoday after experiencing his own frustrations with job search platforms. With a background in product and technology, he saw the opportunity to create something fundamentally better for job seekers across India. His vision: a platform that respects your time and shows you real opportunities.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-ink-900">How We Work</h2>
          <ul className="mt-4 space-y-3 text-slate-700">
            <li className="flex gap-3">
              <span className="text-brand-700 font-bold flex-shrink-0">1.</span>
              <span><strong>Curate</strong> - We collect job listings from reputable sources and verify their legitimacy</span>
            </li>
            <li className="flex gap-3">
              <span className="text-brand-700 font-bold flex-shrink-0">2.</span>
              <span><strong>Organize</strong> - We structure the data so titles, companies, salaries, and locations are crystal clear</span>
            </li>
            <li className="flex gap-3">
              <span className="text-brand-700 font-bold flex-shrink-0">3.</span>
              <span><strong>Verify</strong> - We check that listings are active and employers are legitimate</span>
            </li>
            <li className="flex gap-3">
              <span className="text-brand-700 font-bold flex-shrink-0">4.</span>
              <span><strong>Direct</strong> - We send you straight to the employer's official application page</span>
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Why You Can Trust Us</h2>
          <ul className="mt-4 space-y-3 text-slate-700">
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span>We never ask for payment or personal information upfront</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span>We vet employers to filter out scams and fake postings</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span>We link directly to employer application pages—no redirects or middlemen</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span>We're transparent about data and committed to your privacy</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span>We update listings daily to keep them relevant and current</span>
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-ink-900">What We're Not</h2>
          <p className="text-slate-700">
            We're not an employment agency. We don't hire you, conduct interviews, or make employment decisions. We're also not a resume writing service or job application guarantor. What we are is a trusted curator of verified job opportunities that connects you directly with employers looking for talent.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Based in India, Serving Indian Professionals</h2>
          <p className="text-slate-700">
            Hiringstoday is founded and operated from India with a deep understanding of the Indian job market, professional aspirations, and hiring landscape. We speak your language—literally and figuratively—and understand the unique challenges of job search in India's competitive market.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Our Content & Community</h2>
          <p className="text-slate-700 leading-relaxed">
            Beyond job listings, we provide genuine career guidance through our blog and resources. Our writers—career coaches, interview experts, and negotiation specialists—share real, battle-tested strategies to help you get hired and grow your career. We're building a community where job seekers support each other.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link href="/blog" className="inline-flex items-center gap-2 rounded-full border border-brand-700 px-6 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">
              Read Our Blog →
            </Link>
            <Link href="/resources" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Career Resources →
            </Link>
          </div>
        </section>

        <section className="space-y-4 pt-8 border-t border-slate-200">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Get in Touch</h2>
          <p className="text-slate-700">
            Have feedback, questions, or want to partner with us? We'd love to hear from you. Reach out anytime.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-800">
              Contact Us →
            </Link>
            <Link href="/jobs" className="inline-flex items-center gap-2 rounded-full border border-brand-700 px-6 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">
              Browse Jobs →
            </Link>
          </div>
        </section>

        <section className="space-y-3 text-sm text-slate-500 pt-8 border-t border-slate-200">
          <p>© {new Date().getFullYear()} Hiringstoday. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-brand-700 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-700 transition">Terms & Conditions</Link>
            <Link href="/disclaimer" className="hover:text-brand-700 transition">Disclaimer</Link>
          </div>
        </section>
      </article>
    </section>
  )
}
