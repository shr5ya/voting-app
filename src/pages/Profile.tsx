import React, { useState, useRef } from 'react';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Calendar, Award, BookOpen, Edit, Save, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassContainer } from '@/components/ui/glass-components';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mock data for elections and votes stats (would come from API in real app)
  const mockStats = {
    elections: 12,
    votesCreated: 1254
  };
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    profileImage: user?.profileImage || ''
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleEditToggle = () => {
    if (isEditing) {
      // Discard changes
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        profileImage: user?.profileImage || ''
      });
      setPreviewImage(null);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setFormData(prev => ({ ...prev, profileImage: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        name: formData.name,
        profileImage: previewImage || formData.profileImage
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  return (
    <Layout>
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold font-heading">Profile</h1>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="glass-card lg:col-span-1 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-col items-center gap-4 pb-2">
              <div 
                onClick={handleImageClick} 
                className={`relative ${isEditing ? 'cursor-pointer' : ''}`}
              >
                <Avatar className="h-24 w-24 ring-2 ring-primary/20 hover:scale-105 transition-transform duration-300">
                  <AvatarImage 
                    src={previewImage || user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}&backgroundColor=ffdfbf`} 
                    alt={user?.name || 'User'} 
                  />
                  <AvatarFallback><User className="w-10 h-10" /></AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <div className="text-center">
                {isEditing ? (
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="text-center"
                    />
                  </div>
                ) : (
                  <CardTitle className="text-2xl font-bold">{user?.name}</CardTitle>
                )}
                <CardDescription className="text-muted-foreground">{user?.role === 'admin' ? 'Administrator' : 'Voter'}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Joined Jan 15, 2023</span>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex gap-2">
              {isEditing ? (
                <>
                  <Button 
                    className="flex-1" 
                    variant="default"
                    onClick={handleSave}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button 
                    className="flex-1" 
                    variant="outline"
                    onClick={handleEditToggle}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={handleEditToggle}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <GlassContainer variant="panel" className="p-6 hover:shadow-lg transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4">Activity Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ scale: 1.03 }} 
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card className="glass-card-flat">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Elections
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold animate-count-up">{mockStats.elections}</p>
                    <p className="text-muted-foreground">Elections managed</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card className="glass-card-flat">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Votes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold animate-count-up">{mockStats.votesCreated}</p>
                    <p className="text-muted-foreground">Total votes created</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-medium mb-2">Recent Activity</h3>
              <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-lg p-4">
                <div className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="p-3 bg-white/40 dark:bg-gray-700/30 rounded-lg"
                  >
                    <p className="text-sm font-medium">Created new election: <span className="text-primary">University Student Council</span></p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="p-3 bg-white/40 dark:bg-gray-700/30 rounded-lg"
                  >
                    <p className="text-sm font-medium">Added 20 new voters to <span className="text-primary">Board Election</span></p>
                    <p className="text-xs text-muted-foreground">4 days ago</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </GlassContainer>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Profile; 