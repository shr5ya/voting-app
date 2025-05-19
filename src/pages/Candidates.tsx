import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Users } from 'lucide-react';
import { useElection } from '@/contexts/ElectionContext';
import { GlassContainer } from '@/components/ui/glass-components';

const Candidates: React.FC = () => {
  // Mock candidate data - in a real app this would come from your context/API
  const candidates = [
    {
      id: '1',
      name: 'John Doe',
      position: 'President',
      bio: 'Passionate about student welfare and campus innovation. Ready to lead with integrity and vision.',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: '2',
      name: 'Jane Smith',
      position: 'Vice President',
      bio: 'Committed to diversity and inclusion. Working to create a better campus environment for everyone.',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: '3',
      name: 'Michael Johnson',
      position: 'Treasurer',
      bio: 'Finance major with experience managing budgets. Will ensure transparent financial management.',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
    },
    {
      id: '4',
      name: 'Sarah Williams',
      position: 'Secretary',
      bio: 'Excellent organizational skills and attention to detail. Ready to support the team.',
      avatar: 'https://randomuser.me/api/portraits/women/67.jpg'
    }
  ];

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-heading">Candidates</h1>
      </div>
      
      <p className="text-muted-foreground mb-8">Browse and learn about candidates running in current and upcoming elections</p>
      
      {candidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map(candidate => (
            <Card key={candidate.id} className="glass-card hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage src={candidate.avatar} alt={candidate.name} />
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg font-bold">{candidate.name}</CardTitle>
                  <CardDescription>{candidate.position}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{candidate.bio}</p>
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