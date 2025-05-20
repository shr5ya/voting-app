import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

// Setup axios instance
const api = axios.create({
  baseURL: 'http://localhost:5002/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent long hanging requests
  timeout: 5000
});

// Interfaces
export interface Candidate {
  id: string;
  name: string;
  position: string;
  bio: string;
  imageUrl?: string;
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

// Function to load elections from localStorage backup
const loadElectionsFromLocalStorage = (): Election[] => {
  try {
    const localData = localStorage.getItem('electra-elections');
    if (localData) {
      const parsed = JSON.parse(localData);
      return parsed.map((election: any) => ({
        ...election,
        startDate: new Date(election.startDate),
        endDate: new Date(election.endDate)
      }));
    }
  } catch (err) {
    console.error('Error loading elections from localStorage:', err);
  }
  return [];
};

// Function to save elections to localStorage as backup
const saveElectionsToLocalStorage = (elections: Election[]) => {
  try {
    localStorage.setItem('electra-elections', JSON.stringify(elections));
  } catch (err) {
    console.error('Error saving elections to localStorage:', err);
  }
};

// Create a custom hook to use the election context
export const useElection = () => {
  const context = useContext(ElectionContext);
  if (!context) {
    throw new Error('useElection must be used within an ElectionProvider');
  }
  return context;
};

// Provider component
export const ElectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elections, setElections] = useState<Election[]>([]);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataInitialized, setDataInitialized] = useState(false);

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
          const id = election.id || (election._id ? election._id.toString() : undefined);
          const startDate = new Date(election.startDate);
          const endDate = new Date(election.endDate);
          
          return {
            ...election,
            id: id,
            startDate,
            endDate,
            // Determine status immediately based on current date
            status: determineStatus(startDate, endDate)
          };
        });
        
        setElections(formattedElections);
        
        // Save to localStorage for offline use
        saveElectionsToLocalStorage(formattedElections);
        
        // Load voters - this might need to be adjusted based on your API structure
        try {
          const votersResponse = await api.get('/admin/voters');
          setVoters(votersResponse.data);
        } catch (voterErr) {
          console.warn('Could not load voters data. This might be expected for non-admin users.');
          // Non-critical error, don't set the main error state
        }
        
        setDataInitialized(true);
        
        // Force an immediate update of election statuses
        setTimeout(() => updateElectionStatuses(), 100);
      } catch (err: any) {
        console.error('Error loading initial data:', err);
        
        // Try to load from localStorage as fallback
        const localElections = loadElectionsFromLocalStorage();
        
        if (localElections.length > 0) {
          console.log('Using locally stored elections for initial load');
          setElections(localElections);
          setDataInitialized(true);
          
          // Update their status based on current date
          setTimeout(() => updateElectionStatuses(), 100);
          
          // Show a warning toast
          toast.warning('Using offline data. Server connection failed.');
        } else {
          setError('Failed to load election data');
          if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
            toast.error('Server connection error. Please make sure the server is running at http://localhost:5002.');
          } else {
            toast.error('Failed to load election data');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Computed properties
  const activeElections = elections.filter(election => election.status === 'active');
  const completedElections = elections.filter(election => election.status === 'completed');
  const upcomingElections = elections.filter(election => election.status === 'upcoming');

  // Refresh elections from the server
  const refreshElections = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch elections from the server
      const response = await api.get('/voter/elections');
      console.log('Fetched elections from server:', response.data);
      
      // Map the response to ensure IDs are properly converted
      const formattedElections = response.data.map((election: any) => {
        // Ensure the election has an id property (from _id if needed)
        const id = election.id || (election._id ? election._id.toString() : undefined);
        
        if (!id) {
          console.warn('Election missing ID:', election);
        }
        
        // Process dates to ensure they are Date objects
        const startDate = new Date(election.startDate);
        const endDate = new Date(election.endDate);
        
        // Return the formatted election with proper types
        return {
          ...election,
          id: id,
          startDate,
          endDate,
          // Ensure we have the correct status based on current date
          status: determineStatus(startDate, endDate)
        };
      });
      
      console.log('Formatted elections:', formattedElections);
      setElections(formattedElections);
      
      // Save to localStorage as backup
      saveElectionsToLocalStorage(formattedElections);
      
      // Update election statuses based on current date
      updateElectionStatuses();
      
      // Log the elections after updating
      setTimeout(() => {
        console.log('Elections after refresh:', elections);
      }, 100);
      
      return formattedElections;
    } catch (err: any) {
      console.error('Error refreshing elections:', err);
      
      // Try to load elections from localStorage as fallback
      const localElections = loadElectionsFromLocalStorage();
      
      if (localElections.length > 0) {
        console.log('Using locally stored elections as fallback');
        setElections(localElections);
        
        // Update their status based on current date
        setTimeout(() => updateElectionStatuses(), 100);
        
        // Only show a warning, not an error
        toast.warning('Using offline data. Server connection failed.');
        
        return localElections;
      }
      
      // Only display toast error message once, not repeatedly
      if (!error) {
        setError('Failed to load elections');
        
        // Show more informative message for connection issues
        if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
          toast.error('Server connection error. Please make sure the server is running at http://localhost:5002.');
        } else {
          toast.error('Failed to load elections');
        }
      }
      
      // Return current elections if they exist, empty array otherwise
      return elections.length > 0 ? elections : [];
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to determine election status based on dates
  const determineStatus = (startDate: Date, endDate: Date): 'upcoming' | 'active' | 'completed' => {
    const now = new Date();
    
    console.log('Determining status for election:');
    console.log('- Start date:', startDate);
    console.log('- End date:', endDate);
    console.log('- Current date:', now);
    
    // Ensure we're working with proper Date objects
    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const end = endDate instanceof Date ? endDate : new Date(endDate);
    
    if (now < start) {
      console.log('Status: upcoming');
      return 'upcoming';
    }
    if (now > end) {
      console.log('Status: completed');
      return 'completed';
    }
    console.log('Status: active');
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
    if (!id) return undefined;
    
    // Handle both string IDs and MongoDB ObjectIds
    return elections.find(election => {
      // Make sure both values are strings for comparison
      const electionId = election.id?.toString();
      return electionId === id;
    });
  };

  // Create a new election with better reliability
  const createElection = async (election: Omit<Election, 'id' | 'totalVotes' | 'status'>) => {
    if (!dataInitialized) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Generate a client-side ID for immediate UI feedback
      const tempId = Math.random().toString(36).substring(2, 15);
      
      // Prepare the election data with status determined by dates
      const newElection: Election = {
        ...election,
        id: tempId, // Temporary ID that will be replaced with the server ID
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
          voterCount: election.voterCount || 0,
          isPublic: true
        };
        
        console.log('Sending election data to server:', payload);
        const response = await api.post('/admin/elections', payload);
        
        console.log('Server response:', response.data);
        
        // Get the ID from the response (either id or _id should work)
        let serverId: string | undefined;
        
        if (response.data && response.data.id) {
          serverId = response.data.id;
          console.log('Using server-provided id:', serverId);
        } else if (response.data && response.data._id) {
          serverId = response.data._id.toString();
          console.log('Using server-provided _id:', serverId);
        } else {
          console.warn('Server response missing ID:', response.data);
        }
        
        // If we got a valid ID from the server, update our local state
        if (serverId) {
          setElections(prev => 
            prev.map(e => e.id === tempId ? { ...e, id: serverId! } : e)
          );
          
          // Force a refresh of elections after creating a new one
          setTimeout(() => {
            refreshElections();
          }, 500);
        }
        
        toast.success('Election created successfully!');
      } catch (err) {
        console.error('Error saving election to backend:', err);
        // Mark this election as having a sync error
        setElections(prev => 
          prev.map(e => e.id === tempId ? { ...e, syncError: true } : e)
        );
        
        toast.error('Election created but sync failed. Please refresh.');
      }
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

  // Refresh the list of voters from the server
  const refreshVotersList = async () => {
    try {
      const votersResponse = await api.get('/admin/voters');
      console.log('Refreshed voters data:', votersResponse.data);
      setVoters(votersResponse.data);
      return votersResponse.data;
    } catch (err) {
      console.error('Error refreshing voters list:', err);
      toast.error('Failed to refresh voters data');
      return voters; // Return existing voters on error
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
      
      // Mark the voter as having voted
      setVoters(prev => prev.map(voter => 
        voter.id === voterId ? { ...voter, hasVoted: true } : voter
      ));
      
      toast.success('Vote cast successfully!');
      return true;
    } catch (err) {
      console.error('Error casting vote:', err);
      toast.error('Failed to cast vote');
      return false;
    }
  };

  // Stop polling for an election
  const stopPolling = async (id: string): Promise<void> => {
    try {
      await api.post(`/admin/elections/${id}/status`, { status: 'completed' });
      
      // Update local state
      setElections(prev => prev.map(election => 
        election.id === id ? { ...election, status: 'completed' } : election
      ));
      
      toast.success('Election completed successfully!');
    } catch (err) {
      console.error('Error completing election:', err);
      toast.error('Failed to complete election');
    }
  };

  // Remove a voter
  const removeVoter = async (id: string) => {
    try {
      await api.delete(`/admin/voters/${id}`);
      setVoters(prev => prev.filter(voter => voter.id !== id));
      toast.success('Voter removed successfully!');
    } catch (err) {
      console.error('Error removing voter:', err);
      toast.error('Failed to remove voter');
    }
  };

  // Remove a candidate
  const removeCandidate = async (id: string) => {
    try {
      await api.delete(`/admin/candidates/${id}`);
      
      // Update local state - a bit more complex as we need to find which election has this candidate
      setElections(prev => prev.map(election => {
        const candidateIndex = election.candidates.findIndex(c => c.id === id);
        if (candidateIndex >= 0) {
          // Create a new array of candidates without the removed one
          const newCandidates = [...election.candidates];
          newCandidates.splice(candidateIndex, 1);
          return { ...election, candidates: newCandidates };
        }
        return election;
      }));
      
      toast.success('Candidate removed successfully!');
    } catch (err) {
      console.error('Error removing candidate:', err);
      toast.error('Failed to remove candidate');
    }
  };

  // Add voter if not exists
  const addVoterIfNotExists = async (user: { name: string; email: string }) => {
    if (!user.email) return;
    
    // Check if voter already exists
    const existingVoter = voters.find(v => v.email === user.email);
    if (existingVoter) return;
    
    try {
      // Add voter without specific election
      const response = await api.post('/admin/voters', {
        name: user.name,
        email: user.email
      });
      
      // Add to local state
      setVoters(prev => [...prev, {
        ...response.data,
        hasVoted: false
      }]);
    } catch (err) {
      console.error('Error adding voter:', err);
      // Don't show an error toast as this is a background operation
    }
  };

  // Update a candidate
  const updateCandidate = async (electionId: string, candidateId: string, updated: Partial<Omit<Candidate, 'id' | 'votes'>>) => {
    try {
      const response = await api.put(`/admin/elections/${electionId}/candidates/${candidateId}`, updated);
      
      // Update local state
      setElections(prev => prev.map(election => {
        if (election.id === electionId) {
          return {
            ...election,
            candidates: election.candidates.map(candidate => 
              candidate.id === candidateId ? { ...candidate, ...response.data } : candidate
            )
          };
        }
        return election;
      }));
      
      toast.success('Candidate updated successfully!');
    } catch (err) {
      console.error('Error updating candidate:', err);
      toast.error('Failed to update candidate');
    }
  };

  // Clear all data
  const clearAllData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Call the API to clear all elections
      await api.delete('/admin/elections/all');
      
      // Clear local state
      setElections([]);
      setVoters([]);
      
      toast.success('All data cleared successfully!');
    } catch (err) {
      console.error('Error clearing all data:', err);
      toast.error('Failed to clear data');
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
