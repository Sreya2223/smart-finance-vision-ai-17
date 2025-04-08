
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, createContext, useContext, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ScanReceipt from "./pages/ScanReceipt";
import NotFound from "./pages/NotFound";
import Income from "./pages/Income";
import Expenses from "./pages/Expenses";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

// Create auth context
interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  
  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    // Set default currency to INR
    if (!localStorage.getItem('selectedCurrency')) {
      localStorage.setItem('selectedCurrency', '₹');
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    // This would be replaced with a real API call
    // For demo, we're just simulating a login
    const mockUser = { 
      id: '1', 
      email, 
      name: 'John Doe',
      avatar: '',
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  // Signup function
  const signup = async (userData: any) => {
    // This would be replaced with a real API call
    // For demo, we're just simulating a signup
    const mockUser = { 
      id: '1', 
      ...userData,
      avatar: '',
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/income" 
              element={
                <ProtectedRoute>
                  <Income />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/expenses" 
              element={
                <ProtectedRoute>
                  <Expenses />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/budget" 
              element={
                <ProtectedRoute>
                  <Budget />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/scan-receipt" 
              element={
                <ProtectedRoute>
                  <ScanReceipt />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            
            {/* For demo purposes, also allow direct access */}
            <Route path="/demo/dashboard" element={<Dashboard />} />
            <Route path="/demo/scan-receipt" element={<ScanReceipt />} />
            <Route path="/demo/income" element={<Income />} />
            <Route path="/demo/expenses" element={<Expenses />} />
            <Route path="/demo/budget" element={<Budget />} />
            <Route path="/demo/reports" element={<Reports />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
