import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

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
  createElection: (election: Omit<Election, 'id' | 'totalVotes' | 'status'>) => void;
  addCandidate: (electionId: string, candidate: Omit<Candidate, 'id' | 'votes'>) => void;
  addVoter: (voter: Omit<Voter, 'id' | 'hasVoted'>) => void;
  castVote: (electionId: string, candidateId: string, voterId: string) => boolean;
  getElection: (id: string) => Election | undefined;
  deleteElection: (id: string) => void;
  stopPolling: (id: string) => void;
  removeVoter: (id: string) => void;
  removeCandidate: (id: string) => void;
  activeElections: Election[];
  completedElections: Election[];
  upcomingElections: Election[];
  addVoterIfNotExists: (user: { name: string; email: string }) => void;
  updateCandidate: (electionId: string, candidateId: string, updated: Partial<Omit<Candidate, 'id' | 'votes'>>) => void;
  isLoading: boolean;
  error: string | null;
  refreshElections: () => void;
}

// Mock data
const mockCandidates: Candidate[] = [];
const mockElections: Election[] = [];
const mockVoters: Voter[] = [];

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
        
        // Clear all previous data from localStorage
        localStorage.removeItem('elections');
        localStorage.removeItem('voters');
        
        // Initialize with empty arrays
        setElections([]);
        setVoters([]);
        
        // Store empty arrays in localStorage
        localStorage.setItem('elections', JSON.stringify([]));
        localStorage.setItem('voters', JSON.stringify([]));
        
        setDataInitialized(true);
      } catch (err) {
        setError('Failed to initialize data');
        console.error('Error initializing data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Save elections to localStorage whenever they change
  useEffect(() => {
    if (dataInitialized) {
      localStorage.setItem('elections', JSON.stringify(elections));
    }
  }, [elections, dataInitialized]);

  // Save voters to localStorage whenever they change
  useEffect(() => {
    if (dataInitialized) {
      localStorage.setItem('voters', JSON.stringify(voters));
    }
  }, [voters, dataInitialized]);

  // Refresh elections data
  const refreshElections = async () => {
    if (!dataInitialized) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API fetch with a delayed response
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Check for election status updates based on current date
      const now = new Date();
      const updatedElections = elections.map(election => {
        let status = election.status;
        
        if (election.startDate <= now && election.endDate >= now) {
          status = 'active';
        } else if (election.endDate < now) {
          status = 'completed';
        } else if (election.startDate > now) {
          status = 'upcoming';
        }
        
        return { ...election, status } as Election;
      });
      
      setElections(updatedElections);
      
      // Update localStorage
      localStorage.setItem('elections', JSON.stringify(updatedElections));
      
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

  // Get a specific election
  const getElection = (id: string) => {
    return elections.find(election => election.id === id);
  };

  // Create a new election
  const createElection = (election: Omit<Election, 'id' | 'totalVotes' | 'status'>) => {
    return new Promise<void>((resolve, reject) => {
    try {
      setIsLoading(true);
      
        // Simulate API call delay
        setTimeout(() => {
      const now = new Date();
      let status: 'upcoming' | 'active' | 'completed' = 'upcoming';
      
      if (election.startDate <= now && election.endDate >= now) {
        status = 'active';
      } else if (election.endDate < now) {
        status = 'completed';
      }
      
      const newElection: Election = {
        ...election,
        id: Math.random().toString(36).substring(2, 9),
        totalVotes: 0,
        status,
      };
      
          // Update state with the new election
          setElections(prevElections => {
            const updatedElections = [...prevElections, newElection];
            // Save to localStorage immediately after state update
            localStorage.setItem('elections', JSON.stringify(updatedElections));
            return updatedElections;
          });
          
          setIsLoading(false);
      toast.success('Election created successfully!');
          resolve();
        }, 800);
    } catch (err) {
      setError('Failed to create election');
      console.error('Error creating election:', err);
      toast.error('Failed to create election');
      setIsLoading(false);
        reject(err);
    }
    });
  };

  // Delete an election
  const deleteElection = (id: string) => {
    try {
      setElections(prev => prev.filter(e => e.id !== id));
      toast.success('Election deleted successfully!');
    } catch (err) {
      setError('Failed to delete election');
      console.error('Error deleting election:', err);
      toast.error('Failed to delete election');
    }
  };

  // Add a candidate to an election
  const addCandidate = (electionId: string, candidate: Omit<Candidate, 'id' | 'votes'>) => {
    try {
      setElections(prevElections => {
        return prevElections.map(election => {
          if (election.id === electionId) {
            return {
              ...election,
              candidates: [
                ...election.candidates,
                {
                  ...candidate,
                  id: Math.random().toString(36).substring(2, 9),
                  votes: 0
                }
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

  // Add a voter
  const addVoter = (voter: Omit<Voter, 'id' | 'hasVoted'>) => {
    try {
      const newVoter: Voter = {
        ...voter,
        id: Math.random().toString(36).substring(2, 9),
        hasVoted: false
      };
      setVoters([...voters, newVoter]);
      toast.success('Voter added successfully!');
    } catch (err) {
      setError('Failed to add voter');
      console.error('Error adding voter:', err);
      toast.error('Failed to add voter');
    }
  };

  // Cast a vote
  const castVote = (electionId: string, candidateId: string, voterId: string): boolean => {
    try {
      // Check if the voter exists in our voters array
      let voter = voters.find(v => v.id === voterId);
      
      // If voter doesn't exist in our system yet, add them
      if (!voter) {
        // Get user info from localStorage as a fallback (this assumes AuthContext saved user data)
        const savedUserStr = localStorage.getItem('electra-user');
        if (savedUserStr) {
          const savedUser = JSON.parse(savedUserStr);
          if (savedUser && savedUser.id === voterId) {
            // Create a new voter entry
            voter = {
              id: voterId,
              name: savedUser.name || 'Voter',
              email: savedUser.email || '',
              hasVoted: false
            };
            // Add to voters array
            setVoters(prev => [...prev, voter]);
          }
        }
      }
      
      // Now check if the voter exists and hasn't voted
      if (!voter) {
        toast.error('Voter not found in the system.');
        return false;
      }
      
      // Check if the voter has already voted in ANY election (not just this one)
      if (voter.hasVoted) {
        toast.error('You have already voted in an election.');
        return false;
      }

      // Update the elections state
      setElections(prevElections => {
        return prevElections.map(election => {
          if (election.id === electionId) {
            // Update the candidate's vote count
            const updatedCandidates = election.candidates.map(candidate => {
              if (candidate.id === candidateId) {
                return { ...candidate, votes: candidate.votes + 1 };
              }
              return candidate;
            });
            
            return {
              ...election,
              candidates: updatedCandidates,
              totalVotes: election.totalVotes + 1
            };
          }
          return election;
        });
      });

      // Update the voter's status
      setVoters(prevVoters => {
        return prevVoters.map(v => {
          if (v.id === voterId) {
            return { ...v, hasVoted: true, electionId };
          }
          return v;
        });
      });

      // Save the updated elections and voters to localStorage
      setTimeout(() => {
        localStorage.setItem('elections', JSON.stringify(elections));
        localStorage.setItem('voters', JSON.stringify(voters));
      }, 100);

      toast.success('Vote cast successfully!');
      return true;
    } catch (err) {
      setError('Failed to cast vote');
      console.error('Error casting vote:', err);
      toast.error('Failed to cast vote');
      return false;
    }
  };

  // Stop polling
  const stopPolling = (id: string) => {
    try {
      setElections(prev => prev.map(election => 
        election.id === id ? { ...election, status: 'completed' } : election
      ));
      toast.success('Election has been completed.');
    } catch (err) {
      setError('Failed to complete election');
      console.error('Error completing election:', err);
      toast.error('Failed to complete election');
    }
  };

  // Remove voter
  const removeVoter = (id: string) => {
    try {
      setVoters(prev => prev.filter(voter => voter.id !== id));
      toast.success('Voter removed successfully!');
    } catch (err) {
      setError('Failed to remove voter');
      console.error('Error removing voter:', err);
      toast.error('Failed to remove voter');
    }
  };

  // Remove candidate
  const removeCandidate = (id: string) => {
    try {
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

  // Add voter if not exists
  const addVoterIfNotExists = (user: { name: string; email: string }) => {
    try {
      const existingVoter = voters.find(voter => voter.email === user.email);
      if (!existingVoter) {
        const newVoter: Voter = {
          id: Math.random().toString(36).substring(2, 9),
          name: user.name,
          email: user.email,
          hasVoted: false
        };
        setVoters(prev => [...prev, newVoter]);
      }
    } catch (err) {
      console.error('Error adding voter from user:', err);
    }
  };

  // Update candidate
  const updateCandidate = (electionId: string, candidateId: string, updated: Partial<Omit<Candidate, 'id' | 'votes'>>) => {
    try {
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
      refreshElections
    }}>
      {children}
    </ElectionContext.Provider>
  );
};
