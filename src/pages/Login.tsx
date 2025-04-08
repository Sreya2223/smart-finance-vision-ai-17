
import React from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your credentials to access your account"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
