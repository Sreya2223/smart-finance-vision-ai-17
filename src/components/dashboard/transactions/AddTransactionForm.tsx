
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DollarSign } from 'lucide-react';

type Transaction = {
  id: string;
  type: 'income' | 'expense';
  title: string;
  category: string;
  amount: number;
  date: string;
};

type AddTransactionFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Transaction) => void;
  currency: string;
};

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
  currency
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    type: 'expense' as 'income' | 'expense',
    date: new Date().toISOString().slice(0, 10),
  });

  const expenseCategories = [
    'Food & Drinks',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Housing',
    'Utilities',
    'Health',
    'Education',
    'Other'
  ];

  const incomeCategories = [
    'Salary',
    'Business',
    'Investments',
    'Freelance',
    'Gifts',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: formData.type,
      title: formData.title,
      category: formData.category,
      amount: parseFloat(formData.amount),
      date: formData.date,
    };

    onAddTransaction(newTransaction);
    
    toast({
      title: "Success",
      description: `${formData.type === 'income' ? 'Income' : 'Expense'} added successfully`,
    });
    
    setFormData({
      title: '',
      amount: '',
      category: '',
      type: 'expense',
      date: new Date().toISOString().slice(0, 10),
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-lg">
        <DialogHeader className="bg-gradient-to-r from-indigo-50 to-slate-50 -mx-6 px-6 py-2 rounded-t-lg">
          <DialogTitle className="text-slate-800">Add New Transaction</DialogTitle>
          <DialogDescription className="text-slate-600">
            Enter the details of your transaction below
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="transaction-type" className="text-slate-700">Transaction Type</Label>
            <Select 
              value={formData.type}
              onValueChange={(value: 'income' | 'expense') => setFormData({...formData, type: value, category: ''})}
            >
              <SelectTrigger className="border-slate-300 bg-white">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-700">Title</Label>
            <Input 
              id="title" 
              placeholder="Transaction title" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="border-slate-300 bg-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-slate-700">Amount (₹)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500">
                ₹
              </span>
              <Input 
                id="amount" 
                type="number" 
                placeholder="0.00" 
                className="pl-9 border-slate-300 bg-white"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category" className="text-slate-700">Category</Label>
            <Select 
              value={formData.category}
              onValueChange={value => setFormData({...formData, category: value})}
            >
              <SelectTrigger className="border-slate-300 bg-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {(formData.type === 'income' ? incomeCategories : expenseCategories).map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date" className="text-slate-700">Date</Label>
            <Input 
              id="date" 
              type="date" 
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
              className="border-slate-300 bg-white"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-slate-300 hover:bg-slate-100">
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              Add Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionForm;
