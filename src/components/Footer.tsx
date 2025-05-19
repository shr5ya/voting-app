import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin, Facebook, Instagram, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const FooterLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link 
    to={to} 
    className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300"
  >
    {children}
  </Link>
);

const SocialIcon: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <motion.a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center justify-center h-8 w-8 rounded-full hover:bg-white/20 dark:hover:bg-white/10"
    whileHover={{ scale: 1.2 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    {children}
  </motion.a>
);

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    toast.success('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <footer className="py-8 bg-secondary/80 dark:bg-electra-navy/95 backdrop-blur-xl border-t border-muted/30 dark:border-white/5 transition-all duration-300 glass-panel">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div>
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mr-2 shadow-lg shadow-primary/20 dark:shadow-primary/30 transition-all duration-300 group-hover:scale-110">
                <span className="text-white font-bold">E</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-600 group-hover:to-primary">Electra</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              A modern, secure, and accessible voting platform designed for organizations of all sizes.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            {/* Product links */}
            <div>
              <h3 className="text-sm font-semibold uppercase text-primary mb-3">
                PRODUCT
              </h3>
              <ul className="space-y-2">
                <li><FooterLink to="/features">Features</FooterLink></li>
                <li><FooterLink to="/pricing">Pricing</FooterLink></li>
                <li><FooterLink to="/security">Security</FooterLink></li>
                <li><FooterLink to="/faq">FAQ</FooterLink></li>
              </ul>
            </div>
            
            {/* Company links */}
            <div>
              <h3 className="text-sm font-semibold uppercase text-primary mb-3">
                COMPANY
              </h3>
              <ul className="space-y-2">
                <li><FooterLink to="/about">About</FooterLink></li>
                <li><FooterLink to="/contact">Contact</FooterLink></li>
                <li><FooterLink to="/privacy">Privacy</FooterLink></li>
                <li><FooterLink to="/terms">Terms</FooterLink></li>
              </ul>
            </div>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-primary mb-3">
              STAY UPDATED
            </h3>
            <form onSubmit={handleSubscribe} className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-10 px-3 text-sm bg-background/40 dark:bg-electra-navy/50 backdrop-blur-sm border border-white/30 dark:border-white/10 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button type="submit" size="sm" className="rounded-l-none h-10 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
        
        <hr className="my-6 border-white/10 dark:border-white/5" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground">
          <div className="flex gap-4 mb-4 sm:mb-0">
            <SocialIcon href="https://twitter.com/electravote">
              <Twitter className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="https://github.com/shr5ya">
              <Github className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="https://linkedin.com/company/electravote">
              <Linkedin className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="https://facebook.com/electravote">
              <Facebook className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href="https://instagram.com/electravote">
              <Instagram className="h-4 w-4" />
            </SocialIcon>
          </div>

          <div>
            &copy; {new Date().getFullYear()} Electra. All rights reserved.
          </div>
          
          <div className="flex gap-4 mt-4 sm:mt-0">
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
            <FooterLink to="/terms">Terms of Service</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;