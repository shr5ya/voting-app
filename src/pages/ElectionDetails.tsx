
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, Users, ArrowLeft, User, 
  Vote, BarChart2, Printer, Download, Share2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { useElection } from '@/contexts/ElectionContext';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';

const ElectionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getElection } = useElection();
  const { user } = useAuth();
  
  const election = getElection(id || '');
  
  if (!election) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-2xl font-bold mb-4">Election Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The election you are looking for does not exist or has been removed.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'upcoming':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold font-heading">{election.title}</h1>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(election.status)}`} />
              <Badge>{election.status.charAt(0).toUpperCase() + election.status.slice(1)}</Badge>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{election.description}</p>
          </div>
          <div className="flex gap-2">
            {election.status === 'active' && user?.role === 'voter' && (
              <Button onClick={() => navigate(`/vote/${election.id}`)}>
                <Vote className="mr-2 h-4 w-4" />
                Vote Now
              </Button>
            )}
            {election.status !== 'upcoming' && (
              <Button variant="outline" onClick={() => navigate(`/results/${election.id}`)}>
                <BarChart2 className="mr-2 h-4 w-4" />
                View Results
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Election Details & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-primary" />
              Election Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</div>
                <div>{election.startDate.toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</div>
                <div>{election.endDate.toLocaleDateString()}</div>
              </div>
              {election.status === 'active' && (
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Time Remaining</div>
                  <div className="font-semibold text-primary">
                    {Math.ceil((election.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-4 w-4 text-primary" />
              Participation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Votes Cast</div>
                  <div>
                    {election.totalVotes} / {election.voterCount}
                  </div>
                </div>
                <Progress value={(election.totalVotes / election.voterCount) * 100} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Participation Rate</div>
                <div className="text-2xl font-bold">
                  {Math.round((election.totalVotes / election.voterCount) * 100)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-4 w-4 text-primary" />
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Status</div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(election.status)}`} />
                  <span className="capitalize">{election.status}</span>
                </div>
              </div>
              {election.status === 'active' && (
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Started</div>
                  <div>{Math.ceil((new Date().getTime() - election.startDate.getTime()) / (1000 * 60 * 60 * 24))} days ago</div>
                </div>
              )}
              {election.status === 'upcoming' && (
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Starting In</div>
                  <div className="font-semibold text-yellow-500">
                    {Math.ceil((election.startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Candidates */}
      <h2 className="text-2xl font-semibold font-heading mt-8 mb-4 flex items-center">
        <User className="mr-2 h-5 w-5 text-primary" />
        Candidates
      </h2>
      
      {election.candidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {election.candidates.map((candidate) => (
            <Card key={candidate.id} className="glass-card overflow-hidden">
              <div className="aspect-[3/2] overflow-hidden">
                <img 
                  src={candidate.imageUrl} 
                  alt={candidate.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={candidate.imageUrl} alt={candidate.name} />
                    <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{candidate.name}</CardTitle>
                    <p className="text-sm text-gray-500">{candidate.position}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3">{candidate.bio}</p>
              </CardContent>
              {election.status !== 'upcoming' && (
                <CardFooter>
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <div className="text-sm font-medium">Votes</div>
                      <div className="text-sm text-gray-500">
                        {candidate.votes} ({Math.round((candidate.votes / (election.totalVotes || 1)) * 100)}%)
                      </div>
                    </div>
                    <Progress value={(candidate.votes / (election.totalVotes || 1)) * 100} />
                  </div>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mb-8">
          <CardContent className="pt-6 text-center text-muted-foreground">
            No candidates have been added to this election yet.
          </CardContent>
        </Card>
      )}
      
      {/* Admin Actions */}
      {user?.role === 'admin' && (
        <>
          <h2 className="text-2xl font-semibold font-heading mt-8 mb-4">Admin Actions</h2>
          <div className="flex flex-wrap gap-4 mb-8">
            <Button variant="outline" onClick={() => navigate(`/elections/${election.id}/edit`)}>
              Edit Election
            </Button>
            <Button variant="outline" onClick={() => navigate(`/elections/${election.id}/candidates/add`)}>
              Add Candidate
            </Button>
            <Button variant="outline" onClick={() => navigate(`/elections/${election.id}/voters`)}>
              Manage Voters
            </Button>
            {election.status !== 'upcoming' && (
              <>
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Print Results
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
                <Button variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Results
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </Layout>
  );
};

export default ElectionDetails;
