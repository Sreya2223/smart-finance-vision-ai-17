
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/ui/theme-toggle';
import { useToast } from '@/hooks/use-toast';

export const usePreferences = () => {
  const { toast } = useToast();
  const { theme, setThemeValue } = useTheme();
  
  const [currencies] = useState([
    { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  ]);
  
  const [preferences, setPreferences] = useState({
    currency: localStorage.getItem('selectedCurrencyCode') || 'INR',
    theme: theme || 'light',
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

  return { 
    preferences, 
    setPreferences, 
    currencies, 
    handlePreferencesUpdate 
  };
};
