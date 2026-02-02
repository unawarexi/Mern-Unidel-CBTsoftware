import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  MoreHorizontal,
} from "lucide-react";
import clsx from "clsx";
import EmptyState from "./EmptyState";

/**
 * DataTable Component
 * Sortable, searchable, paginated table
 */
const DataTable = ({
  data = [],
  columns = [],
  searchable = true,
  searchPlaceholder = "Search...",
  sortable = true,
  pagination = true,
  pageSize = 10,
  actions,
  onRowClick,
  isLoading = false,
  emptyTitle = "No data found",
  emptyDescription,
  emptyAction,
  onEmptyAction,
  className = "",
}) => {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(search.toLowerCase());
      }),
    );
  }, [data, search, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      const comparison = aVal < bVal ? -1 : 1;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key) => {
    if (!sortable) return;
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronUp className="w-3 h-3 text-gray-300" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-3 h-3 text-blue-600" />
    ) : (
      <ChevronDown className="w-3 h-3 text-blue-600" />
    );
  };

  if (isLoading) {
    return (
      <div className={clsx("bg-white rounded-xl overflow-hidden", className)}>
        <div className="p-4 border-b border-gray-100">
          <div className="w-64 h-10 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border-b border-gray-100">
              {columns.map((_, j) => (
                <div
                  key={j}
                  className="flex-1 h-5 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          ))}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden",
        className,
      )}
    >
      {/* Toolbar */}
      {(searchable || actions) && (
        <div className="flex items-center justify-between gap-4 p-3 sm:p-4 border-b border-gray-100">
          {searchable && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Table */}
      {paginatedData.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      onClick={() =>
                        column.sortable !== false && handleSort(column.key)
                      }
                      className={clsx(
                        "px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider",
                        sortable &&
                          column.sortable !== false &&
                          "cursor-pointer hover:bg-gray-100 select-none",
                      )}
                      style={{ width: column.width }}
                    >
                      <div className="flex items-center gap-1">
                        {column.label}
                        {sortable &&
                          column.sortable !== false &&
                          renderSortIcon(column.key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedData.map((row, rowIndex) => (
                  <motion.tr
                    key={row.id || rowIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: rowIndex * 0.02 }}
                    onClick={() => onRowClick?.(row)}
                    className={clsx(
                      "hover:bg-gray-50 transition-colors",
                      onRowClick && "cursor-pointer",
                    )}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-3 sm:px-4 py-3 text-sm text-gray-900"
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : row[column.key]}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <div className="text-xs sm:text-sm text-gray-600">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
                {sortedData.length}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={clsx(
                        "w-8 h-8 rounded-lg text-sm font-medium",
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-100 text-gray-600",
                      )}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          actionLabel={emptyAction}
          onAction={onEmptyAction}
          variant="search"
        />
      )}
    </div>
  );
};

export default DataTable;
