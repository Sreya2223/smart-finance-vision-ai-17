
import React, { useState } from 'react';
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

type DashboardHeaderProps = {
  onMenuClick: () => void;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuClick }) => {
  const [currencies, setCurrencies] = useState([
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  ]);

  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={onMenuClick}>
          <Menu />
        </Button>
        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search..." className="pl-8" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
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
                onClick={() => setSelectedCurrency(currency)}
              >
                <span className="mr-2">{currency.symbol}</span>
                <span>{currency.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>

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
