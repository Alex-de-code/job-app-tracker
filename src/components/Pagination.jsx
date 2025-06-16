import { useState, useEffect } from "react";
import { MdOutlineFirstPage, MdLastPage } from "react-icons/md";

const Pagination = ({
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}) => {
  // TODO: When a user deletes the first entry of a table the table is empty, it doesn't refresh and also the next button that's disabled somehow unlocks allowing the user to continue to navigate to empty pages until page refresh

  // TODO: On page refresh pages, get messed up and show trunctation and last page only sometimes, need to fix this
  // TODO: Handle Items per change isn't working so number of job apps on table doesn't update, need to fix this
  // TODO: Also need to set pagination so it doesn't move as table height changes, this may be a fix for the table itself or in jobcard? Maybe we conditionally render the rest of table height so it reaches a point so pagination component is always aligned with the bottom view??
  // TODO: Change  boiler plate styling of pagination to be better suited for UI
  // TODO: Count of entries doesn't update on front end, but on page refresh when another call is made to supabase it does, need to set a solution up on frontend so entries/job application count updates!

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
  // const getPageNumbers = () => {
  //   const pages = [];
  //   const [start, end] = pageRange;

  //   if (start > 1) {
  //     pages.push(1); // show first page no matter what
  //     if (start > 2) pages.push("..."); // if there's a gap greater than 1 show ...
  //   }

  //   // add visible range of pages
  //   for (let i = start; i <= end && i <= totalPages; i++) {
  //     pages.push(i);
  //   }

  //   // add truncation and last page if necessary
  //   if (end < totalPages) {
  //     if (end < totalPages - 1) pages.push("..."); // only show ... if gap is more than 1 page
  //     pages.push(totalPages);
  //   }
  //   return pages;
  // };

  const handlePageChange = (page) => {
    // Prevent navigation to truncation placeholder or current page
    if (page === "..." || page === currentPage) return;

    const rangeSize = 5; // Number of visible page buttons
    let newStart = pageRange[0];
    let newEnd = pageRange[1];

    // Handle edge expansion (clicking "..." or edge pages)
    if (page === pageRange[1] && page + 3 <= totalPages) {
      // Expand right side
      newStart = page + 1;
      newEnd = Math.min(page + 4, totalPages);
    } else if (page === pageRange[0] - 1 && page - 3 >= 1) {
      // Expand left side
      newEnd = page - 1;
      newStart = Math.max(1, page - 4);
    } else if (page < pageRange[0] || page > pageRange[1]) {
      // Jumping to page outside current range - center on new page
      newStart = Math.max(1, page - Math.floor(rangeSize / 2));
      newEnd = Math.min(totalPages, newStart + rangeSize - 1);

      // Adjust if we're at the end
      if (newEnd - newStart + 1 < rangeSize) {
        newStart = Math.max(1, newEnd - rangeSize + 1);
      }
    }

    // Only update range if it actually changed
    if (newStart !== pageRange[0] || newEnd !== pageRange[1]) {
      setPageRange([newStart, newEnd]);
    }

    // Notify parent component
    onPageChange(page);
  };

  // handles changing # of items per page
  // const handleItemsPerPageChange = (e) => {
  //   const newSize = Number(e.target.value);
  //   setLocalItemsPerPage(newSize);
  //   onPageChange(1, newSize); // reset to first page when changing page size, empty state prevention
  // };

  // this rerenders table pages and allows UI to update properly now based on first or last page entries
  useEffect(() => {
    if (totalItems > 0 && currentPage > totalPages) {
      onPageChange(totalPages);
    }
  }, [totalItems, currentPage, totalPages, onPageChange]);

  return (
    <>
      <div className="mt-2">
        {/* <div>Pagination</div> */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-between gap-4`}
        >
          {/* Results count and items per page selector */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {totalItems > 0 ? (
              <>
                <span>
                  Showing {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                  {totalItems}
                </span>
              </>
            ) : (
              <>
                <span>Showing 0-0 of 0</span>
              </>
            )}

            {/* Items per page dropdown */}
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="bg-gray-50 border border-gray-300 text-gray-700 py-1 px-2 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
              aria-label="Items per page"
            >
              {[10, 15, 20].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>

          {/* Page navigation buttons */}
          <div className="flex gap-1 items-center">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium disabled:opacity-50 hover:bg-gray-100 transition-colors"
            >
              <MdOutlineFirstPage className="size-5" />
            </button>
            {/* Previous page button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium disabled:opacity-50 hover:bg-gray-100 transition-colors"
              aria-label="Previous page"
            >
              Previous
            </button>

            {/* Page number buttons */}
            {/* {getPageNumbers().map((page, i) => (
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
            ))} */}

            <span className="text-sm px-2 text-gray-600">
              {totalPages ? (
                <>
                  <span className="">{currentPage}</span> of {totalPages}
                </>
              ) : (
                <>
                  <span className="">{currentPage}</span> of 1
                </>
              )}
            </span>

            {/* Next page button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages <= 1}
              className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium disabled:opacity-50 hover:bg-gray-100 transition-colors"
              aria-label="Next page"
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || totalPages <= 1}
              className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium disabled:opacity-50 hover:bg-gray-100 transition-colors"
              aria-label="Last page"
            >
              <MdLastPage className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pagination;
