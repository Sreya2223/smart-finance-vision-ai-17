
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpRight, ArrowDownLeft, Download, Filter, Plus, Search } from 'lucide-react';
import { getUserTransactions, Transaction } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

const Transactions: React.FC = () => {
  const { toast } = useToast();
  const [filterType, setFilterType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    return localStorage.getItem('selectedCurrency') || '₹';
  });

  // Fetch transactions using React Query
  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['allTransactions'],
    queryFn: async () => {
      try {
        return await getUserTransactions();
      } catch (err: any) {
        console.error('Error fetching transactions:', err);
        toast({
          title: "Error loading transactions",
          description: err.message || 'Failed to load transactions',
          variant: "destructive",
        });
        throw err;
      }
    }
  });

  // Filter transactions based on search query and filter type
  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = searchQuery 
      ? transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesType = filterType 
      ? transaction.type === filterType
      : true;
    
    return matchesSearch && matchesType;
  });

  // Listen for currency changes
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedCurrency') {
        setSelectedCurrency(e.newValue || '₹');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">View and manage all your financial transactions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={filterType || ""} onValueChange={(value) => setFilterType(value || null)}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Types" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expense">Expense</TabsTrigger>
          </TabsList>
          
          <Card className="mt-4">
            {isLoading ? (
              <CardContent className="flex justify-center items-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </CardContent>
            ) : error ? (
              <CardContent className="text-center py-6 text-destructive">
                {(error as Error).message || 'Failed to load transactions'}
              </CardContent>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions && filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell>
                            <div className="flex items-center">
                              <div className={`p-2 rounded-full ${
                                transaction.type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                              }`}>
                                {transaction.type === 'income' ? (
                                  <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                                ) : (
                                  <ArrowDownLeft className="h-4 w-4 text-red-600 dark:text-red-400" />
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{transaction.title}</div>
                              {transaction.payment_method && (
                                <div className="text-xs text-muted-foreground">{transaction.payment_method}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{transaction.category}</TableCell>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell className="text-right">
                            <span className={transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                              {transaction.type === 'income' ? '' : '- '}
                              {selectedCurrency}{parseFloat(String(transaction.amount)).toFixed(2)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          {searchQuery || filterType ? 'No matching transactions found' : 'No transactions to display'}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
