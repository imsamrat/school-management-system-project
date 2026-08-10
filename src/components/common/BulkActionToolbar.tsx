import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BulkActionToolbarProps {
  onMarkAllPresent: () => void;
  onMarkAllAbsent: () => void;
  className?: string;
  disabled?: boolean;
}

export function BulkActionToolbar({ onMarkAllPresent, onMarkAllAbsent, className, disabled }: BulkActionToolbarProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm text-gray-500 font-medium mr-2">Bulk Actions:</span>
      <button
        type="button"
        disabled={disabled}
        onClick={onMarkAllPresent}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CheckCircle className="w-4 h-4" />
        Mark All Present
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={onMarkAllAbsent}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <XCircle className="w-4 h-4" />
        Mark All Absent
      </button>
    </div>
  );
}
