
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CameraTab from './CameraTab';
import UploadTab from './UploadTab';
import { Camera, Upload } from 'lucide-react';

interface ScanTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isScanning: boolean;
  handleCameraCapture: () => void;
  handleFileUpload: (file: File) => void;
}

const ScanTabs: React.FC<ScanTabsProps> = ({
  activeTab,
  setActiveTab,
  isScanning,
  handleCameraCapture,
  handleFileUpload
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full grid grid-cols-2">
        <TabsTrigger value="camera" className="gap-2">
          <Camera className="h-4 w-4" />
          Camera
        </TabsTrigger>
        <TabsTrigger value="upload" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload
        </TabsTrigger>
      </TabsList>

      <TabsContent value="camera" className="mt-4">
        <CameraTab 
          isScanning={isScanning}
          handleCameraCapture={handleCameraCapture}
        />
      </TabsContent>

      <TabsContent value="upload" className="mt-4">
        <UploadTab 
          isScanning={isScanning}
          handleFileUpload={handleFileUpload}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ScanTabs;
