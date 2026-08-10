import { cn } from '@/lib/utils';
import { capitalize, getStatusColor } from '@/utils/format';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(getStatusColor(status), className)}>
      {capitalize(status.replace(/_/g, ' '))}
    </span>
  );
}
