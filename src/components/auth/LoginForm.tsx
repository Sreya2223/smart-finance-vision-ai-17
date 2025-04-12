
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';

// Form validation schema
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to dashboard
  const from = (location.state as { from?: Location })?.from?.pathname || '/dashboard';

  // Initialize form with validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      await login(values.email, values.password);
      
      toast({
        title: "Success!",
        description: "You have successfully logged in.",
      });
      
      // Navigate to the intended route or dashboard
      navigate(from, { replace: true });
    } catch (error: any) {
      // Handle specific error cases
      if (error.message.includes('email_not_confirmed')) {
        setErrorMessage("Please check your email and follow the verification link to confirm your account.");
      } else {
        setErrorMessage(error.message || "Invalid email or password. Please try again.");
      }
      
      toast({
        title: "Login failed",
        description: "There was a problem logging in. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      {errorMessage && (
        <Alert className="mb-4 bg-destructive/15 border-destructive/30">
          <AlertDescription className="text-destructive">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Your email address"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Password</FormLabel>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  placeholder="Your password"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full bg-primary hover:bg-primary-600" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : 'Log in'}
        </Button>
        
        <div className="text-center mt-4">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
