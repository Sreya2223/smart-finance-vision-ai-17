
import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Transaction } from '@/types/transaction';
import { getUserTransactions } from '@/integrations/supabase/client';

type TransactionListProps = {
  transactions?: Transaction[];
  currency?: string;
  onAddTransaction?: () => void;
  isLoading?: boolean;
};

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions: propTransactions, 
  currency: propCurrency,
  onAddTransaction,
  isLoading: propIsLoading = false
}) => {
  const { toast } = useToast();
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    return propCurrency || localStorage.getItem('selectedCurrency') || '₹';
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(propIsLoading);
  const [error, setError] = useState<string | null>(null);
  
  // Use transactions from props if provided, otherwise fetch from Supabase
  useEffect(() => {
    if (propTransactions) {
      setTransactions(propTransactions);
      return;
    }
    
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const data = await getUserTransactions();
        setTransactions(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching transactions:', err);
        setError(err.message || 'Failed to load transactions');
        toast({
          title: "Error loading transactions",
          description: err.message || 'Failed to load transactions',
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, [propTransactions, toast]);
  
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
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-indigo-50 to-slate-50 rounded-t-lg">
        <div>
          <CardTitle className="text-lg text-slate-800">Recent Transactions</CardTitle>
          <CardDescription className="text-slate-600">Your latest financial activities</CardDescription>
        </div>
        <div className="flex gap-2">
          {onAddTransaction && (
            <Button variant="outline" size="sm" className="gap-1 border-indigo-200 hover:bg-indigo-50" onClick={onAddTransaction}>
              <span>Add</span>
            </Button>
          )}
          <Button variant="ghost" size="sm" className="gap-1 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700">
            <span>View all</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-6 text-red-500">
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-md transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-full ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    } transition-transform group-hover:scale-110 duration-200`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">{transaction.title}</h4>
                      <p className="text-sm text-slate-500">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '' : '- '}{selectedCurrency}{parseFloat(String(transaction.amount)).toFixed(2)}
                    </p>
                    <p className="text-sm text-slate-500">{transaction.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-500">
                No transactions to display
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionList;
