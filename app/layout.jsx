import React from 'react'
import { Poppins } from 'next/font/google'
import NavBar from '@/src/components/NavBar'
import Footer from '@/src/components/Footer'
import MonetizationManager from '@/src/components/MonetizationManager'
import '@/src/styles.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata = {
  title: 'Hiringstoday - Daily Job Updates and Career Blog',
  description: 'Find daily updated jobs in India and read practical career advice for interviews, fresher jobs, salary negotiation, and job search planning.',
  keywords: 'daily jobs, job updates, career blog, jobs, hiring, tech jobs, software engineer, india jobs, interview tips, salary negotiation',
  openGraph: {
    title: 'Hiringstoday - Daily Job Updates and Career Blog',
    description: 'Daily job updates, career advice, and verified job opportunities for Indian professionals.',
    url: 'https://hiringstoday.in',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Hiringstoday',
    url: 'https://hiringstoday.in',
    logo: 'https://hiringstoday.in/logo.png',
    description: 'Daily job updates and career blog with practical advice and direct links to official company application pages',
    email: 'hiringstoday7@gmail.com',
    sameAs: [
      'https://twitter.com/hiringstoday',
      'https://linkedin.com/company/hiringstoday',
    ],
  }

  return (
    <html lang="en" className={poppins.className}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      </head>
      <body className="bg-[#f6f8fb]">
        <div className="relative flex min-h-screen flex-col overflow-x-clip bg-[#f6f8fb]">
          <MonetizationManager />

          <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-[#f6f8fb]">
            <div className="absolute inset-0 bg-[#f6f8fb]" />
          </div>

          <NavBar />

          <main
            className="relative mx-auto w-full max-w-7xl flex-1 px-3 pb-12 pt-5 sm:px-6 sm:pb-16 sm:pt-8 lg:px-10"
            role="main"
          >
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  )
}
