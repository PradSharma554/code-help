import React, { useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useQueryState, parseAsInteger } from "nuqs";
import Pagination from "../Pagination/Pagination";

export default function Table({
  columns,
  data,
  onRowClick,
  keyExtractor = (item) => item.id || item._id,
  className = "",
  pagination = false,
  defaultPageSize = 10,
  serverSide = false,
  totalItems = 0, // Required if serverSide is true
}) {
  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1),
  );
  const [pageSize, setPageSize] = useQueryState(
    "pageSize",
    parseAsInteger.withDefault(defaultPageSize),
  );

  const paginatedData = useMemo(() => {
    if (!pagination) return data;
    if (serverSide) return data; // Data is already sliced from server
    const start = (currentPage - 1) * pageSize;
    return data && data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize, pagination, serverSide]);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed">
        No entries found.
      </div>
    );
  }

  // If serverSide, use provided totalItems. If clientSide, calculate length.
  const actualTotalItems = serverSide ? totalItems : data?.length || 0;
  const totalPages = Math.ceil(actualTotalItems / pageSize);

  // For display "Showing X to Y"
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, actualTotalItems);

  return (
    <div
      className={`w-full overflow-hidden border rounded-xl bg-white shadow-sm flex flex-col ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  className={`px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider ${
                    col.headerClassName || ""
                  }`}
                  style={{ width: col.width }}
                >
                  <div className="flex items-center gap-2">
                    {col.header}
                    {col.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp className="w-3 h-3 text-slate-400 -mb-1" />
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick && onRowClick(row)}
                className={`hover:bg-slate-50 transition-colors ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={`${keyExtractor(row)}-${col.key || colIndex}`}
                    className={`px-6 text-sm text-slate-700 ${
                      col.cellClassName || ""
                    }`}
                  >
                    {col.render
                      ? col.render(row)
                      : row[col.key || col.dataIndex]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalItems={actualTotalItems}
          startIndex={startIndex}
          endIndex={endIndex}
        />
      )}
    </div>
  );
}
