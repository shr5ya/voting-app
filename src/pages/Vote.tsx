import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useElection } from '@/contexts/ElectionContext';
import { useAuth } from '@/contexts/AuthContext';

const ElectionVote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getElection, castVote, isLoading: contextLoading } = useElection();
  
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(false);
  const [election, setElection] = useState(null);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (id) {
      const electionData = getElection(id);
      if (electionData) {
        setElection(electionData);
      } else {
        setError('Election not found');
      }
    }
  }, [id, getElection]);
  
  const handleVote = () => {
    if (!selectedCandidate || !user || !election) return;
    
    setLoading(true);
    
    // Use the actual castVote function from context
    try {
      const success = castVote(election.id, selectedCandidate, user.id);
      
    setTimeout(() => {
        setLoading(false);
        if (success) {
          setVoted(true);
        } else {
          setError('Failed to cast vote. You may have already voted in this election.');
        }
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError('An error occurred while casting your vote');
    }
  };

  // Custom styles based on provided color codes
  const styles = {
    container: {
      backgroundColor: '#F1EFEC',
      minHeight: '100vh',
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      overflow: 'hidden',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      width: '100%',
      maxWidth: '28rem',
      border: '1px solid #D4C9BE'
    },
    header: {
      backgroundColor: '#123458',
      padding: '1.5rem',
      color: 'white',
      textAlign: 'center'
    },
    content: {
      padding: '1.5rem'
    },
    candidateBox: (isSelected) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      cursor: 'pointer',
      padding: '1rem',
      borderRadius: '0.75rem',
      border: `2px solid ${isSelected ? '#123458' : '#D4C9BE'}`,
      backgroundColor: isSelected ? '#F1EFEC' : 'white',
      marginBottom: '0.75rem',
      transition: 'all 0.3s ease'
    }),
    button: {
      backgroundColor: '#123458',
      color: 'white',
      width: '100%',
      padding: '0.75rem 0',
      borderRadius: '0.5rem',
      fontWeight: '600',
      cursor: selectedCandidate ? 'pointer' : 'not-allowed',
      opacity: selectedCandidate ? '1' : '0.5',
      transition: 'all 0.3s ease',
      border: 'none',
      fontSize: '1rem',
      marginTop: '1rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    title: {
      color: '#030303',
      fontWeight: 'bold',
      fontSize: '1.5rem',
      marginBottom: '0.5rem',
      textAlign: 'center'
    },
    subtitle: {
      color: '#123458',
      textAlign: 'center',
      fontStyle: 'italic',
      marginBottom: '2rem'
    },
    footer: {
      color: '#030303',
      fontSize: '0.75rem',
      marginTop: '1.5rem',
      textAlign: 'center',
      opacity: '0.7'
    },
    radioOuter: (isSelected) => ({
      width: '1.25rem',
      height: '1.25rem',
      borderRadius: '50%',
      border: `2px solid ${isSelected ? '#123458' : '#D4C9BE'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }),
    radioInner: {
      width: '0.75rem',
      height: '0.75rem',
      borderRadius: '50%',
      backgroundColor: '#123458'
    },
    candidateName: {
      fontWeight: '500',
      color: '#030303'
    },
    candidatePosition: {
      fontSize: '0.875rem',
      color: '#123458',
      opacity: '0.7'
    },
    successIcon: {
      width: '5rem',
      height: '5rem',
      color: '#123458',
      margin: '0 auto 1rem auto'
    },
    errorMessage: {
      color: '#e53e3e',
      textAlign: 'center',
      margin: '1rem 0',
      fontWeight: '500'
    }
  };

  // Show loading state
  if (contextLoading || !election) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.content}>
            <div style={{textAlign: 'center', padding: '1rem 0'}}>
              <div style={{width: '2rem', height: '2rem', borderRadius: '50%', border: '3px solid #123458', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto'}}></div>
              <p>Loading election data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.content}>
            <div style={{textAlign: 'center', padding: '1rem 0'}}>
              <svg style={{...styles.successIcon, color: '#e53e3e'}} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <h3 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#e53e3e', marginBottom: '0.5rem'}}>Error</h3>
              <p style={{color: '#030303', opacity: '0.8'}}>{error}</p>
              <button 
                style={{...styles.button, marginTop: '1.5rem'}} 
                onClick={() => navigate('/elections')}
              >
                Back to Elections
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div style={styles.container}>
      <div style={styles.title}>
        <span style={{color: '#123458', marginRight: '0.5rem'}}>🏆</span>
        {election.title}
      </div>
      <div style={styles.subtitle}>
        {election.description}
      </div>
      
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold'}}>
            <CheckCircle2 style={{marginRight: '0.5rem'}} /> 
            Cast Your Vote
          </div>
        </div>
        
        <div style={styles.content}>
          {voted ? (
            <div style={{textAlign: 'center', padding: '1rem 0'}}>
              <svg style={styles.successIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#123458', marginBottom: '0.5rem'}}>Vote Recorded!</h3>
              <p style={{color: '#030303', opacity: '0.8'}}>Thank you for participating in this election.</p>
              <button 
                style={{...styles.button, marginTop: '1.5rem'}} 
                onClick={() => navigate('/elections')}
              >
                Back to Elections
              </button>
            </div>
          ) : (
            <div>
              <div style={{fontWeight: '600', marginBottom: '0.75rem', color: '#030303'}}>Select a candidate:</div>
              <div>
                {election.candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    style={styles.candidateBox(selectedCandidate === candidate.id)}
                    onClick={() => setSelectedCandidate(candidate.id)}
                  >
                    <div>
                      <div style={styles.radioOuter(selectedCandidate === candidate.id)}>
                        {selectedCandidate === candidate.id && (
                          <div style={styles.radioInner}></div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div style={styles.candidateName}>{candidate.name}</div>
                      <div style={styles.candidatePosition}>{candidate.position}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                style={styles.button}
                onClick={handleVote}
                disabled={loading || !selectedCandidate}
              >
                {loading ? (
                  <>
                    <div style={{width: '1rem', height: '1rem', borderRadius: '50%', border: '2px solid white', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', marginRight: '0.5rem'}}></div>
                    Recording Vote...
                  </>
                ) : (
                  'Submit Vote'
                )}
              </button>
              
              {selectedCandidate && (
                <div style={{textAlign: 'center', fontSize: '0.875rem', marginTop: '0.75rem', color: '#123458'}}>
                  You're voting for: <span style={{fontWeight: '600'}}>{election.candidates.find(c => c.id === selectedCandidate)?.name}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={styles.footer}>
        Electra Voting System • Secure • Transparent • Reliable
      </div>
    </div>
  );
};

export default ElectionVote;