
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
  iconBg = 'bg-primary/10',
  variant = 'default',
  className
}) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  const variantStyles = {
    default: 'bg-white border-gray-200',
    income: 'bg-green-50 border-green-200',
    expense: 'bg-red-50 border-red-200',
  };

  return (
    <div className={cn(
      'rounded-lg border p-6 flex flex-col', 
      variantStyles[variant],
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className={cn("p-2 rounded-full", iconBg)}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-2">{value}</div>
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
              isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-gray-500"
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
