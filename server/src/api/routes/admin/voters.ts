import { Router, Request, Response } from 'express';
import { getElections } from '../../../services';
import { IElection } from '../../../models/Election';

const router = Router();

// In-memory store for voters (would be a database in production)
interface Voter {
  id: string;
  name: string;
  email: string;
  hasVoted: boolean;
  electionId?: string;
}

const voters: Voter[] = [
  {
    id: "voter-1",
    name: "John Smith",
    email: "john@example.com",
    hasVoted: false
  },
  {
    id: "voter-2",
    name: "Jane Doe",
    email: "jane@example.com",
    hasVoted: true,
    electionId: "election-1"
  },
  {
    id: "voter-3",
    name: "Kanav Kumar",
    email: "kumarkanav5753@gmail.com",
    hasVoted: false
  }
];

// Helper function to update voter status based on election data
const syncVoterStatus = async (): Promise<void> => {
  try {
    const elections = await getElections();
    
    // Check each election's voters list and update the corresponding voter's hasVoted status
    elections.forEach((election: IElection) => {
      if (election.voters && Array.isArray(election.voters)) {
        election.voters.forEach((voterId: string) => {
          const voterIndex = voters.findIndex(v => v.id === voterId);
          if (voterIndex !== -1) {
            voters[voterIndex].hasVoted = true;
            voters[voterIndex].electionId = election.id;
          }
        });
      }
    });
  } catch (error) {
    console.error('Error syncing voter status:', error);
  }
};

/**
 * @route   GET /api/admin/voters
 * @desc    Get all voters
 * @access  Admin
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    // Sync voter status with election data before returning
    await syncVoterStatus();
    return res.json(voters);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   GET /api/admin/voters/:id
 * @desc    Get voter by ID
 * @access  Admin
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    // Sync voter status with election data before returning
    await syncVoterStatus();
    
    const voter = voters.find(v => v.id === req.params.id);
    
    if (!voter) {
      return res.status(404).json({ message: 'Voter not found' });
    }
    
    return res.json(voter);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/admin/voters
 * @desc    Create a new voter
 * @access  Admin
 */
router.post('/', (req: Request, res: Response) => {
  try {
    console.log('POST /admin/voters request body:', req.body);
    
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ 
        message: 'Name and email are required',
        received: { name, email },
        body: req.body 
      });
    }
    
    // Check if voter already exists
    const existingVoter = voters.find(v => v.email === email);
    if (existingVoter) {
      // If voter exists, just return it instead of an error
      return res.json(existingVoter);
    }
    
    const newVoter: Voter = {
      id: `voter-${Math.random().toString(36).substring(2, 9)}`,
      name,
      email,
      hasVoted: false
    };
    
    voters.push(newVoter);
    
    return res.status(201).json(newVoter);
  } catch (error) {
    console.error('Error in POST /admin/voters:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   PUT /api/admin/voters/:id
 * @desc    Update voter
 * @access  Admin
 */
router.put('/:id', (req: Request, res: Response) => {
  const { name, email, hasVoted, electionId } = req.body;
  const voterIndex = voters.findIndex(v => v.id === req.params.id);
  
  if (voterIndex === -1) {
    return res.status(404).json({ message: 'Voter not found' });
  }
  
  // Update voter
  voters[voterIndex] = {
    ...voters[voterIndex],
    name: name || voters[voterIndex].name,
    email: email || voters[voterIndex].email,
    hasVoted: hasVoted !== undefined ? hasVoted : voters[voterIndex].hasVoted,
    electionId: electionId || voters[voterIndex].electionId
  };
  
  return res.json(voters[voterIndex]);
});

/**
 * @route   DELETE /api/admin/voters/:id
 * @desc    Delete voter
 * @access  Admin
 */
router.delete('/:id', (req: Request, res: Response) => {
  const voterIndex = voters.findIndex(v => v.id === req.params.id);
  
  if (voterIndex === -1) {
    return res.status(404).json({ message: 'Voter not found' });
  }
  
  voters.splice(voterIndex, 1);
  
  return res.json({ message: 'Voter deleted successfully' });
});

export default router; 