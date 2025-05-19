import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Clock, BarChart2, Lock, UserPlus, Smartphone, 
  FileText, CheckCircle2, ArrowRight, Vote, Users, ChevronRight
} from 'lucide-react';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
}> = ({ icon, title, description, link }) => (
  <Card className="glass-card h-full flex flex-col">
    <CardHeader>
      <div className="flex items-center gap-2 text-primary mb-2">
        {icon}
      </div>
      <CardTitle className="text-xl">{title}</CardTitle>
      <CardDescription className="text-base">{description}</CardDescription>
    </CardHeader>
    <CardContent className="mt-auto">
      {link && (
        <Link to={link} className="group inline-flex items-center text-primary hover:underline">
          Learn more <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </CardContent>
  </Card>
);

const HeroSection = () => (
  <div className="relative overflow-hidden py-12 md:py-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 mb-16">
    <div className="max-w-4xl mx-auto text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
        The tools you need to build election solutions that work
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-8">
        Experience modern, secure, and accessible voting for all your organizational needs
      </p>
      <Button size="lg" className="mr-4">
        <Link to="/demo">Try Demo</Link>
      </Button>
      <Button variant="outline" size="lg">
        <Link to="/pricing">View Pricing</Link>
      </Button>
    </div>
  </div>
);

const Categories = () => (
  <Tabs defaultValue="voting" className="mb-16">
    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-3xl mx-auto mb-8">
      <TabsTrigger value="voting">Secure Voting</TabsTrigger>
      <TabsTrigger value="management">Management</TabsTrigger>
      <TabsTrigger value="security">Security</TabsTrigger>
      <TabsTrigger value="access">Accessibility</TabsTrigger>
    </TabsList>
    
    <TabsContent value="voting" className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          icon={<ShieldCheck className="h-8 w-8" />}
          title="Secure Voting"
          description="End-to-end encryption and blockchain technology ensure the integrity of every vote."
          link="/security"
        />
        <FeatureCard
          icon={<Clock className="h-8 w-8" />}
          title="Real-Time Results"
          description="Get instant access to live results and analytics as votes are cast."
          link="/demo"
        />
        <FeatureCard
          icon={<Vote className="h-8 w-8" />}
          title="Customizable Elections"
          description="Configure elections with different voting methods, eligibility rules, and more."
          link="/demo"
        />
      </div>
    </TabsContent>
    
    <TabsContent value="management" className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          icon={<Users className="h-8 w-8" />}
          title="User Management"
          description="Easily manage voters, candidates, and administrators with role-based permissions."
          link="/demo"
        />
        <FeatureCard
          icon={<BarChart2 className="h-8 w-8" />}
          title="Analytics Dashboard"
          description="Comprehensive dashboard with rich insights and visualization tools."
          link="/demo"
        />
        <FeatureCard
          icon={<FileText className="h-8 w-8" />}
          title="Audit Trails"
          description="Transparent logs and audit trails for complete accountability."
          link="/security"
        />
      </div>
    </TabsContent>
    
    <TabsContent value="security" className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          icon={<Lock className="h-8 w-8" />}
          title="Voter Privacy"
          description="All votes are anonymous and protected by advanced privacy measures."
          link="/security"
        />
        <FeatureCard
          icon={<ShieldCheck className="h-8 w-8" />}
          title="Tamper-Proof"
          description="Blockchain technology ensures votes cannot be altered once cast."
          link="/security"
        />
        <FeatureCard
          icon={<FileText className="h-8 w-8" />}
          title="Compliance Ready"
          description="Built to meet industry standards and regulatory requirements."
          link="/security"
        />
      </div>
    </TabsContent>
    
    <TabsContent value="access" className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          icon={<Smartphone className="h-8 w-8" />}
          title="Multi-Device Access"
          description="Participate in elections from any device, anywhere in the world."
          link="/demo"
        />
        <FeatureCard
          icon={<UserPlus className="h-8 w-8" />}
          title="Easy Voter Registration"
          description="Simple and secure voter onboarding and management tools."
          link="/demo"
        />
        <FeatureCard
          icon={<CheckCircle2 className="h-8 w-8" />}
          title="Inclusive Design"
          description="Accessible interface designed for users of all abilities."
          link="/demo"
        />
      </div>
    </TabsContent>
  </Tabs>
);

const AllFeatures = () => (
  <div className="mb-16">
    <h2 className="text-3xl font-bold mb-8 text-center">All Features</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">
          <ShieldCheck className="h-5 w-5 inline-block mr-2 text-primary" />
          Secure Voting
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
            <span>End-to-end encryption and blockchain technology ensure the integrity of every vote.</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
            <span>Tamper-proof ballots with cryptographic verification.</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
            <span>Anonymous voting with privacy guarantees.</span>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">
          <Vote className="h-5 w-5 inline-block mr-2 text-primary" />
          Customizable Elections
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
            <span>Support for multiple voting methods: first-past-the-post, ranked choice, approval voting.</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
            <span>Customizable eligibility rules and voter verification.</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
            <span>Flexible election scheduling with automatic start/end times.</span>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">
          <Clock className="h-5 w-5 inline-block mr-2 text-primary" />
          Real-Time Results
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
            <span>Instant access to live results and analytics as votes are cast.</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
            <span>Rich data visualization with charts and graphs.</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
            <span>Export results in multiple formats (CSV, PDF, JSON).</span>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">
          <Users className="h-5 w-5 inline-block mr-2 text-primary" />
          User Management
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
            <span>Role-based access control for administrators, voters, and observers.</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
            <span>Bulk import and management of voter lists.</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
            <span>Self-service voter registration with verification options.</span>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">
          <Smartphone className="h-5 w-5 inline-block mr-2 text-primary" />
          Multi-Device Access
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
            <span>Vote from any device with a responsive web interface.</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
            <span>Native mobile apps for iOS and Android.</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
            <span>Offline voting capability with synchronization when online.</span>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">
          <FileText className="h-5 w-5 inline-block mr-2 text-primary" />
          Audit Trails
        </h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
            <span>Comprehensive audit logs for all system activities.</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
            <span>Cryptographic verification of vote integrity.</span>
          </li>
          <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
            <span>Exportable evidence for election validation.</span>
          </li>
      </ul>
      </div>
    </div>
  </div>
);

const CTASection = () => (
  <div className="py-12 px-4 rounded-2xl bg-gradient-to-r from-primary/20 to-blue-400/20 text-center mb-16">
    <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
    <p className="text-lg mb-8 max-w-2xl mx-auto">
      Try our demo to experience Electra's powerful features, or contact us to discuss your specific voting needs.
    </p>
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <Button size="lg">
        <Link to="/demo">Try Demo</Link>
      </Button>
      <Button variant="outline" size="lg">
        <Link to="/contact">Contact Sales</Link>
      </Button>
    </div>
  </div>
);

const Features: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <HeroSection />
        <Categories />
        <AllFeatures />
        <CTASection />
      </div>
    </Layout>
  );
};

export default Features;
