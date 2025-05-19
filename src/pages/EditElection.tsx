import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, ArrowLeft, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useElection } from '@/contexts/ElectionContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

const EditElection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getElection, updateElection } = useElection();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const election = getElection(id || '');

  useEffect(() => {
    if (election) {
      // Format dates to YYYY-MM-DD format for input
      setTitle(election.title);
      setDescription(election.description);
      setStartDate(format(election.startDate, 'yyyy-MM-dd'));
      setEndDate(format(election.endDate, 'yyyy-MM-dd'));
    } else {
      toast.error('Election not found');
      navigate('/elections');
    }
  }, [election, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !startDate || !endDate) {
      setFormError('Please fill in all fields');
      return;
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (endDateObj <= startDateObj) {
      setFormError('End date must be after start date');
      return;
    }

    setLoading(true);
    try {
      if (!id) {
        throw new Error('Election ID is missing');
      }
      
      await updateElection(id, {
        title: title.trim(),
        description: description.trim(),
        startDate: startDateObj,
        endDate: endDateObj
      });
      
      // Navigate back to election details
      navigate(`/elections/${id}`);
    } catch (error) {
      console.error('Failed to update election:', error);
      toast.error('Failed to update election');
    } finally {
      setLoading(false);
    }
  };

  if (!election) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">Edit Election</h1>
        
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center gap-4 pb-4">
            <Calendar className="w-8 h-8 text-primary" />
            <CardTitle className="text-2xl">{election.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {formError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {formError}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="font-medium">Election Title</label>
                <Input 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Enter election title"
                />
              </div>
              
              <div className="space-y-2">
                <label className="font-medium">Description</label>
                <Textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Enter election description"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-medium">Start Date</label>
                  <Input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-medium">End Date</label>
                  <Input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditElection; 