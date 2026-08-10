import { format, parseISO, isValid, formatDistanceToNow } from 'date-fns';

export function formatDate(date: string | Date | undefined, fmt: string = 'dd MMM yyyy'): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) ? format(d, fmt) : '—';
}

export function formatDateTime(date: string | Date | undefined): string {
  return formatDate(date, 'dd MMM yyyy, hh:mm a');
}

export function formatRelative(date: string | Date | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return isValid(d) ? formatDistanceToNow(d, { addSuffix: true }) : '—';
}

export function formatCurrency(amount: number | undefined, symbol: string = '৳'): string {
  if (amount === undefined || amount === null) return `${symbol}0.00`;
  return `${symbol}${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatNumber(num: number | undefined): string {
  if (num === undefined || num === null) return '0';
  return num.toLocaleString('en-IN');
}

export function formatPercentage(value: number | undefined): string {
  if (value === undefined || value === null) return '0%';
  return `${value.toFixed(1)}%`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: 'badge-success',
    present: 'badge-success',
    paid: 'badge-success',
    approved: 'badge-success',
    completed: 'badge-success',
    inactive: 'badge-neutral',
    absent: 'badge-danger',
    overdue: 'badge-danger',
    failed: 'badge-danger',
    cancelled: 'badge-danger',
    suspended: 'badge-danger',
    terminated: 'badge-danger',
    late: 'badge-warning',
    pending: 'badge-warning',
    draft: 'badge-warning',
    upcoming: 'badge-info',
    partial: 'badge-info',
    processing: 'badge-info',
    ongoing: 'badge-info',
    leave: 'badge-neutral',
    excused: 'badge-neutral',
    graduated: 'badge-info',
    transferred: 'badge-neutral',
    withdrawn: 'badge-neutral',
    resigned: 'badge-neutral',
    retired: 'badge-neutral',
  };
  return map[status] || 'badge-neutral';
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
