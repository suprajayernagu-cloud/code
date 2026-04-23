/**
 * PAGINATION COMPONENT - USAGE GUIDE
 * 
 * Import and use the Pagination component in your pages/components:
 */

// Example 1: Basic Usage
import Pagination from '@/components/Pagination';

export default function JobsPage() {
  const handlePageChange = (pageNumber) => {
    console.log('User navigated to page:', pageNumber);
    // Fetch data for the new page
    // fetchJobs(pageNumber);
  };

  return (
    <div>
      <h1>Latest Jobs</h1>
      {/* Your job listings here */}
      
      <Pagination 
        totalPages={5}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

// Example 2: With Custom Styling
import Pagination from '@/components/Pagination';

export default function BlogPage() {
  return (
    <div>
      <h1>Blog Posts</h1>
      {/* Your blog posts here */}
      
      <Pagination 
        totalPages={8}
        onPageChange={(page) => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="mt-12 mb-8"
      />
    </div>
  );
}

// Example 3: With Controlled Current Page
import Pagination from '@/components/Pagination';
import { useState } from 'react';

export default function SearchResultsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div>
      <h1>Search Results</h1>
      <p>Showing results for page {currentPage}</p>
      
      <Pagination 
        totalPages={10}
        currentPageProp={currentPage}
        onPageChange={(page) => {
          setCurrentPage(page);
          // Fetch data for this page
        }}
      />
    </div>
  );
}

/**
 * COMPONENT PROPS:
 * 
 * @param {number} totalPages - Total number of pages (default: 5)
 * @param {function} onPageChange - Callback function when page changes (page number passed)
 * @param {number} currentPageProp - Initial/controlled current page (default: 1)
 * @param {string} className - Additional Tailwind classes for custom styling
 * 
 * FEATURES:
 * ✅ Rounded pill-style container with soft border
 * ✅ Active page highlighted with dark blue background
 * ✅ Inactive pages with outline circles
 * ✅ Previous/Next buttons (disabled on edges)
 * ✅ Smooth hover effects and transitions
 * ✅ Scale animation on active button click
 * ✅ Full ARIA support for accessibility
 * ✅ Fully responsive (mobile + desktop)
 * ✅ Modern SaaS-style UI
 * 
 * STYLING CUSTOMIZATION:
 * 
 * Change active page color:
 * - Find 'bg-blue-600' and replace with 'bg-indigo-600', 'bg-purple-600', etc.
 * 
 * Change border/outline colors:
 * - Find 'border-gray-200' and adjust as needed
 * 
 * Adjust sizing:
 * - Change 'w-10 h-10' to 'w-12 h-12' for larger buttons
 * - Change 'px-6 py-3' for container padding
 * 
 * Change gap/spacing:
 * - Modify 'gap-2' for space between buttons
 * 
 * ACCESSIBILITY FEATURES:
 * ✓ aria-label on all buttons
 * ✓ aria-disabled for disabled states
 * ✓ aria-current="page" on active page
 * ✓ role="group" on page numbers container
 * ✓ Keyboard accessible (Tab navigation)
 * ✓ Screen reader friendly
 */
