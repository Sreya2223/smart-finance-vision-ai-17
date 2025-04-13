
import React, { useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import ProfileSection from '@/components/settings/ProfileSection';
import PreferencesSection from '@/components/settings/PreferencesSection';
import AccountSection from '@/components/settings/AccountSection';
import { usePreferences } from '@/hooks/usePreferences';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const { preferences, setPreferences, currencies, handlePreferencesUpdate } = usePreferences();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileSection user={user} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your app experience</CardDescription>
          </CardHeader>
          <CardContent>
            <PreferencesSection 
              preferences={preferences}
              setPreferences={setPreferences}
              currencies={currencies}
              handlePreferencesUpdate={handlePreferencesUpdate}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <AccountSection handleLogout={handleLogout} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
