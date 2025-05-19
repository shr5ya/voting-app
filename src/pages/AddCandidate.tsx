import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UserPlus, ArrowLeft, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useElection } from '@/contexts/ElectionContext';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AddCandidate: React.FC = () => {
  const { id: electionIdParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { elections, addCandidate, getElection } = useElection();
  const [electionId, setElectionId] = useState(electionIdParam || '');
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Validate election ID exists
  useEffect(() => {
    if (electionIdParam) {
      const election = getElection(electionIdParam);
      if (!election) {
        toast.error('Election not found');
        navigate('/elections');
      }
    } else if (elections.length > 0 && !electionId) {
      setElectionId(elections[0].id);
    }
  }, [electionIdParam, elections, getElection, navigate, electionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!electionId) {
      setFormError('Please select an election');
      return;
    }
    
    if (!name.trim() || !position.trim() || !bio.trim()) {
      setFormError('Please fill in all required fields');
      return;
    }
    
    setFormError('');
    setLoading(true);
    
    try {
      await addCandidate(electionId, { 
        name: name.trim(), 
        position: position.trim(), 
        bio: bio.trim(), 
        imageUrl: imageUrl.trim() || 'https://placehold.co/400?text=Candidate' 
      });
      
      toast.success('Candidate added successfully!');
      
      // Clear form
      setName('');
      setPosition('');
      setBio('');
      setImageUrl('');
      
      // Redirect to election details
      navigate(`/elections/${electionId}`);
    } catch (error) {
      console.error('Failed to add candidate:', error);
      toast.error('Failed to add candidate');
    } finally {
      setLoading(false);
    }
  };

  const selectedElection = getElection(electionId);

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">Add Candidate</h1>
        
        {selectedElection && (
          <p className="text-gray-600 mb-4">
            Adding candidate to: <span className="font-medium">{selectedElection.title}</span>
          </p>
        )}
        
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center gap-4 pb-4">
            <UserPlus className="w-8 h-8 text-primary" />
            <CardTitle className="text-2xl">New Candidate</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {formError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {formError}
                </div>
              )}
              
              {!electionIdParam && elections.length > 0 && (
                <div className="space-y-2">
                  <label className="font-medium">Select Election <span className="text-red-500">*</span></label>
                  <Select value={electionId} onValueChange={setElectionId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an election" />
                    </SelectTrigger>
                    <SelectContent>
                      {elections.map(election => (
                        <SelectItem key={election.id} value={election.id}>
                          {election.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="font-medium">Candidate Name <span className="text-red-500">*</span></label>
                <Input 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Enter candidate name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="font-medium">Position <span className="text-red-500">*</span></label>
                <Input 
                  value={position} 
                  onChange={e => setPosition(e.target.value)} 
                  placeholder="Enter candidate position"
                />
              </div>
              
              <div className="space-y-2">
                <label className="font-medium">Bio <span className="text-red-500">*</span></label>
                <Textarea 
                  value={bio} 
                  onChange={e => setBio(e.target.value)} 
                  placeholder="Enter candidate bio"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <label className="font-medium">Image URL</label>
                <Input 
                  value={imageUrl} 
                  onChange={e => setImageUrl(e.target.value)} 
                  placeholder="Enter image URL (optional)"
                />
                <p className="text-xs text-gray-500">Leave blank to use a placeholder image</p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Candidate'
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

export default AddCandidate; 