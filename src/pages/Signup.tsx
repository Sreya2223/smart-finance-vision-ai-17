
import React from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import SignupForm from '@/components/auth/SignupForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

const Signup: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
  
  // If user is already logged in, redirect to dashboard or the page they tried to access
  if (user) {
    return <Navigate to={from} replace />;
  }
  
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join Smart Pockets today and take control of your financial future."
    >
      <SignupForm />
      <Toaster />
    </AuthLayout>
  );
};

export default Signup;
