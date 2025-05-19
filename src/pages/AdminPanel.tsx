import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useElection } from '@/contexts/ElectionContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Pencil, Trash2, Eye } from 'lucide-react';
import AdminActionBar from '@/components/AdminActionBar';

// Admin sub-pages
const AdminDashboard = () => {
  const { elections, activeElections, completedElections, upcomingElections, deleteElection } = useElection();
  const navigate = useNavigate();
  
  // Sample data for charts
  const electionStatusData = [
    { name: 'Active', value: activeElections.length, color: '#3498db' },
    { name: 'Upcoming', value: upcomingElections.length, color: '#f39c12' },
    { name: 'Completed', value: completedElections.length, color: '#27ae60' },
  ];
  
  const voterActivityData = [
    { name: 'Day 1', voters: 24 },
    { name: 'Day 2', voters: 13 },
    { name: 'Day 3', voters: 38 },
    { name: 'Day 4', voters: 52 },
    { name: 'Day 5', voters: 69 },
    { name: 'Day 6', voters: 41 },
    { name: 'Day 7', voters: 26 },
  ];
  
  return (
    <AdminLayout title="Admin Dashboard" subtitle="Monitor and manage election activity">
      {/* Admin Action Bar */}
      <AdminActionBar />
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="glass-card shadow-sm hover:shadow transition-all duration-200">
          <CardContent className="pt-6">
            <div className="text-gray-500 text-sm uppercase font-medium mb-1">Total Elections</div>
            <div className="text-5xl font-bold">{elections.length}</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card shadow-sm hover:shadow transition-all duration-200">
          <CardContent className="pt-6">
            <div className="text-gray-500 text-sm uppercase font-medium mb-1">Active Elections</div>
            <div className="text-5xl font-bold text-blue-500">{activeElections.length}</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card shadow-sm hover:shadow transition-all duration-200">
          <CardContent className="pt-6">
            <div className="text-gray-500 text-sm uppercase font-medium mb-1">Total Votes</div>
            <div className="text-5xl font-bold">
              {elections.reduce((acc, election) => acc + election.totalVotes, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card shadow-sm hover:shadow transition-all duration-200">
          <CardContent className="pt-6">
            <div className="text-gray-500 text-sm uppercase font-medium mb-1">Avg. Participation</div>
            <div className="text-5xl font-bold">
              {elections.length
                ? Math.round(
                    (elections.reduce((acc, election) => {
                      return acc + (election.totalVotes / election.voterCount) * 100;
                    }, 0) / elections.length)
                  )
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="glass-card shadow-sm hover:shadow transition-all duration-200">
          <CardHeader className="pb-0">
            <CardTitle>Election Status</CardTitle>
            <CardDescription>Distribution of election statuses</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={electionStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => 
                    name && percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                >
                  {electionStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry, index) => (
                    <span className="text-sm font-medium">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <div className="flex justify-center pb-4">
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#3498db]"></div>
                <span className="text-sm">Active: {activeElections.length > 0 ? Math.round((activeElections.length / elections.length) * 100) : 0}%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#f39c12]"></div>
                <span className="text-sm">Upcoming: {upcomingElections.length > 0 ? Math.round((upcomingElections.length / elections.length) * 100) : 0}%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#27ae60]"></div>
                <span className="text-sm">Completed: {completedElections.length > 0 ? Math.round((completedElections.length / elections.length) * 100) : 0}%</span>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="glass-card shadow-sm hover:shadow transition-all duration-200">
          <CardHeader className="pb-0">
            <CardTitle>Voter Activity (Last 7 Days)</CardTitle>
            <CardDescription>Number of votes cast each day</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={voterActivityData} margin={{ top: 20, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} width={30} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    border: 'none'
                  }}
                  formatter={(value) => [`${value} votes`, 'Votes']}
                  labelFormatter={(label) => `Day ${label.split(' ')[1]}`}
                />
                <Bar 
                  dataKey="voters" 
                  name="Votes" 
                  fill="#3498db"
                  radius={[4, 4, 0, 0]}
                  barSize={35}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Elections */}
      <Card className="glass-card mb-8 shadow-sm hover:shadow transition-all duration-200">
        <CardHeader className="pb-2">
          <CardTitle>Recent Elections</CardTitle>
          <CardDescription>Latest election activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-3 text-left font-medium">Title</th>
                  <th className="py-3 text-left font-medium">Status</th>
                  <th className="py-3 text-left font-medium">Start Date</th>
                  <th className="py-3 text-left font-medium">End Date</th>
                  <th className="py-3 text-left font-medium">Participation</th>
                  <th className="py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {elections.slice(0, 5).map((election) => (
                  <tr key={election.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="py-3 font-medium">{election.title}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        election.status === 'active'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          : election.status === 'completed'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                      }`}>
                        {election.status}
                      </span>
                    </td>
                    <td className="py-3">{election.startDate.toLocaleDateString()}</td>
                    <td className="py-3">{election.endDate.toLocaleDateString()}</td>
                    <td className="py-3">{Math.round((election.totalVotes / election.voterCount) * 100)}%</td>
                    <td className="py-3 flex gap-2">
                      <Button size="icon" variant="ghost" className="rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={() => navigate(`/elections/${election.id}`)} title="View">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/20" onClick={() => navigate(`/elections/${election.id}/edit`)} title="Edit">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400" onClick={() => deleteElection(election.id)} title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="border-t border-gray-200 dark:border-gray-700">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/elections')}>View All Elections</Button>
        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

const AdminElections = () => {
  const { elections, activeElections, completedElections, upcomingElections, deleteElection } = useElection();
  const navigate = useNavigate();
  
  return (
    <AdminLayout title="Election Management" subtitle="Create and manage elections">
      {/* Admin Action Bar */}
      <AdminActionBar />
      
      <Card className="glass-card shadow-sm hover:shadow transition-all duration-200 mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Election Overview</CardTitle>
          <CardDescription>Status of all elections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/50 dark:bg-gray-800/50 shadow-sm border border-gray-100 dark:border-gray-700">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-500 text-sm uppercase font-medium mb-1">Active</div>
                    <div className="text-3xl font-bold text-blue-500">{activeElections.length}</div>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                    <div className="text-blue-500 dark:text-blue-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-vote"><path d="m9 12 2 2 4-4"/><path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"/><path d="M22 19H2"/><path d="M17 3v4"/><path d="M7 3v4"/></svg>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/50 dark:bg-gray-800/50 shadow-sm border border-gray-100 dark:border-gray-700">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-500 text-sm uppercase font-medium mb-1">Upcoming</div>
                    <div className="text-3xl font-bold text-amber-500">{upcomingElections.length}</div>
                  </div>
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                    <div className="text-amber-500 dark:text-amber-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-clock"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.5"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><circle cx="16" cy="16" r="6"/><path d="M16 14v2l1 1"/></svg>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/50 dark:bg-gray-800/50 shadow-sm border border-gray-100 dark:border-gray-700">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-gray-500 text-sm uppercase font-medium mb-1">Completed</div>
                    <div className="text-3xl font-bold text-green-500">{completedElections.length}</div>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                    <div className="text-green-500 dark:text-green-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card shadow-sm hover:shadow transition-all duration-200">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Elections</CardTitle>
              <CardDescription>Manage your elections</CardDescription>
            </div>
            <Button onClick={() => navigate('/elections/create')} className="bg-primary hover:bg-primary/90">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus mr-1"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Create Election
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {elections.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="py-3 text-left font-medium">Title</th>
                    <th className="py-3 text-left font-medium">Status</th>
                    <th className="py-3 text-left font-medium">Start Date</th>
                    <th className="py-3 text-left font-medium">End Date</th>
                    <th className="py-3 text-left font-medium">Participation</th>
                    <th className="py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {elections.map((election) => (
                    <tr key={election.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                      <td className="py-3 font-medium">{election.title}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          election.status === 'active'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : election.status === 'completed'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        }`}>
                          {election.status}
                        </span>
                      </td>
                      <td className="py-3">{election.startDate.toLocaleDateString()}</td>
                      <td className="py-3">{election.endDate.toLocaleDateString()}</td>
                      <td className="py-3">{Math.round((election.totalVotes / election.voterCount) * 100)}%</td>
                      <td className="py-3 flex gap-2">
                        <Button size="icon" variant="ghost" className="rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={() => navigate(`/elections/${election.id}`)} title="View">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/20" onClick={() => navigate(`/elections/${election.id}/edit`)} title="Edit">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400" onClick={() => deleteElection(election.id)} title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No elections found. Create your first election to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

const AdminVoters = () => {
  return (
    <AdminLayout title="Voter Management" subtitle="Manage voter registration and access">
      {/* Admin Action Bar */}
      <AdminActionBar />
      
      <Card className="glass-card shadow-sm hover:shadow transition-all duration-200">
        <CardHeader className="pb-2">
          <CardTitle>Registered Voters</CardTitle>
          <CardDescription>View and manage voter accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card className="bg-white/50 dark:bg-gray-800/50 shadow-sm border border-gray-100 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="text-gray-500 text-sm uppercase font-medium mb-1">Total Voters</div>
                <div className="text-4xl font-bold">254</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/50 dark:bg-gray-800/50 shadow-sm border border-gray-100 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="text-gray-500 text-sm uppercase font-medium mb-1">Active Voters</div>
                <div className="text-4xl font-bold text-blue-500">187</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/50 dark:bg-gray-800/50 shadow-sm border border-gray-100 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="text-gray-500 text-sm uppercase font-medium mb-1">Avg. Participation</div>
                <div className="text-4xl font-bold">73%</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
            <p className="text-center text-muted-foreground">Voter management tools will be available here. You'll be able to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
              <li>Add new voters individually or bulk import</li>
              <li>Manage voter credentials and access</li>
              <li>Track voting history and participation</li>
              <li>Export voter data for reporting</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

const AdminSettings = () => {
  return (
    <AdminLayout title="System Settings" subtitle="Configure your voting system">
      {/* Admin Action Bar */}
      <AdminActionBar />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-card shadow-sm hover:shadow transition-all duration-200 mb-6">
            <CardHeader className="pb-2">
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Configure global system settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                  <h3 className="font-medium text-primary mb-2">General Settings</h3>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <div>
                      <p className="font-medium">System Name</p>
                      <p className="text-sm text-muted-foreground">The name displayed throughout the application</p>
                    </div>
                    <div className="text-sm">Electra</div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <div>
                      <p className="font-medium">Date Format</p>
                      <p className="text-sm text-muted-foreground">How dates are displayed</p>
                    </div>
                    <div className="text-sm">MM/DD/YYYY</div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Default Language</p>
                      <p className="text-sm text-muted-foreground">Default system language</p>
                    </div>
                    <div className="text-sm">English (US)</div>
                  </div>
                </div>
                
                <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                  <h3 className="font-medium text-primary mb-2">Security Settings</h3>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                    </div>
                    <div className="text-sm">Enabled</div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <div>
                      <p className="font-medium">Password Expiration</p>
                      <p className="text-sm text-muted-foreground">Force password reset after period</p>
                    </div>
                    <div className="text-sm">90 days</div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Session Timeout</p>
                      <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                    </div>
                    <div className="text-sm">30 minutes</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="glass-card shadow-sm hover:shadow transition-all duration-200 mb-6">
            <CardHeader className="pb-2">
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current system information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="text-sm font-medium">Version</div>
                    <div className="text-sm">1.0.0</div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="text-sm font-medium">Environment</div>
                    <div className="text-sm">Production</div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="text-sm font-medium">Last Updated</div>
                    <div className="text-sm">May 16, 2023</div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="text-sm font-medium">Status</div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm text-green-600 dark:text-green-400">Operational</span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full bg-primary hover:bg-primary/90">Check for Updates</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card shadow-sm hover:shadow transition-all duration-200">
            <CardHeader className="pb-2">
              <CardTitle>Help & Support</CardTitle>
              <CardDescription>Get assistance with Electra</CardDescription>
        </CardHeader>
        <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                  Documentation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
                  Developer API
                </Button>
              </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

// Main AdminPanel component
const AdminPanel: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to /admin/dashboard if we're at /admin
  React.useEffect(() => {
    if (location.pathname === '/admin') {
      navigate('/admin/dashboard');
    }
  }, [location, navigate]);

  return (
    <Routes>
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/elections" element={<AdminElections />} />
      <Route path="/voters" element={<AdminVoters />} />
      <Route path="/settings" element={<AdminSettings />} />
    </Routes>
  );
};

export default AdminPanel;
