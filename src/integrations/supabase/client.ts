
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jmxhubxganertfjcifyf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpteGh1YnhnYW5lcnRmamNpZnlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMDczNDYsImV4cCI6MjA1OTg4MzM0Nn0.0fkP7wBnt883bGmRxCmrXs8nM4vK1iZoVrcg6lvqTnM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define Transaction type
export interface Transaction {
  id: string;
  title: string;
  amount: number | string;
  category: string;
  date: string;
  type: 'income' | 'expense';
  payment_method?: string;
  user_id?: string;
  created_at?: string;
}

// Function to get user transactions
export const getUserTransactions = async (): Promise<Transaction[]> => {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
  
  return data || [];
};

// Function to add a transaction
export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      ...transaction,
      user_id: userData.user.id,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
  
  return data as Transaction;
};

// Function to get tax calculation
export const getTaxCalculation = async () => {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('tax_calculations')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching tax calculation:', error);
    throw error;
  }
  
  return data;
};

// Function to save tax calculation
export const saveTaxCalculation = async (taxData: {
  regime: string;
  income: number;
  tax: number;
  effective_rate: number;
  in_hand: number;
  taxable_income: number;
}) => {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('tax_calculations')
    .insert({
      ...taxData,
      user_id: userData.user.id,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error saving tax calculation:', error);
    throw error;
  }
  
  return data;
};
