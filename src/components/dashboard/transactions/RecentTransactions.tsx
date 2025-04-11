
import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getUserTransactions, Transaction } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

type RecentTransactionsProps = {
  limit?: number;
};

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ limit = 5 }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    return localStorage.getItem('selectedCurrency') || '₹';
  });
  
  // Use React Query to fetch transactions
  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['recentTransactions', limit],
    queryFn: async () => {
      try {
        const data = await getUserTransactions();
        return data.slice(0, limit);
      } catch (err: any) {
        console.error('Error fetching transactions:', err);
        toast({
          title: "Error loading transactions",
          description: err.message || 'Failed to load transactions',
          variant: "destructive",
        });
        throw err;
      }
    }
  });

  // Listen for currency changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedCurrency') {
        setSelectedCurrency(e.newValue || '₹');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleViewAll = () => {
    navigate('/transactions');
  };

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-card to-background border-border dark:from-card dark:to-background/80">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-muted/50 to-background rounded-t-lg dark:from-muted/10">
        <div>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <CardDescription>Your latest financial activities</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="gap-1 text-primary hover:bg-primary/10" onClick={handleViewAll}>
          View all
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-6 text-destructive">
            {(error as Error).message || 'Failed to load transactions'}
          </div>
        ) : (
          <div className="space-y-4">
            {transactions && transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md transition-colors group dark:hover:bg-muted/20"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-full ${
                      transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                    } transition-transform group-hover:scale-110 duration-200`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <ArrowDownLeft className="h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{transaction.title}</h4>
                      <p className="text-sm text-muted-foreground">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '' : '- '}{selectedCurrency}{parseFloat(String(transaction.amount)).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No transactions to display
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
