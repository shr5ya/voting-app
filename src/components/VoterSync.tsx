import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useElection } from '@/contexts/ElectionContext';

export default function VoterSync() {
  const { user } = useAuth();
  const { voters, addVoter } = useElection();

  useEffect(() => {
    if (
      user &&
      user.role === 'voter' &&
      !voters.some(v => v.email === user.email)
    ) {
      addVoter({ name: user.name, email: user.email });
    }
  }, [user, voters, addVoter]);

  return null;
} 