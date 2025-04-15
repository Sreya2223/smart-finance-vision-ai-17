
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AddTransactionForm from '@/components/dashboard/transactions/AddTransactionForm';
import { getUserTransactions } from '@/integrations/supabase/client';
import { Transaction } from '@/types/transaction';
import ReceiptScanner from '@/components/dashboard/ai/ReceiptScanner';
import TransactionHeader from '@/components/dashboard/transactions/TransactionHeader';
import TransactionFilter from '@/components/dashboard/transactions/TransactionFilter';
import TransactionTable from '@/components/dashboard/transactions/TransactionTable';
import { downloadAsJson, transactionsToCSV, downloadAsCSV } from '@/utils/exportUtils';

const Transactions: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filterType, setFilterType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    localStorage.setItem('selectedCurrency', '₹');
    return '₹';
  });
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isReceiptScannerOpen, setIsReceiptScannerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');

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

  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = searchQuery 
      ? transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesType = filterType 
      ? transaction.type === filterType
      : true;
    
    const matchesTab = activeTab === 'all' 
      ? true 
      : transaction.type === activeTab;
    
    return matchesSearch && matchesType && matchesTab;
  });

  useEffect(() => {
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

  const handleAddTransaction = (newTransaction: Transaction) => {
    queryClient.invalidateQueries({ queryKey: ['allTransactions'] });
    toast({
      title: "Transaction added",
      description: `${newTransaction.title} has been added successfully.`,
    });
  };

  const handleExportTransactions = () => {
    if (!filteredTransactions?.length) {
      toast({
        title: "No data to export",
        description: "There are no transactions matching your filters to export.",
        variant: "destructive",
      });
      return;
    }
    
    // Export as CSV
    const csvData = transactionsToCSV(filteredTransactions);
    downloadAsCSV(csvData, `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    
    toast({
      title: "Export successful",
      description: "Your transactions have been exported as CSV.",
    });
  };

  const handleEmailTransactions = () => {
    if (!filteredTransactions?.length) {
      toast({
        title: "No data to email",
        description: "There are no transactions matching your filters to email.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real application, this would call an API endpoint to send the email
    toast({
      title: "Email feature",
      description: "Your transaction data will be emailed to your registered email address shortly.",
    });
    
    // Simulate email being sent
    setTimeout(() => {
      toast({
        title: "Email sent",
        description: "Your transaction data has been sent to your email.",
      });
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <TransactionHeader 
          onAddTransaction={() => setIsAddTransactionOpen(true)}
          onScanReceipt={() => setIsReceiptScannerOpen(true)}
          onExport={handleExportTransactions}
          onEmail={handleEmailTransactions}
        />

        <AddTransactionForm 
          isOpen={isAddTransactionOpen}
          onClose={() => setIsAddTransactionOpen(false)}
          onAddTransaction={handleAddTransaction}
          currency={selectedCurrency}
        />

        {isReceiptScannerOpen && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <ReceiptScanner onClose={() => setIsReceiptScannerOpen(false)} />
            </CardContent>
          </Card>
        )}

        <TransactionFilter 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterType={filterType}
          setFilterType={setFilterType}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expense">Expense</TabsTrigger>
          </TabsList>
          
          <Card className="mt-4">
            <CardContent className="p-0">
              <TransactionTable 
                transactions={filteredTransactions || []}
                isLoading={isLoading}
                error={error}
                selectedCurrency={selectedCurrency}
              />
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
