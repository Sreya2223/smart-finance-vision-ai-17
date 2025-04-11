
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  CreditCard, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Camera, 
  Settings,
  LogOut,
  ListFilter
} from 'lucide-react';
import Logo from '@/components/common/Logo';
import { cn } from '@/lib/utils';
import { useAuth } from '@/App';

const DashboardSidebar: React.FC = () => {
  const { logout } = useAuth();
  
  const navItems = [
    { label: 'Dashboard', icon: Home, to: '/dashboard' },
    { label: 'Income', icon: DollarSign, to: '/income' },
    { label: 'Expenses', icon: CreditCard, to: '/expenses' },
    { label: 'Transactions', icon: ListFilter, to: '/transactions' },
    { label: 'Budget', icon: PieChart, to: '/budget' },
    { label: 'Reports', icon: BarChart3, to: '/reports' },
    { label: 'Scan Receipt', icon: Camera, to: '/scan-receipt' },
    { label: 'Settings', icon: Settings, to: '/settings' },
  ];
  
  return (
    <aside className="w-16 md:w-56 h-full bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 flex flex-col shadow-lg">
      <div className="p-4 flex justify-center md:justify-start">
        <Logo size="md" showText={false} className="md:hidden" />
        <Logo size="md" showText={true} className="hidden md:block" />
      </div>
      
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                className={({ isActive }) => cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-indigo-600 text-white shadow-md" 
                    : "text-slate-300 hover:bg-slate-700/50"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="hidden md:inline">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-3 border-t border-slate-700">
        <button 
          onClick={logout}
          className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium text-red-400 hover:bg-slate-700/50 rounded-md transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
