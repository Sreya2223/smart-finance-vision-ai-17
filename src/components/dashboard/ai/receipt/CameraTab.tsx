
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, LoaderCircle } from 'lucide-react';

interface CameraTabProps {
  isScanning: boolean;
  handleCameraCapture: () => void;
}

const CameraTab: React.FC<CameraTabProps> = ({ isScanning, handleCameraCapture }) => {
  return (
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
  );
};

export default CameraTab;
