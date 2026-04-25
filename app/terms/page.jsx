import React from 'react'
import Link from 'next/link'
import PageMeta from '@/src/components/PageMeta'

export const metadata = {
  title: 'Terms & Conditions | Hiringstoday',
  description: 'Read the terms and conditions of use for the Hiringstoday job board platform.'
}

export default function TermsPage() {
  return (
    <section>
      <article className="surface space-y-8 p-6 sm:p-8 max-w-3xl mx-auto">
        <PageMeta
          title="Terms & Conditions | Hiringstoday"
          description="Read the terms and conditions of use for the Hiringstoday job board platform."
        />

        <div className="max-w-3xl">
          <span className="pill">Legal</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-ink-900 sm:text-5xl">
            Terms & Conditions
          </h1>
          <p className="mt-4 text-slate-600">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-6 text-slate-700">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-900">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Hiringstoday website and platform (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-900">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on Hiringstoday's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              <li>Use automated tools (bots, scrapers, crawlers) to collect data without permission</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-900">3. Disclaimer</h2>
            <p>
              The materials on Hiringstoday's website are provided on an 'as is' basis. Hiringstoday makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            <p>
              <strong>Job Listings Disclaimer:</strong> Hiringstoday curates and verifies job listings from trusted public sources. While we work to ensure accuracy and legitimacy, we do not guarantee the accuracy, completeness, or continued availability of any job listing. Job seekers should always verify job details on the official employer website before applying or sharing personal information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-900">4. Limitations</h2>
            <p>
              In no event shall Hiringstoday or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Hiringstoday's website, even if Hiringstoday or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-900">5. Accuracy of Materials</h2>
            <p>
              The materials appearing on Hiringstoday's website could include technical, typographical, or photographic errors. Hiringstoday does not warrant that any of the materials on its website are accurate, complete, or current. Hiringstoday may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-900">6. Materials and Content Ownership</h2>
            <p>
              The materials on Hiringstoday's website are owned by or licensed to Hiringstoday and are protected by international copyright laws. You may not use job listing content or materials without explicit permission.
            </p>
            <p>
              Job listings remain the property of their original source or employer. By using Hiringstoday, you acknowledge that you are accessing curated content provided for informational purposes only.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-900">7. Limitations on Use</h2>
            <p>
              In using this website, you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Harass or cause distress or discomfort to any person</li>
              <li>Transmit any harmful or malicious code</li>
              <li>Disrupt the normal flow of dialogue within our website</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Post false or misleading information</li>
              <li>Use bots or automation to scrape job listings</li>
              <li>Resell or redistribute job listings or content</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-900">8. User Responsibilities</h2>
            <p>
              You are responsible for maintaining the confidentiality of any account information and passwords and for restricting access to your computer. You accept responsibility for all activities that occur under your account or password. You agree to immediately notify Hiringstoday of any unauthorized uses of your account or any other breaches of security.
            </p>
            <p>
              You agree that you will not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Share your personal information with unverified employers</li>
              <li>Share passwords or account credentials with others</li>
              <li>Provide payment information through unsecured channels</li>
              <li>Accept job offers that require upfront payment</li>
              <li>Use the service for any illegal purpose</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-900">9. Application Process</h2>
            <p>
              Hiringstoday serves as a curator and facilitator of verified job listings. When you click "Apply Now," you are directed to the official employer's application page or source website. Hiringstoday is not an employment agency and does not conduct interviews, offer jobs, or hire individuals. All employment inquiries and applications are handled directly between you and the employer.
            </p>
            <p>
              Hiringstoday is not responsible for the application process, hiring decisions, or any interactions between job seekers and employers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-900">10. Third-Party Links</h2>
            <p>
              Hiringstoday has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Hiringstoday of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-900">11. Modifications</h2>
            <p>
              Hiringstoday may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-900">12. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-900">13. Prohibited Activities</h2>
            <p>
              You may not post, upload, or transmit any content that:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Infringes on intellectual property rights</li>
              <li>Contains false or fraudulent content</li>
              <li>Harasses, threatens, or defames any person</li>
              <li>Contains malicious code or viruses</li>
              <li>Violates any applicable law or regulation</li>
              <li>Exploits minors in any way</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-900">14. Termination</h2>
            <p>
              Hiringstoday may terminate your access to the website and services for violation of these terms or any applicable law. Upon termination, all licenses and rights granted to you immediately cease.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-900">15. Contact Information</h2>
            <p>
              If you have any questions about these terms and conditions, please contact us at:
            </p>
            <div className="bg-slate-100 p-4 rounded-lg">
              <p><strong>Email:</strong> hiringstoday7@gmail.com</p>
              <p><strong>Website:</strong> https://www.hiringstoday.in</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-900">16. Severability</h2>
            <p>
              If any provision of these terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-bold text-ink-900">17. Entire Agreement</h2>
            <p>
              These terms and conditions constitute the entire agreement between you and Hiringstoday regarding your use of the website and supersede all prior negotiations, representations, and warranties, whether written or oral.
            </p>
          </section>

          <section className="mt-12 pt-8 border-t border-slate-200 space-y-6">
            <div>
              <p className="text-slate-600 mb-4">
                Have questions? Check our other legal documents.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/privacy" className="inline-flex items-center gap-2 rounded-full border border-brand-700 px-6 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">
                  Privacy Policy →
                </Link>
                <Link href="/disclaimer" className="inline-flex items-center gap-2 rounded-full border border-brand-700 px-6 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">
                  Disclaimer →
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Contact Us →
                </Link>
              </div>
            </div>
          </section>
        </div>
      </article>
    </section>
  )
}
