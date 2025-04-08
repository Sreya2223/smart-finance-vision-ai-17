
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, FileDown, DollarSign } from 'lucide-react';
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

type IncomeItem = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
};

const Income: React.FC = () => {
  const { toast } = useToast();
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    return localStorage.getItem('selectedCurrency') || '$';
  });
  
  const [incomeItems, setIncomeItems] = useState<IncomeItem[]>([
    { id: '1', title: 'Salary', amount: 3000, category: 'Employment', date: '2025-04-05' },
    { id: '2', title: 'Freelance Work', amount: 500, category: 'Business', date: '2025-04-10' },
    { id: '3', title: 'Dividends', amount: 200, category: 'Investments', date: '2025-04-15' },
  ]);
  
  const [newIncome, setNewIncome] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().slice(0, 10),
  });
  
  const [isAdding, setIsAdding] = useState(false);
  
  useEffect(() => {
    // Listen for currency changes
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
  
  const handleDelete = (id: string) => {
    setIncomeItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Income deleted",
      description: "The income entry has been removed.",
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newIncome.title || !newIncome.amount || !newIncome.category) {
      toast({
        title: "Error",
        description: "Please fill all the required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const newItem: IncomeItem = {
      id: Date.now().toString(),
      title: newIncome.title,
      amount: parseFloat(newIncome.amount),
      category: newIncome.category,
      date: newIncome.date,
    };
    
    setIncomeItems(prev => [...prev, newItem]);
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
  };
  
  const handleExport = () => {
    // This would be where you implement the Excel export
    toast({
      title: "Export started",
      description: "Your income data is being exported to Excel.",
    });
    
    // Simulating download delay
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Your income data has been exported successfully.",
      });
    }, 1500);
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
                      <DollarSign className="h-4 w-4" />
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
                    value={newIncome.category}
                    onValueChange={value => setNewIncome({...newIncome, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
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
      
      <div className="grid grid-cols-1 gap-4">
        {incomeItems.map(item => (
          <Card key={item.id} className="group hover:border-primary transition-colors">
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.category} • {item.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-green-600">{selectedCurrency}{item.amount.toFixed(2)}</span>
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
        ))}
        
        {incomeItems.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">No income sources found. Add your first income!</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Income;
