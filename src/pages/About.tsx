import React from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Badge, Users, Landmark, Building2, Building, Cpu, BarChart3, Lock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const About: React.FC = () => {
  return (
    <Layout>
      <motion.div 
        className="max-w-6xl mx-auto py-12"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeIn} className="order-2 md:order-1">
            <div className="relative">
              <div className="absolute -z-10 -left-8 -top-8 h-16 w-16">
                <svg viewBox="0 0 100 100" className="text-primary h-16 w-16">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M 20,50 L 80,50" stroke="currentColor" strokeWidth="2" />
                  <path d="M 50,20 L 50,80" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <img 
                src="/electra-team.jpg" 
                alt="Electra Team" 
                className="rounded-2xl w-full object-cover h-[500px] shadow-xl"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80';
                }}
              />
            </div>
          </motion.div>

          <motion.div variants={fadeIn} className="order-1 md:order-2">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 font-heading">
              ABOUT US
            </h1>
            
            <p className="text-muted-foreground mb-6">
              Electra started as a small team of voting technology experts in downtown 
              Seattle, aiming to make democratic processes more accessible and transparent. 
              It soon became obvious that we would need to help organizations see beyond traditional 
              voting methods, and be there with them from planning to results.
            </p>
            
            <p className="text-muted-foreground mb-8">
              Currently, we offer secure voting solutions, election management systems, and custom 
              implementation services to help our customers run seamless elections of any scale. 
              We value transparency and security above everything else, meaning that we won't accept 
              "good enough" as an answer.
            </p>
            
            <div className="flex space-x-4">
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Instagram size={20} />
              </motion.a>
            </div>
          </motion.div>
        </div>

        <motion.div 
          variants={fadeIn}
          className="my-24 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 font-heading">Our Services</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Badge className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Elections</h3>
              <p className="text-muted-foreground">
                End-to-end encrypted voting systems with blockchain verification for maximum security and transparency.
              </p>
            </div>
            
            <div className="glass-card p-8 flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Custom Implementations</h3>
              <p className="text-muted-foreground">
                Tailor-made voting solutions designed specifically for your organization's unique requirements.
              </p>
            </div>
            
            <div className="glass-card p-8 flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Advanced Analytics</h3>
              <p className="text-muted-foreground">
                Comprehensive reporting and analytics to gain insights from your election results.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={fadeIn}
          className="my-24"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center font-heading">Who We Serve</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Corporations</h3>
              <p className="text-muted-foreground">
                Board elections, shareholder voting, and corporate governance
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Associations</h3>
              <p className="text-muted-foreground">
                Member voting, board elections, and bylaw amendments
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Landmark className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Governments</h3>
              <p className="text-muted-foreground">
                Municipal elections, public consultations, and citizen engagement
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Cpu className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Organizations</h3>
              <p className="text-muted-foreground">
                Union votes, club elections, and nonprofit governance
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={fadeIn}
          className="my-24 bg-primary/5 rounded-2xl p-12"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">Our Values</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Security First</h3>
                    <p className="text-muted-foreground">
                      We build our systems with security as the foundation, not an afterthought.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Accessibility</h3>
                    <p className="text-muted-foreground">
                      Making voting accessible to everyone, regardless of technical ability or location.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Excellence</h3>
                    <p className="text-muted-foreground">
                      Striving for the highest quality in everything we create and deliver.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="/values.jpg" 
                alt="Our Values" 
                className="rounded-xl shadow-lg object-cover h-[400px] w-full"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80';
                }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">Join Our Journey</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            We're always looking for passionate individuals to join our team and help us 
            create the future of secure, transparent and accessible voting.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="electra-button-primary">
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/careers">View Careers</Link>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default About;
