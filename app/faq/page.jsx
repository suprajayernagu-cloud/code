import React from 'react'
import PageMeta from '@/src/components/PageMeta'
import FAQAccordion from '@/src/components/FAQAccordion'

export const metadata = {
  title: 'FAQ - Frequently Asked Questions | HiringsToday',
  description: 'Find answers to common questions about HiringsToday job search platform, job listings, safety, and how to use our features.',
}

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'What is Hiringstoday?',
        a: 'Hiringstoday is a job discovery platform that aggregates current job listings from public sources. We help you browse, compare, and find opportunities from leading companies—then send you directly to the official application page.',
      },
      {
        q: 'How often are job listings updated?',
        a: 'Our job listings are synced regularly from public sources to keep them as current as possible. However, we recommend verifying listings on the official company page before applying, as some postings may have expired.',
      },
      {
        q: 'Are all job listings verified?',
        a: 'We aggregate listings from reputable public sources, but we do not verify each listing individually. Always verify job details on the employer\'s official website before applying or sharing personal information.',
      },
    ],
  },
  {
    category: 'Using the Platform',
    questions: [
      {
        q: 'How do I search for jobs?',
        a: 'Use the search bar on the homepage to search by job title, company name, skills, or location. You can also use filters like "Remote only" and job type dropdowns to narrow results. Click "Apply Now" to go to the official company page.',
      },
      {
        q: 'Can I filter jobs by location or remote status?',
        a: 'Yes! Use the "Remote only" checkbox to show only remote positions. Search by location name, or use the job type filter to narrow by Full-time, Contract, or other types.',
      },
      {
        q: 'What is the "Latest Jobs" sidebar?',
        a: 'The sidebar displays the 10 most recently posted jobs. It\'s a quick way to see what\'s new on the platform without navigating through pages.',
      },
      {
        q: 'How do I view job details?',
        a: 'Click on any job card or title to see the full job details page. This includes responsibilities, required skills, salary information, and a link to apply on the official company page.',
      },
    ],
  },
  {
    category: 'Jobs & Opportunities',
    questions: [
      {
        q: 'Where do you get job listings from?',
        a: 'We collect job listings from public sources and aggregation feeds. We do not post jobs ourselves—all listings link back to the official employer page.',
      },
      {
        q: 'How do I apply for a job?',
        a: 'Click "Apply Now" on any job listing to go directly to the official employer application page. Apply there following the company\'s hiring process.',
      },
      {
        q: 'Can I save or bookmark jobs?',
        a: 'Currently, we don\'t have a bookmarking feature. We recommend opening multiple job links in separate tabs or bookmarking them in your browser.',
      },
      {
        q: 'What if I find a duplicate or expired listing?',
        a: 'Please report it on our Contact page with the job URL and a description. We review and remove outdated or duplicate listings regularly.',
      },
    ],
  },
  {
    category: 'Safety & Trust',
    questions: [
      {
        q: 'Is my personal information safe?',
        a: 'Hiringstoday does not collect personal data when browsing jobs. When you click "Apply Now," you\'re redirected to the official company page—their privacy policy applies. Never share sensitive details with unknown employers.',
      },
      {
        q: 'How do I identify job scams?',
        a: 'Red flags include: requests for payment to apply, offers that seem too good to be true, urgent pressure to start immediately, and requests for upfront bank information. Always verify on the company\'s official website.',
      },
      {
        q: 'What should I do if I suspect a fake posting?',
        a: 'Report it on our Contact page with the job URL and details. Also report to the company directly and relevant authorities like NCLM or local law enforcement.',
      },
      {
        q: 'Does Hiringstoday conduct interviews or assessments?',
        a: 'No. Hiringstoday is only a job listing platform. All interviews and hiring processes are conducted by the employer directly. We are not affiliated with any company unless explicitly stated.',
      },
    ],
  },
  {
    category: 'Content & Resources',
    questions: [
      {
        q: 'What are the blog articles about?',
        a: 'Our blog covers career growth topics including interview prep, job search strategies, salary negotiation, and career transitions. Visit the Blog page to explore articles in different categories.',
      },
      {
        q: 'Can I contribute content or suggest topics?',
        a: 'Yes! Please reach out through our Contact page with your suggestions, feedback, or partnership inquiries. We review all messages and respond within 1-2 business days.',
      },
    ],
  },
  {
    category: 'Technical Issues',
    questions: [
      {
        q: 'Why is a job listing showing incorrect information?',
        a: 'Job information comes from the original source. If you notice errors, please report them on the Contact page with the job URL. We can investigate and update or remove listings if needed.',
      },
      {
        q: 'The website is slow or not loading properly. What do I do?',
        a: 'Try clearing your browser cache, disabling browser extensions, or trying a different browser. If the issue persists, contact us through our Contact page with details about what you\'re experiencing.',
      },
      {
        q: 'Is the site mobile-friendly?',
        a: 'Yes! Hiringstoday is fully responsive and works great on phones, tablets, and desktops. The full search, filter, and job browsing experience is available on mobile.',
      },
    ],
  },
]

// Generate FAQ schema for search engines
function generateFAQSchema(faqs) {
  const mainEntity = faqs
    .flatMap((section) =>
      section.questions.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      }))
    )

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  }
}

export default function FAQPage() {
  const faqSchema = generateFAQSchema(faqs)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        suppressHydrationWarning
      />
      <section className="space-y-8">
        <PageMeta
          title="FAQ - Frequently Asked Questions | HiringsToday"
          description="Find answers to common questions about HiringsToday job search platform, job listings, safety, and how to use our features."
        />
        <FAQAccordion faqs={faqs} />
      </section>
    </>
  )
}
