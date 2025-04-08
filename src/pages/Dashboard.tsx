
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/cards/StatsCard';
import ChartCard from '@/components/dashboard/charts/ChartCard';
import TransactionList from '@/components/dashboard/transactions/TransactionList';
import AddTransactionForm from '@/components/dashboard/transactions/AddTransactionForm';
import BudgetProgressCard from '@/components/dashboard/budget/BudgetProgressCard';
import { Wallet, CreditCard, DollarSign, Utensils, ShoppingBag, Home, Train, Gift } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

type Transaction = {
  id: string;
  type: 'income' | 'expense';
  title: string;
  category: string;
  amount: number;
  date: string;
};

const Dashboard: React.FC = () => {
  // Get the currency from DashboardHeader or localStorage
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    return localStorage.getItem('selectedCurrency') || '₹';
  });
  
  useEffect(() => {
    // Set default currency to INR if not present
    if (!localStorage.getItem('selectedCurrency')) {
      localStorage.setItem('selectedCurrency', '₹');
      setSelectedCurrency('₹');
    }
    
    // Listen for currency changes from the header
    const handleCurrencyChange = (e: StorageEvent) => {
      if (e.key === 'selectedCurrency') {
        setSelectedCurrency(e.newValue || '₹');
      }
    };
    
    window.addEventListener('storage', handleCurrencyChange);
    
    return () => {
      window.removeEventListener('storage', handleCurrencyChange);
    };
  }, []);
  
  // Mock data for testing
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  
  const expenseData = [
    { name: 'Jan', expense: 1200 },
    { name: 'Feb', expense: 1900 },
    { name: 'Mar', expense: 1500 },
    { name: 'Apr', expense: 1800 },
    { name: 'May', expense: 1300 },
    { name: 'Jun', expense: 1700 },
  ];
  
  const incomeData = [
    { name: 'Jan', income: 2500 },
    { name: 'Feb', income: 2500 },
    { name: 'Mar', income: 2700 },
    { name: 'Apr', income: 2600 },
    { name: 'May', income: 2800 },
    { name: 'Jun', income: 3000 },
  ];
  
  const balanceData = incomeData.map((item, index) => ({
    name: item.name,
    balance: item.income - expenseData[index].expense
  }));
  
  const expenseByCategory = [
    { name: 'Food', value: 400, color: '#F8C942' },
    { name: 'Housing', value: 700, color: '#4A9F7E' },
    { name: 'Transport', value: 200, color: '#E76F51' },
    { name: 'Entertainment', value: 150, color: '#2A9D8F' },
    { name: 'Shopping', value: 250, color: '#F4A261' },
    { name: 'Others', value: 100, color: '#264653' },
  ];

  // Combine income and expense data
  const combinedChartData = expenseData.map((item, index) => ({
    name: item.name,
    expense: item.expense,
    income: incomeData[index].income
  }));
  
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'expense',
      title: 'Grocery Shopping',
      category: 'Food & Drinks',
      amount: 78.95,
      date: '2025-04-08',
    },
    {
      id: '2',
      type: 'income',
      title: 'Salary Deposit',
      category: 'Salary',
      amount: 3000.00,
      date: '2025-04-05',
    },
    {
      id: '3',
      type: 'expense',
      title: 'Netflix Subscription',
      category: 'Entertainment',
      amount: 15.99,
      date: '2025-04-03',
    },
    {
      id: '4',
      type: 'expense',
      title: 'Uber Ride',
      category: 'Transportation',
      amount: 24.50,
      date: '2025-04-02',
    },
    {
      id: '5',
      type: 'income',
      title: 'Freelance Payment',
      category: 'Freelance',
      amount: 350.00,
      date: '2025-04-01',
    },
  ]);
  
  const handleAddTransaction = (newTransaction: Transaction) => {
    setRecentTransactions(prev => [newTransaction, ...prev]);
  };
  
  const budgetCategories = [
    {
      id: '1',
      name: 'Food & Dining',
      budgeted: 600,
      spent: 480,
      icon: <Utensils className="h-4 w-4 text-indigo-600" />,
    },
    {
      id: '2',
      name: 'Shopping',
      budgeted: 400,
      spent: 320,
      icon: <ShoppingBag className="h-4 w-4 text-indigo-600" />,
    },
    {
      id: '3',
      name: 'Housing',
      budgeted: 1200,
      spent: 1200,
      icon: <Home className="h-4 w-4 text-indigo-600" />,
    },
    {
      id: '4',
      name: 'Transportation',
      budgeted: 300,
      spent: 340,
      icon: <Train className="h-4 w-4 text-indigo-600" />,
    },
    {
      id: '5',
      name: 'Entertainment',
      budgeted: 200,
      spent: 180,
      icon: <Gift className="h-4 w-4 text-indigo-600" />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's an overview of your finances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatsCard
          title="Total Balance"
          value={`${selectedCurrency}7,815.00`}
          icon={<DollarSign className="h-5 w-5 text-indigo-600" />}
          iconBg="bg-indigo-100"
        />
        <StatsCard
          title="Total Income"
          value={`${selectedCurrency}12,500.00`}
          change={8}
          icon={<Wallet className="h-5 w-5 text-green-600" />}
          iconBg="bg-green-100"
          variant="income"
        />
        <StatsCard
          title="Total Expenses"
          value={`${selectedCurrency}4,685.00`}
          change={-2}
          icon={<CreditCard className="h-5 w-5 text-red-600" />}
          iconBg="bg-red-100"
          variant="expense"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard
          title="Income vs Expenses"
          description="Monthly comparison of your financial activity"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={combinedChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${selectedCurrency}${value}`, 'Amount']}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="expense" name="Expenses" fill="#F97066" />
              <Bar dataKey="income" name="Income" fill="#4A9F7E" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Expense Categories"
          description="Where your money is going this month"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseByCategory}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {expenseByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${selectedCurrency}${value}`, 'Amount']}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionList 
          transactions={recentTransactions.slice(0, 5)} 
          currency={selectedCurrency} 
          onAddTransaction={() => setIsAddingTransaction(true)}
        />
        <BudgetProgressCard categories={budgetCategories} currency={selectedCurrency} month="April 2025" />
      </div>
      
      {/* Transaction input dialog */}
      <AddTransactionForm 
        isOpen={isAddingTransaction}
        onClose={() => setIsAddingTransaction(false)}
        onAddTransaction={handleAddTransaction}
        currency={selectedCurrency}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
