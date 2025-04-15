
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Transaction } from '@/types/transaction';

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  error: any;
  selectedCurrency: string;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  isLoading,
  error,
  selectedCurrency
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-destructive">
        {(error as Error).message || 'Failed to load transactions'}
      </div>
    );
  }

  return (
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
          {transactions && transactions.length > 0 ? (
            transactions.map((transaction) => (
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
                {transactions?.length === 0 ? 'No matching transactions found' : 'No transactions to display'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
