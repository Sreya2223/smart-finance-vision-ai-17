
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, LoaderCircle } from 'lucide-react';

interface UploadTabProps {
  isScanning: boolean;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadTab: React.FC<UploadTabProps> = ({ isScanning, handleFileUpload }) => {
  return (
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
  );
};

export default UploadTab;
