
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTransactions } from '@/contexts/TransactionContext';
import { addTransaction } from '@/integrations/supabase/client';

export interface ScanResultType {
  merchant: string;
  date: string;
  total: number;
  items: { name: string; price: number }[];
}

export const useScanReceipt = (onClose?: () => void) => {
  const [activeTab, setActiveTab] = useState('camera');
  const [isScanning, setIsScanning] = useState(false);
  const [receiptCategory, setReceiptCategory] = useState('Groceries');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [scanResult, setScanResult] = useState<ScanResultType | null>(null);
  const { toast } = useToast();
  const { refreshTransactions } = useTransactions();
  const [selectedCurrency] = useState('₹'); // Always use INR

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateScan(file);
    }
  };

  const handleCameraCapture = () => {
    // In a real implementation, this would access the device camera
    simulateScan();
  };

  const simulateScan = (file?: File) => {
    setIsScanning(true);
    setScanResult(null);
    
    // Simulate processing time
    setTimeout(() => {
      setIsScanning(false);
      
      // Mock result with more Indian-specific data
      setScanResult({
        merchant: "Grocery Store",
        date: new Date().toLocaleDateString(),
        total: 1299.95,
        items: [
          { name: "Basmati Rice", price: 299.99 },
          { name: "Atta Flour", price: 145.50 },
          { name: "Paneer", price: 125.99 },
          { name: "Fresh Vegetables", price: 220.50 },
          { name: "Spices", price: 159.99 },
          { name: "Cooking Oil", price: 199.99 },
          { name: "Milk & Dairy", price: 149.99 },
          { name: "Snacks", price: 98.00 },
        ]
      });
      
      toast({
        title: "Receipt scanned successfully!",
        description: "We've extracted all the information from your receipt.",
      });
    }, 2000);
  };

  const handleSave = async () => {
    if (!scanResult) return;

    try {
      // Format date as YYYY-MM-DD for database
      const dateParts = scanResult.date.split('/');
      const formattedDate = dateParts.length === 3 
        ? `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`
        : new Date().toISOString().split('T')[0];

      // Add transaction directly to the database
      const transactionData = {
        type: 'expense' as 'income' | 'expense',
        title: scanResult.merchant,
        amount: scanResult.total,
        category: receiptCategory,
        date: formattedDate,
        payment_method: paymentMethod,
      };

      // Save to database
      await addTransaction(transactionData);
      
      // Refresh transactions
      await refreshTransactions();
      
      toast({
        title: "Receipt saved!",
        description: "The receipt has been added to your expenses.",
      });
      
      handleDiscard();
      if (onClose) onClose();
    } catch (error: any) {
      console.error('Error saving receipt:', error);
      toast({
        title: "Error saving receipt",
        description: error.message || "Failed to save the receipt data",
        variant: "destructive",
      });
    }
  };

  const handleDiscard = () => {
    setScanResult(null);
  };

  return {
    activeTab,
    setActiveTab,
    isScanning,
    receiptCategory,
    setReceiptCategory,
    paymentMethod,
    setPaymentMethod,
    scanResult,
    selectedCurrency,
    handleFileUpload,
    handleCameraCapture,
    handleSave,
    handleDiscard
  };
};
