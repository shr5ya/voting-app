import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { useElection } from '@/contexts/ElectionContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Calendar, Trophy, Users, ChevronRight, Search, Loader2, 
  AlertCircle, RefreshCw, BarChart2, Vote, PlusCircle, Filter, SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassBadge, GlassContainer, AnimatedText, GlassDivider } from '@/components/ui/glass-components';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger, 
  DropdownMenuItem,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import AdminActionBar from '@/components/AdminActionBar';
import ClearDataButton from '@/components/ClearDataButton';
import { Election } from '@/contexts/ElectionContext';

const statusBadgeVariant: Record<string, string> = {
  active: 'primary',
  upcoming: 'secondary',
  completed: 'default',
};

const fallbackImages = [
  <Trophy className="w-6 h-6 text-blue-400" />,
  <Calendar className="w-6 h-6 text-purple-400" />,
  <Users className="w-6 h-6 text-pink-400" />,
];

const EmptyState = () => (
  <GlassContainer
    variant="default"
    className="col-span-full p-10 text-center"
  >
    <div className="flex flex-col items-center gap-4">
      <Calendar className="h-12 w-12 text-muted-foreground/70" />
      <h3 className="text-xl font-medium">No elections found</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        There are no elections matching your criteria. Try adjusting your filters or check back later.
      </p>
    </div>
  </GlassContainer>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <GlassContainer
    variant="default"
    className="col-span-full p-10 text-center"
  >
    <div className="flex flex-col items-center gap-4">
      <AlertCircle className="h-12 w-12 text-red-500/70" />
      <h3 className="text-xl font-medium">Failed to load elections</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-4">
        We encountered an error while loading the election data. Please try again.
      </p>
      <Button onClick={onRetry} variant="outline" className="gap-2">
        <RefreshCw className="h-4 w-4" /> 
        Retry
      </Button>
    </div>
  </GlassContainer>
);

// Helper function for formatting dates
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const Elections: React.FC = () => {
  const { elections, isLoading, error, refreshElections } = useElection();
  const [visibleItems, setVisibleItems] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [retryCount, setRetryCount] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('newest');
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Add refresh effect when component mounts
  useEffect(() => {
    refreshElections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Filter elections based on search and filter criteria
  let filteredElections = elections.filter(election => {
    const matchesSearch = 
      election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      election.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || 
      election.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort elections
  filteredElections = filteredElections.sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    } else if (sortBy === 'votes') {
      return b.totalVotes - a.totalVotes;
    } else if (sortBy === 'name') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
  
  // Handle retry loading
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    refreshElections();
  };
  
  // Staggered animation effect
  useEffect(() => {
    if (!isLoading && filteredElections.length > 0) {
      // Reset visible count first
      setVisibleItems(0);
      
      // Then animate items in with short delay
      const timer = setTimeout(() => {
        setVisibleItems(filteredElections.length);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [filteredElections.length, isLoading]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setVisibleItems(0); // Reset animations when search changes
  };

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    setVisibleItems(0); // Reset animations when filter changes
  };

  const handleViewResults = (electionId: string) => {
    navigate(`/results/${electionId}`);
  };

  // Render election card
  const renderElectionCard = (election: Election) => {
    const badgeColor = 
      election.status === 'active' ? 'bg-blue-600' :
      election.status === 'upcoming' ? 'bg-amber-500' :
      'bg-green-600';
    
    const badgeText = 
      election.status === 'active' ? 'Active' :
      election.status === 'upcoming' ? 'Upcoming' :
      'Completed';
    
    const hasVotingEnded = election.status === 'completed';
    
    // Show total votes. For active elections, this is the actual number of voters who have participated
    // not the sum of all candidate votes which could be higher if multiple candidates can be selected
    const totalVotes = election.totalVotes || 0;
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="mb-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${badgeColor}`}>
            {badgeText}
          </span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{election.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{election.description}</p>
        
        <div className="flex justify-between mb-5">
          {hasVotingEnded ? (
            <div>
              <span className="text-sm text-gray-500">Total Votes</span>
              <p className="font-medium">{totalVotes} / {totalVotes}</p>
            </div>
          ) : (
            <div>
              <span className="text-sm text-gray-500">End Date</span>
              <p className="font-medium">{formatDate(election.endDate)}</p>
            </div>
          )}
          
          <div>
            <span className="text-sm text-gray-500">Total Votes</span>
            <p className="font-medium">{totalVotes} / {election.voterCount || 0}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/elections/${election.id}`)}
          >
            View Details
          </Button>
          
          {hasVotingEnded ? (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => handleViewResults(election.id)}
            >
              <BarChart2 className="h-4 w-4 mr-1" />
              View Results
            </Button>
          ) : (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => navigate(`/vote/${election.id}`)}
            >
              <Vote className="h-4 w-4 mr-1" />
              Vote Now
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen mb-12">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 font-heading">Elections</h1>
            <p className="text-muted-foreground">Browse, search and participate in elections</p>
          </div>
          {user?.role === 'admin' && <ClearDataButton />}
        </div>
        
        {/* Admin Actions */}
        {user?.role === 'admin' && (
          <AdminActionBar compact />
        )}
        
        {/* Search and filters */}
        <GlassContainer
          variant="flat"
          className="mb-8 p-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-auto sm:flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search elections..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-9 glass-input w-full"
                disabled={isLoading}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="flex gap-1">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFilterChange('all')}
                  disabled={isLoading}
                  className="px-3"
                >
                  All
                </Button>
                <Button 
                  variant={filterStatus === 'active' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFilterChange('active')}
                  disabled={isLoading}
                  className="px-3"
                >
                  Active
                </Button>
                <Button 
                  variant={filterStatus === 'upcoming' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFilterChange('upcoming')}
                  disabled={isLoading}
                  className="px-3"
                >
                  Upcoming
                </Button>
                <Button 
                  variant={filterStatus === 'completed' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFilterChange('completed')}
                  disabled={isLoading}
                  className="px-3"
                >
                  Completed
                </Button>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 ml-auto">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Sort</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => setSortBy('newest')}
                    className={sortBy === 'newest' ? 'bg-primary/10 font-medium' : ''}
                  >
                    Newest first
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortBy('oldest')}
                    className={sortBy === 'oldest' ? 'bg-primary/10 font-medium' : ''}
                  >
                    Oldest first
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setSortBy('name')}
                    className={sortBy === 'name' ? 'bg-primary/10 font-medium' : ''}
                  >
                    Alphabetical
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortBy('votes')}
                    className={sortBy === 'votes' ? 'bg-primary/10 font-medium' : ''}
                  >
                    Most votes
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </GlassContainer>
        
        {/* Election List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <ErrorState onRetry={handleRetry} />
        ) : filteredElections.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredElections.map((election, index) => (
              <Card 
                key={election.id}
                className={`glass-card hover:shadow-lg transition-all duration-200 ${
                  index < visibleItems ? 'animate-fade-in' : 'opacity-0'
                }`}
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <CardHeader>
                  <Badge className="w-fit mb-2" variant={
                    election.status === 'active' ? 'default' :
                    election.status === 'upcoming' ? 'outline' : 'secondary'
                  }>
                    {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                  </Badge>
                  
                  <CardTitle>{election.title}</CardTitle>
                  <CardDescription>{election.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        {election.status === 'upcoming' ? 'Start Date' : 'End Date'}
                      </span>
                      <span className="font-medium">
                        {(election.status === 'upcoming' ? election.startDate : election.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        {election.status === 'completed' ? 'Participation' : 'Total Votes'}
                      </span>
                      <span className="font-medium">
                        {election.status === 'completed' 
                          ? `${Math.round((election.totalVotes / election.voterCount) * 100)}%`
                          : `${election.totalVotes} / ${election.voterCount}`
                        }
                      </span>
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
                  
                  {election.status === 'active' && user?.role === 'voter' && (
                    <Button 
                      size="sm"
                      onClick={() => navigate(`/vote/${election.id}`)}
                    >
                      <Vote className="mr-1 h-4 w-4" />
                      Vote Now
                    </Button>
                  )}
                  
                  {election.status === 'completed' && (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewResults(election.id)}
                    >
                      <BarChart2 className="mr-1 h-4 w-4" />
                      Results
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Elections; 