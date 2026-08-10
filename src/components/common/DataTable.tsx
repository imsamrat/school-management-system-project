import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  // Pagination
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  // Sorting (Managed internally for now if no backend sorting, but can be lifted)
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading,
  onRowClick,
  pagination,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  const handleSort = (key?: keyof T) => {
    if (!key) return;
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Basic client-side sorting if needed (usually handled by backend via API)
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[11px] font-semibold">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={cn(
                    'px-4 py-3 first:pl-6 last:pr-6',
                    col.sortable && 'cursor-pointer hover:bg-gray-100 transition-colors',
                    col.className
                  )}
                  onClick={() => col.sortable && handleSort(col.accessorKey)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && (
                      <span className="text-gray-400">
                        {sortConfig.key === col.accessorKey ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowUp className="w-3 h-3 text-primary-600" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-primary-600" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin" />
                    <span className="text-sm">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                  No data available.
                </td>
              </tr>
            ) : (
              sortedData.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'transition-colors',
                    onRowClick ? 'cursor-pointer hover:bg-gray-50/80' : 'hover:bg-gray-50/50'
                  )}
                >
                  {columns.map((col, idx) => (
                    <td key={idx} className={cn('px-4 py-3.5 first:pl-6 last:pr-6', col.className)}>
                      {col.cell ? col.cell(row) : col.accessorKey ? (row[col.accessorKey] as React.ReactNode) : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && pagination.total > 0 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50/50">
          <p className="text-xs text-gray-500 font-medium">
            Showing{' '}
            <span className="font-semibold text-gray-700">
              {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-gray-700">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of <span className="font-semibold text-gray-700">{pagination.total}</span> entries
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.page === 1}
              className="p-1 rounded text-gray-500 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-1 rounded text-gray-500 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-xs font-semibold text-gray-700">
              Page {pagination.page}
            </span>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page * pagination.limit >= pagination.total}
              className="p-1 rounded text-gray-500 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => pagination.onPageChange(Math.ceil(pagination.total / pagination.limit))}
              disabled={pagination.page * pagination.limit >= pagination.total}
              className="p-1 rounded text-gray-500 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
