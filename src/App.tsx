
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Expenses from './pages/Expenses';
import ScanReceipt from './pages/ScanReceipt';
import Settings from './pages/Settings';
import Budget from './pages/Budget';
import TaxCalculator from './pages/TaxCalculator';
import Income from './pages/Income';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useTheme } from '@/components/ui/theme-toggle';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TransactionProvider } from './contexts/TransactionContext';
import { AuthProvider } from './contexts/AuthContext';

// Custom ThemeProvider wrapper component
export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
}> = ({ children, defaultTheme = 'system', storageKey = 'vite-ui-theme' }) => {
  return (
    <div>
      {children}
    </div>
  );
};

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Router>
          <AuthProvider>
            <TransactionProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/income" element={<Income />} />
                <Route path="/scan-receipt" element={<ScanReceipt />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/tax-calculator" element={<TaxCalculator />} />
              </Routes>
            </TransactionProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
