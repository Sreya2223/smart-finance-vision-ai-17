
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CameraTab from './CameraTab';
import UploadTab from './UploadTab';

interface ScanTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  isScanning: boolean;
  handleCameraCapture: () => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
      
      <TabsContent value="camera">
        <CameraTab 
          isScanning={isScanning} 
          handleCameraCapture={handleCameraCapture} 
        />
      </TabsContent>
      
      <TabsContent value="upload">
        <UploadTab 
          isScanning={isScanning} 
          handleFileUpload={handleFileUpload} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default ScanTabs;
