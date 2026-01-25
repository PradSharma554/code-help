import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Table({
  columns,
  data,
  onRowClick,
  keyExtractor = (item) => item.id || item._id,
  className = "",
}) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed">
        No entries found.
      </div>
    );
  }

  return (
    <div
      className={`w-full overflow-hidden border rounded-xl bg-white shadow-sm ${className}`}
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
            {data.map((row, rowIndex) => (
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
                    className={`px-6 py-4 text-sm text-slate-700 ${
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
    </div>
  );
}
