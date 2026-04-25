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
            Hi, I'm Siddiq, a developer based in Hyderabad. I built Hiringstoday because I got tired of the mess. I spent weeks job hunting across broken platforms, spam-filled boards, and fake listings. Something had to change. Today, I'm building the job platform I wish existed—one where real opportunities connect with real talent, no noise, no middlemen, no BS.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Why I Built This</h2>
          <p className="text-slate-700 leading-relaxed">
            During my own job transitions, I realized how broken job search feels in India. LinkedIn is flooded with recruiter spam. Generic job boards mix real opportunities with predatory training schemes and fake consulting gigs. Scrolling through 100 listings, only 5 are legitimate. I was clicking "Apply Now" only to land on recruiting agency pages instead of the actual employer. I'd spend 3 hours researching to figure out which listings were real.
          </p>
          <p className="mt-3 text-slate-700 leading-relaxed">
            The best opportunities I found weren't on job boards at all—they came through networks and referrals. But most people don't have access to those networks. That's the gap I wanted to close. I wanted to build a platform where job seekers could find legitimate, verified opportunities directly from employers, without the friction, spam, or middlemen getting in the way.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl font-semibold text-ink-900">About Me</h2>
          
          <div className="border-l-4 border-brand-700 pl-6 space-y-3">
            <div>
              <h3 className="font-display text-lg font-bold text-ink-900">Siddiq Kolimi</h3>
              <p className="text-sm text-brand-700 font-semibold">Founder & Developer</p>
              <p className="mt-2 text-slate-700 leading-relaxed">
                I've spent the last 2+ years working in product development, helping teams ship real products that solve real problems. I've worked with startups and established companies, lived through hiring booms and busts, and sat in hiring meetings. I know how hiring actually works.
              </p>
              <p className="mt-3 text-slate-700 leading-relaxed">
                Hiringstoday started as a side project to scratch my own itch. But after talking to dozens of job seekers and seeing the same frustrations pop up again and again, I realized this needed to exist full-time. Every decision at Hiringstoday—from which listings we feature to how we present job data—comes from my own experience as someone who's been in your shoes. I'm not running a company that profits from confusion. I'm building a tool I want to exist.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-ink-900">My Mission</h2>
          <p className="text-slate-700 leading-relaxed">
            I built Hiringstoday with one core principle: job search shouldn't feel like gambling. Finding your next opportunity shouldn't require hours of research to separate signal from noise. My mission is simple—be the platform where Indian job seekers find verified, real opportunities from legitimate employers, without wading through spam, fake postings, or predatory schemes. I curate and verify thousands of job listings so you can trust what you're seeing and spend your time actually applying to real jobs.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-ink-900">How I Do It</h2>
          <ul className="mt-4 space-y-3 text-slate-700">
            <li className="flex gap-3">
              <span className="text-brand-700 font-bold flex-shrink-0">1.</span>
              <span><strong>Curate</strong> - I identify job listings from trusted, verified sources and direct employer partnerships</span>
            </li>
            <li className="flex gap-3">
              <span className="text-brand-700 font-bold flex-shrink-0">2.</span>
              <span><strong>Verify</strong> - I validate that listings are active, employers are legitimate, and opportunities are real before showing them to you</span>
            </li>
            <li className="flex gap-3">
              <span className="text-brand-700 font-bold flex-shrink-0">3.</span>
              <span><strong>Organize</strong> - I structure job data clearly so roles, companies, salaries, and locations are crystal clear at a glance</span>
            </li>
            <li className="flex gap-3">
              <span className="text-brand-700 font-bold flex-shrink-0">4.</span>
              <span><strong>Connect</strong> - I send you directly to the employer's official application page—no redirects, no recruiting agencies, no middlemen</span>
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Why You Can Trust Me</h2>
          <ul className="mt-4 space-y-3 text-slate-700">
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span>I've sat in the chair you're sitting in. I've job hunted. I know the frustration.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span>I never ask for payment or personal info before you apply. You control when you're ready.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span>I vet every employer listing to filter out scams, training schemes, and fake postings.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span>I link directly to employer application pages. No redirects. No recruiting agencies getting between you and the job.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span>I'm transparent about how this works. I'm not hiding what I do or why I do it.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-600 font-bold flex-shrink-0">✓</span>
              <span>I update listings daily to keep them fresh and relevant. Dead postings get removed.</span>
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-ink-900">What I'm Not</h2>
          <p className="text-slate-700">
            I'm not an employment agency placing you in roles or conducting interviews. I'm not a resume writing service or job application guarantor. I'm not a marketplace where anyone with a credit card can post anything. What I am is a curator of verified opportunities that connects you directly with employers. I do the work of finding the real listings, filtering out the spam, and organizing it so you can actually focus on applying to roles that matter.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Based in India, Built for Indian Professionals</h2>
          <p className="text-slate-700">
            I'm based in Hyderabad and deeply understand the Indian job market. I know the frustrations of navigating it. I know the salary expectations across different cities and experience levels. I know the difference between real opportunities and predatory schemes that target job seekers. I'm not outsourcing this to some generic platform. I'm building this specifically for Indian professionals like me.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Beyond Job Listings: Real Career Guidance</h2>
          <p className="text-slate-700 leading-relaxed">
            Job search is more than just finding listings. It's about getting hired, negotiating well, and building a career that actually feels fulfilling. So I've created guides, resources, and real strategies written by people who've done this work—interview coaches, career consultants, and hiring managers who are sharing battle-tested advice. The blog and resources section aren't just fluff. They're here to genuinely help you get hired.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link href="/blog" className="inline-flex items-center gap-2 rounded-full border border-brand-700 px-6 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">
              Read My Blog →
            </Link>
            <Link href="/resources" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Career Resources →
            </Link>
          </div>
        </section>

        <section className="space-y-4 pt-8 border-t border-slate-200">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Let's Connect</h2>
          <p className="text-slate-700">
            Have feedback? Questions? Want to partner or suggest a feature? I read every message and reply personally. Let me know what you think.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-800">
              Get in Touch →
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
