
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

export interface TaxCalculation {
  id: string;
  user_id: string;
  regime: string;
  income: number;
  tax: number;
  effective_rate: number;
  in_hand: number;
  taxable_income: number;
  created_at?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  icon: string | null;
  created_at?: string;
  user_id?: string;
}
