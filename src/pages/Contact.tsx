import React from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Send, 
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

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

const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle form submission to your backend
    toast.success('Your message has been sent successfully!');
  };

  return (
    <Layout>
      <motion.div 
        className="max-w-6xl mx-auto py-12"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div variants={fadeIn} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-heading">
            Get in Touch
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about Electra or need help with your voting system? Our team is here to help.
            Fill out the form below or contact us directly using the information provided.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div variants={fadeIn} className="md:col-span-2">
            <Card className="glass-card">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input 
                        id="name" 
                        placeholder="John Doe" 
                        className="glass-input"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john@example.com" 
                        className="glass-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      placeholder="How can we help you?" 
                      className="glass-input"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Write your message here..." 
                      className="glass-input min-h-[150px]"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="consent" 
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                      required
                    />
                    <Label htmlFor="consent" className="text-sm">
                      I agree to the processing of my personal data in accordance with the <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                    </Label>
                  </div>

                  <Button type="submit" className="electra-button-primary w-full">
                    <Send className="mr-2 h-4 w-4" /> Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn} className="space-y-6">
            <Card className="glass-card">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-xl font-bold">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <a 
                        href="mailto:info@electra-vote.com" 
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        info@electra-vote.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Phone</h4>
                      <a 
                        href="tel:+917508486221" 
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                       +917508486221
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Office</h4>
                      <address className="text-muted-foreground not-italic">
                        1234 Sector-17 <br />
                        Chandigarh, 134113<br />
                        India
                      </address>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Support Hours</h4>
                      <p className="text-muted-foreground">
                        Monday - Friday<br />
                        9:00 AM - 6:00 PM IST
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/30">
                  <h4 className="font-medium mb-3">Connect With Us</h4>
                  <div className="flex space-x-3">
                    <a 
                      href="https://twitter.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Twitter size={18} />
                    </a>
                    <a 
                      href="https://facebook.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Facebook size={18} />
                    </a>
                    <a 
                      href="https://instagram.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Instagram size={18} />
                    </a>
                    <a 
                      href="https://linkedin.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Linkedin size={18} />
                    </a>
                    <a 
                      href="https://github.com" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Github size={18} />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Request a Demo</h3>
                <p className="text-muted-foreground mb-4">
                  Want to see Electra in action? Schedule a personalized demo with our team.
                </p>
                <Button className="w-full electra-button-secondary">
                  Book a Demo
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={fadeIn} className="mt-16">
          <div className="relative h-[400px] rounded-xl overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13716.88954646666!2d76.7723478017224!3d30.740254193286255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fed0afe5003d3%3A0x8f47abe9f2044934!2sSector%2017%2C%20Chandigarh!5e0!3m2!1sen!2sin!4v1747389971974!5m2!1sen!2sin"
              width="100%" 
              height="100%" 
              style={{ border: 0 }}
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Electra Office Location"
              className="absolute inset-0"
            ></iframe>
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent pointer-events-none"></div>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Contact;