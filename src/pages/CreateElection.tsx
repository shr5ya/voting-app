import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CalendarPlus, PlusCircle, Trash2, UserCircle, BriefcaseBusiness, FileText, Image } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useElection } from '@/contexts/ElectionContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const CreateElection = () => {
  const navigate = useNavigate();
  const { createElection } = useElection();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([
    { name: '', position: '', bio: '', imageUrl: '' }
  ]);

  const handleCandidateChange = (idx, field, value) => {
    setCandidates(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  const addCandidateField = () => {
    if (candidates.length >= 10) {
      toast.error('Maximum 10 candidates allowed per election');
      return;
    }
    setCandidates(prev => [...prev, { name: '', position: '', bio: '', imageUrl: '' }]);
  };

  const removeCandidateField = (idx) => {
    if (candidates.length <= 1) {
      toast.error('At least one candidate is required');
      return;
    }
    setCandidates(prev => prev.filter((_, i) => i !== idx));
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast.error('Please enter an election title');
      return false;
    }
    if (!description.trim()) {
      toast.error('Please enter an election description');
      return false;
    }
    if (!startDate) {
      toast.error('Please select a start date');
      return false;
    }
    if (!endDate) {
      toast.error('Please select an end date');
      return false;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      toast.error('End date must be after start date');
      return false;
    }
    if (candidates.some(c => !c.name.trim() || !c.position.trim())) {
      toast.error('Please fill in all candidate name and position fields');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const electionData = {
        title: title.trim(),
        description: description.trim(),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        candidates: candidates.map(c => ({
          ...c,
          name: c.name.trim(),
          position: c.position.trim(),
          bio: c.bio.trim(),
          imageUrl: c.imageUrl.trim(),
          id: Math.random().toString(36).substring(2, 9),
          votes: 0
        })),
        voterCount: 0,
      };
      
      await createElection(electionData);
      toast.success('Election created successfully!');
      
      // Redirect to elections page after creation
      navigate('/elections');
      
      // Reset form
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setCandidates([{ name: '', position: '', bio: '', imageUrl: '' }]);
    } catch (error) {
      toast.error('Failed to create election. Please try again.');
      console.error('Error creating election:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Create Election</h1>
            <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
          </div>
          
          <Card className="shadow-lg border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex items-center gap-3">
                <CalendarPlus className="w-8 h-8" />
                <CardTitle className="text-2xl font-bold">New Election</CardTitle>
              </div>
              <p className="text-blue-100 mt-2">Fill in the details below to create a new election.</p>
            </CardHeader>
            
            <CardContent className="p-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Election Title</label>
                    <Input 
                      placeholder="Enter election title" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <Input 
                      placeholder="Enter election description" 
                      value={description} 
                      onChange={e => setDescription(e.target.value)} 
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                      <Input 
                        type="date" 
                        value={startDate} 
                        onChange={e => setStartDate(e.target.value)} 
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                      <Input 
                        type="date" 
                        value={endDate} 
                        onChange={e => setEndDate(e.target.value)} 
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <UserCircle className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-800 dark:text-white">Candidates</h3>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addCandidateField}
                      className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Candidate
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    {candidates.map((candidate, idx) => (
                      <div key={idx} className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-gray-700 dark:text-gray-300">Candidate {idx + 1}</h4>
                          {candidates.length > 1 && (
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeCandidateField(idx)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <UserCircle className="w-4 h-4 text-gray-500" />
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Name</label>
                            </div>
                            <Input 
                              placeholder="Candidate name" 
                              value={candidate.name} 
                              onChange={e => handleCandidateChange(idx, 'name', e.target.value)} 
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" 
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <BriefcaseBusiness className="w-4 h-4 text-gray-500" />
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Position</label>
                            </div>
                            <Input 
                              placeholder="Candidate position" 
                              value={candidate.position} 
                              onChange={e => handleCandidateChange(idx, 'position', e.target.value)} 
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" 
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-500" />
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Bio</label>
                            </div>
                            <Input 
                              placeholder="Candidate bio" 
                              value={candidate.bio} 
                              onChange={e => handleCandidateChange(idx, 'bio', e.target.value)} 
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" 
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Image className="w-4 h-4 text-gray-500" />
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Image URL</label>
                            </div>
                            <Input 
                              placeholder="Candidate image URL" 
                              value={candidate.imageUrl} 
                              onChange={e => handleCandidateChange(idx, 'imageUrl', e.target.value)} 
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-2"
                  >
                    {loading ? 'Creating...' : 'Create Election'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CreateElection;