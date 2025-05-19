import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useElection } from '@/contexts/ElectionContext';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const EditCandidate: React.FC = () => {
  const { electionId, candidateId } = useParams<{ electionId: string; candidateId: string }>();
  const navigate = useNavigate();
  const { getElection, updateCandidate } = useElection();
  const election = getElection(electionId || '');
  const candidate = election?.candidates.find(c => c.id === candidateId);

  const [name, setName] = useState(candidate?.name || '');
  const [position, setPosition] = useState(candidate?.position || '');
  const [bio, setBio] = useState(candidate?.bio || '');
  const [imageUrl, setImageUrl] = useState(candidate?.imageUrl || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (candidate) {
      setName(candidate.name);
      setPosition(candidate.position);
      setBio(candidate.bio);
      setImageUrl(candidate.imageUrl);
    }
  }, [candidate]);

  if (!election || !candidate) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-lg w-full p-8 text-center">
            <CardTitle>Candidate Not Found</CardTitle>
            <CardContent>
              The candidate you are looking for does not exist.
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    updateCandidate(electionId!, candidateId!, { name, position, bio, imageUrl });
    setLoading(false);
    toast.success('Candidate updated!');
    navigate(`/elections/${electionId}`);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-12 px-2">
        <h1 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">Edit Candidate</h1>
        <div className="max-w-xl mx-auto">
          <Card className="shadow-xl hover:shadow-2xl transition-all duration-200 border-2 border-transparent hover:border-pink-300 bg-white/80 dark:bg-card">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <User className="w-10 h-10 text-pink-500" />
              <CardTitle className="text-2xl font-bold leading-tight mb-1">Edit Candidate</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input placeholder="Candidate Name" value={name} onChange={e => setName(e.target.value)} />
                <Input placeholder="Position" value={position} onChange={e => setPosition(e.target.value)} />
                <Input placeholder="Bio" value={bio} onChange={e => setBio(e.target.value)} />
                <Input placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                <Button className="w-full mt-4" type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default EditCandidate; 