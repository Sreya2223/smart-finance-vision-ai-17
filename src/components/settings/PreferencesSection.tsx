
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from '@/components/ui/theme-toggle';

interface PreferencesSectionProps {
  preferences: {
    currency: string;
    theme: string;
    emailNotifications: boolean;
    appNotifications: boolean;
    budgetAlerts: boolean;
    weeklyReports: boolean;
  };
  setPreferences: React.Dispatch<React.SetStateAction<{
    currency: string;
    theme: string;
    emailNotifications: boolean;
    appNotifications: boolean;
    budgetAlerts: boolean;
    weeklyReports: boolean;
  }>>;
  currencies: { code: string; symbol: string; name: string; flag: string; }[];
  handlePreferencesUpdate: () => void;
}

const PreferencesSection: React.FC<PreferencesSectionProps> = ({ 
  preferences, 
  setPreferences, 
  currencies,
  handlePreferencesUpdate 
}) => {
  return (
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
  );
};

export default PreferencesSection;
