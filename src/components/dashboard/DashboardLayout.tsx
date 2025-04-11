
import React, { useState, useEffect } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from '@/components/ui/sheet';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<string>('light');
  
  useEffect(() => {
    // Check for theme in localStorage on component mount
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    // Listen for theme changes from other components
    const handleThemeChange = () => {
      const currentTheme = localStorage.getItem('theme') || 'light';
      setTheme(currentTheme);
    };
    
    window.addEventListener('storage', handleThemeChange);
    
    return () => {
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  return (
    <div className={cn(
      "flex h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200",
    )}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <DashboardSidebar />
      </div>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0">
          <DashboardSidebar />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className={cn("flex-1 flex flex-col")}>
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-background dark:bg-slate-900 transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
