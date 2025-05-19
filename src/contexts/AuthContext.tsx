import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define the shape of our user object
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'voter';
}

// Define the shape of our auth context
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// In a real app, these would connect to your backend
const mockLogin = async (email: string, password: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Allow any user to log in for demo mode
  return {
    id: Math.random().toString(36).substring(2, 9),
    name: email.split('@')[0] || 'Demo User',
    email,
    role: email === 'admin@electra.com' ? 'admin' : 'voter',
  };
};

const mockRegister = async (name: string, email: string, password: string): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would validate and create a new user on the server
  return {
    id: Math.random().toString(36).substring(2, 9),
    name,
    email,
    role: 'voter' as const
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('electra-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await mockLogin(email, password);
      setUser(user);
      localStorage.setItem('electra-user', JSON.stringify(user));
      toast.success("Login successful!", {
        description: `Welcome back, ${user.name}!`,
      });
    } catch (error) {
      toast.error("Login failed", { 
        description: error instanceof Error ? error.message : "Unknown error" 
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await mockRegister(name, email, password);
      setUser(user);
      localStorage.setItem('electra-user', JSON.stringify(user));
      toast.success("Registration successful!", {
        description: `Welcome to Electra, ${user.name}!`,
      });
    } catch (error) {
      toast.error("Registration failed", { 
        description: error instanceof Error ? error.message : "Unknown error" 
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('electra-user');
    toast.success("You've been logged out");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
