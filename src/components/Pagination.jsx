'use client';

import { useState } from 'react';

const Pagination = ({ 
  totalPages = 5, 
  onPageChange,
  currentPageProp = 1,
  className = ''
}) => {
  const [currentPage, setCurrentPage] = useState(currentPageProp);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      onPageChange?.(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Generate array of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={`flex justify-center my-8 ${className}`}>
      <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
          aria-disabled={currentPage === 1}
          className={`
            flex items-center justify-center
            w-10 h-10 rounded-full
            font-medium text-sm
            transition-all duration-200 ease-in-out
            ${currentPage === 1
              ? 'text-gray-300 cursor-not-allowed bg-gray-50'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:scale-95'
            }
          `}
        >
          ← Previous
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200 mx-2" />

        {/* Page Numbers */}
        <div className="flex gap-1" role="group" aria-label="Page numbers">
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
              className={`
                flex items-center justify-center
                w-10 h-10 rounded-full
                font-medium text-sm
                transition-all duration-200 ease-in-out
                ${currentPage === page
                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95'
                  : 'border-2 border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600 active:scale-95'
                }
              `}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200 mx-2" />

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
          aria-disabled={currentPage === totalPages}
          className={`
            flex items-center justify-center
            w-10 h-10 rounded-full
            font-medium text-sm
            transition-all duration-200 ease-in-out
            ${currentPage === totalPages
              ? 'text-gray-300 cursor-not-allowed bg-gray-50'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:scale-95'
            }
          `}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
