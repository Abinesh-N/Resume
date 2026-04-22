'use client';

import { Card } from '@/components/ui/card';
import { Clock, FileText, Palette } from 'lucide-react';

const icons = {
  'file-text': FileText,
  clock: Clock,
  palette: Palette,
} as const;

type StatsCardIcon = keyof typeof icons;

interface StatsCardProps {
  icon: StatsCardIcon;
  title: string;
  value: string | number;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'info';
}

const variantStyles = {
  default: 'from-blue-50 to-slate-50 dark:from-slate-900 dark:to-slate-800',
  success: 'from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800',
  warning: 'from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800',
  info: 'from-purple-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800',
};

const iconStyles = {
  default: 'text-blue-600 bg-blue-100 dark:bg-blue-900',
  success: 'text-green-600 bg-green-100 dark:bg-green-900',
  warning: 'text-amber-600 bg-amber-100 dark:bg-amber-900',
  info: 'text-purple-600 bg-purple-100 dark:bg-purple-900',
};

export function StatsCard({
  icon,
  title,
  value,
  description,
  variant = 'default',
}: StatsCardProps) {
  const Icon = icons[icon];

  return (
    <Card
      className={`p-6 bg-gradient-to-br ${variantStyles[variant]} border-slate-200 dark:border-slate-700`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
            {value}
          </p>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              {description}
            </p>
          )}
        </div>
        <div className={`${iconStyles[variant]} p-3 rounded-lg`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}
