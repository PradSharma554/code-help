import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems,
  startIndex,
  endIndex,
}) {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = totalPages > 1 ? getVisiblePages() : [1];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-gray-200 bg-white rounded-b-xl">
      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-medium text-slate-900">{startIndex}</span> to{" "}
          <span className="font-medium text-slate-900">{endIndex}</span> of{" "}
          <span className="font-medium text-slate-900">{totalItems}</span>{" "}
          results
        </div>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border border-slate-300 rounded-lg text-sm p-1 text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          {[10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {visiblePages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
            className={clsx(
              "w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium border transition",
              {
                "bg-indigo-600 text-white border-indigo-600":
                  page === currentPage,
                "text-slate-600 border-gray-300 hover:bg-gray-50":
                  page !== currentPage && page !== "...",
                "border-transparent cursor-default text-gray-400":
                  page === "...",
              },
            )}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
