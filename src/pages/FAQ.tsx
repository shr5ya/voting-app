import React from 'react';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BadgeCheck, HelpCircle, MessageSquare } from 'lucide-react';
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

const FAQ: React.FC = () => {
  return (
    <Layout>
      <motion.div
        className="max-w-4xl mx-auto py-12"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div variants={fadeIn} className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tighter md:text-5xl mb-4 font-heading">
            Frequently asked questions
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            These are the most commonly asked questions about Electra voting platform.
            Can't find what you're looking for? <Link to="/contact" className="text-primary hover:underline">Chat to our friendly team!</Link>
          </p>
        </motion.div>

        <motion.div variants={fadeIn} className="mb-8">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button variant="outline" className="rounded-full bg-background/80 backdrop-blur-sm">
              General
            </Button>
            <Button variant="outline" className="rounded-full bg-primary text-primary-foreground">
              Pricing
            </Button>
            <Button variant="outline" className="rounded-full bg-background/80 backdrop-blur-sm">
              Dashboard
            </Button>
            <Button variant="outline" className="rounded-full bg-background/80 backdrop-blur-sm">
              API
            </Button>
          </div>
        </motion.div>

        <motion.div variants={fadeIn} className="glass-card">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b border-border/30">
              <AccordionTrigger className="hover:no-underline px-4 py-4 text-lg font-medium">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Is there a free trial available?
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 text-muted-foreground">
                Yes, you can try us for free for 30 days. If you want, we'll provide you with a free, 
                30-minute onboarding call to get you up and running. <a href="#" className="text-primary hover:underline">Book a call here</a>.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b border-border/30">
              <AccordionTrigger className="hover:no-underline px-4 py-4 text-lg font-medium">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Can I change my plan later?
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. If you upgrade, you'll be 
                prorated for the remainder of the billing period. If you downgrade, your new rate will 
                take effect at the next billing cycle.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b border-border/30">
              <AccordionTrigger className="hover:no-underline px-4 py-4 text-lg font-medium">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  What is your cancellation policy?
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 text-muted-foreground">
                You can cancel your subscription at any time, and you won't be charged for the next billing 
                period. We don't offer refunds for partial months, but your service will continue until the 
                end of the current billing period.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-b border-border/30">
              <AccordionTrigger className="hover:no-underline px-4 py-4 text-lg font-medium">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Can other info be added to an invoice?
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 text-muted-foreground">
                Yes, you can add additional information like your company name, address, VAT number, or any 
                special notes to your invoices. You can set this up in your account settings under Billing.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-b border-border/30">
              <AccordionTrigger className="hover:no-underline px-4 py-4 text-lg font-medium">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  How does billing work?
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 text-muted-foreground">
                We offer both monthly and annual billing options. For monthly plans, you'll be charged on 
                the same date each month. For annual plans, you'll be charged once a year on the anniversary 
                of your signup date. We accept all major credit cards and PayPal.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border-b border-border/30">
              <AccordionTrigger className="hover:no-underline px-4 py-4 text-lg font-medium">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  How do I change my account email?
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 text-muted-foreground">
                You can change your account email from your profile settings. After you change your email, 
                we'll send a verification link to your new email address to confirm the change.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border-b border-border/30">
              <AccordionTrigger className="hover:no-underline px-4 py-4 text-lg font-medium">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  How does support work?
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 text-muted-foreground">
                Our support team is available 24/7 via email and chat. Enterprise customers also receive 
                phone support and a dedicated account manager. Our average response time is under 2 hours.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border-b-0">
              <AccordionTrigger className="hover:no-underline px-4 py-4 text-lg font-medium">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Do you provide tutorials?
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 text-muted-foreground">
                Yes! We have a comprehensive knowledge base with tutorials, guides, and documentation to 
                help you get the most out of Electra. We also offer webinars and personalized training 
                sessions for Enterprise customers.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>

        <motion.div variants={fadeIn} className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Can't find the answer you're looking for? Please chat to our friendly team.
          </p>
          <Button asChild className="electra-button-primary">
            <Link to="/contact" className="inline-flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Contact us
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default FAQ;
