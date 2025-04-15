
import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import Footer from '@/components/common/Footer';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useTheme } from '@/components/ui/theme-toggle';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const { toast } = useToast();

  const handleEmailData = () => {
    toast({
      title: "Email Data",
      description: "Your financial data will be emailed to your registered email address.",
    });
    // In a real application, this would trigger an API call to send an email with the data
  };

  const handleExportData = () => {
    toast({
      title: "Export Data",
      description: "Your financial data export is being prepared for download.",
    });
    
    // Simulate download after a short delay
    setTimeout(() => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
        financialData: "Sample data that would come from your actual application state",
        exportedAt: new Date().toISOString()
      }));
      
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "financial_data_export.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      
      toast({
        title: "Download Started",
        description: "Your financial data export is downloading.",
      });
    }, 1000);
  };

  return (
    <SidebarProvider>
      <div className={cn(
        "flex min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200 w-full",
      )}>
        {/* Desktop sidebar */}
        <div className="hidden md:block md:w-64 md:flex-shrink-0">
          <div className="fixed h-full w-64">
            <DashboardSidebar />
          </div>
        </div>

        {/* Mobile sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0">
            <DashboardSidebar />
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <div className={cn("flex-1 flex flex-col md:ml-64 w-full")}>
          <DashboardHeader 
            onMenuClick={() => setSidebarOpen(true)} 
            onEmailData={handleEmailData}
            onExportData={handleExportData}
          />
          <main className="flex-1 overflow-auto p-4 md:p-6 bg-background dark:bg-slate-900 transition-colors duration-200">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
