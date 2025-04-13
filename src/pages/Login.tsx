
import React, { useEffect } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

const Login: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
  
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
