import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useElection } from '@/contexts/ElectionContext';
import { BadgeCheck, XCircle, Users } from 'lucide-react';
import { GlassContainer } from '@/components/ui/glass-components';
import { Badge } from '@/components/ui/badge';

const Voters: React.FC = () => {
  const { voters } = useElection();

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-heading">Voters</h1>
      </div>
      
      <p className="text-muted-foreground mb-8">View and manage registered voters for your elections</p>
      
      {voters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {voters.map(voter => (
            <Card key={voter.id} className="glass-card hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-col items-center text-center">
                <Avatar className="w-16 h-16 mb-3">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(voter.name)}`} alt={voter.name} />
                  <AvatarFallback>{voter.name[0]}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg font-bold">{voter.name}</CardTitle>
                <CardDescription>{voter.email}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center pt-0">
                {voter.hasVoted ? (
                  <Badge variant="default" className="bg-green-500/80 hover:bg-green-500/90">
                    <BadgeCheck className="w-3 h-3 mr-1" /> Voted
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    <XCircle className="w-3 h-3 mr-1" /> Not Voted
                  </Badge>
                )}
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
            <h3 className="text-xl font-medium">No voters found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              There are no registered voters at this time. Add voters to get started.
            </p>
          </div>
        </GlassContainer>
      )}
    </Layout>
  );
};

export default Voters; 