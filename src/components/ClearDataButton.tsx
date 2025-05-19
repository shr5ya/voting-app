import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { useElection } from '@/contexts/ElectionContext';
import { toast } from 'sonner';

export default function ClearDataButton() {
  const { clearAllData } = useElection();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearAllData = async () => {
    if (isClearing) return;
    
    try {
      setIsClearing(true);
      
      // Clear localStorage entries
      localStorage.removeItem('elections');
      localStorage.removeItem('voters');
      
      // Call the context method to clear all data
      await clearAllData();
      
    } catch (error) {
      console.error('Error clearing data:', error);
      toast.error('Failed to clear data');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Button 
      variant="destructive" 
      size="sm" 
      onClick={handleClearAllData}
      disabled={isClearing}
      className="flex items-center gap-1"
    >
      {isClearing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
      Clear All Data
    </Button>
  );
} 