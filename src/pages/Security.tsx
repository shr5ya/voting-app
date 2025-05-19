import React from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Shield, 
  User, 
  Users, 
  Lock, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search,
  ChevronDown,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BarChart } from '@/components/charts/BarChart';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Sample data for the security stats
const securityStats = {
  user: 36899,
  admin: 75,
  failed: 291
};

// Sample data for the chart
const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'User Activity',
      data: [18000, 30000, 25000, 32000, 20000, 25000],
      backgroundColor: 'rgba(18, 52, 86, 0.7)',
      borderColor: 'rgba(18, 52, 86, 1)',
      borderWidth: 1
    }
  ]
};

// Sample session data
const sessionData = [
  { 
    location: 'USA(5)', 
    device: 'Chrome - Windows', 
    ipAddress: '236.125.56.78',
    time: '2 minutes ago',
    status: 'success'
  },
  { 
    location: 'United Kingdom(10)', 
    device: 'Safari - Mac OS', 
    ipAddress: '236.125.56.69',
    time: '10 minutes ago',
    status: 'success'
  },
  { 
    location: 'Norway(-)', 
    device: 'Firefox - Windows', 
    ipAddress: '236.125.56.10',
    time: '20 minutes ago',
    status: 'success'
  },
  { 
    location: 'Japan(12)', 
    device: 'iOS - iPhone Pro', 
    ipAddress: '236.125.56.54',
    time: '30 minutes ago',
    status: 'failure'
  },
  { 
    location: 'Italy(5)', 
    device: 'Samsung Note5 - Android', 
    ipAddress: '236.100.56.50',
    time: '40 minutes ago',
    status: 'failure'
  }
];

const Security: React.FC = () => {
  return (
    <Layout>
      <motion.div 
        className="py-6"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div variants={fadeIn} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Security</h1>
            <p className="text-muted-foreground">Monitor and manage your account security settings</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Button>
            <Button variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              View Logs
            </Button>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <motion.div variants={fadeIn} className="col-span-full lg:col-span-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Sign in times</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="12Hours">
                  <div className="flex justify-between items-center mb-4">
                    <TabsList>
                      <TabsTrigger value="12Hours">12 Hours</TabsTrigger>
                      <TabsTrigger value="Day">Day</TabsTrigger>
                      <TabsTrigger value="Week">Week</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-background/40 p-4 rounded-lg text-center">
                      <div className="text-lg font-semibold text-muted-foreground mb-1">User</div>
                      <div className="text-3xl font-bold">{securityStats.user.toLocaleString()}</div>
                    </div>
                    <div className="bg-background/40 p-4 rounded-lg text-center">
                      <div className="text-lg font-semibold text-muted-foreground mb-1">Admin</div>
                      <div className="text-3xl font-bold">{securityStats.admin}</div>
                    </div>
                    <div className="bg-background/40 p-4 rounded-lg text-center">
                      <div className="text-lg font-semibold text-muted-foreground mb-1">Failed</div>
                      <div className="text-3xl font-bold">{securityStats.failed}</div>
                    </div>
                  </div>

                  <Tabs defaultValue="agentsChart">
                    <TabsList className="mb-4">
                      <TabsTrigger value="agentsChart">Agents Chart</TabsTrigger>
                      <TabsTrigger value="clientsChart">Clients Chart</TabsTrigger>
                    </TabsList>
                    <TabsContent value="agentsChart" className="h-[270px] mt-0">
                      <BarChart data={chartData} />
                    </TabsContent>
                    <TabsContent value="clientsChart" className="h-[270px] mt-0">
                      <BarChart data={chartData} />
                    </TabsContent>
                  </Tabs>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn} className="col-span-full lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Alerts</span>
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <div className="h-2 w-2 rounded-full bg-muted"></div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm">
                    In the last year, you've probably had to adapt to new ways of living and working.
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Jun 11, 2024</span>
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-primary hover:text-primary font-medium">
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span>Security Guidelines</span>
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <div className="h-2 w-2 rounded-full bg-muted"></div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm">
                    As we approach one year of working remotely, we wanted to take a look back and share some ways teams around the world have collaborated effectively.
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Jun 10, 2024</span>
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-primary hover:text-primary font-medium">
                      Explore
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={fadeIn} className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Sign in Sessions</CardTitle>
                <Button variant="outline" size="sm">
                  1 Hour <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground [&>th]:p-3 border-b">
                      <th>Location</th>
                      <th>Device</th>
                      <th>IP Address</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessionData.map((session, index) => (
                      <tr key={index} className="border-b last:border-0 [&>td]:p-3 text-sm">
                        <td>{session.location}</td>
                        <td>{session.device}</td>
                        <td>{session.ipAddress}</td>
                        <td className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          {session.time}
                        </td>
                        <td>
                          {session.status === 'success' ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Success
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
                              <XCircle className="h-3 w-3 mr-1" /> Failure
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn} className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Security Recommendations</CardTitle>
              <CardDescription>Steps to improve your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 p-3 bg-green-500/10 rounded-md">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Two-factor authentication is enabled</h3>
                  <p className="text-sm text-muted-foreground">Your account is protected with an extra layer of security.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 bg-yellow-500/10 rounded-md">
                <Shield className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Consider changing your password</h3>
                  <p className="text-sm text-muted-foreground">It's been over 3 months since your last password change.</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Change Password
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 bg-red-500/10 rounded-md">
                <Lock className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">Review active sessions</h3>
                  <p className="text-sm text-muted-foreground">There are 5 devices currently logged into your account.</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Manage Sessions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Security;