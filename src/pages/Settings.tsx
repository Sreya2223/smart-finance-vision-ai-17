
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/ui/theme-toggle';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const { theme, setThemeValue } = useTheme();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Get user information from metadata
  const userEmail = user?.email || '';
  const userName = user?.user_metadata?.full_name || '';
  const userAvatar = user?.user_metadata?.avatar_url || '';
  
  const [currencies] = useState([
    { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  ]);
  
  const [profileData, setProfileData] = useState({
    name: userName || 'John Doe',
    email: userEmail || 'john.doe@example.com',
    avatar: userAvatar || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Update profile data when user object changes
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: userName || prev.name,
        email: userEmail || prev.email,
        avatar: userAvatar || prev.avatar,
      }));
    }
  }, [user, userName, userEmail, userAvatar]);
  
  const [preferences, setPreferences] = useState({
    currency: localStorage.getItem('selectedCurrencyCode') || 'INR',
    theme: theme || 'light', // Use the current theme from useTheme
    emailNotifications: true,
    appNotifications: true,
    budgetAlerts: true,
    weeklyReports: true,
  });
  
  // Update theme preference when theme changes
  useEffect(() => {
    setPreferences(prev => ({
      ...prev,
      theme
    }));
  }, [theme]);
  
  const handleProfileUpdate = async () => {
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Your new password and confirmation password do not match.",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);

    try {
      let updates = {};
      
      // Update name if provided
      if (profileData.name && profileData.name !== userName) {
        updates = {
          ...updates,
          data: { 
            full_name: profileData.name 
          }
        };
      }
      
      // Update password if provided
      if (profileData.currentPassword && profileData.newPassword) {
        const { error } = await supabase.auth.updateUser({
          password: profileData.newPassword
        });
        
        if (error) throw error;
        
        // Clear password fields
        setProfileData({
          ...profileData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
      
      // Update metadata if needed
      if (Object.keys(updates).length > 0) {
        const { error } = await supabase.auth.updateUser(updates);
        if (error) throw error;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile information",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handlePreferencesUpdate = () => {
    // Update saved currency preference
    if (preferences.currency) {
      const currencyObj = currencies.find(c => c.code === preferences.currency);
      if (currencyObj) {
        localStorage.setItem('selectedCurrencyCode', currencyObj.code);
        localStorage.setItem('selectedCurrency', currencyObj.symbol);
        
        // Trigger an event so other components can listen for changes
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'selectedCurrency',
          newValue: currencyObj.symbol
        }));
      }
    }
    
    // Update theme if changed
    if (preferences.theme !== theme) {
      setThemeValue(preferences.theme);
    }
    
    toast({
      title: "Preferences updated",
      description: "Your preferences have been saved.",
    });
  };
  
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
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileData.avatar} />
                  <AvatarFallback className="text-2xl">{profileData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Photo</Button>
              </div>
              
              <div className="space-y-4 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={profileData.name}
                      onChange={e => setProfileData({...profileData, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={profileData.email}
                      readOnly
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    placeholder="Enter current password" 
                    value={profileData.currentPassword}
                    onChange={e => setProfileData({...profileData, currentPassword: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      placeholder="Enter new password" 
                      value={profileData.newPassword}
                      onChange={e => setProfileData({...profileData, newPassword: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      placeholder="Confirm new password" 
                      value={profileData.confirmPassword}
                      onChange={e => setProfileData({...profileData, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleProfileUpdate} disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your app experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currency-preference">Default Currency</Label>
                  <Select 
                    value={preferences.currency}
                    onValueChange={value => setPreferences({...preferences, currency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(currency => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center gap-2">
                            <span>{currency.flag}</span>
                            <span>{currency.name} ({currency.symbol})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="theme-preference">Theme</Label>
                  <Select 
                    value={preferences.theme}
                    onValueChange={value => setPreferences({...preferences, theme: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="font-normal">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive important updates via email</p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={preferences.emailNotifications}
                    onCheckedChange={checked => setPreferences({...preferences, emailNotifications: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="app-notifications" className="font-normal">App Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications within the app</p>
                  </div>
                  <Switch 
                    id="app-notifications" 
                    checked={preferences.appNotifications}
                    onCheckedChange={checked => setPreferences({...preferences, appNotifications: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="budget-alerts" className="font-normal">Budget Alerts</Label>
                    <p className="text-sm text-gray-500">Get notified when you approach budget limits</p>
                  </div>
                  <Switch 
                    id="budget-alerts" 
                    checked={preferences.budgetAlerts}
                    onCheckedChange={checked => setPreferences({...preferences, budgetAlerts: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-reports" className="font-normal">Weekly Reports</Label>
                    <p className="text-sm text-gray-500">Receive weekly summary of your finances</p>
                  </div>
                  <Switch 
                    id="weekly-reports" 
                    checked={preferences.weeklyReports}
                    onCheckedChange={checked => setPreferences({...preferences, weeklyReports: checked})}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handlePreferencesUpdate}>Save Preferences</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
