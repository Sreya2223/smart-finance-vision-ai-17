
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase, getUserTransactions, addTransaction } from '@/integrations/supabase/client';
import { Transaction } from '@/types/transaction';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
      
      if (event === 'SIGNED_IN') {
        queryClient.invalidateQueries({ queryKey: ['allTransactions'] });
      }
    });

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);
  
  const {
    data: transactions = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['allTransactions'],
    queryFn: async () => {
      if (!isAuthenticated) {
        return []; // Return empty array when not authenticated
      }
      
      try {
        return await getUserTransactions();
      } catch (err: any) {
        if (err.message === 'User not authenticated') {
          // This is expected when not logged in
          return [];
        }
        console.error('Error fetching transactions:', err);
        throw err;
      }
    },
    enabled: isAuthenticated // Only run query when authenticated
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
    if (!isAuthenticated) return;
    
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
  }, [isAuthenticated]);

  const refreshTransactions = async () => {
    await refetch();
    queryClient.invalidateQueries({ queryKey: ['allTransactions'] });
    queryClient.invalidateQueries({ queryKey: ['budgetData'] });
  };

  const addNewTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to add transactions.",
        variant: "destructive",
      });
      throw new Error("User not authenticated");
    }
    
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
      throw error;
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
