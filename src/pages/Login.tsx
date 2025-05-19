import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { 
  Loader2, 
  User, 
  UserCog, 
  AtSign, 
  Lock, 
  HelpCircle 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Define the form schema for admin login
const adminLoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(4, { message: 'Password must be at least 4 characters' }),
});

// Define the form schema for voter login
const voterLoginSchema = z.object({
  voterId: z.string().min(3, { message: 'Please enter a valid voter ID' }),
  accessCode: z.string().min(4, { message: 'Access code must be at least 4 characters' }),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;
type VoterLoginFormValues = z.infer<typeof voterLoginSchema>;

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginMode, setLoginMode] = useState<'admin' | 'voter'>('admin');

  // Initialize the admin form
  const adminForm = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Initialize the voter form
  const voterForm = useForm<VoterLoginFormValues>({
    resolver: zodResolver(voterLoginSchema),
    defaultValues: {
      voterId: '',
      accessCode: '',
    },
  });

  // Handle admin form submission
  const onAdminSubmit = async (values: AdminLoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(values.email, values.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle voter form submission
  const onVoterSubmit = async (values: VoterLoginFormValues) => {
    setIsSubmitting(true);
    try {
      // For demo purposes, we'll use a simplified voter login
      // In a real app, this would validate against a different endpoint
      await login(values.voterId, values.accessCode);
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error('Voter login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    const userType = loginMode === 'admin' ? 'an administrator' : 'a voter';
    
    toast.info(`Reset Password`, {
      description: `Instructions to reset your password will be sent if you are registered as ${userType}.`,
      duration: 5000,
    });
  };

  return (
    <Layout>
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md glass-card animate-fade-in">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/20 p-2 backdrop-blur-sm flex items-center justify-center">
              {loginMode === 'admin' ? (
                <UserCog className="h-6 w-6 text-primary" />
              ) : (
                <User className="h-6 w-6 text-primary" />
              )}
            </div>
            <CardTitle className="text-3xl font-heading">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your {loginMode === 'admin' ? 'administration' : 'voting'} account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="admin" className="w-full" onValueChange={(value) => setLoginMode(value as 'admin' | 'voter')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="admin" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <UserCog className="mr-2 h-4 w-4" />
                  Administrator
                </TabsTrigger>
                <TabsTrigger value="voter" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <User className="mr-2 h-4 w-4" />
                  Voter
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="admin">
                <Form {...adminForm}>
                  <form onSubmit={adminForm.handleSubmit(onAdminSubmit)} className="space-y-6">
                    <FormField
                      control={adminForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <AtSign className="mr-1 h-4 w-4 text-muted-foreground" />
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="glass-input"
                              type="email"
                              placeholder="you@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={adminForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Lock className="mr-1 h-4 w-4 text-muted-foreground" />
                            Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="glass-input"
                              type="password"
                              placeholder="••••••••"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="text-sm text-right">
                      <button 
                        type="button" 
                        onClick={handleForgotPassword} 
                        className="text-primary hover:underline flex items-center justify-end w-full"
                      >
                        <HelpCircle className="mr-1 h-3 w-3" />
                        Forgot password?
                      </button>
                    </div>
                    <Button type="submit" className="w-full glass-button" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        'Sign In as Admin'
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="voter">
                <Form {...voterForm}>
                  <form onSubmit={voterForm.handleSubmit(onVoterSubmit)} className="space-y-6">
                    <FormField
                      control={voterForm.control}
                      name="voterId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <User className="mr-1 h-4 w-4 text-muted-foreground" />
                            Voter ID
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="glass-input"
                              type="text"
                              placeholder="Enter your voter ID"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={voterForm.control}
                      name="accessCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Lock className="mr-1 h-4 w-4 text-muted-foreground" />
                            Access Code
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="glass-input"
                              type="password"
                              placeholder="Enter your access code"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="text-sm text-right">
                      <button 
                        type="button" 
                        onClick={handleForgotPassword} 
                        className="text-primary hover:underline flex items-center justify-end w-full"
                      >
                        <HelpCircle className="mr-1 h-3 w-3" />
                        Forgot access code?
                      </button>
                    </div>
                    <Button type="submit" className="w-full glass-button" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Access Ballot'
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardFooter>
          
          {/* Demo accounts info */}
          <div className="px-6 pb-6">
            <div className="rounded-md bg-blue-50 dark:bg-blue-900/30 p-3">
              <div className="text-sm text-blue-800 dark:text-blue-300">
                {/* <p className="font-medium mb-1">Demo Accounts:</p> */}
                {/* <p className="text-xs">Admin: admin@electra.com / admin</p>
                <p className="text-xs">Voter: voter@electra.com / voter</p> */}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
