
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check } from 'lucide-react';

interface ScanResultProps {
  scanResult: {
    merchant: string;
    date: string;
    total: number;
    items: { name: string; price: number }[];
  } | null;
  receiptCategory: string;
  setReceiptCategory: (value: string) => void;
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  selectedCurrency: string;
  handleSave: () => Promise<void>;
  handleDiscard: () => void;
}

const ScanResult: React.FC<ScanResultProps> = ({
  scanResult,
  receiptCategory,
  setReceiptCategory,
  paymentMethod,
  setPaymentMethod,
  selectedCurrency,
  handleSave,
  handleDiscard
}) => {
  if (!scanResult) return null;

  return (
    <div className="mt-8 border rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b p-4">
        <h3 className="font-medium text-lg">Scan Results</h3>
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-500">Merchant</Label>
            <div className="font-medium">{scanResult.merchant}</div>
          </div>
          <div>
            <Label className="text-gray-500">Date</Label>
            <div className="font-medium">{scanResult.date}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-500">Category</Label>
            <Select value={receiptCategory} onValueChange={setReceiptCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Groceries">Groceries</SelectItem>
                <SelectItem value="Food & Drinks">Food & Drinks</SelectItem>
                <SelectItem value="Transportation">Transportation</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-gray-500">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Debit Card">Debit Card</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label className="text-gray-500 mb-2 block">Items</Label>
          <div className="border rounded max-h-60 overflow-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="border-b">
                  <th className="text-left p-2">Item</th>
                  <th className="text-right p-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {scanResult.items.map((item, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="p-2">{item.name}</td>
                    <td className="text-right p-2">{selectedCurrency}{item.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="flex justify-between pt-4 border-t">
          <span className="font-bold">Total</span>
          <span className="font-bold">{selectedCurrency}{scanResult.total.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleDiscard}>
            Discard
          </Button>
          <Button onClick={handleSave}>
            <Check className="h-4 w-4 mr-2" /> Save Receipt
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScanResult;
