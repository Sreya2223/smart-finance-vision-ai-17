
import React from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { user } = useAuth();
  
  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your credentials to access your finances and start managing your money smarter."
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
