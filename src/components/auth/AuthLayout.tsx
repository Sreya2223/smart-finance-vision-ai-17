
import React from 'react';
import Logo from '../common/Logo';
import { Card, CardContent } from '@/components/ui/card';

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-secondary-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>
        <Card className="border-none shadow-lg">
          <div className="px-8 pt-8 pb-2">
            <h1 className="text-3xl font-bold text-primary mb-2">{title}</h1>
            <p className="text-gray-600 mb-6">{subtitle}</p>
          </div>
          <CardContent className="px-8 py-6">
            {children}
          </CardContent>
        </Card>
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Smart Pockets. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
