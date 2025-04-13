
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactions } from '@/contexts/TransactionContext';
import { CircleDollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const UserProfileSection: React.FC = () => {
  const { user } = useAuth();
  const { totalIncome, totalExpenses, totalBalance } = useTransactions();

  const userName = user?.user_metadata?.full_name || 'User';
  const userAvatar = user?.user_metadata?.avatar_url;
  const userInitials = userName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  // Format numbers with currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card className="border-none shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-primary-600 text-white p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-4 border-white/20">
            <AvatarImage src={userAvatar} />
            <AvatarFallback className="text-2xl bg-primary-700">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{userName}</h2>
            <p className="text-white/80">{user?.email}</p>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Income</p>
              <h3 className="text-xl font-bold text-green-600">{formatCurrency(totalIncome)}</h3>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <h3 className="text-xl font-bold text-red-600">{formatCurrency(totalExpenses)}</h3>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <div className="p-3 bg-blue-100 rounded-full">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Net Balance</p>
              <h3 className="text-xl font-bold text-blue-600">{formatCurrency(totalBalance)}</h3>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileSection;
