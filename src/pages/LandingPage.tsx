
import React from 'react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/common/Logo';
import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronRight, BarChart3, CreditCard, Lock, PieChart } from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      title: 'Visual Analytics',
      description: 'Understand your spending patterns with beautiful, interactive charts.'
    },
    {
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      title: 'Expense Tracking',
      description: 'Easily track and categorize all your expenses in one place.'
    },
    {
      icon: <PieChart className="h-6 w-6 text-primary" />,
      title: 'Budget Planning',
      description: 'Set monthly budgets and monitor your progress towards financial goals.'
    },
    {
      icon: <Lock className="h-6 w-6 text-primary" />,
      title: 'Secure Data',
      description: 'Your financial information is encrypted and securely stored.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="w-full py-4 px-6 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo size="lg" />
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-primary hover:bg-primary-600">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-dark leading-tight mb-6">
              Smart finances for smarter decisions
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Gain control over your finances with our powerful yet simple-to-use AI-driven financial management platform.
            </p>
            <div className="space-y-4 mb-8">
              {[
                'Track expenses and income effortlessly',
                'Visualize spending patterns with AI analytics',
                'Set and monitor budgets across multiple categories',
                'Scan receipts to capture expenses instantly'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Link to="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary-600">
                Get Started <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="hidden md:block">
            <img
              src="/lovable-uploads/13185240-d1b7-411e-94a9-2d83dd38b7fb.png"
              alt="Smart Pockets Dashboard"
              className="w-full h-auto max-w-md mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark mb-4">Features that empower your finances</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Smart Pockets combines powerful financial tools with AI technology to help you make smarter decisions about your money.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 bg-primary/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-dark mb-4">Ready to take control of your finances?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of users who have transformed their financial habits with Smart Pockets.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-primary hover:bg-primary-600">
              Start your financial journey
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-6 bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Logo size="sm" />
          </div>
          <div className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Smart Pockets. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
