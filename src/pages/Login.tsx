
import React from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

const Login: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-background to-secondary/10 dark:from-background dark:to-primary/5">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  // If user is already logged in, redirect to dashboard or the page they tried to access
  if (user) {
    return <Navigate to={from} replace />;
  }
  
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your credentials to access your finances and start managing your money smarter."
    >
      <LoginForm />
      <Toaster />
    </AuthLayout>
  );
};

export default Login;
