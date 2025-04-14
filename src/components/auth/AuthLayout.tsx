
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 dark:from-background dark:via-background/95 dark:to-primary/10 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        <div className="absolute top-2 right-2 z-20">
          <ThemeToggle />
        </div>
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>
        <Card className="border-none shadow-xl dark:shadow-primary/5 backdrop-blur-sm bg-white/95 dark:bg-gray-900/90">
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
      
      {/* Decorative elements for premium feel */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/5 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/5 w-80 h-80 bg-secondary/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default AuthLayout;
