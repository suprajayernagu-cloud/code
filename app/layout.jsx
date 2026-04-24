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
  title: 'HiringsToday - Premium Job Board for Tech Professionals',
  description: 'Discover curated job opportunities at leading tech companies. Find roles matching your skills with detailed company insights, salary info, and interview preparation guides.',
  keywords: 'jobs, hiring, tech jobs, software engineer, india jobs, career',
  openGraph: {
    title: 'HiringsToday - Premium Job Board for Tech Professionals',
    description: 'Discover curated job opportunities at leading tech companies.',
    url: 'https://hiringstoday.in',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Hiringstoday',
    url: 'https://hiringstoday.in',
    logo: 'https://hiringstoday.in/logo.png',
    description: 'Job discovery platform with direct links to official company application pages',
    email: 'contact@hiringstoday.in',
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
      <body className="bg-white">
        <div className="relative flex min-h-screen flex-col overflow-x-clip bg-white">
          <MonetizationManager />

          <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-white">
            <div className="absolute inset-0 bg-white" />
          </div>

          <NavBar />

          <main
            className="relative mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-8 sm:px-6 lg:px-10"
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
