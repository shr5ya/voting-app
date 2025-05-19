import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { 
  Settings as SettingsIcon, Trash2, StopCircle, UserMinus, UserX, 
  Bell, Shield, Lock, Eye, EyeOff, Globe, Moon, Sun, Smartphone, Mail, Save
} from 'lucide-react';
import { useElection } from '@/contexts/ElectionContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassContainer } from '@/components/ui/glass-components';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { setTheme } = useTheme();
  const { elections, deleteElection, stopPolling, removeVoter, removeCandidate, voters } = useElection();
  const [selectedElection, setSelectedElection] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Account settings state
  const [accountSettings, setAccountSettings] = useState({
    email: user?.email || 'shreya@electra.com',
    password: '•••••••••••',
    showPassword: false,
    language: 'English',
    timezone: 'Asia/Kolkata'
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    votingReminders: true,
    resultAlerts: true,
    marketingEmails: false
  });

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    twoFactorAuth: false,
    autoLogout: true,
    dataSharing: false,
    activityTracking: true,
    inactivityTimeout: 30
  });

  // Candidates: flatten all candidates from all elections (unique by id)
  const candidates = Array.from(
    new Map(
      elections.flatMap(e => e.candidates).map(c => [c.id, c])
    ).values()
  );
  const [selectedVoter, setSelectedVoter] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState('');

  const handlePasswordToggle = () => {
    setAccountSettings({
      ...accountSettings,
      showPassword: !accountSettings.showPassword
    });
  };

  const handleNotificationChange = (name: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrivacyChange = (name: string, value: boolean | number) => {
    setPrivacySettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = () => {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Settings updated successfully");
      setIsUpdating(false);
    }, 1000);
  };

  return (
    <Layout>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="min-h-screen py-12 px-2"
      >
        <h1 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-lg">Settings</h1>
        
        <Tabs defaultValue="account" className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
          </TabsList>
          
          {/* Account Settings Tab */}
          <TabsContent value="account">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GlassContainer variant="panel" className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <SettingsIcon className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Account Settings</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="email" 
                          name="email"
                          value={accountSettings.email} 
                          onChange={handleInputChange}
                          className="pl-10" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="password" 
                          name="password"
                          type={accountSettings.showPassword ? "text" : "password"} 
                          value={accountSettings.password} 
                          onChange={handleInputChange}
                          className="pl-10" 
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          type="button"
                          onClick={handlePasswordToggle}
                          className="absolute right-1 top-1"
                        >
                          {accountSettings.showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select 
                        defaultValue={accountSettings.language}
                        onValueChange={(value) => setAccountSettings(prev => ({...prev, language: value}))}
                      >
                        <SelectTrigger className="w-full pl-3">
                          <Globe className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="German">German</SelectItem>
                          <SelectItem value="Hindi">Hindi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select 
                        defaultValue={accountSettings.timezone}
                        onValueChange={(value) => setAccountSettings(prev => ({...prev, timezone: value}))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Los Angeles (GMT-8)</SelectItem>
                          <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                          <SelectItem value="Asia/Kolkata">India (GMT+5:30)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="flex items-center space-x-4 mt-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 py-6"
                        onClick={() => setTheme('light')}
                      >
                        <Sun className="mr-2 h-4 w-4" />
                        Light
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 py-6"
                        onClick={() => setTheme('dark')}
                      >
                        <Moon className="mr-2 h-4 w-4" />
                        Dark
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 py-6"
                        onClick={() => setTheme('system')}
                      >
                        <Smartphone className="mr-2 h-4 w-4" />
                        System
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleSaveSettings} 
                    disabled={isUpdating}
                    className="w-full"
                  >
                    {isUpdating ? 'Saving...' : 'Save Account Settings'}
                  </Button>
                </div>
              </GlassContainer>
            </motion.div>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GlassContainer variant="panel" className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Notification Settings</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.emailNotifications} 
                        onCheckedChange={(value) => handleNotificationChange('emailNotifications', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.pushNotifications} 
                        onCheckedChange={(value) => handleNotificationChange('pushNotifications', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Voting Reminders</h3>
                        <p className="text-sm text-muted-foreground">Get reminders about upcoming and active elections</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.votingReminders} 
                        onCheckedChange={(value) => handleNotificationChange('votingReminders', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Results Alerts</h3>
                        <p className="text-sm text-muted-foreground">Be notified when election results are available</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.resultAlerts} 
                        onCheckedChange={(value) => handleNotificationChange('resultAlerts', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Marketing Emails</h3>
                        <p className="text-sm text-muted-foreground">Receive updates about new features and promotions</p>
                      </div>
                      <Switch 
                        checked={notificationSettings.marketingEmails} 
                        onCheckedChange={(value) => handleNotificationChange('marketingEmails', value)}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleSaveSettings} 
                    disabled={isUpdating}
                    className="w-full"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isUpdating ? 'Saving...' : 'Save Notification Settings'}
                  </Button>
                </div>
              </GlassContainer>
            </motion.div>
          </TabsContent>
          
          {/* Privacy & Security Tab */}
          <TabsContent value="privacy">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GlassContainer variant="panel" className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Privacy & Security</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch 
                        checked={privacySettings.twoFactorAuth} 
                        onCheckedChange={(value) => handlePrivacyChange('twoFactorAuth', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Auto Logout</h3>
                        <p className="text-sm text-muted-foreground">Automatically log out when inactive</p>
                      </div>
                      <Switch 
                        checked={privacySettings.autoLogout} 
                        onCheckedChange={(value) => handlePrivacyChange('autoLogout', value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Inactivity Timeout (minutes)</h3>
                        <span className="font-medium">{privacySettings.inactivityTimeout}</span>
                      </div>
                      <Slider
                        defaultValue={[privacySettings.inactivityTimeout]}
                        max={60}
                        min={5}
                        step={5}
                        disabled={!privacySettings.autoLogout}
                        onValueChange={(value) => handlePrivacyChange('inactivityTimeout', value[0])}
                        className="bg-transparent"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Data Sharing</h3>
                        <p className="text-sm text-muted-foreground">Allow anonymous data collection to improve services</p>
                      </div>
                      <Switch 
                        checked={privacySettings.dataSharing} 
                        onCheckedChange={(value) => handlePrivacyChange('dataSharing', value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Activity Tracking</h3>
                        <p className="text-sm text-muted-foreground">Track your activity for security purposes</p>
                      </div>
                      <Switch 
                        checked={privacySettings.activityTracking} 
                        onCheckedChange={(value) => handlePrivacyChange('activityTracking', value)}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleSaveSettings} 
                    disabled={isUpdating}
                    className="w-full"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isUpdating ? 'Saving...' : 'Save Privacy Settings'}
                  </Button>
                </div>
              </GlassContainer>
            </motion.div>
          </TabsContent>
        </Tabs>
        
        {/* Admin Controls Section */}
        {user?.role === 'admin' && (
          <motion.div 
            className="mt-10 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Admin Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Remove Poll */}
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Card className="shadow-xl hover:shadow-2xl transition-all duration-200 border-2 border-transparent hover:border-red-300 bg-card dark:bg-card rounded-xl glass-tile">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <Trash2 className="w-8 h-8 text-red-500" />
                    <CardTitle className="text-xl font-bold leading-tight mb-1 text-foreground dark:text-foreground">Remove Poll</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <select
                      className="w-full p-2 rounded-lg border mb-2 bg-background/80 backdrop-blur-sm"
                      value={selectedElection}
                      onChange={e => setSelectedElection(e.target.value)}
                    >
                      <option value="">Select Election</option>
                      {elections.map(e => (
                        <option key={e.id} value={e.id}>{e.title}</option>
                      ))}
                    </select>
                    <Button
                      variant="destructive"
                      className="w-full"
                      disabled={!selectedElection}
                      onClick={() => {
                        if (selectedElection) {
                          deleteElection(selectedElection);
                          toast.success("Election removed successfully");
                        }
                      }}
                    >
                      Remove Poll
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stop Polling */}
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Card className="shadow-xl hover:shadow-2xl transition-all duration-200 border-2 border-transparent hover:border-yellow-300 bg-card dark:bg-card rounded-xl glass-tile">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <StopCircle className="w-8 h-8 text-yellow-500" />
                    <CardTitle className="text-xl font-bold leading-tight mb-1 text-foreground dark:text-foreground">Stop Polling</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <select
                      className="w-full p-2 rounded-lg border mb-2 bg-background/80 backdrop-blur-sm"
                      value={selectedElection}
                      onChange={e => setSelectedElection(e.target.value)}
                    >
                      <option value="">Select Election</option>
                      {elections.map(e => (
                        <option key={e.id} value={e.id}>{e.title}</option>
                      ))}
                    </select>
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={!selectedElection}
                      onClick={() => {
                        stopPolling(selectedElection);
                        toast.success("Polling stopped successfully");
                      }}
                    >
                      Stop Polling
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Remove Voter */}
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Card className="shadow-xl hover:shadow-2xl transition-all duration-200 border-2 border-transparent hover:border-blue-300 bg-card dark:bg-card rounded-xl glass-tile">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <UserMinus className="w-8 h-8 text-blue-500" />
                    <CardTitle className="text-xl font-bold leading-tight mb-1 text-foreground dark:text-foreground">Remove Voter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <select
                      className="w-full p-2 rounded-lg border mb-2 bg-background/80 backdrop-blur-sm"
                      value={selectedVoter}
                      onChange={e => setSelectedVoter(e.target.value)}
                    >
                      <option value="">Select Voter</option>
                      {voters.map(v => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </select>
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={!selectedVoter}
                      onClick={() => {
                        removeVoter(selectedVoter);
                        toast.success("Voter removed successfully");
                      }}
                    >
                      Remove Voter
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Remove Candidate */}
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Card className="shadow-xl hover:shadow-2xl transition-all duration-200 border-2 border-transparent hover:border-pink-300 bg-card dark:bg-card rounded-xl glass-tile">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <UserX className="w-8 h-8 text-pink-500" />
                    <CardTitle className="text-xl font-bold leading-tight mb-1 text-foreground dark:text-foreground">Remove Candidate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <select
                      className="w-full p-2 rounded-lg border mb-2 bg-background/80 backdrop-blur-sm"
                      value={selectedCandidate}
                      onChange={e => setSelectedCandidate(e.target.value)}
                    >
                      <option value="">Select Candidate</option>
                      {candidates.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={!selectedCandidate}
                      onClick={() => {
                        removeCandidate(selectedCandidate);
                        toast.success("Candidate removed successfully");
                      }}
                    >
                      Remove Candidate
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  );
};

export default Settings; 