import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, CalendarCheck, Clock, CheckCircle, User, Vote, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import Stats from '@/components/Stats';
import { useElection } from '@/contexts/ElectionContext';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminActionBar from '@/components/AdminActionBar';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeElections, upcomingElections, completedElections } = useElection();
  
  // Sample data for the chart
  const chartData = [
    { name: 'May 1', votes: 24 },
    { name: 'May 2', votes: 13 },
    { name: 'May 3', votes: 38 },
    { name: 'May 4', votes: 52 },
    { name: 'May 5', votes: 69 },
    { name: 'May 6', votes: 41 },
    { name: 'May 7', votes: 26 },
  ];

  const handleViewResults = (electionId: string) => {
    navigate(`/results/${electionId}`);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
        {user?.role !== 'admin' && (
          <Button variant="outline" className="glass-button bg-white/20 text-primary"onClick={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        )}
      </div>
      
      {/* Admin Actions */}
      {user?.role === 'admin' && (
        <div className="mb-4">
          <h2 className="text-2xl font-semibold font-heading mb-2">Admin Control Panel</h2>
          <AdminActionBar />
        </div>
      )}
      
      {/* Stats */}
      <Stats className="mb-8" />
      
      {/* Active Elections */}
      <h2 className="text-2xl font-semibold font-heading mt-8 mb-4 flex items-center">
        <CalendarCheck className="mr-2 h-5 w-5 text-primary" />
        Active Elections
      </h2>
      {activeElections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeElections.map((election) => (
            <Card key={election.id} className="glass-card hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="outline">
                  Active
                </Badge>
                <CardTitle>{election.title}</CardTitle>
                <CardDescription>{election.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">End Date</span>
                    <span className="font-medium">{election.endDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Total Votes</span>
                    <span className="font-medium">{election.totalVotes} / {election.voterCount}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/elections/${election.id}`)}
                >
                  View Details
                </Button>
                {user?.role === 'voter' && (
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/vote/${election.id}`)}
                  >
                    <Vote className="mr-1 h-4 w-4" />
                    Vote Now
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mb-8">
          <CardContent className="pt-6 text-center text-muted-foreground">
            No active elections at the moment.
          </CardContent>
        </Card>
      )}
      
      {/* Upcoming Elections */}
      <h2 className="text-2xl font-semibold font-heading mt-8 mb-4 flex items-center">
        <Clock className="mr-2 h-5 w-5 text-primary" />
        Upcoming Elections
      </h2>
      {upcomingElections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingElections.map((election) => (
            <Card key={election.id} className="glass-card hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="outline">
                  Upcoming
                </Badge>
                <CardTitle>{election.title}</CardTitle>
                <CardDescription>{election.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Start Date</span>
                    <span className="font-medium">{election.startDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">End Date</span>
                    <span className="font-medium">{election.endDate.toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate(`/elections/${election.id}`)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mb-8">
          <CardContent className="pt-6 text-center text-muted-foreground">
            No upcoming elections.
          </CardContent>
        </Card>
      )}
      
      {/* Recent Activity Chart */}
      <h2 className="text-2xl font-semibold font-heading mt-8 mb-4 flex items-center">
        <User className="mr-2 h-5 w-5 text-primary" />
        Voting Activity
      </h2>
      <Card className="w-full glass-card p-4 mb-8">
        <CardHeader>
          <CardTitle>Recent Votes</CardTitle>
          <CardDescription>Daily voting trends for the past week</CardDescription>
        </CardHeader>
        <CardContent className="pl-0">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }}
                />
                <Bar dataKey="votes" fill="hsla(196, 80%, 40%, 0.7)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Completed Elections */}
      <h2 className="text-2xl font-semibold font-heading mt-8 mb-4 flex items-center">
        <CheckCircle className="mr-2 h-5 w-5 text-primary" />
        Completed Elections
      </h2>
      {completedElections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {completedElections.slice(0, 3).map((election) => (
            <Card key={election.id} className="glass-card hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">
                  Completed
                </Badge>
                <CardTitle>{election.title}</CardTitle>
                <CardDescription>{election.description}</CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleViewResults(election.id)}
                >
                  View Results
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No completed elections yet.
          </CardContent>
        </Card>
      )}
    </Layout>
  );
};

export default Dashboard;





