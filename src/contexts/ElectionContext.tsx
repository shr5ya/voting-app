import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

// Setup axios instance
const api = axios.create({
  baseURL: 'http://localhost:5002/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token in headers
api.interceptors.request.use(
  (config) => {
    const userJson = localStorage.getItem('electra-user');
    if (userJson) {
      const user = JSON.parse(userJson);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interfaces
export interface Candidate {
  id: string;
  name: string;
  position: string;
  bio: string;
  imageUrl: string;
  votes: number;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed';
  candidates: Candidate[];
  totalVotes: number;
  voterCount: number;
}

export interface Voter {
  id: string;
  name: string;
  email: string;
  hasVoted: boolean;
  electionId?: string;
}

interface ElectionContextType {
  elections: Election[];
  voters: Voter[];
  createElection: (election: Omit<Election, 'id' | 'totalVotes' | 'status'>) => Promise<void>;
  addCandidate: (electionId: string, candidate: Omit<Candidate, 'id' | 'votes'>) => void;
  addVoter: (electionId: string, voter: Omit<Voter, 'id' | 'hasVoted'>) => Promise<void>;
  castVote: (electionId: string, candidateId: string, voterId: string) => Promise<boolean>;
  getElection: (id: string) => Election | undefined;
  deleteElection: (id: string) => void;
  stopPolling: (id: string) => Promise<void>;
  removeVoter: (id: string) => void;
  removeCandidate: (id: string) => void;
  activeElections: Election[];
  completedElections: Election[];
  upcomingElections: Election[];
  addVoterIfNotExists: (user: { name: string; email: string }) => void;
  updateCandidate: (electionId: string, candidateId: string, updated: Partial<Omit<Candidate, 'id' | 'votes'>>) => void;
  isLoading: boolean;
  error: string | null;
  refreshElections: () => Promise<void>;
  clearAllData: () => Promise<void>;
  updateElectionStatuses: () => void;
  getVotersForElection: (electionId: string) => Voter[];
  refreshVotersList: () => Promise<void>;
  updateElection: (id: string, updates: { title?: string; description?: string; startDate?: Date; endDate?: Date }) => Promise<void>;
}

// Create the context
const ElectionContext = createContext<ElectionContextType | undefined>(undefined);

export const useElection = () => {
  const context = useContext(ElectionContext);
  if (!context) {
    throw new Error('useElection must be used within an ElectionProvider');
  }
  return context;
};

export const ElectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elections, setElections] = useState<Election[]>([]);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dataInitialized, setDataInitialized] = useState<boolean>(false);

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Load elections from API
        const electionsResponse = await api.get('/voter/elections');
        
        // Format dates from API response and pre-process status
        const formattedElections = electionsResponse.data.map((election: any) => {
          const startDate = new Date(election.startDate);
          const endDate = new Date(election.endDate);
          
          return {
            ...election,
            startDate,
            endDate,
            // Determine status immediately based on current date
            status: determineStatus(startDate, endDate)
          };
        });
        
        setElections(formattedElections);
        
        // Load voters - this might need to be adjusted based on your API structure
        try {
          const votersResponse = await api.get('/admin/voters');
          setVoters(votersResponse.data);
        } catch (voterErr) {
          console.warn('Could not load voters data. This might be expected for non-admin users.');
          // Non-critical error, don't set the main error state
        }
        
        setDataInitialized(true);
      } catch (err) {
        setError('Failed to load election data');
        console.error('Error loading data:', err);
        toast.error('Failed to load election data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Periodically update election status based on current date
  useEffect(() => {
    if (!elections.length) return;
    
    // Don't update immediately, only set up interval
    // This prevents unnecessary updates when data is already fresh
    
    // Set up interval to update every 5 minutes
    const intervalId = setInterval(() => {
      const now = new Date();
      let needsUpdate = false;
      
      // Only update if at least one election might need status change
      for (const election of elections) {
        const currentStatus = election.status;
        const newStatus = determineStatus(election.startDate, election.endDate);
        
        if (currentStatus !== newStatus) {
          needsUpdate = true;
          break;
        }
      }
      
      if (needsUpdate) {
        updateElectionStatuses();
      }
    }, 300000); // 5 minutes (previously 60000 - 1 minute)
    
    return () => {
      clearInterval(intervalId);
    };
  }, [elections]);

  // Refresh elections data
  const refreshElections = async () => {
    if (!dataInitialized) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch updated elections from API
      const response = await api.get('/voter/elections');
      
      // Format dates from API response and pre-process status
      const formattedElections = response.data.map((election: any) => {
        const startDate = new Date(election.startDate);
        const endDate = new Date(election.endDate);
        
        return {
          ...election,
          startDate,
          endDate,
          // Determine status immediately based on current date
          status: determineStatus(startDate, endDate)
        };
      });
      
      setElections(formattedElections);
      
      toast.success('Election data refreshed');
    } catch (err) {
      setError('Failed to refresh election data');
      console.error('Error refreshing election data:', err);
      toast.error('Failed to refresh election data');
    } finally {
      setIsLoading(false);
    }
  };

  // Get elections by status
  const activeElections = elections.filter(election => election.status === 'active');
  const completedElections = elections.filter(election => election.status === 'completed');
  const upcomingElections = elections.filter(election => election.status === 'upcoming');

  // Helper function to determine election status based on dates
  const determineStatus = (startDate: Date, endDate: Date): 'upcoming' | 'active' | 'completed' => {
    const now = new Date();
    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'completed';
    return 'active';
  };

  // Update election statuses based on current date
  const updateElectionStatuses = () => {
    setElections(prevElections => 
      prevElections.map(election => {
        const currentStatus = determineStatus(election.startDate, election.endDate);
        
        // Only update if status needs to change
        if (election.status !== currentStatus) {
          return { ...election, status: currentStatus };
        }
        
        return election;
      })
    );
  };

  // Get a specific election
  const getElection = (id: string) => {
    return elections.find(election => election.id === id);
  };

  // Create a new election
  const createElection = async (election: Omit<Election, 'id' | 'totalVotes' | 'status'>) => {
    if (!dataInitialized) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Generate a client-side ID for immediate UI feedback
      const newElectionId = Math.random().toString(36).substring(2, 15);
      
      // Prepare the election data with status determined by dates
      const newElection: Election = {
        ...election,
        id: newElectionId,
        totalVotes: 0,
        status: determineStatus(election.startDate, election.endDate)
      };
      
      // Update local state immediately for responsive UI
      setElections(prev => [...prev, newElection]);
      
      // Attempt to save to backend
      try {
        const payload = {
          title: election.title,
          description: election.description,
          startDate: election.startDate.toISOString(),
          endDate: election.endDate.toISOString(),
          candidates: election.candidates,
          voterCount: election.voterCount || 0
        };
        
        const response = await api.post('/admin/elections', payload);
        
        // If successful, update the local election with server-generated ID
        if (response.data && response.data.id) {
          setElections(prev => prev.map(e => 
            e.id === newElectionId ? { ...e, id: response.data.id } : e
          ));
        }
      } catch (err) {
        console.error('Error saving election to backend:', err);
        // In a real app, you might want to mark this election as "not synced" 
        // or retry the save operation
      }
      
      toast.success('Election created successfully!');
    } catch (err) {
      setError('Failed to create election');
      console.error('Error creating election:', err);
      toast.error('Failed to create election');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an election
  const deleteElection = async (id: string) => {
    try {
      await api.delete(`/admin/elections/${id}`);
      setElections(prev => prev.filter(e => e.id !== id));
      toast.success('Election deleted successfully!');
    } catch (err) {
      setError('Failed to delete election');
      console.error('Error deleting election:', err);
      toast.error('Failed to delete election');
    }
  };

  // Add a candidate to an election
  const addCandidate = async (electionId: string, candidate: Omit<Candidate, 'id' | 'votes'>) => {
    try {
      const response = await api.post(`/admin/elections/${electionId}/candidates`, candidate);
      
      setElections(prevElections => {
        return prevElections.map(election => {
          if (election.id === electionId) {
            return {
              ...election,
              candidates: [
                ...election.candidates,
                response.data
              ]
            };
          }
          return election;
        });
      });
      toast.success('Candidate added successfully!');
    } catch (err) {
      setError('Failed to add candidate');
      console.error('Error adding candidate:', err);
      toast.error('Failed to add candidate');
    }
  };

  // Get all voters for a specific election
  const getVotersForElection = (electionId: string): Voter[] => {
    return voters.filter((voter) => voter.electionId === electionId);
  };

  // Refresh voters list from API
  const refreshVotersList = async (): Promise<void> => {
    try {
      const votersResponse = await api.get('/admin/voters');
      setVoters(votersResponse.data);
    } catch (err) {
      console.error('Error refreshing voters:', err);
      setError('Failed to refresh voters');
      toast.error('Failed to refresh voters list');
    }
  };

  // Add a voter to an election
  const addVoter = async (electionId: string, voter: Omit<Voter, 'id' | 'hasVoted'>): Promise<void> => {
    try {
      // Call API to add voter
      const response = await api.post(`/admin/elections/${electionId}/voters`, voter);
      
      // Add the new voter to the local state
      const newVoter = {
        ...response.data,
        hasVoted: false,
        electionId
      };
      
      setVoters(prev => [...prev, newVoter]);
      
      // Update the election's voterCount
      setElections(prev => prev.map(election => 
        election.id === electionId 
          ? { ...election, voterCount: election.voterCount + 1 } 
          : election
      ));
      
      toast.success('Voter added successfully!');
    } catch (err) {
      console.error('Error adding voter:', err);
      setError('Failed to add voter');
      toast.error('Failed to add voter');
      throw err;
    }
  };

  // Cast a vote
  const castVote = async (electionId: string, candidateId: string, voterId: string): Promise<boolean> => {
    try {
      // Call the API to cast a vote
      await api.post(`/voter/elections/${electionId}/vote`, { candidateId });
      
      // Refresh the elections to get the updated vote count
      await refreshElections();
      
      toast.success('Vote cast successfully!');
      return true;
    } catch (err: any) {
      setError('Failed to cast vote');
      console.error('Error casting vote:', err);
      
      // Show more specific error message if available from API
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Failed to cast vote');
      }
      
      return false;
    }
  };

  // Stop polling (complete an election)
  const stopPolling = async (id: string): Promise<void> => {
    try {
      await api.post(`/admin/elections/${id}/complete`);
      
      setElections(prev => prev.map(election => 
        election.id === id ? { ...election, status: 'completed' } : election
      ));
      
      toast.success('Election has been completed.');
    } catch (err) {
      setError('Failed to complete election');
      console.error('Error completing election:', err);
      toast.error('Failed to complete election');
      throw err;
    }
  };

  // Remove voter
  const removeVoter = async (id: string) => {
    try {
      await api.delete(`/admin/voters/${id}`);
      
      setVoters(prev => prev.filter(voter => voter.id !== id));
      toast.success('Voter removed successfully!');
    } catch (err) {
      setError('Failed to remove voter');
      console.error('Error removing voter:', err);
      toast.error('Failed to remove voter');
    }
  };

  // Remove candidate
  const removeCandidate = async (id: string) => {
    try {
      // Note: This API endpoint might need to be adjusted based on your backend structure
      await api.delete(`/admin/candidates/${id}`);
      
      setElections(prev => 
        prev.map(election => ({
          ...election,
          candidates: election.candidates.filter(candidate => candidate.id !== id)
        }))
      );
      
      toast.success('Candidate removed successfully!');
    } catch (err) {
      setError('Failed to remove candidate');
      console.error('Error removing candidate:', err);
      toast.error('Failed to remove candidate');
    }
  };

  // Add voter if they don't already exist in the system
  const addVoterIfNotExists = async (user: { name: string; email: string }) => {
    // Check if the voter already exists
    const existingVoter = voters.find(v => v.email === user.email);
    
    if (!existingVoter) {
      try {
        // If we're adding a user generically (not to a specific election)
        // we'll use a special API endpoint or parameter to indicate this
        await api.post('/admin/voters', user);
        
        // We don't need to call the regular addVoter method because
        // this is a special case where we're just registering a user in the system
        // without associating them with a specific election
        
        // Update the local state
        const newVoterId = crypto.randomUUID();
        const newVoter = {
          id: newVoterId,
          name: user.name,
          email: user.email,
          hasVoted: false
        };
        
        setVoters(prev => [...prev, newVoter]);
      } catch (err) {
        console.error('Error adding voter to system:', err);
        // We don't show an error toast here as this is a background operation
      }
    }
  };

  // Update candidate
  const updateCandidate = async (electionId: string, candidateId: string, updated: Partial<Omit<Candidate, 'id' | 'votes'>>) => {
    try {
      await api.put(`/admin/elections/${electionId}/candidates/${candidateId}`, updated);
      
      setElections(prev => 
        prev.map(election => {
          if (election.id === electionId) {
            return {
              ...election,
              candidates: election.candidates.map(candidate => {
                if (candidate.id === candidateId) {
                  return { ...candidate, ...updated };
                }
                return candidate;
              })
            };
          }
          return election;
        })
      );
      
      toast.success('Candidate updated successfully!');
    } catch (err) {
      setError('Failed to update candidate');
      console.error('Error updating candidate:', err);
      toast.error('Failed to update candidate');
    }
  };

  // Clear all data
  const clearAllData = async () => {
    try {
      setIsLoading(true);
      
      // Call the API to clear all elections
      await api.delete('/admin/elections/all');
      
      // Clear local state
      setElections([]);
      setVoters([]);
      
      toast.success('All data cleared successfully!');
    } catch (err) {
      setError('Failed to clear all data');
      console.error('Error clearing all data:', err);
      toast.error('Failed to clear all data');
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing election
  const updateElection = async (id: string, updates: { title?: string; description?: string; startDate?: Date; endDate?: Date }) => {
    try {
      setIsLoading(true);
      
      // Get the current election
      const currentElection = getElection(id);
      if (!currentElection) {
        throw new Error('Election not found');
      }
      
      // Prepare the updated election data
      const updatedElection = {
        ...currentElection,
        ...updates,
        // Recalculate status if dates were changed
        status: updates.startDate || updates.endDate 
          ? determineStatus(
              updates.startDate || currentElection.startDate,
              updates.endDate || currentElection.endDate
            )
          : currentElection.status
      };
      
      // Send to API
      await api.put(`/admin/elections/${id}`, {
        title: updatedElection.title,
        description: updatedElection.description,
        startDate: updatedElection.startDate,
        endDate: updatedElection.endDate,
        status: updatedElection.status
      });
      
      // Update local state
      setElections(prev => prev.map(election => 
        election.id === id ? updatedElection : election
      ));
      
      toast.success('Election updated successfully!');
    } catch (err) {
      setError('Failed to update election');
      console.error('Error updating election:', err);
      toast.error('Failed to update election');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ElectionContext.Provider value={{
      elections,
      voters,
      createElection,
      addCandidate,
      addVoter,
      castVote,
      getElection,
      deleteElection,
      stopPolling,
      removeVoter,
      removeCandidate,
      activeElections,
      completedElections,
      upcomingElections,
      addVoterIfNotExists,
      updateCandidate,
      isLoading,
      error,
      refreshElections,
      clearAllData,
      updateElectionStatuses,
      getVotersForElection,
      refreshVotersList,
      updateElection
    }}>
      {children}
    </ElectionContext.Provider>
  );
};
