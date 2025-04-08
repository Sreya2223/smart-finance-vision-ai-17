
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ReceiptScanner from '@/components/dashboard/ai/ReceiptScanner';

const ScanReceipt: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Scan Receipt</h1>
        <p className="text-gray-600">Capture receipts and we'll extract the data for you</p>
      </div>
      
      <ReceiptScanner />
    </DashboardLayout>
  );
};

export default ScanReceipt;
