
import React from 'react';
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
  currency: string;
  month: string;
};

const BudgetProgressCard: React.FC<BudgetProgressCardProps> = ({
  categories,
  currency = '$',
  month,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Monthly Budget</CardTitle>
        <CardDescription>Your budget progress for {month}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {categories.map((category) => {
            const percentage = Math.min(Math.round((category.spent / category.budgeted) * 100), 100);
            const isOverBudget = category.spent > category.budgeted;

            return (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <span className={isOverBudget ? 'text-red-600 font-medium' : 'text-gray-700'}>
                      {currency}{category.spent.toFixed(2)}
                    </span>
                    <span className="text-gray-500"> / {currency}{category.budgeted.toFixed(2)}</span>
                  </div>
                </div>
                <Progress 
                  value={percentage} 
                  className={`h-2 ${isOverBudget ? 'bg-red-200' : 'bg-gray-200'}`}
                  indicatorClassName={isOverBudget ? 'bg-red-600' : 'bg-primary'}
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
