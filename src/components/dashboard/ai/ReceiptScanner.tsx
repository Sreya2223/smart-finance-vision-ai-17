
import React from 'react';
import ScanTabs from './receipt/ScanTabs';
import ScanResult from './receipt/ScanResult';
import { useScanReceipt } from './receipt/useScanReceipt';

interface ReceiptScannerProps {
  onClose?: () => void;
}

const ReceiptScanner: React.FC<ReceiptScannerProps> = ({ onClose }) => {
  const {
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
  } = useScanReceipt(onClose);

  return (
    <div className="w-full">
      <ScanTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isScanning={isScanning}
        handleCameraCapture={handleCameraCapture}
        handleFileUpload={handleFileUpload}
      />

      <ScanResult
        scanResult={scanResult}
        receiptCategory={receiptCategory}
        setReceiptCategory={setReceiptCategory}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        selectedCurrency={selectedCurrency}
        handleSave={handleSave}
        handleDiscard={handleDiscard}
      />
    </div>
  );
};

export default ReceiptScanner;
