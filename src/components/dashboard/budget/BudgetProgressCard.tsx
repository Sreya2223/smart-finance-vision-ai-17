
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type BudgetCategory = {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  icon?: React.ReactNode;
};

type BudgetProgressCardProps = {
  categories: BudgetCategory[];
  currency?: string;
  month: string;
};

const BudgetProgressCard: React.FC<BudgetProgressCardProps> = ({
  categories,
  currency: propCurrency,
  month,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    return propCurrency || localStorage.getItem('selectedCurrency') || '₹';
  });
  
  useEffect(() => {
    // Update currency when localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedCurrency') {
        setSelectedCurrency(e.newValue || '₹');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // If prop currency changes, update the state
    if (propCurrency) {
      setSelectedCurrency(propCurrency);
    }
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [propCurrency]);

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-white to-slate-50 border-slate-200">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-slate-50 rounded-t-lg">
        <CardTitle className="text-lg text-slate-800">Monthly Budget</CardTitle>
        <CardDescription className="text-slate-600">Your budget progress for {month}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-5">
          {categories.map((category) => {
            const percentage = Math.min(Math.round((category.spent / category.budgeted) * 100), 100);
            const isOverBudget = category.spent > category.budgeted;

            return (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <span className="font-medium text-slate-700">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <span className={isOverBudget ? 'text-red-600 font-medium' : 'text-slate-700'}>
                      {selectedCurrency}{category.spent.toFixed(2)}
                    </span>
                    <span className="text-slate-500"> / {selectedCurrency}{category.budgeted.toFixed(2)}</span>
                  </div>
                </div>
                <Progress 
                  value={percentage} 
                  className={`h-2 ${isOverBudget ? 'bg-red-200' : 'bg-slate-200'}`}
                  indicatorClassName={isOverBudget ? 'bg-red-500' : 'bg-indigo-600'}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetProgressCard;
