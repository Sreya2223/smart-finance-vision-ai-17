
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Upload, Check, AlertCircle, LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ReceiptScanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState('camera');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<null | {
    merchant: string;
    date: string;
    total: number;
    items: { name: string; price: number }[];
  }>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateScan(file);
    }
  };

  const handleCameraCapture = () => {
    // In a real implementation, this would access the device camera
    // For now, we'll simulate the scan with a mock result
    simulateScan();
  };

  const simulateScan = (file?: File) => {
    setIsScanning(true);
    setScanResult(null);
    
    // Simulate processing time
    setTimeout(() => {
      setIsScanning(false);
      
      // Mock result
      setScanResult({
        merchant: "Grocery Store",
        date: new Date().toLocaleDateString(),
        total: 78.95,
        items: [
          { name: "Milk", price: 3.99 },
          { name: "Bread", price: 4.50 },
          { name: "Eggs", price: 5.99 },
          { name: "Vegetables", price: 12.50 },
          { name: "Chicken", price: 15.99 },
          { name: "Pasta", price: 2.99 },
          { name: "Snacks", price: 8.99 },
          { name: "Beverages", price: 24.00 },
        ]
      });
      
      toast({
        title: "Receipt scanned successfully!",
        description: "We've extracted all the information from your receipt.",
      });
    }, 2000);
  };

  const handleSave = () => {
    // In a real app, this would save the receipt data to the database
    toast({
      title: "Receipt saved!",
      description: "The receipt has been added to your expenses.",
    });
    setScanResult(null);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Receipt Scanner</CardTitle>
        <CardDescription>
          Upload or take a photo of your receipt to automatically extract expense information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="camera">
              <Camera className="h-4 w-4 mr-2" />
              Camera
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </TabsTrigger>
          </TabsList>
          <TabsContent value="camera" className="space-y-4">
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              {isScanning ? (
                <div className="flex flex-col items-center">
                  <LoaderCircle className="h-8 w-8 text-primary animate-spin mb-2" />
                  <p className="text-gray-500">Scanning receipt...</p>
                </div>
              ) : (
                <>
                  <Camera className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-500 mb-4">Position the receipt in the frame</p>
                  <Button onClick={handleCameraCapture}>
                    Capture Receipt
                  </Button>
                </>
              )}
            </div>
          </TabsContent>
          <TabsContent value="upload" className="space-y-4">
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              {isScanning ? (
                <div className="flex flex-col items-center">
                  <LoaderCircle className="h-8 w-8 text-primary animate-spin mb-2" />
                  <p className="text-gray-500">Processing image...</p>
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-500 mb-4">Drag and drop a receipt image or click to browse</p>
                  <Label htmlFor="receipt-upload" className="cursor-pointer">
                    <div className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-600 transition-colors">
                      Select File
                    </div>
                    <Input 
                      id="receipt-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </Label>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {scanResult && (
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
                          <td className="text-right p-2">${item.price.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex justify-between pt-4 border-t">
                <span className="font-bold">Total</span>
                <span className="font-bold">${scanResult.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {scanResult && (
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setScanResult(null)}>
            Discard
          </Button>
          <Button onClick={handleSave}>
            <Check className="h-4 w-4 mr-2" /> Save Receipt
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ReceiptScanner;
