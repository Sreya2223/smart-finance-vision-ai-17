
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Plus, Camera, Mail } from 'lucide-react';

interface TransactionHeaderProps {
  onAddTransaction: () => void;
  onScanReceipt: () => void;
  onExport?: () => void;
  onEmail?: () => void;
}

const TransactionHeader: React.FC<TransactionHeaderProps> = ({
  onAddTransaction,
  onScanReceipt,
  onExport,
  onEmail
}) => {
  const handleExport = () => {
    if (onExport) {
      onExport();
    }
  };

  const handleEmail = () => {
    if (onEmail) {
      onEmail();
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">View and manage all your financial transactions</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={onScanReceipt}>
          <Camera className="h-4 w-4 mr-2" />
          Scan Receipt
        </Button>
        {onEmail && (
          <Button variant="outline" onClick={handleEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
        )}
        <Button variant="outline" onClick={handleExport}>
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
