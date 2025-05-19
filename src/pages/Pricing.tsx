import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Check, CreditCard, Shield, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Initialize Stripe (would use actual publishable key in production)
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

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

const featureItem = {
  included: [
    'Up to 1 election',
    'Up to 100 voters',
    'Email support',
    'Basic analytics',
    'Standard templates'
  ],
  pro: [
    'Unlimited elections',
    'Up to 5,000 voters',
    'Priority email support',
    'Custom branding',
    'Advanced analytics',
    'Custom templates',
    'API access',
    'Data export'
  ],
  enterprise: [
    'Unlimited everything',
    'Dedicated support',
    'Custom integrations',
    'On-premise options',
    'SLA guarantees',
    'Compliance reporting',
    'SSO integration',
    'Custom development',
    'Account manager'
  ]
};

// Checkout form component
const CheckoutForm = ({ plan, amount, onCancel, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState('');
  const [cardComplete, setCardComplete] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });

  // Reset the card error when the dialog is opened
  useEffect(() => {
    setCardError('');
    setCardComplete(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    // Check if card details are complete
    if (!cardComplete) {
      setCardError('Please enter valid card details');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Get the card element
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }
      
      // In a real implementation, you would make an API call to your server
      // to create a payment intent, and then confirm the payment
      
      // Simulate creating a payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: formData.name,
          email: formData.email,
          address: {
            line1: formData.address,
            city: formData.city,
            postal_code: formData.zip
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Simulate a successful payment after creation
      toast.success(`Successfully subscribed to ${plan} plan!`);
      onSuccess();
    } catch (error) {
      setCardError(error.message || 'An error occurred with the payment');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCardChange = (event) => {
    setCardError(event.error ? event.error.message : '');
    setCardComplete(event.complete);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Test mode notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
        <p className="text-amber-800 text-sm flex items-center">
          <Info className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>
            <strong>Test Mode:</strong> This is a test payment form. You can use the test card number 
            <span className="font-mono mx-1">4242 4242 4242 4242</span> with any future expiration date and CVC.
          </span>
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleInputChange} 
          required 
          className="glass-input"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          value={formData.email} 
          onChange={handleInputChange} 
          required 
          className="glass-input"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="card">Card Details</Label>
        <div className="border rounded-md p-3 bg-background/80 backdrop-blur-sm">
          <CardElement 
            id="card-element"
            onChange={handleCardChange}
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  fontFamily: 'Arial, sans-serif',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
              hidePostalCode: true,
            }}
          />
        </div>
        {cardError && <p className="text-red-500 text-sm mt-1">{cardError}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Billing Address</Label>
        <Input 
          id="address" 
          name="address" 
          value={formData.address} 
          onChange={handleInputChange} 
          required 
          className="glass-input"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input 
            id="city" 
            name="city" 
            value={formData.city} 
            onChange={handleInputChange} 
            required 
            className="glass-input"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zip">Zip/Postal Code</Label>
          <Input 
            id="zip" 
            name="zip" 
            value={formData.zip} 
            onChange={handleInputChange} 
            required 
            className="glass-input"
          />
        </div>
      </div>
      
      <DialogFooter className="pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isProcessing}
          className="glass-card-flat"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing || !cardComplete}
          className="glass-button"
        >
          {isProcessing ? 'Processing...' : `Pay $${amount}`}
        </Button>
      </DialogFooter>
    </form>
  );
};

const Pricing: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({ name: '', amount: 0 });
  const [paymentComplete, setPaymentComplete] = useState(false);
  
  const handlePlanSelect = (plan, amount) => {
    setSelectedPlan({ name: plan, amount });
    setCheckoutOpen(true);
    setPaymentComplete(false);
  };
  
  const handleSuccess = () => {
    setPaymentComplete(true);
    // Close dialog after showing success for a moment
    setTimeout(() => {
      setCheckoutOpen(false);
    }, 2000);
  };

  return (
    <Layout>
      <motion.div 
        className="max-w-6xl mx-auto py-16 px-4"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div variants={fadeIn} className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Flexible Pricing for Every Organization</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan that fits your needs. All plans include our core features with different limits.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={staggerContainer}
        >
          {/* Starter Plan */}
          <motion.div variants={fadeIn} whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
            <Card className="border h-full flex flex-col overflow-hidden glass-card">
              <CardHeader className="bg-muted/50 pb-8">
                <div>
                  <Badge className="mb-2">Free</Badge>
                  <CardTitle className="text-2xl font-bold">Starter</CardTitle>
                  <CardDescription>Perfect for small teams and events</CardDescription>
                </div>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow pt-6">
                <ul className="space-y-2">
                  {featureItem.included.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full glass-button" 
                  onClick={() => handlePlanSelect('Starter', 0)}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          
          {/* Pro Plan */}
          <motion.div 
            variants={fadeIn} 
            whileHover={{ scale: 1.05 }} 
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            className="relative"
          >
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
              <Badge className="bg-primary text-primary-foreground px-6 py-1">Most Popular</Badge>
            </div>
            <Card className="border-2 border-primary h-full flex flex-col shadow-lg glass-card">
              <CardHeader className="bg-primary/10 pb-8">
                <div>
                  <Badge className="mb-2 bg-primary text-primary-foreground">Professional</Badge>
                  <CardTitle className="text-2xl font-bold">Pro</CardTitle>
                  <CardDescription>Ideal for growing organizations</CardDescription>
                </div>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="pt-6 flex-grow">
                <ul className="space-y-2">
                  {featureItem.pro.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90" 
                  onClick={() => handlePlanSelect('Pro', 49)}
                >
                  Start Pro
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          
          {/* Enterprise Plan */}
          <motion.div variants={fadeIn} whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
            <Card className="border h-full flex flex-col glass-card">
              <CardHeader className="bg-muted/50 pb-8">
                <div>
                  <Badge className="mb-2">Enterprise</Badge>
                  <CardTitle className="text-2xl font-bold">Enterprise</CardTitle>
                  <CardDescription>For large-scale organizations</CardDescription>
                </div>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Custom</span>
                  <span className="text-muted-foreground">/pricing</span>
                </div>
              </CardHeader>
              <CardContent className="pt-6 flex-grow">
                <ul className="space-y-2">
                  {featureItem.enterprise.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handlePlanSelect('Enterprise', 0)}
                >
                  Contact Sales
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
        
        {/* FAQs */}
        <motion.div variants={fadeIn} className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Info className="h-5 w-5 mr-2 text-primary" />
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-muted-foreground">Yes, you can cancel your subscription at any time. If you cancel, you'll still have access to your plan until the end of your billing period.</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Info className="h-5 w-5 mr-2 text-primary" />
                Do you offer discounts for educational institutions?
              </h3>
              <p className="text-muted-foreground">Yes, we offer special discounts for educational institutions. Please contact our sales team for more information.</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Info className="h-5 w-5 mr-2 text-primary" />
                What payment methods do you accept?
              </h3>
              <p className="text-muted-foreground">We accept all major credit cards, including Visa, Mastercard, and American Express. We also support payment via invoicing for Enterprise plans.</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Info className="h-5 w-5 mr-2 text-primary" />
                Can I upgrade or downgrade my plan later?
              </h3>
              <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. When you upgrade, the new price will be prorated for the remainder of your billing cycle.</p>
            </div>
          </div>
        </motion.div>
        
        {/* CTA */}
        <motion.div 
          variants={fadeIn}
          className="mt-20 text-center"
        >
          <div className="bg-primary/10 rounded-xl p-10 border border-primary/20 glass-panel">
            <h2 className="text-2xl font-bold mb-4">Ready to transform your voting experience?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">Join thousands of organizations that trust Electra for secure, efficient, and transparent voting.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="glass-button" onClick={() => handlePlanSelect('Pro', 49)}>
                Get Started with Pro
              </Button>
              <Button size="lg" variant="outline" className="glass-card-flat">
                Schedule Demo
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={(open) => {
        // Only allow closing if not in the middle of processing
        if (!open && !paymentComplete) {
          setCheckoutOpen(false);
        }
      }}>
        <DialogContent className="sm:max-w-[500px] glass-card">
          <DialogHeader>
            <DialogTitle>{paymentComplete ? 'Payment Successful!' : `Subscribe to ${selectedPlan.name} Plan`}</DialogTitle>
            <DialogDescription>
              {paymentComplete 
                ? 'Thank you for your subscription. You now have access to all features.' 
                : selectedPlan.name === 'Enterprise' 
                  ? 'Enter your details and our sales team will contact you shortly.' 
                  : 'Complete your payment details below to subscribe.'}
            </DialogDescription>
          </DialogHeader>
          
          {paymentComplete ? (
            <div className="flex flex-col items-center py-4">
              <div className="bg-green-100 text-green-700 p-3 rounded-full mb-4">
                <Check className="h-8 w-8" />
              </div>
              <p className="text-center mb-6">Your payment was successful. Your account has been upgraded to {selectedPlan.name}.</p>
              <Button 
                onClick={() => setCheckoutOpen(false)}
                className="glass-button"
              >
                Continue
              </Button>
            </div>
          ) : (
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                plan={selectedPlan.name} 
                amount={selectedPlan.amount} 
                onCancel={() => setCheckoutOpen(false)}
                onSuccess={handleSuccess}
              />
            </Elements>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Pricing;