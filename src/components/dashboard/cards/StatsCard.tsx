
import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatsCardProps = {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  iconBg?: string;
  variant?: 'default' | 'income' | 'expense';
  className?: string;
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  iconBg = 'bg-indigo-600/10',
  variant = 'default',
  className
}) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  const variantStyles = {
    default: 'bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-md',
    income: 'bg-gradient-to-br from-white to-green-50 border-green-200 shadow-md',
    expense: 'bg-gradient-to-br from-white to-red-50 border-red-200 shadow-md',
  };

  return (
    <div className={cn(
      'rounded-xl border p-6 flex flex-col transition-all duration-200 hover:shadow-lg', 
      variantStyles[variant],
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        <div className={cn("p-2 rounded-full", iconBg)}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-800 mb-2">{value}</div>
      {typeof change !== 'undefined' && (
        <div className="flex items-center">
          {isPositive ? (
            <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
          ) : isNegative ? (
            <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
          ) : null}
          <span
            className={cn(
              "text-sm",
              isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-slate-500"
            )}
          >
            {Math.abs(change)}% from last month
          </span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
