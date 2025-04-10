
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jmxhubxganertfjcifyf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpteGh1YnhnYW5lcnRmamNpZnlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMDczNDYsImV4cCI6MjA1OTg4MzM0Nn0.0fkP7wBnt883bGmRxCmrXs8nM4vK1iZoVrcg6lvqTnM";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Transaction related functions
export type Transaction = {
  id: string;
  user_id?: string;
  type: 'income' | 'expense';
  title: string;
  amount: number;
  category: string;
  date: string;
  payment_method?: string;
  receipt_url?: string;
  created_at?: string;
};

// Get transactions for the current user
export const getUserTransactions = async () => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });
    
  if (error) throw error;
  return data as Transaction[];
};

// Add a new transaction
export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      ...transaction,
      user_id: user.user.id,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data as Transaction;
};

// Update an existing transaction
export const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
  const { data, error } = await supabase
    .from('transactions')
    .update(transaction)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Transaction;
};

// Delete a transaction
export const deleteTransaction = async (id: string) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};
