  import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useElection } from '@/contexts/ElectionContext';

export default function VoterSync() {
  const { user } = useAuth();
  const { addVoterIfNotExists } = useElection();

  useEffect(() => {
    if (user && user.role === 'voter') {
      addVoterIfNotExists({ 
        name: user.name, 
        email: user.email 
      });
    }
  }, [user, addVoterIfNotExists]);

  return null;
} 