'use client';

import { useState } from 'react';
import Pagination from '@/components/Pagination';

/**
 * COMPONENT SHOWCASE - All Pagination Variations
 * Use this to test and demonstrate different pagination configurations
 */

export default function PaginationShowcase() {
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(1);
  const [page3, setPage3] = useState(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Pagination Component Showcase
          </h1>
          <p className="text-lg text-gray-600">
            Modern, responsive pagination component with Tailwind CSS
          </p>
        </div>

        {/* Variation 1: Default 5 Pages */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Variation 1: 5 Pages (Default)
            </h2>
            <p className="text-gray-600">
              Standard pagination with 5 page numbers. Perfect for job listings, blog archives, etc.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-8 mb-4">
            <Pagination 
              totalPages={5}
              currentPageProp={page1}
              onPageChange={setPage1}
            />
          </div>
          
          <div className="text-sm text-gray-600 p-4 bg-blue-50 rounded-lg border border-blue-200">
            Current Page: <span className="font-semibold text-blue-600">{page1}</span>
          </div>
        </section>

        {/* Variation 2: Large Pagination (10+ Pages) */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Variation 2: Large Dataset (10 Pages)
            </h2>
            <p className="text-gray-600">
              Suitable for large search results or comprehensive job databases
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-8 mb-4">
            <Pagination 
              totalPages={10}
              currentPageProp={page2}
              onPageChange={setPage2}
            />
          </div>
          
          <div className="text-sm text-gray-600 p-4 bg-blue-50 rounded-lg border border-blue-200">
            Current Page: <span className="font-semibold text-blue-600">{page2}</span>
          </div>
        </section>

        {/* Variation 3: Single Page (No Pagination Needed) */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Variation 3: Single Page Result
            </h2>
            <p className="text-gray-600">
              When totalPages = 1, the component is still rendered but all navigation is disabled
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-8 mb-4">
            <Pagination 
              totalPages={1}
              currentPageProp={page3}
              onPageChange={setPage3}
            />
          </div>
          
          <div className="text-sm text-gray-600 p-4 bg-blue-50 rounded-lg border border-blue-200">
            Current Page: <span className="font-semibold text-blue-600">{page3}</span>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">✨ Key Features</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Feature 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Pill-Style Design</h3>
                <p className="text-gray-600 text-sm">Rounded container with soft border and modern aesthetic</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Smart Disabled States</h3>
                <p className="text-gray-600 text-sm">Previous disabled on page 1, Next disabled on last page</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Responsive Design</h3>
                <p className="text-gray-600 text-sm">Mobile-friendly with adaptive spacing and touch-friendly buttons</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Smooth Animations</h3>
                <p className="text-gray-600 text-sm">Hover effects, transitions, and scale animations on click</p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Accessibility First</h3>
                <p className="text-gray-600 text-sm">Full ARIA support, keyboard navigation, screen reader friendly</p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Tailwind Styled</h3>
                <p className="text-gray-600 text-sm">100% Tailwind CSS - easy to customize colors and sizes</p>
              </div>
            </div>

          </div>
        </section>

        {/* Implementation Guide */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 Quick Start</h2>
          <p className="text-gray-700 mb-4">
            Import and use the component in your page or component:
          </p>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import Pagination from '@/components/Pagination';

export default function MyPage() {
  return (
    <Pagination 
      totalPages={5}
      onPageChange={(page) => console.log('Page:', page)}
    />
  );
}`}
          </pre>
        </section>

      </div>
    </div>
  );
}
