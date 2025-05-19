import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Users, ArrowLeft, Loader2, Mail, UserPlus, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useElection } from '@/contexts/ElectionContext';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

// Define the Voter interface locally instead of importing
interface Voter {
  id: string;
  name: string;
  email: string;
  hasVoted: boolean;
  electionId?: string;
}

const ManageVoters: React.FC = () => {
  const { id: electionIdParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { elections, getElection, addVoter, voters, getVotersForElection, refreshVotersList } = useElection();
  
  const [electionId, setElectionId] = useState(electionIdParam || '');
  const [voterEmail, setVoterEmail] = useState('');
  const [voterName, setVoterName] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingVoters, setLoadingVoters] = useState(false);
  const [electionVoters, setElectionVoters] = useState<Voter[]>([]);
  const [formError, setFormError] = useState('');

  // Get voters for the selected election
  useEffect(() => {
    if (electionId) {
      setLoadingVoters(true);
      const election = getElection(electionId);
      if (!election) {
        if (electionIdParam) {
          toast.error('Election not found');
          navigate('/elections');
          return;
        }
      } else {
        const votersList = getVotersForElection(electionId);
        setElectionVoters(votersList);
      }
      setLoadingVoters(false);
    } else if (elections.length > 0 && !electionId) {
      setElectionId(elections[0].id);
    }
  }, [electionId, electionIdParam, elections, getElection, getVotersForElection, navigate]);

  const handleAddVoter = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!electionId) {
      setFormError('Please select an election');
      return;
    }
    
    if (!voterEmail.trim()) {
      setFormError('Email is required');
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(voterEmail.trim())) {
      setFormError('Please enter a valid email address');
      return;
    }
    
    setFormError('');
    setLoading(true);
    
    try {
      await addVoter(electionId, {
        name: voterName.trim() || voterEmail.split('@')[0],
        email: voterEmail.trim(),
      });
      
      toast.success('Voter added successfully!');
      
      // Clear form
      setVoterName('');
      setVoterEmail('');
      
      // Refresh voters list
      const votersList = getVotersForElection(electionId);
      setElectionVoters(votersList);
    } catch (error) {
      console.error('Failed to add voter:', error);
      toast.error('Failed to add voter');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshVoters = async () => {
    setLoadingVoters(true);
    try {
      await refreshVotersList();
      const votersList = getVotersForElection(electionId);
      setElectionVoters(votersList);
      toast.success('Voters list refreshed');
    } catch (error) {
      console.error('Failed to refresh voters:', error);
      toast.error('Failed to refresh voters list');
    } finally {
      setLoadingVoters(false);
    }
  };

  const handleRemoveVoter = (voterId: string) => {
    // In a real application, you would implement this
    toast.info('This feature is not implemented yet');
  };

  const selectedElection = getElection(electionId);

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Voters</h1>
          <Button variant="outline" onClick={handleRefreshVoters} disabled={loadingVoters}>
            {loadingVoters ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
        
        {!electionIdParam && (
          <Card className="mb-8 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Select Election</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        )}
        
        {selectedElection && (
          <>
            <Card className="mb-8 shadow-md">
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <UserPlus className="w-6 h-6 text-primary" />
                <CardTitle className="text-xl">Add Voter to {selectedElection.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleAddVoter}>
                  {formError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {formError}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="font-medium">Name</label>
                      <Input 
                        value={voterName} 
                        onChange={e => setVoterName(e.target.value)} 
                        placeholder="Enter voter name (optional)"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-medium">Email <span className="text-red-500">*</span></label>
                      <Input 
                        value={voterEmail} 
                        onChange={e => setVoterEmail(e.target.value)} 
                        placeholder="Enter voter email"
                        type="email"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add Voter
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <Users className="w-6 h-6 text-primary" />
                <CardTitle className="text-xl">Voters for {selectedElection.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingVoters ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : electionVoters.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No voters found for this election
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {electionVoters.map(voter => (
                        <TableRow key={voter.id}>
                          <TableCell className="font-medium">{voter.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-gray-400" />
                              {voter.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={voter.hasVoted ? "default" : "secondary"}>
                              {voter.hasVoted ? "Voted" : "Not Voted"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleRemoveVoter(voter.id)}
                              title="Remove voter"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-gray-500 pt-2">
                <div>Total: {electionVoters.length} voters</div>
                <div>Voted: {electionVoters.filter(v => v.hasVoted).length}</div>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ManageVoters; 