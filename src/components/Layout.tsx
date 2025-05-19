import React, { useState, useEffect, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Loader2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
        <div className="glass-card p-8 text-center max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">
            We're sorry, but there was an error loading this page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-all"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
    <div className="bg-background/80 p-6 rounded-xl shadow-lg flex items-center gap-3">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <span className="font-medium">Loading...</span>
    </div>
  </div>
);

const Layout: React.FC<LayoutProps> = ({ children, showFooter = true }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Initial content loading
  useEffect(() => {
    const loadTimer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(loadTimer);
  }, []);

  // Handle route changes
  useEffect(() => {
    if (location !== displayLocation) {
      setIsLoading(true);
      setIsTransitioning(true);
      setTransitionStage('page-transition-exit');
      
      // Short timeout to ensure exit animation starts
      const exitStartTimeout = setTimeout(() => {
        setTransitionStage('page-transition-exit-active');
      }, 10);
      
      // After exit animation completes
      const exitCompleteTimeout = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('page-transition-enter');
        
        // Short timeout to ensure enter animation starts
        const enterStartTimeout = setTimeout(() => {
          setTransitionStage('page-transition-enter-active');
          
          // After enter animation completes
          const enterCompleteTimeout = setTimeout(() => {
            setIsTransitioning(false);
            setIsLoading(false);
          }, 300);
          
          return () => clearTimeout(enterCompleteTimeout);
        }, 10);
        
        return () => clearTimeout(enterStartTimeout);
      }, 300);
      
      return () => {
        clearTimeout(exitStartTimeout);
        clearTimeout(exitCompleteTimeout);
      };
    }
  }, [location, displayLocation]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-subtle dark:bg-gradient-dark transition-colors duration-500">
      <div className="fixed inset-0 bg-gradient-subtle dark:bg-gradient-dark -z-10 transition-colors duration-500"></div>
      <Navbar />
      <main className="flex-1 px-4 py-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full transition-all duration-300">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <div className={`relative z-10 ${transitionStage}`}>
              {isLoading ? (
                <div className="min-h-[300px] flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
                </div>
              ) : (
                <div className="transition-opacity duration-300 opacity-100">
                  {children}
                </div>
              )}
            </div>
          </Suspense>
        </ErrorBoundary>
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
