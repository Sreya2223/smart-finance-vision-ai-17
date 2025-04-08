
import React, { useState, useEffect } from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

type Currency = {
  code: string;
  symbol: string;
  name: string;
  flag?: string;
};

type DashboardHeaderProps = {
  onMenuClick: () => void;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuClick }) => {
  const { toast } = useToast();
  const [currencies, setCurrencies] = useState<Currency[]>([
    { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
  ]);

  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(() => {
    const savedCurrency = localStorage.getItem('selectedCurrencyCode');
    return savedCurrency 
      ? currencies.find(c => c.code === savedCurrency) || currencies[0]
      : currencies[0];
  });
  
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Budget Alert', message: 'You are close to your monthly Entertainment budget limit.', date: '2025-04-08', read: false },
    { id: 2, title: 'New Feature', message: 'Try our new AI Receipt Scanner to track expenses faster!', date: '2025-04-07', read: false },
    { id: 3, title: 'Transaction Alert', message: 'Large expense detected: $245.00 at Electronics Store', date: '2025-04-06', read: true },
  ]);

  const handleCurrencyChange = (currency: Currency) => {
    setSelectedCurrency(currency);
    // Save both code and symbol for easy access
    localStorage.setItem('selectedCurrencyCode', currency.code);
    localStorage.setItem('selectedCurrency', currency.symbol);
    
    // Trigger an event so other components can listen for changes
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'selectedCurrency',
      newValue: currency.symbol
    }));
    
    toast({
      title: "Currency Changed",
      description: `Your currency has been changed to ${currency.name}`,
    });
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={onMenuClick}>
          <Menu />
        </Button>
        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search transactions..." className="pl-8" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <span>{selectedCurrency.flag}</span>
              <span>{selectedCurrency.symbol}</span>
              <span>{selectedCurrency.code}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Select Currency</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {currencies.map((currency) => (
              <DropdownMenuItem 
                key={currency.code}
                onClick={() => handleCurrencyChange(currency)}
                className="flex items-center gap-2"
              >
                <span className="mr-1">{currency.flag}</span>
                <span>{currency.symbol}</span>
                <span>{currency.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="py-4 text-center text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={`flex flex-col items-start py-2 px-4 ${notification.read ? 'opacity-70' : 'font-medium'}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold">{notification.title}</span>
                    {!notification.read && (
                      <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600 mt-1">{notification.message}</span>
                  <span className="text-xs text-gray-500 mt-1">{notification.date}</span>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-white">JP</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
