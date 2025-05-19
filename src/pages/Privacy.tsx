import React from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Shield, Lock, Clock, Check, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

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

const Privacy: React.FC = () => {
  // Current date formatting for the "Last updated" section
  const lastUpdated = new Date('2023-11-05').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Layout>
      <motion.div 
        className="max-w-4xl mx-auto py-12"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div variants={fadeIn} className="mb-10">
          <div className="flex flex-col items-center justify-center text-center mb-8">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-heading">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground mb-2">Last updated: {lastUpdated}</p>
            <p className="text-muted-foreground max-w-2xl">
              This Privacy Policy describes how we collect, use, and disclose your personal information 
              when you use our voting services. Your privacy is important to us.
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeIn} className="mb-6">
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2 text-primary" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Personal Information</h3>
                <p className="text-muted-foreground">
                  When you register for our service, we may collect the following personal information:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Name and contact information</li>
                  <li>Email address</li>
                  <li>Organization details (if applicable)</li>
                  <li>Login credentials</li>
                  <li>Profile information</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Usage Data</h3>
                <p className="text-muted-foreground">
                  We automatically collect information about how you interact with our service, including:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>IP address and device information</li>
                  <li>Browser type and settings</li>
                  <li>Election creation and management activities</li>
                  <li>System logs and performance data</li>
                  <li>Voting records (anonymized)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We use the collected information for various purposes, including:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Providing our Services:</span> To operate our voting platform, create and manage elections, and process votes.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Improving our Services:</span> To analyze usage patterns, troubleshoot issues, and enhance features.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Communication:</span> To respond to your inquiries, provide support, and send service updates.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Legal Compliance:</span> To comply with applicable laws, regulations, and legal processes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We implement robust security measures to protect your personal information from unauthorized 
                access, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>End-to-end encryption for all election data</li>
                <li>Secure data storage with regular backups</li>
                <li>Regular security assessments and audits</li>
                <li>Access controls and authentication protocols</li>
                <li>Continuous monitoring for suspicious activities</li>
              </ul>
              <div className="mt-4 bg-yellow-500/10 p-4 rounded-md flex gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm">
                  While we implement robust security measures, no method of transmission over the internet or 
                  electronic storage is 100% secure. We strive to use commercially acceptable means to protect your 
                  data but cannot guarantee absolute security.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle>Sharing Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We do not sell, trade, or rent your personal information to third parties. We may share your 
                information in the following limited circumstances:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>With service providers who help us deliver our services (subject to confidentiality obligations)</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer, merger, or acquisition</li>
                <li>With your explicit consent</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Access and Review</h3>
                  <p className="text-muted-foreground text-sm">
                    You can request access to the personal information we hold about you.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Correction</h3>
                  <p className="text-muted-foreground text-sm">
                    You can request correction of inaccurate or incomplete information.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Deletion</h3>
                  <p className="text-muted-foreground text-sm">
                    You can request deletion of your personal information in certain circumstances.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Data Portability</h3>
                  <p className="text-muted-foreground text-sm">
                    You can request a copy of your data in a structured, commonly used format.
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground mt-4">
                To exercise these rights, please contact us at <a href="mailto:privacy@electra-vote.com" className="text-primary hover:underline">privacy@electra-vote.com</a>.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. 
                We will notify you of any material changes by posting the updated policy on our website with a new 
                effective date.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-border/30">
                <p className="text-sm text-muted-foreground">
                  Effective Date: {lastUpdated}
                </p>
                <Button asChild variant="outline" size="sm" className="flex items-center gap-1">
                  <a href="/terms" className="flex items-center gap-1">
                    <span>Terms of Service</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn} className="text-center mt-12">
          <h3 className="text-xl font-bold mb-4">Have Questions About Our Privacy Practices?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            If you have any questions or concerns about this Privacy Policy or our data practices, 
            please contact our Privacy Team.
          </p>
          <Button asChild className="electra-button-primary">
            <Link to="/contact" className="inline-flex items-center gap-2">
              Contact Privacy Team
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Privacy;