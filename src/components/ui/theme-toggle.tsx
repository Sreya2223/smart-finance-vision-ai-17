
import React, { createContext, useContext } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

// Create a context for theme
const ThemeContext = createContext<{
  theme: string;
  toggleTheme: () => void;
  setThemeValue: (theme: string) => void;
}>({
  theme: 'light',
  toggleTheme: () => {},
  setThemeValue: () => {}
});

// Create a custom hook to manage theme
export function useTheme() {
  return useContext(ThemeContext);
}

// Create a provider component
export function ThemeProvider({ 
  children, 
  defaultTheme = 'light', 
  storageKey = 'theme' 
}: { 
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
}) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(storageKey) || defaultTheme;
    }
    return defaultTheme;
  });

  useEffect(() => {
    // Update class on document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem(storageKey, theme);
    
    // Dispatch storage event so other components can listen
    window.dispatchEvent(new StorageEvent('storage', {
      key: storageKey,
      newValue: theme
    }));
  }, [theme, storageKey]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const setThemeValue = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setThemeValue }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
