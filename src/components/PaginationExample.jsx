'use client';

import { useState, useEffect } from 'react';
import Pagination from '@/components/Pagination';

/**
 * ADVANCED EXAMPLE: Pagination with Data Fetching
 * Shows how to integrate Pagination with real data loading
 */

export default function JobsPageWithPagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // Simulate fetching jobs for a specific page
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`/api/jobs?page=${currentPage}&limit=10`);
        const data = await response.json();
        
        setJobs(data.jobs);
        setTotalPages(data.totalPages);
        
        // Scroll to top of jobs list
        document.querySelector('#jobs-section')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Latest Jobs</h1>

      {/* Jobs Section */}
      <div id="jobs-section" className="min-h-96">
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full" />
            </div>
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {job.title}
                </h3>
                <p className="text-gray-600 mt-1">{job.company}</p>
                <p className="text-sm text-gray-500 mt-2">{job.location}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No jobs found</p>
          </div>
        )}
      </div>

      {/* Pagination Component */}
      {totalPages > 1 && (
        <Pagination 
          totalPages={totalPages}
          currentPageProp={currentPage}
          onPageChange={handlePageChange}
          className="mt-12"
        />
      )}

      {/* Page Info */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Page {currentPage} of {totalPages}</p>
      </div>
    </div>
  );
}

/**
 * API ENDPOINT EXAMPLE (Next.js App Router)
 * 
 * File: app/api/jobs/route.js
 * 
 * export async function GET(request) {
 *   const { searchParams } = new URL(request.url);
 *   const page = parseInt(searchParams.get('page')) || 1;
 *   const limit = parseInt(searchParams.get('limit')) || 10;
 * 
 *   const offset = (page - 1) * limit;
 * 
 *   try {
 *     // Fetch from your database
 *     const jobs = await db.jobs
 *       .skip(offset)
 *       .take(limit)
 *       .findMany();
 * 
 *     const totalJobs = await db.jobs.count();
 *     const totalPages = Math.ceil(totalJobs / limit);
 * 
 *     return Response.json({
 *       jobs,
 *       totalPages,
 *       currentPage: page,
 *       totalJobs
 *     });
 *   } catch (error) {
 *     return Response.json(
 *       { error: 'Failed to fetch jobs' },
 *       { status: 500 }
 *     );
 *   }
 * }
 */
