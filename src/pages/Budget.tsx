
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import RecentTransactions from '@/components/dashboard/transactions/RecentTransactions';
import { 
  Utensils, 
  ShoppingBag, 
  Home, 
  Train, 
  Gift, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { BudgetCategory } from '@/types/transaction';
import { 
  getUserBudgetCategories, 
  addBudgetCategory, 
  updateBudgetCategory, 
  deleteBudgetCategory 
} from '@/integrations/supabase/client';

const ICON_MAP: Record<string, React.ReactNode> = {
  utensils: <Utensils className="h-4 w-4 text-primary" />,
  shopping: <ShoppingBag className="h-4 w-4 text-primary" />,
  home: <Home className="h-4 w-4 text-primary" />,
  train: <Train className="h-4 w-4 text-primary" />,
  gift: <Gift className="h-4 w-4 text-primary" />,
};

const getIconComponent = (iconName: string | null) => {
  if (!iconName) return <Gift className="h-4 w-4 text-primary" />;
  return ICON_MAP[iconName] || <Gift className="h-4 w-4 text-primary" />;
};

const Budget: React.FC = () => {
  const { toast } = useToast();
  const [month, setMonth] = useState('April 2025');
  const [totalBudget, setTotalBudget] = useState(3000);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    budgeted: 0,
    icon: 'gift',
  });
  const [loading, setLoading] = useState(true);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [spentAmounts, setSpentAmounts] = useState<Record<string, number>>({});
  
  useEffect(() => {
    const fetchBudgetCategories = async () => {
      try {
        setLoading(true);
        const categories = await getUserBudgetCategories();
        setBudgetCategories(categories);
        
        // For demo purposes, we'll generate random spent amounts
        // In a real app, these would come from transactions
        const demoSpentAmounts: Record<string, number> = {};
        categories.forEach(category => {
          const percentage = Math.random() * 1.2; // 0 to 120% of budget
          demoSpentAmounts[category.id] = Math.round(percentage * category.budgeted * 100) / 100;
        });
        setSpentAmounts(demoSpentAmounts);
      } catch (error) {
        console.error('Error fetching budget categories:', error);
        toast({
          title: "Error loading budget",
          description: "Could not load your budget categories.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBudgetCategories();
  }, [toast]);
  
  const totalSpent = Object.values(spentAmounts).reduce((total, amount) => total + amount, 0);
  const totalBudgeted = budgetCategories.reduce((total, category) => total + category.budgeted, 0);
  const remainingBudget = totalBudget - totalBudgeted;
  
  const handleUpdateBudget = async (id: string, amount: number) => {
    try {
      await updateBudgetCategory(id, { budgeted: amount });
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
    } catch (error) {
      console.error('Error updating budget:', error);
      toast({
        title: "Error updating budget",
        description: "Could not update your budget allocation.",
        variant: "destructive",
      });
    }
  };
  
  const addNewCategory = async () => {
    if (!newCategory.name || newCategory.budgeted <= 0) {
      toast({
        title: "Error",
        description: "Please provide a category name and budget amount.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newCategoryItem = await addBudgetCategory({
        name: newCategory.name,
        budgeted: newCategory.budgeted,
        icon: newCategory.icon,
      });
      
      setBudgetCategories(prev => [...prev, newCategoryItem]);
      
      // Add a demo spent amount for the new category
      setSpentAmounts(prev => ({
        ...prev,
        [newCategoryItem.id]: Math.round(Math.random() * newCategoryItem.budgeted * 100) / 100
      }));
      
      setNewCategory({ name: '', budgeted: 0, icon: 'gift' });
      setIsAddingCategory(false);
      
      toast({
        title: "Category added",
        description: `New category "${newCategory.name}" has been added.`,
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error adding category",
        description: "Could not add the new budget category.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Budget Planning</h1>
          <p className="text-muted-foreground">Manage your monthly budget allocations</p>
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
                  className="border rounded px-2 py-1 bg-background text-foreground"
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
                  <span className={remainingBudget < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}>
                    Remaining: ₹{remainingBudget.toFixed(2)}
                  </span>
                </div>
                <Progress 
                  value={(totalBudgeted / totalBudget) * 100}
                  className="h-2"
                  indicatorClassName={remainingBudget < 0 ? 'bg-red-600 dark:bg-red-500' : undefined}
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
              
              {loading ? (
                <div className="text-center py-8">Loading your budget data...</div>
              ) : (
                <div className="space-y-4">
                  {budgetCategories.map((category) => {
                    const spent = spentAmounts[category.id] || 0;
                    const percentage = Math.min(Math.round((spent / category.budgeted) * 100), 100);
                    const isOverBudget = spent > category.budgeted;
                    
                    return (
                      <div key={category.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getIconComponent(category.icon)}
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="flex items-center">
                            {isOverBudget && (
                              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                            )}
                            <span className={isOverBudget ? 'text-red-500' : 'text-foreground'}>
                              ₹{spent.toFixed(2)} / ₹{category.budgeted.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-[1fr,auto] gap-4 items-center">
                          <div className="space-y-1 flex-1">
                            <Progress 
                              value={percentage}
                              className={`h-2 ${isOverBudget ? 'bg-red-200 dark:bg-red-950' : 'bg-muted'}`}
                              indicatorClassName={isOverBudget ? 'bg-red-600 dark:bg-red-500' : 'bg-primary'}
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
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget Summary</CardTitle>
              <CardDescription>Overview of your monthly allocations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Total Budgeted</span>
                    <span className="font-medium">₹{totalBudgeted.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Total Spent</span>
                    <span className="font-medium">₹{totalSpent.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Remaining Budget</span>
                    <span className={`font-medium ${remainingBudget < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      ₹{remainingBudget.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <h4 className="font-medium mb-3">Top Spending Categories</h4>
                  {[...budgetCategories]
                    .sort((a, b) => (spentAmounts[b.id] || 0) - (spentAmounts[a.id] || 0))
                    .slice(0, 3)
                    .map((category) => (
                      <div key={category.id} className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          {getIconComponent(category.icon)}
                          <span className="text-sm">{category.name}</span>
                        </div>
                        <span className="text-sm font-medium">₹{(spentAmounts[category.id] || 0).toFixed(2)}</span>
                      </div>
                    ))
                  }
                </div>
                
                <div className="pt-4 border-t border-border">
                  <h4 className="font-medium mb-3">Budget Status</h4>
                  {budgetCategories
                    .filter(category => (spentAmounts[category.id] || 0) > category.budgeted)
                    .map((category) => (
                      <div key={category.id} className="text-sm text-red-600 dark:text-red-400 mb-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{category.name} is over budget by ₹{((spentAmounts[category.id] || 0) - category.budgeted).toFixed(2)}</span>
                      </div>
                    ))
                  }
                  {!budgetCategories.some(category => (spentAmounts[category.id] || 0) > category.budgeted) && (
                    <div className="text-sm text-green-600 dark:text-green-400">
                      All categories are within budget!
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <RecentTransactions limit={3} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Budget;
