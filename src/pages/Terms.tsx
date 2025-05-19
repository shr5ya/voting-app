import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, useInView, useAnimation } from 'framer-motion';

const TermsOfService: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const headingRef = useRef(null);
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  
  const headingInView = useInView(headingRef, { once: true, amount: 0.3 });
  const section1InView = useInView(section1Ref, { once: true, amount: 0.3 });
  const section2InView = useInView(section2Ref, { once: true, amount: 0.3 });
  const section3InView = useInView(section3Ref, { once: true, amount: 0.3 });
  
  const headingControls = useAnimation();
  const section1Controls = useAnimation();
  const section2Controls = useAnimation();
  const section3Controls = useAnimation();
  
  useEffect(() => {
    if (headingInView) headingControls.start('visible');
    if (section1InView) section1Controls.start('visible');
    if (section2InView) section2Controls.start('visible');
    if (section3InView) section3Controls.start('visible');
  }, [headingInView, section1InView, section2InView, section3InView]);
  
  return (
    <div className="min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-3xl mx-auto">
        {/* Animated heading */}
        <motion.div
          ref={headingRef}
          animate={headingControls}
          initial="hidden"
          variants={fadeInUpVariants}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent pb-2">
            Terms of Service
          </h1>
          <div className="inline-flex items-center mt-2">
            <div className="h-1 w-12 bg-gradient-to-r from-primary to-blue-600 rounded-full"></div>
            <p className="mx-3 text-sm text-gray-500 dark:text-gray-400">Last updated: May 16, 2025</p>
            <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-primary rounded-full"></div>
          </div>
        </motion.div>
        
        {/* Section 1: Introduction */}
        <motion.section
          ref={section1Ref}
          animate={section1Controls}
          initial="hidden"
          variants={fadeInUpVariants}
          className="mb-10 p-6 rounded-xl bg-white/70 dark:bg-gray-800/40 backdrop-blur-sm shadow-lg border border-gray-200/50 dark:border-gray-700/30 hover:shadow-xl transition-all duration-300 hover:bg-white/90 dark:hover:bg-gray-800/60"
        >
          <div className="flex items-center mb-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center mr-2">
              <span className="text-primary dark:text-primary-foreground text-lg font-bold">1</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Introduction</h2>
          </div>
          
          <div className="pl-10 pr-2 mt-2 text-gray-700 dark:text-gray-300 space-y-3">
            <p className="leading-relaxed">
              Welcome to Electra ("we," "our," or "us"). By accessing or using the Electra platform, website, and services 
              (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these 
              Terms, please do not use our Services.
            </p>
          </div>
        </motion.section>
        
        {/* Section 2: Use of Services */}
        <motion.section
          ref={section2Ref}
          animate={section2Controls}
          initial="hidden"
          variants={fadeInUpVariants}
          className="mb-10 p-6 rounded-xl bg-white/70 dark:bg-gray-800/40 backdrop-blur-sm shadow-lg border border-gray-200/50 dark:border-gray-700/30 hover:shadow-xl transition-all duration-300 hover:bg-white/90 dark:hover:bg-gray-800/60"
        >
          <div className="flex items-center mb-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center mr-2">
              <span className="text-primary dark:text-primary-foreground text-lg font-bold">2</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Use of Services</h2>
          </div>
          
          <div className="pl-10 pr-2 mt-2 text-gray-700 dark:text-gray-300">
            <p className="mb-3 leading-relaxed">
              You may use our Services only as permitted by these Terms and any applicable laws. You may not:
            </p>
            <ul className="space-y-2 list-inside ml-2">
              <motion.li 
                className="flex items-start"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="min-w-4 h-4 mt-1 mr-2 rounded-full bg-primary/30 dark:bg-primary/40"></div>
                <span>Use our Services in any way that violates any applicable law or regulation.</span>
              </motion.li>
              <motion.li 
                className="flex items-start"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="min-w-4 h-4 mt-1 mr-2 rounded-full bg-primary/30 dark:bg-primary/40"></div>
                <span>Attempt to interfere with the proper functioning of our Services.</span>
              </motion.li>
              <motion.li 
                className="flex items-start"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="min-w-4 h-4 mt-1 mr-2 rounded-full bg-primary/30 dark:bg-primary/40"></div>
                <span>Bypass or attempt to bypass any measures we use to restrict access to the Services.</span>
              </motion.li>
              <motion.li 
                className="flex items-start"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="min-w-4 h-4 mt-1 mr-2 rounded-full bg-primary/30 dark:bg-primary/40"></div>
                <span>Collect or harvest any information from our Services without our permission.</span>
              </motion.li>
              <motion.li 
                className="flex items-start"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="min-w-4 h-4 mt-1 mr-2 rounded-full bg-primary/30 dark:bg-primary/40"></div>
                <span>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity.</span>
              </motion.li>
            </ul>
          </div>
        </motion.section>
        
        {/* Section 3: User Accounts */}
        <motion.section
          ref={section3Ref}
          animate={section3Controls}
          initial="hidden"
          variants={fadeInUpVariants}
          className="mb-10 p-6 rounded-xl bg-white/70 dark:bg-gray-800/40 backdrop-blur-sm shadow-lg border border-gray-200/50 dark:border-gray-700/30 hover:shadow-xl transition-all duration-300 hover:bg-white/90 dark:hover:bg-gray-800/60"
        >
          <div className="flex items-center mb-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center mr-2">
              <span className="text-primary dark:text-primary-foreground text-lg font-bold">3</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">User Accounts</h2>
          </div>
          
          <div className="pl-10 pr-2 mt-2 text-gray-700 dark:text-gray-300">
            <p className="mb-3 leading-relaxed">
              To use certain features of our Services, you may need to create an account. You are responsible for maintaining the 
              confidentiality of your account credentials and for all activities that occur under your account. You agree to:
            </p>
            <ul className="space-y-2 list-inside ml-2">
              <motion.li 
                className="flex items-start"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="min-w-4 h-4 mt-1 mr-2 rounded-full bg-primary/30 dark:bg-primary/40"></div>
                <span>Provide accurate and complete information when creating an account.</span>
              </motion.li>
            </ul>
          </div>
        </motion.section>
        
        {/* Table of Contents - Floating */}
        <div className="fixed top-32 right-4 lg:right-8 hidden lg:block">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="p-4 rounded-xl bg-white/70 dark:bg-gray-800/40 backdrop-blur-sm shadow-lg border border-gray-200/50 dark:border-gray-700/30"
          >
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3">On This Page</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#introduction" className="text-primary hover:text-primary/80 transition-colors duration-200 flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/80 mr-2"></div>
                  Introduction
                </a>
              </li>
              <li>
                <a href="#use-of-services" className="text-primary hover:text-primary/80 transition-colors duration-200 flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/80 mr-2"></div>
                  Use of Services
                </a>
              </li>
              <li>
                <a href="#user-accounts" className="text-primary hover:text-primary/80 transition-colors duration-200 flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/80 mr-2"></div>
                  User Accounts
                </a>
              </li>
            </ul>
          </motion.div>
        </div>
        
        {/* Back to Top Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="fixed bottom-8 right-8"
        >
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-3 rounded-full bg-primary/90 hover:bg-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-5 w-5 group-hover:scale-110 transition-transform duration-300"
            >
              <path d="m18 15-6-6-6 6"/>
            </svg>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;