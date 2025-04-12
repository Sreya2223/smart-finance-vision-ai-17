
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserTransactions, Transaction, addTransaction } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TransactionContextType {
  transactions: Transaction[];
  isLoading: boolean;
  error: Error | null;
  refreshTransactions: () => Promise<void>;
  addNewTransaction: (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const {
    data: transactions = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['allTransactions'],
    queryFn: async () => {
      try {
        return await getUserTransactions();
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

  // Calculate totals whenever transactions change
  useEffect(() => {
    let incomeTotal = 0;
    let expenseTotal = 0;
    
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        incomeTotal += parseFloat(String(transaction.amount));
      } else {
        expenseTotal += parseFloat(String(transaction.amount));
      }
    });
    
    setTotalIncome(incomeTotal);
    setTotalExpenses(expenseTotal);
    setTotalBalance(incomeTotal - expenseTotal);
  }, [transactions]);

  // Set up real-time subscription to transaction changes
  useEffect(() => {
    const channel = supabase
      .channel('db-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'transactions' }, 
        () => {
          // Refetch transactions when any changes are detected
          refreshTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const refreshTransactions = async () => {
    await refetch();
    queryClient.invalidateQueries({ queryKey: ['allTransactions'] });
    queryClient.invalidateQueries({ queryKey: ['budgetData'] });
  };

  const addNewTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
    try {
      await addTransaction(transaction);
      toast({
        title: "Transaction added",
        description: `${transaction.title} has been added successfully.`,
      });
      await refreshTransactions();
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error adding transaction",
        description: error.message || 'Failed to add transaction',
        variant: "destructive",
      });
    }
  };

  return (
    <TransactionContext.Provider value={{
      transactions,
      isLoading,
      error: error as Error | null,
      refreshTransactions,
      addNewTransaction,
      totalIncome,
      totalExpenses,
      totalBalance
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
