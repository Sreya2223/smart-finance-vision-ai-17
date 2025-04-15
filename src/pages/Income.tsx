
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, FileDown, IndianRupee } from 'lucide-react';
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
import RecentTransactions from '@/components/dashboard/transactions/RecentTransactions';
import { useTransactions } from '@/contexts/TransactionContext';
import { Transaction } from '@/types/transaction';

const Income: React.FC = () => {
  const { toast } = useToast();
  const { transactions, addNewTransaction } = useTransactions();
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    localStorage.setItem('selectedCurrency', '₹');
    return '₹';
  });
  
  const [incomeTransactions, setIncomeTransactions] = useState<Transaction[]>([]);
  
  const [newIncome, setNewIncome] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().slice(0, 10),
  });
  
  const [isAdding, setIsAdding] = useState(false);
  
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const filtered = transactions
        .filter(t => t.type === 'income')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setIncomeTransactions(filtered);
    }
  }, [transactions]);
  
  useEffect(() => {
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
  
  const handleDelete = async (id: string) => {
    try {
      const { deleteTransaction } = await import('@/integrations/supabase/client');
      await deleteTransaction(id);
      
      setIncomeTransactions(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Income deleted",
        description: "The income entry has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete income",
        variant: "destructive",
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newIncome.title || !newIncome.amount || !newIncome.category) {
      toast({
        title: "Error",
        description: "Please fill all the required fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await addNewTransaction({
        title: newIncome.title,
        amount: parseFloat(newIncome.amount),
        category: newIncome.category,
        date: newIncome.date,
        type: 'income',
        payment_method: 'Other'
      });
      
      setNewIncome({
        title: '',
        amount: '',
        category: '',
        date: new Date().toISOString().slice(0, 10),
      });
      
      setIsAdding(false);
      
      toast({
        title: "Income added",
        description: "The new income entry has been added successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add income",
        variant: "destructive",
      });
    }
  };
  
  const handleExport = () => {
    try {
      const headers = ['Title', 'Category', 'Date', 'Amount'];
      const csvContent = [
        headers.join(','),
        ...incomeTransactions.map(t => 
          [t.title, t.category, t.date, t.amount].join(',')
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `income-data-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.display = 'none';
      document.body.appendChild(link);
      
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export complete",
        description: "Your income data has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export income data. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Income Management</h1>
          <p className="text-gray-600">Track and manage your income sources</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Income
          </Button>
        </div>
      </div>
      
      {isAdding && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Income</CardTitle>
            <CardDescription>Record a new income source</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Income Title" 
                    value={newIncome.title}
                    onChange={e => setNewIncome({...newIncome, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ({selectedCurrency})</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500">
                      <IndianRupee className="h-4 w-4" />
                    </span>
                    <Input 
                      id="amount" 
                      type="number" 
                      placeholder="0.00" 
                      className="pl-9"
                      value={newIncome.amount}
                      onChange={e => setNewIncome({...newIncome, amount: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newIncome.category || "select-category"}
                    onValueChange={value => setNewIncome({...newIncome, category: value === "select-category" ? "" : value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="select-category">Select a category</SelectItem>
                      <SelectItem value="Employment">Employment</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Investments">Investments</SelectItem>
                      <SelectItem value="Rental">Rental</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={newIncome.date}
                    onChange={e => setNewIncome({...newIncome, date: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Income
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {incomeTransactions.length > 0 ? (
            incomeTransactions.map(item => (
              <Card key={item.id} className="group hover:border-primary transition-colors">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.category} • {item.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold text-green-600">{selectedCurrency}{parseFloat(String(item.amount)).toFixed(2)}</span>
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
              <p className="text-gray-500">No income sources found. Add your first income!</p>
            </div>
          )}
        </div>
        
        <div>
          <RecentTransactions limit={5} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Income;
