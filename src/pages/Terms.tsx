import React from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TermsOfService: React.FC = () => {
  const fadeInVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: i * 0.1, 
        duration: 0.5 
      } 
    })
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-center mb-2">Terms of Service</h1>
          <p className="text-muted-foreground text-center text-sm">Last updated: May 16, 2025</p>
          <div className="flex justify-center mt-2">
            <div className="h-1 w-16 bg-primary rounded-full"></div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Main content */}
          <div className="md:col-span-3 space-y-6">
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
            >
              <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">1</span>
                    Introduction
                  </h2>
                  <div className="text-muted-foreground">
                    <p>
                      Welcome to Electra ("we," "our," or "us"). By accessing or using the Electra platform, 
                      website, and services (collectively, the "Services"), you agree to be bound by these Terms 
                      of Service ("Terms"). If you do not agree to these Terms, please do not use our Services.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
            >
              <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">2</span>
                    Use of Services
                  </h2>
                  <div className="text-muted-foreground">
                    <p className="mb-3">
                      You may use our Services only as permitted by these Terms and any applicable laws. You may not:
                    </p>
                    <ul className="space-y-2 ml-2">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary/60"></div>
                        <span>Use our Services in any way that violates any applicable law or regulation.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary/60"></div>
                        <span>Attempt to interfere with the proper functioning of our Services.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary/60"></div>
                        <span>Bypass or attempt to bypass any measures we use to restrict access to the Services.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary/60"></div>
                        <span>Collect or harvest any information from our Services without our permission.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary/60"></div>
                        <span>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity.</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
            >
              <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">3</span>
                    User Accounts
                  </h2>
                  <div className="text-muted-foreground">
                    <p className="mb-3">
                      To use certain features of our Services, you may need to create an account. You are responsible for maintaining the 
                      confidentiality of your account credentials and for all activities that occur under your account. You agree to:
                    </p>
                    <ul className="space-y-2 ml-2">
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary/60"></div>
                        <span>Provide accurate and complete information when creating an account.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary/60"></div>
                        <span>Keep your password secure and confidential.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary/60"></div>
                        <span>Notify us immediately of any unauthorized use of your account.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary/60"></div>
                        <span>Update your account information to ensure it remains accurate and complete.</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Sidebar navigation */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="sticky top-24">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-semibold mb-3">On This Page</h3>
                    <ul className="space-y-3 text-sm">
                      <li>
                        <a 
                          href="#introduction" 
                          className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          Introduction
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#use-of-services" 
                          className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          Use of Services
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#user-accounts" 
                          className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          User Accounts
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Back to top button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="fixed bottom-8 right-8"
        >
          <Button
            onClick={scrollToTop}
            size="icon"
            className="rounded-full"
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default TermsOfService;