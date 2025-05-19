import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useElection } from '@/contexts/ElectionContext';
import { toast } from 'sonner';

export default function ClearDataButton() {
  const handleClearAllData = () => {
    try {
      // Clear localStorage entries
      localStorage.removeItem('elections');
      localStorage.removeItem('voters');
      
      // Reload the page to reset all state
      toast.success('All data cleared successfully! Reloading page...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error('Failed to clear data');
      console.error('Error clearing data:', error);
    }
  };

  return (
    <Button 
      variant="destructive" 
      size="sm" 
      onClick={handleClearAllData}
      className="flex items-center gap-1"
    >
      <Trash2 className="h-4 w-4" />
      Clear All Data
    </Button>
  );
} 