import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Edit, 
  UserPlus, 
  Users, 
  Printer, 
  FileDown, 
  Share2,
  BarChart2,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassContainer } from '@/components/ui/glass-components';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminActionBarProps {
  electionId?: string;
  compact?: boolean;
}

const AdminActionBar: React.FC<AdminActionBarProps> = ({ 
  electionId,
  compact = false 
}) => {
  const navigate = useNavigate();
  
  return (
    <GlassContainer
      variant="flat"
      intensity="medium"
      className="w-full p-3 rounded-xl mb-6 bg-primary/5 border border-primary/10"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold text-primary px-2">Admin Actions</h2>
        
        <div className="flex flex-wrap gap-2">
          {/* Visible buttons */}
          <Button 
            variant="default" 
            size={compact ? "sm" : "default"}
            className="bg-primary hover:bg-primary/90 gap-2"
            onClick={() => electionId ? navigate(`/elections/${electionId}/edit`) : navigate('/elections/create')}
          >
            <Edit className="h-4 w-4" />
            <span>{electionId ? 'Edit Election' : 'Create Election'}</span>
          </Button>
          
          {electionId && (
            <>
              <Button 
                variant="default" 
                size={compact ? "sm" : "default"}
                className="bg-primary hover:bg-primary/90 gap-2"
                onClick={() => navigate(`/elections/${electionId}/candidates/add`)}
              >
                <UserPlus className="h-4 w-4" />
                <span>Add Candidate</span>
              </Button>
              
              <Button 
                variant="default" 
                size={compact ? "sm" : "default"}
                className="bg-primary hover:bg-primary/90 gap-2"
                onClick={() => navigate(`/elections/${electionId}/voters`)}
              >
                <Users className="h-4 w-4" />
                <span>Manage Voters</span>
              </Button>
              
              {/* More actions dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="default" 
                    size={compact ? "sm" : "default"}
                    className="bg-primary hover:bg-primary/90 gap-2"
                  >
                    <BarChart2 className="h-4 w-4" /> 
                    <span>Results</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    <span>Print Results</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log('Export data')}>
                    <FileDown className="mr-2 h-4 w-4" />
                    <span>Export Data</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log('Share results')}>
                    <Share2 className="mr-2 h-4 w-4" />
                    <span>Share Results</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </GlassContainer>
  );
};

export default AdminActionBar; 