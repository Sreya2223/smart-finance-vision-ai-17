
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process for now
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "You have successfully logged in.",
      });
      // In a real app, we would store the token and redirect
      window.location.href = '/dashboard';
      setIsLoading(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className="w-full"
        />
      </div>
      <div>
        <div className="flex justify-between mb-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <a href="#" className="text-sm text-primary-600 hover:underline">
            Forgot password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          required
          className="w-full"
        />
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary-600" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Log in'}
      </Button>
      <div className="text-center mt-4">
        <span className="text-gray-600">Don't have an account? </span>
        <Link to="/signup" className="text-primary-600 hover:underline">
          Sign up
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
