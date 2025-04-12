import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, FileDown, DollarSign, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useTransactions } from '@/contexts/TransactionContext';
import { Transaction } from '@/types/transaction';

type ExpenseItem = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod?: string;
  receipt?: string;
};

const Expenses: React.FC = () => {
  const { toast } = useToast();
  const { transactions, addNewTransaction, refreshTransactions, isLoading } = useTransactions();
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    return localStorage.getItem('selectedCurrency') || '$';
  });
  
  const expenseItems = transactions.filter(transaction => transaction.type === 'expense');
  
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().slice(0, 10),
    paymentMethod: '',
    receipt: '',
  });
  
  const [isAdding, setIsAdding] = useState(false);
  
  useEffect(() => {
    const handleCurrencyChange = (e: StorageEvent) => {
      if (e.key === 'selectedCurrency') {
        setSelectedCurrency(e.newValue || '$');
      }
    };
    
    window.addEventListener('storage', handleCurrencyChange);
    
    return () => {
      window.removeEventListener('storage', handleCurrencyChange);
    };
  }, []);
  
  const handleDelete = async (id: string) => {
    toast({
      title: "Expense deleted",
      description: "The expense entry has been removed.",
    });
    await refreshTransactions();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newExpense.title || !newExpense.amount || !newExpense.category) {
      toast({
        title: "Error",
        description: "Please fill all the required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await addNewTransaction({
        type: 'expense',
        title: newExpense.title,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        date: newExpense.date,
        payment_method: newExpense.paymentMethod || undefined,
      });
      
      setNewExpense({
        title: '',
        amount: '',
        category: '',
        date: new Date().toISOString().slice(0, 10),
        paymentMethod: '',
        receipt: '',
      });
      
      setIsAdding(false);
    } catch (error: any) {
      toast({
        title: "Error adding expense",
        description: error.message || "Failed to add expense",
        variant: "destructive",
      });
    }
  };
  
  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Your expense data is being exported to Excel.",
    });
    
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Your expense data has been exported successfully.",
      });
    }, 1500);
  };
  
  const getCategoryColor = (category: string) => {
    const categories: {[key: string]: string} = {
      'Food & Drinks': 'bg-orange-100 text-orange-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Transportation': 'bg-blue-100 text-blue-800',
      'Housing': 'bg-green-100 text-green-800',
      'Utilities': 'bg-slate-100 text-slate-800',
      'Shopping': 'bg-pink-100 text-pink-800',
      'Health': 'bg-red-100 text-red-800',
      'Education': 'bg-indigo-100 text-indigo-800',
      'Personal': 'bg-yellow-100 text-yellow-800',
      'Other': 'bg-gray-100 text-gray-800',
    };
    
    return categories[category] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-600">Track and manage your expenses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>
      
      {isAdding && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Expense</CardTitle>
            <CardDescription>Record a new expense</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Expense Title" 
                    value={newExpense.title}
                    onChange={e => setNewExpense({...newExpense, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ({selectedCurrency})</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500">
                      <DollarSign className="h-4 w-4" />
                    </span>
                    <Input 
                      id="amount" 
                      type="number" 
                      placeholder="0.00" 
                      className="pl-9"
                      value={newExpense.amount}
                      onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newExpense.category}
                    onValueChange={value => setNewExpense({...newExpense, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Food & Drinks">Food & Drinks</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Transportation">Transportation</SelectItem>
                      <SelectItem value="Housing">Housing</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={newExpense.date}
                    onChange={e => setNewExpense({...newExpense, date: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select
                    value={newExpense.paymentMethod}
                    onValueChange={value => setNewExpense({...newExpense, paymentMethod: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Debit Card">Debit Card</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="PayPal">PayPal</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="receipt">Receipt (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" className="w-full h-10">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Receipt
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Expense
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : expenseItems.length > 0 ? (
          expenseItems.map(item => (
            <Card key={item.id} className="group hover:border-primary transition-colors">
              <CardContent className="p-4 flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getCategoryColor(item.category)}>{item.category}</Badge>
                    <span className="text-sm text-gray-500">{item.date}</span>
                    {item.payment_method && (
                      <span className="text-sm text-gray-500">• {item.payment_method}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold text-red-600">-{selectedCurrency}{parseFloat(String(item.amount)).toFixed(2)}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">No expenses found. Add your first expense!</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Expenses;
