
import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Transaction = {
  id: string;
  type: 'income' | 'expense';
  title: string;
  category: string;
  amount: number;
  date: string;
};

type TransactionListProps = {
  transactions: Transaction[];
  currency?: string;
  onAddTransaction?: () => void;
};

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  currency: propCurrency,
  onAddTransaction 
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    return propCurrency || localStorage.getItem('selectedCurrency') || '$';
  });
  
  useEffect(() => {
    // Update currency when localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedCurrency') {
        setSelectedCurrency(e.newValue || '$');
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
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <CardDescription>Your latest financial activities</CardDescription>
        </div>
        <div className="flex gap-2">
          {onAddTransaction && (
            <Button variant="outline" size="sm" className="gap-1" onClick={onAddTransaction}>
              <span>Add</span>
            </Button>
          )}
          <Button variant="ghost" size="sm" className="gap-1">
            <span>View all</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{transaction.title}</h4>
                    <p className="text-sm text-gray-500">{transaction.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{selectedCurrency}{transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              No transactions to display
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionList;
