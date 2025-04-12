
import { createClient } from '@supabase/supabase-js';
import { Transaction, TaxCalculation } from '@/types/transaction';

const supabaseUrl = 'https://jmxhubxganertfjcifyf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpteGh1YnhnYW5lcnRmamNpZnlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMDczNDYsImV4cCI6MjA1OTg4MzM0Nn0.0fkP7wBnt883bGmRxCmrXs8nM4vK1iZoVrcg6lvqTnM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

// Interface for BudgetCategory
export interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  icon: string | null;
  created_at?: string;
  user_id?: string;
}

// Function to get user budget categories
export const getUserBudgetCategories = async (): Promise<BudgetCategory[]> => {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('budget_categories')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching budget categories:', error);
    throw error;
  }
  
  return data || [];
};

// Function to add a budget category
export const addBudgetCategory = async (category: Omit<BudgetCategory, 'id' | 'user_id' | 'created_at'>) => {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('budget_categories')
    .insert({
      ...category,
      user_id: userData.user.id,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding budget category:', error);
    throw error;
  }
  
  return data as BudgetCategory;
};

// Function to update a budget category
export const updateBudgetCategory = async (id: string, updates: Partial<Omit<BudgetCategory, 'id' | 'user_id' | 'created_at'>>) => {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('budget_categories')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userData.user.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating budget category:', error);
    throw error;
  }
  
  return data as BudgetCategory;
};

// Function to delete a budget category
export const deleteBudgetCategory = async (id: string) => {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    throw new Error('User not authenticated');
  }
  
  const { error } = await supabase
    .from('budget_categories')
    .delete()
    .eq('id', id)
    .eq('user_id', userData.user.id);
  
  if (error) {
    console.error('Error deleting budget category:', error);
    throw error;
  }
  
  return true;
};
