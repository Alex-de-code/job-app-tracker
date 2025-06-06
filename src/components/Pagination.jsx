import { useState } from "react";

const Pagination = ({
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}) => {
  // calculate total pages needed for table, based on item count & items per page
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate initial range to include current page
  const getInitialRange = () => {
    const rangeSize = 5; // Number of pages to show
    let start = Math.max(1, currentPage - Math.floor(rangeSize / 2));
    let end = Math.min(totalPages, start + rangeSize - 1);

    // Adjust if we're at the end
    if (end - start + 1 < rangeSize) {
      start = Math.max(1, end - rangeSize + 1);
    }

    return [start, end];
  };

  // state for range of page numbers, initial range will show first 5 pages || total pages if less than 5
  //   const [pageRange, setPageRange] = useState([1, Math.min(5, totalPages)]);
  const [pageRange, setPageRange] = useState(getInitialRange());

  // local state for items per page dropdown
  const [localItemsPerPage, setLocalItemsPerPage] = useState(itemsPerPage);

  // gives an array of page numbers to display, will also have truncation [...]
  const getPageNumbers = () => {
    const pages = [];
    const [start, end] = pageRange;

    if (start > 1) {
      pages.push(1); // show first page no matter what
      if (start > 2) pages.push("..."); // if there's a gap greater than 1 show ...
    }

    // add visible range of pages
    for (let i = start; i <= end && i <= totalPages; i++) {
      pages.push(i);
    }

    // add truncation and last page if necessary
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("..."); // only show ... if gap is more than 1 page
      pages.push(totalPages);
    }
    return pages;
  };

  // handles page navigation + updates visible range
  const handlePageChange = (page) => {
    // prevent navigation to truncation placeholder or curren page
    if (page === "..." || page === currentPage) return;

    // // expand rightside when clicking at end of visible range
    // if (page === pageRange[1] && page + 3 <= totalPages) {
    //   setPageRange([page + 1, Math.min(page + 4, totalPages)]);
    // }

    // // expand leftside when clicking at the beginning of range
    // else if (page === pageRange[0] - 1 && page - 3 >= 1) {
    //   setPageRange([Math.max(1, page - 4), page - 1]);
    // }

    // // notify parent component of page change
    // onPageChange(page);
    // Update range when navigating to edges
    if (page === pageRange[1] && page + 3 <= totalPages) {
      setPageRange([page + 1, Math.min(page + 4, totalPages)]);
    } else if (page === pageRange[0] - 1 && page - 3 >= 1) {
      setPageRange([Math.max(1, page - 4), page - 1]);
    } else if (page < pageRange[0] || page > pageRange[1]) {
      // If jumping to a page outside current range, recalculate range
      const rangeSize = 5;
      let newStart = Math.max(1, page - Math.floor(rangeSize / 2));
      let newEnd = Math.min(totalPages, newStart + rangeSize - 1);

      if (newEnd - newStart + 1 < rangeSize) {
        newStart = Math.max(1, newEnd - rangeSize + 1);
      }

      setPageRange([newStart, newEnd]);
    }
    onPageChange(page);
  };

  // handles changing # of items per page
  const handleItemsPerPageChange = (e) => {
    const newSize = Number(e.target.value);
    setLocalItemsPerPage(newSize);
    onPageChange(1, newSize); // reset to first page when changing page size, empty state prevention
  };

  return (
    <>
      <div className="mt-2">
        {/* <div>Pagination</div> */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-between gap-4`}
        >
          {/* Results count and items per page selector */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
            </span>

            {/* Items per page dropdown */}
            <select
              value={localItemsPerPage}
              onChange={handleItemsPerPageChange}
              className="bg-gray-50 border border-gray-300 text-gray-700 py-1 px-2 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
              aria-label="Items per page"
            >
              {[5, 10, 15, 20].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>

          {/* Page navigation buttons */}
          <div className="flex gap-1">
            {/* Previous page button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
              aria-label="Previous page"
            >
              Previous
            </button>

            {/* Page number buttons */}
            {getPageNumbers().map((page, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md border text-sm font-medium ${
                  page === currentPage
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white border-gray-300 hover:bg-gray-50"
                } ${
                  page === "..." ? "pointer-events-none" : ""
                } transition-colors`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            ))}

            {/* Next page button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pagination;
