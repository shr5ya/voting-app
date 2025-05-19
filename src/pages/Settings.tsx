import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Settings as SettingsIcon, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme} mode`);
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">
            <SettingsIcon className="inline-block mr-2 h-8 w-8" />
            Settings
          </h1>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-5 w-5 text-muted-foreground" />
                  <Switch 
                    checked={theme === 'dark'} 
                    onCheckedChange={handleThemeToggle}
                  />
                  <Moon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Name:</strong> {user?.name || 'Not logged in'}</p>
                <p><strong>Email:</strong> {user?.email || 'Not logged in'}</p>
                <p><strong>Role:</strong> {user?.role || 'Not logged in'}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Electra Voting App v1.0.0</p>
              <p className="text-muted-foreground">© 2024 Electra. All rights reserved.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings; 