import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

// Define the API base URL
const API_URL = 'http://localhost:5002/api/v1';

// Define the shape of our user object
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'voter';
  token?: string;
  profileImage?: string;
}

// Define the shape of our auth context
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateProfile: (updates: { name?: string; profileImage?: string }) => Promise<void>;
}

// Interface for voter info passing to parent component
export interface VoterInfo {
  name: string;
  email: string;
}

// Props for the AuthProvider
interface AuthProviderProps {
  children: React.ReactNode;
  onUserLogin?: (voter: VoterInfo) => void; 
  onUserRegister?: (voter: VoterInfo) => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
  updateProfile: async () => {}
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const userJson = localStorage.getItem('electra-user');
    if (userJson) {
      const user = JSON.parse(userJson);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, onUserLogin, onUserRegister }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('electra-user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      // Notify parent component about the user
      if (onUserLogin && parsedUser.role === 'voter') {
        onUserLogin({
          name: parsedUser.name,
          email: parsedUser.email
        });
      }
    }
    setIsLoading(false);
  }, [onUserLogin]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting login with:', { email, password });
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data && response.data.token) {
        // Format user object from API response
        const userData: User = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role,
          token: response.data.token
        };
        
        setUser(userData);
        localStorage.setItem('electra-user', JSON.stringify(userData));
        
        // Notify parent component if this is a voter
        if (userData.role === 'voter' && onUserLogin) {
          onUserLogin({
            name: userData.name,
            email: userData.email
          });
        }
        
        toast.success("Login successful!", {
          description: `Welcome back, ${userData.name}!`,
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || "Login failed";
        console.error('Login error details:', error.response?.data);
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error("Login failed", { description: errorMessage });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password });
      
      if (response.data && response.data.user) {
        // In a real implementation, you might need to login immediately after registration
        // or the server might return a token directly
        
        // For now, we'll just set the user info and then require login
        toast.success("Registration successful!", {
          description: `Welcome to Electra, ${response.data.user.name}! Please login with your credentials.`,
        });
        
        // Notify parent component if this is a voter
        if (response.data.user.role === 'voter' && onUserRegister) {
          onUserRegister({
            name: response.data.user.name,
            email: response.data.user.email
          });
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || "Registration failed";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error("Registration failed", { description: errorMessage });
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

  const updateProfile = async (updates: { name?: string; profileImage?: string }) => {
    setIsLoading(true);
    try {
      if (!user) {
        throw new Error('No authenticated user');
      }

      // In a real app, you would send this to your API
      // const response = await api.put('/auth/profile', updates);
      
      // For this demo, we'll just update it locally
      const updatedUser = {
        ...user,
        ...updates
      };
      
      setUser(updatedUser);
      localStorage.setItem('electra-user', JSON.stringify(updatedUser));
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || "Profile update failed";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error("Profile update failed", { description: errorMessage });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout,
      isAuthenticated: !!user,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
