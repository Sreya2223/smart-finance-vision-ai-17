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
import { ThemeProvider } from '@/components/ui/theme-toggle';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TransactionProvider } from './contexts/TransactionContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <TransactionProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/scan-receipt" element={<ScanReceipt />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/tax-calculator" element={<TaxCalculator />} />
            </Routes>
          </Router>
        </TransactionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
