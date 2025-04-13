
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { useTransactions } from '@/contexts/TransactionContext';
import { FileDown, BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  Legend 
} from 'recharts';

const Reports: React.FC = () => {
  const { toast } = useToast();
  const { transactions } = useTransactions();
  const [timeRange, setTimeRange] = useState('last6Months');
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('selectedCurrency') || '₹';
  });
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [savingsData, setSavingsData] = useState<any[]>([]);
  
  // Update currency when it changes in localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedCurrency') {
        setCurrency(e.newValue || '₹');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Generate chart data from transactions
  useEffect(() => {
    if (!transactions || transactions.length === 0) return;

    // Filter transactions based on selected time range
    const now = new Date();
    const filtered = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const diffMonths = (now.getFullYear() - transactionDate.getFullYear()) * 12 + 
                         (now.getMonth() - transactionDate.getMonth());
      
      switch(timeRange) {
        case 'lastMonth': return diffMonths <= 1;
        case 'last3Months': return diffMonths <= 3;
        case 'last6Months': return diffMonths <= 6;
        case 'thisYear': return transactionDate.getFullYear() === now.getFullYear();
        case 'lastYear': return transactionDate.getFullYear() === now.getFullYear() - 1;
        default: return true;
      }
    });

    // Group by month for monthly data
    const monthMap = new Map();
    filtered.forEach(t => {
      const date = new Date(t.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })}${date.getFullYear() !== now.getFullYear() ? ' ' + date.getFullYear().toString().slice(-2) : ''}`;
      
      if (!monthMap.has(monthYear)) {
        monthMap.set(monthYear, { month: monthYear, income: 0, expenses: 0, savings: 0 });
      }
      
      const entry = monthMap.get(monthYear);
      const amount = parseFloat(String(t.amount));
      
      if (t.type === 'income') {
        entry.income += amount;
      } else {
        entry.expenses += amount;
      }
      
      entry.savings = entry.income - entry.expenses;
    });
    
    // Convert to array and sort by date
    const sortedMonthly = Array.from(monthMap.values()).sort((a, b) => {
      return new Date(a.month + ' 1, 2023').getTime() - new Date(b.month + ' 1, 2023').getTime();
    });
    setMonthlyData(sortedMonthly);
    
    // Calculate savings data
    setSavingsData(sortedMonthly.map(item => ({ month: item.month, amount: item.savings })));

    // Group by category for pie chart
    const expensesByCategory = new Map();
    filtered.filter(t => t.type === 'expense').forEach(t => {
      if (!expensesByCategory.has(t.category)) {
        expensesByCategory.set(t.category, { name: t.category, value: 0 });
      }
      expensesByCategory.get(t.category).value += parseFloat(String(t.amount));
    });
    
    // Assign colors to categories
    const colors = ['#F8C942', '#4A9F7E', '#E76F51', '#2A9D8F', '#F4A261', '#264653', '#9b87f5', '#023047', '#FB8500', '#6D6875'];
    const categoriesWithColors = Array.from(expensesByCategory.values()).map((category, index) => ({
      ...category,
      color: colors[index % colors.length]
    }));
    
    setCategoryData(categoriesWithColors);
  }, [transactions, timeRange]);

  const exportReports = () => {
    const csvContent = [
      // Header row
      ['Month', 'Income', 'Expenses', 'Savings'].join(','),
      // Data rows
      ...monthlyData.map(item => 
        [item.month, item.income, item.expenses, item.savings].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `financial-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Reports exported",
      description: "Your financial reports have been downloaded successfully.",
    });
  };
  
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-600">Analyze your spending patterns and financial trends</p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="last3Months">Last 3 Months</SelectItem>
              <SelectItem value="last6Months">Last 6 Months</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
              <SelectItem value="lastYear">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={exportReports}>
            <FileDown className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChartIcon className="h-5 w-5 text-primary" />
                <span>Income vs Expenses</span>
              </CardTitle>
              <CardDescription>Monthly comparison over time</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${currency}${value}`, '']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#4A9F7E" />
                <Bar dataKey="expenses" name="Expenses" fill="#F97066" />
                <Bar dataKey="savings" name="Savings" fill="#9b87f5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-primary" />
                <span>Expense Breakdown</span>
              </CardTitle>
              <CardDescription>Spending by category</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${currency}${value}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="h-5 w-5 text-primary" />
                <span>Savings Trend</span>
              </CardTitle>
              <CardDescription>Monthly savings over time</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={savingsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${currency}${value}`, 'Savings']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  name="Savings"
                  stroke="#9b87f5" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="h-5 w-5 text-primary" />
                <span>Income vs Expense Trends</span>
              </CardTitle>
              <CardDescription>Monthly trends over time</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${currency}${value}`, '']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  name="Income"
                  stroke="#4A9F7E" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  name="Expense"
                  stroke="#F97066" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
