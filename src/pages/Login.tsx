
import React from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your credentials to access your account. If you're a new user, please sign up instead."
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
