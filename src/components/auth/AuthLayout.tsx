
import React from 'react';
import Logo from '../common/Logo';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/theme-toggle';

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 dark:from-background dark:to-primary/5 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        <div className="absolute top-2 right-2">
          <ThemeToggle />
        </div>
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>
        <Card className="border-none shadow-xl dark:shadow-primary/5 backdrop-blur-sm">
          <div className="px-8 pt-8 pb-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent dark:from-primary-foreground dark:to-primary-foreground/80 mb-2">{title}</h1>
            <p className="text-muted-foreground mb-6">{subtitle}</p>
          </div>
          <CardContent className="px-8 py-6">
            {children}
          </CardContent>
        </Card>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Smart Pockets. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
