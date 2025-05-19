import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Download, Printer, Share2, ChevronDown, 
  ChevronUp, Trophy, BarChart2, PieChart as PieChartIcon, Filter 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import Layout from '@/components/Layout';
import { useElection } from '@/contexts/ElectionContext';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { GlassContainer } from '@/components/ui/glass-components';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Results: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getElection } = useElection();
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  
  const election = getElection(id || '');

  useEffect(() => {
    // Set shareable URL
    if (election) {
      setShareUrl(`${window.location.origin}/results/${id}`);
    }
  }, [election, id]);
  
  if (!election) {
    return (
      <Layout>
        <GlassContainer
          variant="panel"
          className="p-10 text-center"
        >
          <div className="flex flex-col items-center justify-center py-12">
            <h1 className="text-2xl font-bold mb-4">Election Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The election you are looking for does not exist or has been removed.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </GlassContainer>
      </Layout>
    );
  }
  
  // Format data for charts with properly spaced colors
  const chartData = election.candidates.map((candidate, index) => {
    // Create distinct colors with good separation
    const hue = (index * 137.5) % 360; // Golden angle approximation for better distribution
    return {
      name: candidate.name,
      value: candidate.votes,
      color: `hsl(${hue}, 75%, 55%)`,
    };
  });
  
  // Sort candidates by votes (descending)
  const sortedCandidates = [...election.candidates].sort((a, b) => b.votes - a.votes);
  
  // Calculate if we have a winner or tie
  const hasWinner = sortedCandidates.length > 0 && 
    sortedCandidates[0].votes > 0 && 
    (sortedCandidates.length === 1 || sortedCandidates[0].votes > sortedCandidates[1].votes);

  const handleExport = (format: string) => {
    setIsExporting(true);
    
    // Mock export functionality
    setTimeout(() => {
      toast.success(`Results exported as ${format} successfully!`);
      setIsExporting(false);
    }, 1500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast.success('Link copied to clipboard!');
        setShowShareDialog(false);
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  };

  const handlePrint = () => {
    window.print();
  };
  
  return (
    <Layout>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading">{election.title} Results</h1>
            <p className="text-muted-foreground">{election.description}</p>
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={isExporting}>
                <Button variant="outline" className="glass-card-flat">
                  <Download className="mr-2 h-4 w-4" />
                  {isExporting ? 'Exporting...' : 'Export'}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('PDF')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('CSV')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('Image')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as Image
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" className="glass-card-flat" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            
            <Button variant="outline" className="glass-card-flat" onClick={() => setShowShareDialog(true)}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="glass-card lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Election Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white/20 dark:bg-gray-800/20 p-3 rounded-lg backdrop-blur-sm">
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div className="font-medium capitalize flex items-center gap-2">
                    {election.status === 'completed' && (
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    )}
                    {election.status === 'active' && (
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                    {election.status === 'upcoming' && (
                      <span className="inline-block w-2 h-2 bg-amber-500 rounded-full"></span>
                    )}
                    {election.status}
                  </div>
                </div>
                <div className="bg-white/20 dark:bg-gray-800/20 p-3 rounded-lg backdrop-blur-sm">
                  <div className="text-sm font-medium text-muted-foreground">Total Votes</div>
                  <div className="font-medium text-lg">{election.totalVotes}</div>
                </div>
                <div className="bg-white/20 dark:bg-gray-800/20 p-3 rounded-lg backdrop-blur-sm">
                  <div className="text-sm font-medium text-muted-foreground">Eligible Voters</div>
                  <div className="font-medium text-lg">{election.voterCount}</div>
                </div>
                <div className="bg-white/20 dark:bg-gray-800/20 p-3 rounded-lg backdrop-blur-sm">
                  <div className="text-sm font-medium text-muted-foreground">Participation Rate</div>
                  <div className="font-medium text-lg flex items-center gap-2">
                    {Math.round((election.totalVotes / election.voterCount) * 100)}%
                    {election.totalVotes / election.voterCount > 0.5 ? (
                      <ChevronUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                </div>
                <div className="bg-white/20 dark:bg-gray-800/20 p-3 rounded-lg backdrop-blur-sm">
                  <div className="text-sm font-medium text-muted-foreground">End Date</div>
                  <div className="font-medium">{election.endDate.toLocaleDateString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Results Visualization</CardTitle>
                <div className="flex items-center gap-2 text-sm">
                  <Button 
                    variant={chartType === 'pie' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('pie')}
                    className={chartType === 'pie' ? '' : 'glass-card-flat'}
                  >
                    <PieChartIcon className="h-4 w-4 mr-1" />
                    Pie
                  </Button>
                  <Button 
                    variant={chartType === 'bar' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('bar')}
                    className={chartType === 'bar' ? '' : 'glass-card-flat'}
                  >
                    <BarChart2 className="h-4 w-4 mr-1" />
                    Bar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {election.totalVotes > 0 ? (
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'pie' ? (
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => {
                            // Only show label if percent is large enough to be readable
                            return percent > 0.1 ? `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%` : '';
                          }}
                          paddingAngle={4}
                          cornerRadius={3}
                        >
                          {chartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color} 
                              stroke="rgba(255, 255, 255, 0.3)" 
                              strokeWidth={1} 
                            />
                          ))}
                        </Pie>
                        <Legend
                          layout="vertical"
                          verticalAlign="middle"
                          align="right"
                          wrapperStyle={{
                            paddingLeft: "20px",
                            fontSize: "12px",
                          }}
                          payload={
                            chartData.map((item, index) => ({
                              id: index,
                              value: `${item.name} (${item.value} votes)`,
                              color: item.color,
                              type: 'square'
                            }))
                          }
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            border: 'none',
                            padding: '10px'
                          }}
                          formatter={(value, name) => [`${value} votes (${Math.round((value / election.totalVotes) * 100)}%)`, name]}
                          labelFormatter={() => 'Votes'}
                        />
                      </PieChart>
                    ) : (
                      <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={true} vertical={false} />
                        <XAxis type="number" />
                        <YAxis 
                          type="category" 
                          dataKey="name" 
                          tick={{ fontSize: 12 }} 
                          width={120}
                          tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            border: 'none'
                          }}
                          formatter={(value) => [`${value} votes (${Math.round((value as number / election.totalVotes) * 100)}%)`, 'Votes']}
                        />
                        <Bar 
                          dataKey="value" 
                          name="Votes" 
                          radius={[0, 4, 4, 0]} 
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] bg-white/10 dark:bg-gray-800/20 rounded-lg backdrop-blur-sm">
                  <p className="text-muted-foreground">No votes have been cast yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Winner Section */}
        {hasWinner && election.status === 'completed' && (
          <GlassContainer variant="panel" className="my-6 p-6">
            <div className="flex flex-col items-center">
              <Trophy className="h-10 w-10 text-amber-500 mb-2" />
              <h2 className="text-2xl font-bold mb-2">Winner</h2>
              <Avatar className="h-20 w-20 mb-3 border-4 border-amber-300">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(sortedCandidates[0].name)}`} alt={sortedCandidates[0].name} />
                <AvatarFallback>{sortedCandidates[0].name[0]}</AvatarFallback>
              </Avatar>
              <p className="text-xl font-bold">{sortedCandidates[0].name}</p>
              <p className="text-muted-foreground mb-4">{sortedCandidates[0].position}</p>
              <Badge className="bg-amber-500/80">{sortedCandidates[0].votes} Votes ({Math.round((sortedCandidates[0].votes / election.totalVotes) * 100)}%)</Badge>
            </div>
          </GlassContainer>
        )}
        
        {/* Candidates Results */}
        <h2 className="text-2xl font-semibold font-heading mt-8 mb-4 flex items-center">
          <BarChart2 className="mr-2 h-5 w-5 text-primary" />
          Candidate Results
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {sortedCandidates.map((candidate, index) => (
            <Card key={candidate.id} className="glass-card-flat">
              <CardContent className="flex items-center p-4">
                <div className="mr-4 relative">
                  {index === 0 && hasWinner && (
                    <div className="absolute -top-1 -left-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">
                      1
                    </div>
                  )}
                  <Avatar className="h-16 w-16 border border-white/30 shadow-sm">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(candidate.name)}`} alt={candidate.name} />
                    <AvatarFallback>{candidate.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="font-bold">{candidate.name}</p>
                      <p className="text-sm text-muted-foreground">{candidate.position}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{candidate.votes} votes</p>
                      <p className="text-sm text-muted-foreground">
                        {election.totalVotes > 0 ? Math.round((candidate.votes / election.totalVotes) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                  <Progress 
                    value={election.totalVotes > 0 ? (candidate.votes / election.totalVotes) * 100 : 0} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
      
      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Share Results</DialogTitle>
            <DialogDescription>
              Share the results of this election with others.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <label className="text-sm font-medium leading-none">
                Share Link
              </label>
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="glass-input py-2 px-3 w-full"
              />
            </div>
            <Button onClick={handleShare}>Copy</Button>
          </div>
          <DialogFooter>
            <Button variant="outline" className="glass-card-flat" onClick={() => setShowShareDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Results;
