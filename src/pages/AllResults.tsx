import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Trophy, BarChart2, Calendar, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useElection } from '@/contexts/ElectionContext';
import { GlassContainer } from '@/components/ui/glass-components';

const AllResults: React.FC = () => {
  const navigate = useNavigate();
  const { completedElections } = useElection();

  // Create some example completed elections if none exist in context
  const resultsToShow = completedElections.length > 0 ? completedElections : [
    {
      id: '1',
      title: 'Student Council Election 2024',
      description: 'Annual election for student council positions.',
      status: 'completed',
      startDate: new Date('2024-04-10'),
      endDate: new Date('2024-04-15'),
      totalVotes: 254,
      voterCount: 350,
      candidates: [
        { id: 'c1', name: 'John Doe', position: 'President', votes: 102 },
        { id: 'c2', name: 'Jane Smith', position: 'Vice President', votes: 85 },
        { id: 'c3', name: 'Robert Johnson', position: 'Treasurer', votes: 67 }
      ]
    },
    {
      id: '2',
      title: 'Faculty Board Selection',
      description: 'Selection process for the new faculty board members.',
      status: 'completed',
      startDate: new Date('2024-03-20'),
      endDate: new Date('2024-03-25'),
      totalVotes: 156,
      voterCount: 185,
      candidates: [
        { id: 'c4', name: 'Emily Richards', position: 'Chair', votes: 78 },
        { id: 'c5', name: 'Michael Stevens', position: 'Co-Chair', votes: 48 },
        { id: 'c6', name: 'Sarah Williams', position: 'Secretary', votes: 30 }
      ]
    }
  ];

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-heading">Election Results</h1>
      </div>
      
      <p className="text-muted-foreground mb-8">View results from all completed elections</p>
      
      {resultsToShow.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resultsToShow.map(election => {
            // Find the winner
            const winner = [...election.candidates].sort((a, b) => b.votes - a.votes)[0];
            
            return (
              <Card key={election.id} className="glass-card hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <Badge className="w-fit mb-2" variant="secondary">
                    Completed
                  </Badge>
                  <CardTitle>{election.title}</CardTitle>
                  <CardDescription>{election.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Winner</p>
                        <p className="font-medium">{winner?.name || 'No winner determined'}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">End Date</span>
                        <span className="font-medium">{election.endDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Participation</span>
                        <span className="font-medium">{Math.round((election.totalVotes / election.voterCount) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate(`/results/${election.id}`)}
                  >
                    <BarChart2 className="mr-1 h-4 w-4" />
                    View Detailed Results
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <GlassContainer
          variant="default"
          className="p-10 text-center"
        >
          <div className="flex flex-col items-center gap-4">
            <Trophy className="h-12 w-12 text-muted-foreground/70" />
            <h3 className="text-xl font-medium">No completed elections found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              There are no completed elections with results available at this time.
            </p>
          </div>
        </GlassContainer>
      )}
    </Layout>
  );
};

export default AllResults; 