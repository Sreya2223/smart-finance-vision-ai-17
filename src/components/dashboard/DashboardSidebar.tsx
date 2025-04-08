
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../common/Logo';
import { 
  LayoutDashboard, 
  Wallet, 
  CreditCard, 
  BarChart3, 
  Receipt, 
  Settings, 
  LogOut,
  Goal,
  ScanText
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
};

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active }) => {
  return (
    <Link to={to}>
      <Button 
        variant="ghost" 
        className={cn(
          "w-full justify-start gap-2 font-medium", 
          active ? "bg-primary/10 text-primary" : "text-gray-700 hover:text-primary"
        )}
      >
        {icon}
        {label}
      </Button>
    </Link>
  );
};

const DashboardSidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/income', icon: <Wallet size={20} />, label: 'Income' },
    { to: '/expenses', icon: <CreditCard size={20} />, label: 'Expenses' },
    { to: '/budget', icon: <Goal size={20} />, label: 'Budget' },
    { to: '/reports', icon: <BarChart3 size={20} />, label: 'Reports' },
    { to: '/transactions', icon: <Receipt size={20} />, label: 'Transactions' },
    { to: '/scan-receipt', icon: <ScanText size={20} />, label: 'Scan Receipt' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col p-4">
      <div className="py-4 px-2">
        <Logo />
      </div>
      
      <nav className="mt-8 flex-1 space-y-1">
        {navItems.map(item => (
          <NavItem 
            key={item.to} 
            to={item.to} 
            icon={item.icon} 
            label={item.label}
            active={currentPath === item.to}
          />
        ))}
      </nav>
      
      <div className="pt-4 border-t border-gray-200">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut size={20} />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
