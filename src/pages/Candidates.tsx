import React, { useMemo } from 'react';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Users } from 'lucide-react';
import { useElection } from '@/contexts/ElectionContext';
import { GlassContainer } from '@/components/ui/glass-components';

const Candidates: React.FC = () => {
  const { elections } = useElection();
  
  // Collect all candidates from all elections
  const allCandidates = useMemo(() => {
    return elections.flatMap(election => 
      election.candidates.map(candidate => ({
        ...candidate,
        electionTitle: election.title,
        electionId: election.id
      }))
    );
  }, [elections]);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-heading">Candidates</h1>
      </div>
      
      <p className="text-muted-foreground mb-8">Browse and learn about candidates running in current and upcoming elections</p>
      
      {allCandidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allCandidates.map(candidate => (
            <Card key={`${candidate.electionId}-${candidate.id}`} className="glass-card hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage src={candidate.imageUrl} alt={candidate.name} />
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg font-bold">{candidate.name}</CardTitle>
                  <CardDescription>{candidate.position}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">{candidate.bio}</p>
                <p className="text-xs text-primary font-medium">Election: {candidate.electionTitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <GlassContainer
          variant="default"
          className="p-10 text-center"
        >
          <div className="flex flex-col items-center gap-4">
            <Users className="h-12 w-12 text-muted-foreground/70" />
            <h3 className="text-xl font-medium">No candidates found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              There are no candidates available at this time.
            </p>
          </div>
        </GlassContainer>
      )}
    </Layout>
  );
};

export default Candidates; 