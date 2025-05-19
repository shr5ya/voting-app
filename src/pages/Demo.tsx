import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, Vote, User, ChevronRight, 
  BarChart2, UserCheck, LockIcon, Award, 
  Settings, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Demo election data
const demoElection = {
  id: 'demo-01',
  title: 'University Student Council Election',
  description: 'Annual election for the student council positions',
  candidates: [
    { id: 'c1', name: 'David Lee', position: 'President', votes: 52.5, image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
    { id: 'c2', name: 'Anna Martinez', position: 'President', votes: 47.5, image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna' },
    { id: 'c3', name: 'Michael Chen', position: 'Vice President', votes: 64, image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
    { id: 'c4', name: 'Sarah Johnson', position: 'Vice President', votes: 36, image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  ],
  totalVotes: 250,
  totalVoters: 400,
  startDate: new Date('2025-05-10'),
  endDate: new Date('2025-05-15'),
  status: 'completed'
};

interface StepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// Step component for the demo process
const Step: React.FC<StepProps> = ({ number, title, description, icon }) => (
  <div className="flex items-start gap-4 mb-8">
    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-1">
        <span className="text-primary mr-2">{number}.</span>{title}
      </h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

const VoterView: React.FC = () => {
  const [voted, setVoted] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

  const handleVote = () => {
    if (!selectedCandidate) {
      toast.error('Please select a candidate first');
      return;
    }
    
    toast.success('Your vote has been cast successfully!');
    setVoted(true);
  };

  if (voted) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Thank you for voting!</h2>
        <p className="text-muted-foreground mb-6">Your vote has been securely recorded.</p>
        <Button onClick={() => setVoted(false)}>Back to Demo</Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Cast Your Vote</h2>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{demoElection.title}</CardTitle>
          <CardDescription>Select your preferred candidate for President</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {demoElection.candidates
            .filter(c => c.position === 'President')
            .map(candidate => (
              <div 
                key={candidate.id}
                className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedCandidate === candidate.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedCandidate(candidate.id)}
              >
                <div className="mr-4">
                  <img 
                    src={candidate.image} 
                    alt={candidate.name} 
                    className="w-16 h-16 rounded-full border border-border"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{candidate.name}</h3>
                  <p className="text-muted-foreground text-sm">{candidate.position}</p>
                </div>
                <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-border flex items-center justify-center">
                  {selectedCandidate === candidate.id && (
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  )}
                </div>
              </div>
            ))}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleVote}
            disabled={!selectedCandidate}
          >
            Cast Vote
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const ResultsView: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Election Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Participation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Voter Turnout</span>
              <span className="font-semibold">{Math.round((demoElection.totalVotes / demoElection.totalVoters) * 100)}%</span>
            </div>
            <Progress value={(demoElection.totalVotes / demoElection.totalVoters) * 100} className="h-2" />
            <div className="text-sm text-muted-foreground">
              {demoElection.totalVotes} out of {demoElection.totalVoters} eligible voters
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Election Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Status</span>
                <span className="capitalize text-green-600 font-medium">{demoElection.status}</span>
              </div>
              <div className="flex justify-between">
                <span>Start Date</span>
                <span>{demoElection.startDate.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>End Date</span>
                <span>{demoElection.endDate.toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Results for President</CardTitle>
          <CardDescription>Total votes: {demoElection.totalVotes}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {demoElection.candidates
            .filter(c => c.position === 'President')
            .map(candidate => (
              <div key={candidate.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src={candidate.image} 
                      alt={candidate.name} 
                      className="w-10 h-10 rounded-full mr-3 border border-border"
                    />
                    <span className="font-medium">{candidate.name}</span>
                  </div>
                  <span>{candidate.votes}%</span>
                </div>
                <Progress value={candidate.votes} className="h-2" />
              </div>
            ))}
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Results for Vice President</CardTitle>
          <CardDescription>Total votes: {demoElection.totalVotes}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {demoElection.candidates
            .filter(c => c.position === 'Vice President')
            .map(candidate => (
              <div key={candidate.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src={candidate.image} 
                      alt={candidate.name} 
                      className="w-10 h-10 rounded-full mr-3 border border-border"
                    />
                    <span className="font-medium">{candidate.name}</span>
                  </div>
                  <span>{candidate.votes}%</span>
                </div>
                <Progress value={candidate.votes} className="h-2" />
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
};

const AdminView: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  
  const toggleSettings = () => {
    setShowSettings(!showSettings);
    if (!showSettings) {
      toast.success('Admin settings activated');
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      
      {showSettings ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Election Settings</CardTitle>
            <CardDescription>Configure the demo election parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Election Title</label>
                <input 
                  type="text" 
                  value={demoElection.title} 
                  readOnly 
                  className="w-full p-2 border border-border rounded-md bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select className="w-full p-2 border border-border rounded-md bg-background">
                  <option value="draft">Draft</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="completed" selected>Completed</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <input 
                  type="date" 
                  value="2025-05-10"
                  className="w-full p-2 border border-border rounded-md bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <input 
                  type="date" 
                  value="2025-05-15"
                  className="w-full p-2 border border-border rounded-md bg-background"
                />
              </div>
            </div>
            
            <div className="pt-4">
              <h3 className="font-medium mb-3">Candidates (President)</h3>
              {demoElection.candidates
                .filter(c => c.position === 'President')
                .map(candidate => (
                  <div key={candidate.id} className="flex items-center justify-between mb-3 p-3 border border-border rounded-md">
                    <div className="flex items-center">
                      <img 
                        src={candidate.image} 
                        alt={candidate.name} 
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="font-medium">{candidate.name}</div>
                        <div className="text-sm text-muted-foreground">{candidate.position}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                ))}
                
              <Button variant="outline" size="sm" className="mt-2">
                + Add Candidate
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowSettings(false)}>Cancel</Button>
            <Button onClick={() => {
              toast.success("Settings saved successfully!");
              setShowSettings(false);
            }}>Save Changes</Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <User className="w-5 h-5 mr-2 text-primary" />
                Voters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{demoElection.totalVoters}</div>
              <p className="text-muted-foreground text-sm">Registered voters</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="w-full justify-between">
                Manage Voters <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Vote className="w-5 h-5 mr-2 text-primary" />
                Participation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Math.round((demoElection.totalVotes / demoElection.totalVoters) * 100)}%</div>
              <div className="text-muted-foreground text-sm">Voter turnout</div>
              <Progress value={(demoElection.totalVotes / demoElection.totalVoters) * 100} className="h-1.5 mt-2" />
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="w-full justify-between">
                View Analytics <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-md transition-all duration-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Settings className="w-5 h-5 mr-2 text-primary" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Configure election parameters, candidates, and voting rules</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="w-full justify-between" onClick={toggleSettings}>
                Manage Settings <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

const Demo: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <h1 className="text-3xl font-bold mb-6">Demo Election Experience</h1>
          <p className="text-lg mb-6">Try out Electra with a live demo election! Experience the voting process, see real-time results, and explore the admin dashboard—all with sample data.</p>
          
          <div className="bg-gradient-to-r from-primary/20 to-blue-400/20 p-6 rounded-xl mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">{demoElection.totalVotes}</div>
                <div className="text-sm">Votes Cast</div>
              </div>
              <div className="hidden sm:block h-12 w-px bg-border"></div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">{demoElection.candidates.length}</div>
                <div className="text-sm">Candidates</div>
              </div>
              <div className="hidden sm:block h-12 w-px bg-border"></div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">{Math.round((demoElection.totalVotes / demoElection.totalVoters) * 100)}%</div>
                <div className="text-sm">Voter Turnout</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
          <div className="max-w-3xl mx-auto">
            <Step 
              number={1}
              title="Experience the Voting Process"
              description="Cast a vote as a demo voter and see how secure and easy it is to participate in an election."
              icon={<Vote className="h-6 w-6" />}
            />
            <Step 
              number={2}
              title="View Real-Time Results"
              description="Access comprehensive analytics and visualizations to see election results as they come in."
              icon={<BarChart2 className="h-6 w-6" />}
            />
            <Step 
              number={3}
              title="Explore Admin Features"
              description="Try out admin functionality to manage candidates, voters, and election settings."
              icon={<Settings className="h-6 w-6" />}
            />
          </div>
        </div>
        
        <div className="mb-12">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="voter" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="voter">Voter Experience</TabsTrigger>
                <TabsTrigger value="results">Results Dashboard</TabsTrigger>
                <TabsTrigger value="admin">Admin Controls</TabsTrigger>
              </TabsList>
              
              <TabsContent value="voter" className="p-4 border rounded-lg bg-card/50">
                <VoterView />
              </TabsContent>
              
              <TabsContent value="results" className="p-4 border rounded-lg bg-card/50">
                <ResultsView />
              </TabsContent>
              
              <TabsContent value="admin" className="p-4 border rounded-lg bg-card/50">
                <AdminView />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">Ready to Create Your Own Election?</h2>
          <p className="mb-8">Sign up for Electra to create and manage your own secure elections.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/register')} size="lg">
              Sign Up Free
            </Button>
            <Button variant="outline" onClick={() => navigate('/contact')} size="lg">
              Contact Sales
            </Button>
          </div>
        </div>
    </div>
  </Layout>
);
};

export default Demo;