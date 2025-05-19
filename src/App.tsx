import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ElectionDetails from "./pages/ElectionDetails";
import Vote from "./pages/Vote";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";
import AdminPanel from "./pages/AdminPanel";
import Elections from "./pages/Elections";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Security from "./pages/Security";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from './pages/Terms';

import Demo from "./pages/Demo";
import Candidates from './pages/Candidates';
import Voters from './pages/Voters';
import AllResults from './pages/AllResults';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Help from './pages/Help';
import CreateElection from './pages/CreateElection';
import EditElection from './pages/EditElection';
import AddCandidate from './pages/AddCandidate';
import ManageVoters from './pages/ManageVoters';
import EditCandidate from './pages/EditCandidate';

// Contexts
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ElectionProvider } from "@/contexts/ElectionContext";

// Auth protection wrapper
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";
import VoterSync from './components/VoterSync';

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/elections" element={<Elections />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/security" element={<Security />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/candidates" element={<Candidates />} />
      <Route path="/voters" element={<Voters />} />
      <Route path="/results" element={<AllResults />} />
      <Route path="/results/:id" element={
        <ProtectedRoute>
          <Results />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/help" element={<Help />} />
      <Route path="/elections/create" element={
        <ProtectedRoute>
          <CreateElection />
        </ProtectedRoute>
      } />
      <Route path="/elections/:id/edit" element={
        <AdminRoute>
          <EditElection />
        </AdminRoute>
      } />
      <Route path="/elections/:id/candidates/add" element={
        <AdminRoute>
          <AddCandidate />
        </AdminRoute>
      } />
      <Route path="/elections/:electionId/candidates/:candidateId/edit" element={
        <AdminRoute>
          <EditCandidate />
        </AdminRoute>
      } />
      <Route path="/elections/:id/voters" element={
        <AdminRoute>
          <ManageVoters />
        </AdminRoute>
      } />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/elections/:id" element={
        <ProtectedRoute>
          <ElectionDetails />
        </ProtectedRoute>
      } />
      <Route path="/vote" element={<Vote />} />
      <Route path="/vote/:id" element={
        <ProtectedRoute>
          <Vote />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/*" element={
        <AdminRoute>
          <AdminPanel />
        </AdminRoute>
      } />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <ElectionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <VoterSync />
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </ElectionProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
