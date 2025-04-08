import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/cards/StatsCard';
import ChartCard from '@/components/dashboard/charts/ChartCard';
import TransactionList from '@/components/dashboard/transactions/TransactionList';
import BudgetProgressCard from '@/components/dashboard/budget/BudgetProgressCard';
import { Wallet, CreditCard, DollarSign, Utensils, ShoppingBag, Home, Train, Gift } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Dashboard: React.FC = () => {
  // Mock data for testing
  const [currency, setCurrency] = useState('$');
  
  const expenseData = [
    { month: 'Jan', amount: 1200 },
    { month: 'Feb', amount: 1900 },
    { month: 'Mar', amount: 1500 },
    { month: 'Apr', amount: 1800 },
    { month: 'May', amount: 1300 },
    { month: 'Jun', amount: 1700 },
  ];
  
  const incomeData = [
    { month: 'Jan', amount: 2500 },
    { month: 'Feb', amount: 2500 },
    { month: 'Mar', amount: 2700 },
    { month: 'Apr', amount: 2600 },
    { month: 'May', amount: 2800 },
    { month: 'Jun', amount: 3000 },
  ];
  
  const balanceData = incomeData.map((item, index) => ({
    month: item.month,
    amount: item.amount - expenseData[index].amount
  }));
  
  const expenseByCategory = [
    { name: 'Food', value: 400, color: '#F8C942' },
    { name: 'Housing', value: 700, color: '#4A9F7E' },
    { name: 'Transport', value: 200, color: '#E76F51' },
    { name: 'Entertainment', value: 150, color: '#2A9D8F' },
    { name: 'Shopping', value: 250, color: '#F4A261' },
    { name: 'Others', value: 100, color: '#264653' },
  ];
  
  const recentTransactions = [
    {
      id: '1',
      type: 'expense' as const,
      title: 'Grocery Shopping',
      category: 'Food & Drinks',
      amount: 78.95,
      date: '2025-04-08',
    },
    {
      id: '2',
      type: 'income' as const,
      title: 'Salary Deposit',
      category: 'Salary',
      amount: 3000.00,
      date: '2025-04-05',
    },
    {
      id: '3',
      type: 'expense' as const,
      title: 'Netflix Subscription',
      category: 'Entertainment',
      amount: 15.99,
      date: '2025-04-03',
    },
    {
      id: '4',
      type: 'expense' as const,
      title: 'Uber Ride',
      category: 'Transportation',
      amount: 24.50,
      date: '2025-04-02',
    },
    {
      id: '5',
      type: 'income' as const,
      title: 'Freelance Payment',
      category: 'Freelance',
      amount: 350.00,
      date: '2025-04-01',
    },
  ];
  
  const budgetCategories = [
    {
      id: '1',
      name: 'Food & Dining',
      budgeted: 600,
      spent: 480,
      icon: <Utensils className="h-4 w-4 text-primary" />,
    },
    {
      id: '2',
      name: 'Shopping',
      budgeted: 400,
      spent: 320,
      icon: <ShoppingBag className="h-4 w-4 text-primary" />,
    },
    {
      id: '3',
      name: 'Housing',
      budgeted: 1200,
      spent: 1200,
      icon: <Home className="h-4 w-4 text-primary" />,
    },
    {
      id: '4',
      name: 'Transportation',
      budgeted: 300,
      spent: 340,
      icon: <Train className="h-4 w-4 text-primary" />,
    },
    {
      id: '5',
      name: 'Entertainment',
      budgeted: 200,
      spent: 180,
      icon: <Gift className="h-4 w-4 text-primary" />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your finances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatsCard
          title="Total Balance"
          value={`${currency}7,815.00`}
          icon={<DollarSign className="h-5 w-5 text-primary" />}
          iconBg="bg-primary/10"
        />
        <StatsCard
          title="Total Income"
          value={`${currency}12,500.00`}
          change={8}
          icon={<Wallet className="h-5 w-5 text-green-600" />}
          iconBg="bg-green-100"
          variant="income"
        />
        <StatsCard
          title="Total Expenses"
          value={`${currency}4,685.00`}
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
              data={[...expenseData.map(item => ({
                month: item.month,
                expense: item.amount,
                income: incomeData.find(inc => inc.month === item.month)?.amount || 0
              }))]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${currency}${value}`, 'Amount']}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }}
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
                formatter={(value) => [`${currency}${value}`, 'Amount']}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionList transactions={recentTransactions} currency={currency} />
        <BudgetProgressCard categories={budgetCategories} currency={currency} month="April 2025" />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
