import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Shield, Award, BarChart3, ChevronRight, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Index: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <motion.section 
        className="py-16 md:py-24"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <motion.div 
              className="space-y-2"
              variants={fadeIn}
            >
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-heading bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Modern Voting Made Simple
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-300 md:text-xl">
                Secure, transparent, and accessible elections for organizations of all sizes.
              </p>
            </motion.div>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 w-full justify-center"
              variants={fadeIn}
            >
              <Link to="/register">
                <Button className="glass-button px-8 py-6 text-lg hover:scale-105 transition-transform">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" className="px-8 py-6 text-lg hover:scale-105 transition-transform">
                  View Demo
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features */}
<motion.section 
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7, ease: "easeOut" }}
  viewport={{ once: true, amount: 0.3 }}
  className="py-16 bg-gray-50 dark:bg-gray-900/50 rounded-3xl"
>
  <div className="container px-4 md:px-6">
    <motion.div 
      className="flex flex-col items-center space-y-4 text-center mb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-heading">
        Powerful Features
      </h2>
      <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-300">
        Everything you need to run successful elections, from start to finish.
      </p>
    </motion.div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Feature 1 */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.1, rotate: 2 }}
        className="glass-panel p-6 hover:scale-105 transition-all duration-300"
      >
        <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">Secure Voting</h3>
        <p className="text-gray-600 dark:text-gray-300">
          End-to-end encryption and blockchain technology ensure the integrity of every vote.
        </p>
      </motion.div>

      {/* Feature 2 */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        whileHover={{ scale: 1.1, rotate: 2 }}
        className="glass-panel p-6 hover:scale-105 transition-all duration-300"
      >
        <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
          <Award className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">Customizable Elections</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Configure elections with different voting methods, eligibility rules, and more.
        </p>
      </motion.div>

      {/* Feature 3 */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        whileHover={{ scale: 1.1, rotate: 2 }}
        className="glass-panel p-6 hover:scale-105 transition-all duration-300"
      >
        <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
          <BarChart3 className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">Real-time Results</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Watch results update live with beautiful charts and detailed analytics.
        </p>
      </motion.div>
    </div>
  </div>
</motion.section>

      {/* How It Works */}
      <motion.section 
        className="py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="container px-4 md:px-6">
          <motion.div 
            className="flex flex-col items-center space-y-4 text-center mb-12"
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-heading">
              How It Works
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-300">
              Setting up and running elections has never been easier.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <motion.div 
              variants={fadeIn}
              className="flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 animate-pulse-soft">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Create</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Set up your election with custom questions, options, and settings.
              </p>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div 
              variants={fadeIn}
              className="flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 animate-pulse-soft">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Invite</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Invite voters via email or generate secure single-use voting links.
              </p>
            </motion.div>
            
            {/* Step 3 */}
            <motion.div 
              variants={fadeIn}
              className="flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 animate-pulse-soft">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Analyze</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get real-time results and insightful analytics when voting ends.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials/Social Proof */}
      <motion.section 
  className="py-16 bg-[#FFFFFF4D] dark:bg-gray-900/50 rounded-2xl"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  variants={staggerContainer}
>
        <div className="container px-4 md:px-6">
          <motion.div 
            className="flex flex-col items-center space-y-4 text-center mb-12"
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-heading">
              Trusted By
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-300">
              Organizations of all sizes rely on Electra for their voting needs.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            <motion.div 
              className="h-12 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity hover:scale-110"
              variants={fadeIn}
              whileHover={{ scale: 1.1 }}
            >
              <span className="text-xl font-bold text-gray-500 dark:text-gray-400">University</span>
            </motion.div>
            <motion.div 
              className="h-12 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity hover:scale-110"
              variants={fadeIn}
              whileHover={{ scale: 1.1 }}
            >
              <span className="text-xl font-bold text-gray-500 dark:text-gray-400">Corporation</span>
            </motion.div>
            <motion.div 
              className="h-12 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity hover:scale-110"
              variants={fadeIn}
              whileHover={{ scale: 1.1 }}
            >
              <span className="text-xl font-bold text-gray-500 dark:text-gray-400">Association</span>
            </motion.div>
            <motion.div 
              className="h-12 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity hover:scale-110"
              variants={fadeIn}
              whileHover={{ scale: 1.1 }}
            >
              <span className="text-xl font-bold text-gray-500 dark:text-gray-400">Government</span>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section 
        className="py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
      >
        <div className="container px-4 md:px-6">
          <motion.div 
            className="glass-panel p-8 md:p-12 hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold mb-4 font-heading">Ready to get started?</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-md">
                  Join thousands of organizations using Electra for their voting needs.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button className="glass-button px-8 py-6 text-lg min-w-[180px] hover:scale-105 transition-transform">
                    Sign Up Free
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="px-8 py-6 text-lg min-w-[180px] hover:scale-105 transition-transform">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </Layout>
  );
};

export default Index;
