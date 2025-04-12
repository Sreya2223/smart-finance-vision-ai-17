
import React, { useState } from 'react';
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
  const [timeRange, setTimeRange] = useState('last6Months');
  const [currency, setCurrency] = useState('₹');
  
  // Sample data for reports
  const monthlyData = [
    { month: 'Jan', income: 2500, expenses: 1200, savings: 1300 },
    { month: 'Feb', income: 2500, expenses: 1900, savings: 600 },
    { month: 'Mar', income: 2700, expenses: 1500, savings: 1200 },
    { month: 'Apr', income: 2600, expenses: 1800, savings: 800 },
    { month: 'May', income: 2800, expenses: 1300, savings: 1500 },
    { month: 'Jun', income: 3000, expenses: 1700, savings: 1300 },
  ];
  
  const categoryData = [
    { name: 'Food & Dining', value: 480, color: '#F8C942' },
    { name: 'Housing', value: 1200, color: '#4A9F7E' },
    { name: 'Transportation', value: 340, color: '#E76F51' },
    { name: 'Entertainment', value: 180, color: '#2A9D8F' },
    { name: 'Shopping', value: 320, color: '#F4A261' },
    { name: 'Others', value: 100, color: '#264653' },
  ];
  
  const savingsData = [
    { month: 'Jan', amount: 1300 },
    { month: 'Feb', amount: 600 },
    { month: 'Mar', amount: 1200 },
    { month: 'Apr', amount: 800 },
    { month: 'May', amount: 1500 },
    { month: 'Jun', amount: 1300 },
  ];
  
  const incomeVsExpenseTrend = monthlyData.map(item => ({
    month: item.month,
    'Income Trend': item.income,
    'Expense Trend': item.expenses,
  }));
  
  const exportReports = () => {
    toast({
      title: "Exporting reports",
      description: "Your reports are being prepared for download.",
    });
    
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Your reports have been downloaded successfully.",
      });
    }, 1500);
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
                data={incomeVsExpenseTrend}
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
                  dataKey="Income Trend" 
                  stroke="#4A9F7E" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Expense Trend" 
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
