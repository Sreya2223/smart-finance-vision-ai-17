
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { 
  Utensils, 
  ShoppingBag, 
  Home, 
  Train, 
  Gift, 
  AlertCircle,
  DollarSign,
  Plus
} from 'lucide-react';

type BudgetCategory = {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  icon: React.ReactNode;
};

const Budget: React.FC = () => {
  const { toast } = useToast();
  const [month, setMonth] = useState('April 2025');
  const [totalBudget, setTotalBudget] = useState(3000);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    budgeted: 0,
  });
  
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([
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
  ]);
  
  const totalSpent = budgetCategories.reduce((total, category) => total + category.spent, 0);
  const totalBudgeted = budgetCategories.reduce((total, category) => total + category.budgeted, 0);
  const remainingBudget = totalBudget - totalBudgeted;
  
  const handleUpdateBudget = (id: string, amount: number) => {
    setBudgetCategories(prev => 
      prev.map(category => 
        category.id === id 
          ? { ...category, budgeted: amount } 
          : category
      )
    );
    
    toast({
      title: "Budget updated",
      description: "Your budget allocation has been updated.",
    });
  };
  
  const addNewCategory = () => {
    if (!newCategory.name || newCategory.budgeted <= 0) {
      toast({
        title: "Error",
        description: "Please provide a category name and budget amount.",
        variant: "destructive",
      });
      return;
    }
    
    const icons = [<Utensils className="h-4 w-4 text-primary" />, <ShoppingBag className="h-4 w-4 text-primary" />, <Gift className="h-4 w-4 text-primary" />];
    
    const newCategoryItem: BudgetCategory = {
      id: Date.now().toString(),
      name: newCategory.name,
      budgeted: newCategory.budgeted,
      spent: 0,
      icon: icons[Math.floor(Math.random() * icons.length)],
    };
    
    setBudgetCategories(prev => [...prev, newCategoryItem]);
    setNewCategory({ name: '', budgeted: 0 });
    setIsAddingCategory(false);
    
    toast({
      title: "Category added",
      description: `New category "${newCategory.name}" has been added.`,
    });
  };
  
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget Planning</h1>
          <p className="text-gray-600">Manage your monthly budget allocations</p>
        </div>
        <div>
          <Button onClick={() => setIsAddingCategory(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Monthly Budget: {month}</CardTitle>
              <div className="flex items-center gap-2">
                <Label htmlFor="month-select">Month:</Label>
                <select 
                  id="month-select" 
                  className="border rounded px-2 py-1"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  <option value="April 2025">April 2025</option>
                  <option value="May 2025">May 2025</option>
                  <option value="June 2025">June 2025</option>
                </select>
              </div>
            </div>
            <CardDescription>Manage budget allocations across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label htmlFor="total-budget">Total Monthly Budget</Label>
                  <span className="flex items-center">
                    <span className="text-sm mr-1">₹</span>
                    <Input 
                      id="total-budget" 
                      type="number" 
                      value={totalBudget}
                      onChange={e => setTotalBudget(parseFloat(e.target.value))}
                      className="w-24 h-8 ml-1 text-right"
                    />
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Allocated: ₹{totalBudgeted}</span>
                  <span className={remainingBudget < 0 ? 'text-red-600' : 'text-green-600'}>
                    Remaining: ₹{remainingBudget.toFixed(2)}
                  </span>
                </div>
                <Progress 
                  value={(totalBudgeted / totalBudget) * 100}
                  className="h-2"
                  indicatorClassName={remainingBudget < 0 ? 'bg-red-600' : undefined}
                />
              </div>
              
              {isAddingCategory && (
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-category">Category Name</Label>
                        <Input 
                          id="new-category" 
                          placeholder="e.g., Subscriptions" 
                          value={newCategory.name}
                          onChange={e => setNewCategory({...newCategory, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="new-budget">Budget Amount</Label>
                          <span>₹{newCategory.budgeted}</span>
                        </div>
                        <Slider 
                          id="new-budget"
                          value={[newCategory.budgeted]}
                          min={0}
                          max={1000}
                          step={10}
                          onValueChange={(val) => setNewCategory({...newCategory, budgeted: val[0]})}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddingCategory(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addNewCategory}>
                          Add Category
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="space-y-4">
                {budgetCategories.map((category) => {
                  const percentage = Math.min(Math.round((category.spent / category.budgeted) * 100), 100);
                  const isOverBudget = category.spent > category.budgeted;
                  
                  return (
                    <div key={category.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {category.icon}
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="flex items-center">
                          {isOverBudget && (
                            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                          )}
                          <span className={isOverBudget ? 'text-red-500' : 'text-gray-700'}>
                            ₹{category.spent.toFixed(2)} / ₹{category.budgeted.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-[1fr,auto] gap-4 items-center">
                        <div className="space-y-1 flex-1">
                          <Progress 
                            value={percentage}
                            className={`h-2 ${isOverBudget ? 'bg-red-200' : 'bg-gray-200'}`}
                            indicatorClassName={isOverBudget ? 'bg-red-600' : 'bg-primary'}
                          />
                        </div>
                        <div className="w-32">
                          <Slider 
                            value={[category.budgeted]}
                            min={0}
                            max={2000}
                            step={50}
                            onValueChange={(val) => handleUpdateBudget(category.id, val[0])}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Budget Summary</CardTitle>
            <CardDescription>Overview of your monthly allocations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Total Budgeted</span>
                  <span className="font-medium">₹{totalBudgeted.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Total Spent</span>
                  <span className="font-medium">₹{totalSpent.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Remaining Budget</span>
                  <span className={`font-medium ${remainingBudget < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ₹{remainingBudget.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Top Spending Categories</h4>
                {[...budgetCategories]
                  .sort((a, b) => b.spent - a.spent)
                  .slice(0, 3)
                  .map((category) => (
                    <div key={category.id} className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        {category.icon}
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <span className="text-sm font-medium">₹{category.spent.toFixed(2)}</span>
                    </div>
                  ))
                }
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Budget Status</h4>
                {budgetCategories
                  .filter(category => category.spent > category.budgeted)
                  .map((category) => (
                    <div key={category.id} className="text-sm text-red-600 mb-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{category.name} is over budget by ₹{(category.spent - category.budgeted).toFixed(2)}</span>
                    </div>
                  ))
                }
                {!budgetCategories.some(category => category.spent > category.budgeted) && (
                  <div className="text-sm text-green-600">
                    All categories are within budget!
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Budget;
