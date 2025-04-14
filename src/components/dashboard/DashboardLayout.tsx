
import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import Footer from '@/components/common/Footer';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useTheme } from '@/components/ui/theme-toggle';
import { SidebarProvider } from '@/components/ui/sidebar';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <SidebarProvider>
      <div className={cn(
        "flex min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200 w-full flex-col",
      )}>
        {/* Desktop sidebar */}
        <div className="hidden md:block md:w-64 flex-shrink-0">
          <div className="fixed h-full">
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
        <div className={cn("flex-1 flex flex-col overflow-hidden")}>
          <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
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
