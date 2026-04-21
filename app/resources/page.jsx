'use client'

import React from 'react'
import Link from 'next/link'
import PageMeta from '@/src/components/PageMeta'

const guides = [
  {
    title: 'How to Write a Winning Resume',
    description: 'Learn the structure, formatting, and content strategies that help your resume stand out to recruiters and hiring managers.',
    icon: '📄',
    topics: ['ATS Optimization', 'Action Verbs', 'Quantifiable Results', 'Skills Section', 'Format Tips'],
    tips: [
      'Keep it to 1 page for entry-level, 2 pages maximum for experienced professionals',
      'Use specific numbers and percentages to quantify your achievements',
      'Tailor your resume to match the job description keywords',
      'Avoid generic phrases like "hard worker" or "team player"',
      'Use consistent formatting with clear headings and bullet points',
    ],
  },
  {
    title: 'Interview Preparation Guide',
    description: 'Master common interview questions, behavioral techniques, and strategies to present yourself confidently.',
    icon: '🎤',
    topics: ['Common Questions', 'STAR Method', 'Technical Prep', 'Body Language', 'Follow-up'],
    tips: [
      'Prepare stories for behavioral questions using the STAR method (Situation, Task, Action, Result)',
      'Research the company thoroughly before the interview',
      'Practice answering in front of a mirror or with a friend',
      'Prepare 2-3 thoughtful questions to ask the interviewer',
      'Arrive 10-15 minutes early and dress one level above the job role',
    ],
  },
  {
    title: 'Salary Negotiation Tactics',
    description: 'Understand market rates, timing, and negotiation strategies to secure the compensation you deserve.',
    icon: '💰',
    topics: ['Market Research', 'Timing', 'Negotiation Scripts', 'Benefits Package', 'Counter Offers'],
    tips: [
      'Research industry salaries using Payscale, Glassdoor, and LinkedIn Salary before negotiating',
      'Let the employer make the first offer when possible',
      'Focus on your value and market rates, not personal financial needs',
      'Negotiate the entire package: salary, bonus, equity, PTO, and flexibility',
      'Get the final offer in writing before accepting',
    ],
  },
  {
    title: 'Job Search Strategy',
    description: 'Develop an effective job search plan with application tracking, networking, and timeline management.',
    icon: '🔍',
    topics: ['Job Boards', 'Networking', 'Application Tracking', 'Follow-up', 'Timeline'],
    tips: [
      'Apply to 5-10 positions per week rather than mass applying to hundreds',
      'Customize your resume and cover letter for each application',
      'Network actively: attend meetups, connect on LinkedIn, informational interviews',
      'Track applications in a spreadsheet with dates, contacts, and follow-up status',
      'Follow up after 1-2 weeks if you haven\'t heard back from applications',
    ],
  },
  {
    title: 'Career Transition Guide',
    description: 'Plan a successful career change with skill-building, storytelling, and strategy.',
    icon: '🚀',
    topics: ['Skills Assessment', 'Reskilling', 'Storytelling', 'Networking', 'First Roles'],
    tips: [
      'Identify transferable skills from your current role that apply to the new field',
      'Build relevant skills through courses, projects, or certifications',
      'Create a compelling narrative about why you\'re making the transition',
      'Start with roles that bridge your old and new experience',
      'Be prepared to potentially take a step back in seniority or salary initially',
    ],
  },
  {
    title: 'Remote Job Success',
    description: 'Master remote work by optimizing your environment, communication, and work-life balance.',
    icon: '🏡',
    topics: ['Home Setup', 'Communication', 'Time Management', 'Boundaries', 'Networking'],
    tips: [
      'Create a dedicated workspace separate from your living area',
      'Over-communicate in a remote environment: status updates, meeting notes, async documentation',
      'Set clear work hours and stick to them to avoid burnout',
      'Use video during meetings even when not required—it builds stronger connections',
      'Attend virtual team events and take initiative on company culture activities',
    ],
  },
]

export default function ResourcesPage() {
  return (
    <section className="space-y-12">
      <PageMeta
        title="Career Resources & Guides - Hiringstoday"
        description="Free career guides covering resume writing, interview prep, salary negotiation, job search strategy, career transitions, and remote work success."
      />

      <div className="text-center space-y-4">
        <p className="text-sm font-semibold tracking-wide text-brand-700">Career Resources</p>
        <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
          Guides to Land Your Dream Job
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Free, practical guides covering everything from resume optimization to interview techniques. Master the skills employers are looking for.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {guides.map((guide, index) => (
          <div
            key={index}
            className="surface flex flex-col gap-4 rounded-2xl border border-slate-200 p-6 transition hover:border-brand-200 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-3xl">{guide.icon}</span>
                <h2 className="mt-3 font-display text-lg font-semibold text-ink-900">
                  {guide.title}
                </h2>
              </div>
            </div>

            <p className="text-sm text-slate-600">{guide.description}</p>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Topics Covered
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {guide.topics.map((topic, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Key Tips
                </p>
                <ul className="mt-2 space-y-1">
                  {guide.tips.slice(0, 2).map((tip, i) => (
                    <li key={i} className="text-xs text-slate-600 leading-relaxed">
                      • {tip}
                    </li>
                  ))}
                  <li className="text-xs font-semibold text-brand-700">
                    + {guide.tips.length - 2} more tips...
                  </li>
                </ul>
              </div>
            </div>

            <button className="mt-auto inline-flex items-center justify-center rounded-lg border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-100">
              View Full Guide
            </button>
          </div>
        ))}
      </div>

      <section className="surface space-y-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-50 to-blue-50 p-8">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink-900">
            Want to master job searching?
          </h2>
          <p className="mt-2 text-slate-600">
            Check out our blog for in-depth articles, interview questions, and career success stories.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-lg bg-brand-700 px-6 py-3 font-semibold text-white transition hover:bg-brand-800"
          >
            Read Blog Articles
          </Link>
          <Link
            href="/faq"
            className="inline-flex items-center justify-center rounded-lg border border-brand-700 bg-white px-6 py-3 font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            Browse FAQs
          </Link>
        </div>
      </section>

      <section className="surface space-y-4 rounded-2xl border border-slate-200 p-6 text-center">
        <h3 className="font-display text-lg font-semibold text-ink-900">
          Get Job Updates in Your Inbox
        </h3>
        <p className="text-sm text-slate-600">
          No spam, just fresh job opportunities and career tips delivered weekly.
        </p>
        <form className="flex gap-2">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-brand-700 px-4 py-2 font-semibold text-white transition hover:bg-brand-800"
          >
            Subscribe
          </button>
        </form>
      </section>
    </section>
  )
}
