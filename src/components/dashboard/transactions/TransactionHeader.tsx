
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Plus, Camera } from 'lucide-react';

interface TransactionHeaderProps {
  onAddTransaction: () => void;
  onScanReceipt: () => void;
}

const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  onAddTransaction,
  onScanReceipt
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">View and manage all your financial transactions</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onScanReceipt}>
          <Camera className="h-4 w-4 mr-2" />
          Scan Receipt
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button onClick={onAddTransaction}>
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>
    </div>
  );
};

export default TransactionHeader;
