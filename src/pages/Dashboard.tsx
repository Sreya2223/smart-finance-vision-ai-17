import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/cards/StatsCard';
import ChartCard from '@/components/dashboard/charts/ChartCard';
import TransactionList from '@/components/dashboard/transactions/TransactionList';
import AddTransactionForm from '@/components/dashboard/transactions/AddTransactionForm';
import BudgetProgressCard from '@/components/dashboard/budget/BudgetProgressCard';
import TaxSummaryCard from '@/components/dashboard/cards/TaxSummaryCard';
import { IndianRupee, CreditCard, Utensils, ShoppingBag, Home, Train, Gift, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { getUserTransactions, getTaxCalculation } from '@/integrations/supabase/client';
import { Transaction } from '@/types/transaction';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { downloadAsJson, transactionsToCSV, downloadAsCSV, generateFinancialSummary } from '@/utils/exportUtils';

const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [incomeData, setIncomeData] = useState<any[]>([]);
  const [balanceData, setBalanceData] = useState<any[]>([]);
  const [expenseByCategory, setExpenseByCategory] = useState<any[]>([]);
  
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    localStorage.setItem('selectedCurrency', '₹');
    return '₹';
  });

  useEffect(() => {
    localStorage.setItem('selectedCurrency', '₹');
    setSelectedCurrency('₹');
    
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
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getUserTransactions();
        setRecentTransactions(data);
        
        let incomeTotal = 0;
        let expenseTotal = 0;
        
        data.forEach(transaction => {
          if (transaction.type === 'income') {
            incomeTotal += parseFloat(String(transaction.amount));
          } else {
            expenseTotal += parseFloat(String(transaction.amount));
          }
        });
        
        setTotalIncome(incomeTotal);
        setTotalExpenses(expenseTotal);
        setTotalBalance(incomeTotal - expenseTotal);
        
        processChartData(data);
      } catch (error: any) {
        console.error('Error fetching transactions:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load transactions",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  const { data: taxData, isLoading: taxLoading } = useQuery({
    queryKey: ['taxCalculation'],
    queryFn: async () => {
      try {
        return await getTaxCalculation();
      } catch (error) {
        console.error('Error fetching tax calculation:', error);
        return null;
      }
    }
  });
  
  const processChartData = (transactions: Transaction[]) => {
    if (!transactions.length) return;
    
    const months: Record<string, {income: number, expense: number}> = {};
    const categoryTotals: Record<string, number> = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      
      if (!months[monthYear]) {
        months[monthYear] = { income: 0, expense: 0 };
      }
      
      const amount = parseFloat(String(transaction.amount));
      
      if (transaction.type === 'income') {
        months[monthYear].income += amount;
      } else {
        months[monthYear].expense += amount;
        
        if (!categoryTotals[transaction.category]) {
          categoryTotals[transaction.category] = 0;
        }
        categoryTotals[transaction.category] += amount;
      }
    });
    
    const expenseChartData = [];
    const incomeChartData = [];
    const balanceChartData = [];
    
    for (const [month, data] of Object.entries(months)) {
      expenseChartData.push({ name: month, expense: data.expense });
      incomeChartData.push({ name: month, income: data.income });
      balanceChartData.push({ name: month, balance: data.income - data.expense });
    }
    
    setExpenseData(expenseChartData);
    setIncomeData(incomeChartData);
    setBalanceData(balanceChartData);
    
    const colors = ['#F8C942', '#4A9F7E', '#E76F51', '#2A9D8F', '#F4A261', '#264653'];
    const categoryData = Object.entries(categoryTotals).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
    
    setExpenseByCategory(categoryData);
  };
  
  const exportDashboardData = () => {
    if (recentTransactions.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no transactions available to export.",
        variant: "destructive",
      });
      return;
    }
    
    const dashboardData = {
      summary: {
        totalIncome,
        totalExpenses,
        totalBalance,
      },
      transactions: recentTransactions,
      expenseByCategory: expenseByCategory,
      taxData: taxData || {},
    };
    
    downloadAsJson(dashboardData, `financial_dashboard_data_${new Date().toISOString().split('T')[0]}.json`);
    
    toast({
      title: "Export successful",
      description: "Your dashboard data has been exported as JSON.",
    });
  };
  
  const emailDashboardData = () => {
    toast({
      title: "Email feature",
      description: "Your financial data will be emailed to your registered email address shortly.",
    });
    
    setTimeout(() => {
      toast({
        title: "Email sent",
        description: "Your financial data has been sent to your email.",
      });
    }, 2000);
  };
  
  const combinedChartData = expenseData.map((item, index) => ({
    name: item.name,
    expense: item.expense,
    income: incomeData[index]?.income || 0
  }));

  const handleAddTransaction = async (transaction: Transaction) => {
    try {
      setRecentTransactions(prev => [transaction, ...prev]);
      
      const data = await getUserTransactions();
      setRecentTransactions(data);
      processChartData(data);
      
      let incomeTotal = 0;
      let expenseTotal = 0;
      
      data.forEach(t => {
        if (t.type === 'income') {
          incomeTotal += parseFloat(String(t.amount));
        } else {
          expenseTotal += parseFloat(String(t.amount));
        }
      });
      
      setTotalIncome(incomeTotal);
      setTotalExpenses(expenseTotal);
      setTotalBalance(incomeTotal - expenseTotal);
      
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };
  
  const budgetCategories = [
    {
      id: '1',
      name: 'Food & Dining',
      budgeted: 6000,
      spent: 4800,
      icon: <Utensils className="h-4 w-4 text-indigo-600" />,
    },
    {
      id: '2',
      name: 'Shopping',
      budgeted: 4000,
      spent: 3200,
      icon: <ShoppingBag className="h-4 w-4 text-indigo-600" />,
    },
    {
      id: '3',
      name: 'Housing',
      budgeted: 12000,
      spent: 12000,
      icon: <Home className="h-4 w-4 text-indigo-600" />,
    },
    {
      id: '4',
      name: 'Transportation',
      budgeted: 3000,
      spent: 3400,
      icon: <Train className="h-4 w-4 text-indigo-600" />,
    },
    {
      id: '5',
      name: 'Entertainment',
      budgeted: 2000,
      spent: 1800,
      icon: <Gift className="h-4 w-4 text-indigo-600" />,
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-700">Loading your financial data...</h2>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's an overview of your finances</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatsCard
          title="Total Balance"
          value={`${selectedCurrency}${totalBalance.toFixed(2)}`}
          icon={<IndianRupee className="h-5 w-5 text-indigo-600" />}
          iconBg="bg-indigo-100"
        />
        <StatsCard
          title="Total Income"
          value={`${selectedCurrency}${totalIncome.toFixed(2)}`}
          change={8}
          icon={<IndianRupee className="h-5 w-5 text-green-600" />}
          iconBg="bg-green-100"
          variant="income"
        />
        <StatsCard
          title="Total Expenses"
          value={`${selectedCurrency}${totalExpenses.toFixed(2)}`}
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
          {combinedChartData.length > 0 ? (
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
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No data available to display</p>
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Expense Categories"
          description="Where your money is going this month"
        >
          {expenseByCategory.length > 0 ? (
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
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No expense data available to display</p>
            </div>
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TransactionList 
            transactions={recentTransactions.slice(0, 5)}
            currency={selectedCurrency} 
            onAddTransaction={() => setIsAddingTransaction(true)}
          />
        </div>
        <div className="space-y-6">
          <TaxSummaryCard 
            taxData={taxData ? {
              regime: taxData.regime,
              income: taxData.income,
              tax: taxData.tax,
              inHand: taxData.in_hand
            } : undefined}
            currency={selectedCurrency}
            isLoading={taxLoading}
          />
          <BudgetProgressCard 
            categories={budgetCategories} 
            currency={selectedCurrency} 
            month="April 2025" 
          />
        </div>
      </div>
      
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
