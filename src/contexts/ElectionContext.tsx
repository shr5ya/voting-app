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
const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Jane Smith',
    position: 'President',
    bio: 'Experienced leader with a track record of success.',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
    votes: 25,
  },
  {
    id: '2',
    name: 'John Doe',
    position: 'Vice President',
    bio: 'Passionate about innovation and technology.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
    votes: 17,
  },
  {
    id: '3',
    name: 'Emily Johnson',
    position: 'Secretary',
    bio: 'Detail-oriented and efficient administrator.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
    votes: 12,
  },
];

const mockElections: Election[] = [
  {
    id: '1',
    title: 'Student Council Election 2024',
    description: 'Annual election for student council positions.',
    startDate: new Date('2024-05-10'),
    endDate: new Date('2024-05-25'),
    status: 'active',
    candidates: mockCandidates,
    totalVotes: 54,
    voterCount: 100,
  },
  {
    id: '2',
    title: 'Faculty Board Election',
    description: 'Election for faculty board positions.',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-15'),
    status: 'upcoming',
    candidates: [],
    totalVotes: 0,
    voterCount: 50,
  },
  {
    id: '3',
    title: 'Club President Election',
    description: 'Election for the club president position.',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-04-15'),
    status: 'completed',
    candidates: [
      {
        id: '4',
        name: 'Michael Brown',
        position: 'President',
        bio: 'Dedicated to club growth and member engagement.',
        imageUrl: 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
        votes: 32,
      },
      {
        id: '5',
        name: 'Sarah Wilson',
        position: 'President',
        bio: 'Focusing on innovation and inclusivity.',
        imageUrl: 'https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHlvdW5nJTIwd29tYW58ZW58MHx8MHx8fDA%3D',
        votes: 28,
      },
    ],
    totalVotes: 60,
    voterCount: 75,
  },
  {
    id: '4',
    title: 'Department Chair Election',
    description: 'Election for the department chair position.',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-07-15'),
    status: 'upcoming',
    candidates: [],
    totalVotes: 0,
    voterCount: 25,
  },
  {
    id: '5',
    title: 'Student Association Board',
    description: 'Election for the student association board positions.',
    startDate: new Date('2024-05-01'),
    endDate: new Date('2024-05-08'),
    status: 'completed',
    candidates: [
      {
        id: '6',
        name: 'David Lee',
        position: 'Chair',
        bio: 'Experienced in student leadership and community building.',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
        votes: 42,
      },
      {
        id: '7',
        name: 'Anna Martinez',
        position: 'Chair',
        bio: 'Committed to improving student experience and campus life.',
        imageUrl: 'https://images.unsplash.com/photo-1520810627419-35e362c5dc07?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
        votes: 38,
      },
    ],
    totalVotes: 80,
    voterCount: 100,
  }
];

const mockVoters: Voter[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', hasVoted: false },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', hasVoted: true, electionId: '1' },
  { id: '3', name: 'Carol White', email: 'carol@example.com', hasVoted: false },
  { id: '4', name: 'David Brown', email: 'david@example.com', hasVoted: true, electionId: '3' },
  { id: '5', name: 'Eva Martinez', email: 'eva@example.com', hasVoted: false },
];

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

  // Process mock data to ensure dates are proper Date objects
  const processMockData = (mockData: Election[]): Election[] => {
    return mockData.map(election => ({
      ...election,
      startDate: new Date(election.startDate),
      endDate: new Date(election.endDate),
    }));
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Try to load from localStorage first
        const storedElections = localStorage.getItem('elections');
        
        if (storedElections) {
          try {
            const parsedElections = JSON.parse(storedElections);
            // Convert string dates back to Date objects
            const processedElections = parsedElections.map(election => ({
              ...election,
              startDate: new Date(election.startDate),
              endDate: new Date(election.endDate),
            }));
            setElections(processedElections);
          } catch (parseError) {
            console.error('Error parsing stored elections:', parseError);
            // Fall back to mock data if parse error
            const processedElections = processMockData(mockElections);
            setElections(processedElections);
            localStorage.setItem('elections', JSON.stringify(processedElections));
          }
        } else {
          // No localStorage data, use mock data
        // Simulate API fetch with a delayed response
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Convert dates from string to Date objects for mock data
        const processedElections = processMockData(mockElections);
        
        setElections(processedElections);
          // Store mock data in localStorage
          localStorage.setItem('elections', JSON.stringify(processedElections));
        }
        
        setVoters(mockVoters);
        setDataInitialized(true);
      } catch (err) {
        setError('Failed to load election data. Please try again later.');
        console.error('Error loading election data:', err);
        toast.error('Failed to load election data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

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
      // Check if the voter has already voted
      const voter = voters.find(v => v.id === voterId);
      if (!voter || voter.hasVoted) {
        toast.error('You have already voted in this election.');
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
