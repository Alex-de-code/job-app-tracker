import { useState, useEffect } from "react";
import { MdOutlineFirstPage, MdLastPage } from "react-icons/md";

const Pagination = ({
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}) => {
  // TODO: Also need to set pagination so it doesn't move as table height changes, this may be a fix for the table itself or in jobcard? Maybe we conditionally render the rest of table height so it reaches a point so pagination component is always aligned with the bottom view??
  // TODO: Change  boiler plate styling of pagination to be better suited for UI

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
