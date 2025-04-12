
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, ChevronRight, LayoutDashboard, CreditCard, Banknote, 
  BarChart3, File, Settings, Receipt, Calculator, Wallet
} from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import Logo from '@/components/common/Logo';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface NavSection {
  label: string;
  links: NavItem[];
}

const DashboardSidebar = () => {
  const { state, open, setOpen } = useSidebar();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setOpen(!open);
    setIsMobileOpen(!isMobileOpen);
  };

  const closeSidebar = () => {
    setOpen(false);
    setIsMobileOpen(false);
  };

  const navigation = [
    {
      label: 'Main',
      links: [
        { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
        { name: 'Transactions', href: '/transactions', icon: <File className="h-5 w-5" /> },
      ]
    },
    {
      label: 'Finance',
      links: [
        { name: 'Income', href: '/income', icon: <Banknote className="h-5 w-5" /> },
        { name: 'Expenses', href: '/expenses', icon: <CreditCard className="h-5 w-5" /> },
        { name: 'Budget', href: '/budget', icon: <Wallet className="h-5 w-5" /> },
      ]
    },
    {
      label: 'Analysis',
      links: [
        { name: 'Reports', href: '/reports', icon: <BarChart3 className="h-5 w-5" /> },
        { name: 'Tax Calculator', href: '/tax-calculator', icon: <Calculator className="h-5 w-5" /> },
      ]
    },
    {
      label: 'Tools',
      links: [
        { name: 'Scan Receipt', href: '/scan-receipt', icon: <Receipt className="h-5 w-5" /> },
        { name: 'Settings', href: '/settings', icon: <Settings className="h-5 w-5" /> },
      ]
    }
  ];

  return (
    <div
      className={cn(
        "h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto",
      )}
    >
      <div className="h-full px-3 py-4">
        <div className="flex items-center justify-between mb-6">
          <Link to="/dashboard" className="flex items-center">
            <Logo className="h-8 w-auto" />
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            {open ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
          </Button>
        </div>
        
        <div className="space-y-4">
          {navigation.map((section, index) => (
            <div key={index} className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-3">{section.label}</h3>
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      onClick={closeSidebar}
                      className={cn(
                        "flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium",
                        location.pathname === link.href 
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' 
                          : 'text-gray-700 dark:text-gray-200',
                      )}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {index < navigation.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
