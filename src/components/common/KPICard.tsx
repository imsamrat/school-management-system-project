import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  subtitle?: string;
  className?: string;
  children?: ReactNode;
}

export default function KPICard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-primary-600',
  iconBg = 'bg-primary-50',
  trend,
  subtitle,
  className,
  children,
}: KPICardProps) {
  return (
    <div className={cn('card', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
              )}
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.value}%
              </span>
              <span className="text-xs text-gray-400">{trend.label}</span>
            </div>
          )}
          {subtitle && (
            <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
          )}
        </div>
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', iconBg)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
      </div>
      {children}
    </div>
  );
}
