import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useElection } from '@/contexts/ElectionContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';

// Define proper types for our data
interface Candidate {
  id: string;
  name: string;
  position: string;
  votes?: number;
}

interface Election {
  id: string;
  title: string;
  description: string;
  candidates: Candidate[];
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed';
  totalVotes?: number;
  voterCount?: number;
}

const ElectionVote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getElection, castVote, refreshElections } = useElection();

  const [election, setElection] = useState<Election | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Load election data
  useEffect(() => {
    if (id) {
      const electionData = getElection(id);
      console.log("Election data:", electionData);
      
      if (electionData) {
        setElection(electionData as unknown as Election);
      } else {
        setError('Election not found');
      }
    }
  }, [id, getElection]);

  // Handle radio button change
  const handleCandidateSelect = (candidateId: string) => {
    console.log("Selected candidate:", candidateId);
    setSelectedCandidate(candidateId);
    setError(''); // Clear any previous errors
  };

  // Debug function to show what's happening
  const showDebugInfo = () => {
    const info = {
      electionId: id,
      selectedCandidate,
      user: user ? { id: user.id, name: user.name } : 'No user logged in',
      election: election ? { id: election.id, title: election.title, candidatesCount: election.candidates?.length } : 'No election data'
    };
    
    setDebugInfo(JSON.stringify(info, null, 2));
    console.log("Debug info:", info);
  };

  // Direct vote submission - bypasses any potential issues with the form
  const submitVoteDirectly = async () => {
    if (!selectedCandidate || !id) {
      setError('Please select a candidate first');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Use a mock voter ID if user is not available
      const voterId = user?.id || 'temp-voter-' + Math.random().toString(36).substring(2, 9);
      
      console.log('Submitting vote directly:', {
        electionId: id,
        candidateId: selectedCandidate,
        voterId
      });
      
      // Try direct API call first
      try {
        const response = await axios.post(`http://localhost:5002/api/v1/voter/elections/${id}/vote`, { 
          candidateId: selectedCandidate,
          voterId: voterId
        });
        
        console.log('Direct API response:', response.data);
        setSuccess(true);
        toast.success('Your vote has been recorded!');
        
        // Refresh elections to update counts
        setTimeout(() => refreshElections(), 1000);
        return;
      } catch (apiErr) {
        console.warn('Direct API call failed, trying context method:', apiErr);
      }
      
      // Fall back to context method
      const result = await castVote(id, selectedCandidate, voterId);
      console.log('Vote result:', result);
      
      if (result) {
        setSuccess(true);
        toast.success('Your vote has been recorded!');
      } else {
        setError('Failed to cast vote. You may have already voted in this election.');
      }
    } catch (err) {
      console.error('Vote error:', err);
      setError(`An error occurred while casting your vote: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitVoteDirectly();
  };
  
  if (!election && !error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
          </div>
          <p className="mt-4 text-center text-gray-600">Loading election...</p>
        </div>
      </div>
    );
  }

  if (error && !election) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full">
          <div className="text-center text-red-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold mt-2">Error</h2>
            <p className="mt-1">{error}</p>
          </div>
          <button 
            onClick={() => navigate('/elections')}
            className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition-colors"
          >
            Back to Elections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F1EFEC', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '28rem', margin: '0 auto' }}>
        {/* Election Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#030303' }}>
            <span style={{ color: '#123458', marginRight: '0.5rem' }}>🏆</span>
            {election?.title}
          </h1>
          <p style={{ marginTop: '0.5rem', color: '#123458', fontStyle: 'italic' }}>{election?.description}</p>
        </div>
        
        {/* Voting Card */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #D4C9BE' }}>
          {/* Card Header */}
          <div style={{ backgroundColor: '#123458', color: 'white', padding: '1rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ marginRight: '0.5rem', width: '1.5rem', height: '1.5rem' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Cast Your Vote
            </h2>
          </div>
          
          {/* Card Content */}
          <div style={{ padding: '1.5rem' }}>
            {success ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <svg style={{ width: '5rem', height: '5rem', color: '#123458', margin: '0 auto 1rem auto' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#123458', marginBottom: '0.5rem' }}>Vote Recorded!</h3>
                <p style={{ color: '#030303', opacity: '0.8' }}>Thank you for participating in this election.</p>
                <button 
                  onClick={() => navigate('/elections')}
                  style={{ marginTop: '1.5rem', backgroundColor: '#123458', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                >
                  Back to Elections
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#030303' }}>Select a candidate:</div>
                
                {error && (
                  <div style={{ backgroundColor: '#FEF2F2', color: '#DC2626', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem', textAlign: 'center' }}>
                    {error}
                  </div>
                )}
                
                <div style={{ marginBottom: '1.5rem' }}>
                  {election?.candidates?.map((candidate) => (
                    <div 
                      key={candidate.id}
                      style={{ 
                        display: 'block', 
                        padding: '1rem', 
                        borderRadius: '0.5rem', 
                        border: `2px solid ${selectedCandidate === candidate.id ? '#123458' : '#E5E7EB'}`,
                        backgroundColor: selectedCandidate === candidate.id ? '#F1EFEC' : 'white',
                        marginBottom: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onClick={() => handleCandidateSelect(candidate.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                          type="radio"
                          name="candidate"
                          id={`candidate-${candidate.id}`}
                          value={candidate.id}
                          checked={selectedCandidate === candidate.id}
                          onChange={() => handleCandidateSelect(candidate.id)}
                          style={{ marginRight: '0.75rem', width: '1.25rem', height: '1.25rem' }}
                        />
                        <div>
                          <div style={{ fontWeight: '500', color: '#030303' }}>{candidate.name}</div>
                          <div style={{ fontSize: '0.875rem', color: '#123458', opacity: '0.75' }}>{candidate.position}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedCandidate}
                    style={{ 
                      padding: '0.75rem', 
                      borderRadius: '0.375rem', 
                      fontWeight: '600', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      backgroundColor: !selectedCandidate || isSubmitting ? '#93C5FD' : '#123458',
                      color: 'white',
                      cursor: !selectedCandidate || isSubmitting ? 'not-allowed' : 'pointer',
                      border: 'none'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div style={{ width: '1rem', height: '1rem', borderRadius: '50%', border: '2px solid white', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', marginRight: '0.5rem' }}></div>
                        Recording Vote...
                      </>
                    ) : (
                      'Submit Vote'
                    )}
                  </button>
                  
                  {/* Direct vote button as fallback */}
                  <button
                    type="button"
                    onClick={submitVoteDirectly}
                    disabled={isSubmitting || !selectedCandidate}
                    style={{ 
                      padding: '0.75rem', 
                      borderRadius: '0.375rem', 
                      fontWeight: '600',
                      backgroundColor: !selectedCandidate || isSubmitting ? '#E5E7EB' : '#F59E0B',
                      color: !selectedCandidate || isSubmitting ? '#9CA3AF' : 'white',
                      cursor: !selectedCandidate || isSubmitting ? 'not-allowed' : 'pointer',
                      border: 'none'
                    }}
                  >
                    {isSubmitting ? 'Processing...' : 'Submit Vote (Alternative Method)'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={showDebugInfo}
                    style={{ fontSize: '0.875rem', color: '#6B7280', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Debug Info
                  </button>
                </div>
                
                {selectedCandidate && (
                  <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem', color: '#123458' }}>
                    You're voting for: <span style={{ fontWeight: '600' }}>{election?.candidates?.find(c => c.id === selectedCandidate)?.name}</span>
                  </div>
                )}
                
                {debugInfo && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#F3F4F6', borderRadius: '0.375rem', fontSize: '0.75rem', fontFamily: 'monospace', overflow: 'auto' }}>
                    <pre>{debugInfo}</pre>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: '#6B7280' }}>
          Electra Voting System • Secure • Transparent • Reliable
        </div>
      </div>
    </div>
  );
};

export default ElectionVote;