
import React from 'react';
import Logo from '../common/Logo';

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 w-full">
          <h1 className="text-2xl font-bold text-dark mb-2">{title}</h1>
          <p className="text-gray-600 mb-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
