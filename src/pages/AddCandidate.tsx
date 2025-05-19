import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useElection } from '@/contexts/ElectionContext';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AddCandidate: React.FC = () => {
  const { id: electionIdParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { elections, addCandidate } = useElection();
  const [electionId, setElectionId] = useState(electionIdParam || (elections[0]?.id ?? ''));
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [bio, setBio] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!electionId || !name || !position || !bio) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    addCandidate(electionId, { name, position, bio, imageUrl });
    toast.success('Candidate added!');
    setName('');
    setPosition('');
    setBio('');
    setImageUrl('');
    setLoading(false);
    // Optionally, navigate back to election details
    // navigate(`/elections/${electionId}`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-100 py-12 px-2">
        <h1 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">Add Candidate</h1>
        <div className="max-w-xl mx-auto">
          <Card className="shadow-xl hover:shadow-2xl transition-all duration-200 border-2 border-transparent hover:border-pink-300 bg-white/80">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <UserPlus className="w-10 h-10 text-pink-500" />
              <CardTitle className="text-2xl font-bold leading-tight mb-1">New Candidate</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {!electionIdParam && (
                  <select
                    className="w-full p-2 rounded-lg border mb-2"
                    value={electionId}
                    onChange={e => setElectionId(e.target.value)}
                  >
                    <option value="">Select Election</option>
                    {elections.map(e => (
                      <option key={e.id} value={e.id}>{e.title}</option>
                    ))}
                  </select>
                )}
                <Input placeholder="Candidate Name" value={name} onChange={e => setName(e.target.value)} />
                <Input placeholder="Position" value={position} onChange={e => setPosition(e.target.value)} />
                <Input placeholder="Bio" value={bio} onChange={e => setBio(e.target.value)} />
                <Input placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                <Button className="w-full mt-4" type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Candidate'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AddCandidate; 