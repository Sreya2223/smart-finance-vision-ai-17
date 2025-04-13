
import React from 'react';
import { Button } from '@/components/ui/button';

interface AccountSectionProps {
  handleLogout: () => void;
}

const AccountSection: React.FC<AccountSectionProps> = ({ handleLogout }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">Export All Data</h3>
          <p className="text-sm text-gray-500">Download all your financial data</p>
        </div>
        <Button variant="outline">Export Data</Button>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">Logout</h3>
          <p className="text-sm text-gray-500">Sign out from your account</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium text-red-600">Delete Account</h3>
          <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
        </div>
        <Button variant="destructive">Delete Account</Button>
      </div>
    </div>
  );
};

export default AccountSection;
