import { Router } from 'express';
import { authenticateUser, checkVoterEligibility, AuthenticatedRequest } from '../../../middleware/auth';
import { Response } from 'express';
import { ElectionStatus } from '../../../types/election';
import { getElections, updateElection } from '../../../services';

const router = Router();

// Middleware that applies to all routes in this router
router.use(authenticateUser);

/**
 * @route   GET /api/voter/elections
 * @desc    Get all elections a voter is eligible for
 * @access  Voter only
 */
router.get('/', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    // Get all elections (now includes mock elections if enabled)
    const allElections = getElections();
    
    res.json(allElections);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   GET /api/voter/elections/:id
 * @desc    Get details of a specific election
 * @access  Voter only
 */
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const electionId = req.params.id;
    
    // Mock response
    const election = {
      id: electionId,
      title: 'Community Council Election',
      description: 'Election for new community council members',
      startDate: new Date(Date.now() - 86400000), // 1 day ago
      endDate: new Date(Date.now() + 4 * 86400000), // 4 days from now
      status: ElectionStatus.ACTIVE,
      hasVoted: false,
      candidates: [
        {
          id: '1',
          name: 'John Doe',
          description: 'Community activist with 10 years of experience',
          position: 'President',
          imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        {
          id: '2',
          name: 'Jane Smith',
          description: 'Local business owner focused on community development',
          position: 'Secretary',
          imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg'
        },
        {
          id: '3',
          name: 'Bob Johnson',
          description: 'Retired teacher passionate about education',
          position: 'Treasurer',
          imageUrl: 'https://randomuser.me/api/portraits/men/3.jpg'
        }
      ]
    };
    
    // In a real implementation, check if voter is eligible for this election
    res.json(election);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/voter/elections/:id/vote
 * @desc    Cast a vote in an election
 * @access  Voter only
 */
router.post('/:id/vote', checkVoterEligibility, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const electionId = req.params.id;
    const { candidateId } = req.body;
    const userId = req.user?.id;
    
    // Validate required fields
    if (!candidateId) {
      return res.status(400).json({ message: 'Candidate ID is required' });
    }
    
    // Get the election from the service
    const election = getElections().find(e => e.id === electionId);
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    
    // Check if election is active
    if (election.status !== ElectionStatus.ACTIVE) {
      return res.status(400).json({ message: `Cannot vote in an election with status: ${election.status}` });
    }
    
    // Initialize voters array if it doesn't exist
    if (!election.voters) {
      election.voters = [];
    }
    
    // Check if user has already voted
    if (election.voters.includes(userId)) {
      return res.status(400).json({ message: 'You have already voted in this election' });
    }
    
    // Find the candidate
    const candidateIndex = election.candidates.findIndex((c: any) => c.id === candidateId);
    if (candidateIndex === -1) {
      return res.status(404).json({ message: 'Candidate not found in this election' });
    }
    
    // Increment the candidate's vote count
    election.candidates[candidateIndex].votes += 1;
    
    // Increment the total votes for the election
    election.totalVotes += 1;
    
    // Add user to the list of voters for this election
    election.voters.push(userId);
    
    // Update the election
    updateElection(electionId, {
      candidates: election.candidates,
      totalVotes: election.totalVotes,
      voters: election.voters
    });
    
    // Mock response
    res.status(201).json({
      message: 'Vote cast successfully',
      vote: {
        electionId,
        candidateId,
        timestamp: new Date()
      }
    });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
    return;
  }
});

/**
 * @route   GET /api/voter/elections/:id/receipt
 * @desc    Get a vote receipt/confirmation
 * @access  Voter only
 */
router.get('/:id/receipt', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const electionId = req.params.id;
    
    // In a real implementation, check if voter has voted in this election
    const hasVoted = true;
    if (!hasVoted) {
      return res.status(400).json({ message: 'You have not voted in this election' });
    }
    
    // Mock response
    const receipt = {
      electionId,
      electionTitle: 'Community Council Election',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      receiptId: `VOTE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      confirmed: true
    };
    
    res.json(receipt);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
    return;
  }
});

/**
 * @route   GET /api/voter/elections/:id/results
 * @desc    Get results of a completed election
 * @access  Voter only
 */
router.get('/:id/results', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const electionId = req.params.id;
    
    // Mock response
    const results = {
      electionId,
      electionTitle: 'Community Council Election',
      status: ElectionStatus.COMPLETED,
      totalVotes: 128,
      participationRate: 78.5, // percentage
      candidates: [
        {
          id: '1',
          name: 'John Doe',
          position: 'President',
          votes: 42,
          percentage: 32.8
        },
        {
          id: '2',
          name: 'Jane Smith',
          position: 'Secretary',
          votes: 38,
          percentage: 29.7
        },
        {
          id: '3',
          name: 'Bob Johnson',
          position: 'Treasurer',
          votes: 48,
          percentage: 37.5
        }
      ],
      winner: {
        id: '3',
        name: 'Bob Johnson',
        position: 'Treasurer',
        votes: 48,
        percentage: 37.5
      }
    };
    
    // In a real implementation, check if:
    // 1. Election is completed
    // 2. Results are published
    // 3. Voter is eligible to view results
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   GET /api/voter/history
 * @desc    Get voter's voting history
 * @access  Voter only
 */
router.get('/history/votes', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    // Mock response
    const history = [
      {
        electionId: '3',
        electionTitle: 'Budget Committee',
        votedAt: new Date(Date.now() - 15 * 86400000), // 15 days ago
        status: ElectionStatus.COMPLETED,
        receiptId: 'VOTE-ABC123XYZ',
        resultsAvailable: true
      },
      {
        electionId: '4',
        electionTitle: 'Library Board',
        votedAt: new Date(Date.now() - 45 * 86400000), // 45 days ago
        status: ElectionStatus.COMPLETED,
        receiptId: 'VOTE-DEF456UVW',
        resultsAvailable: true
      }
    ];
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   GET /api/voter/eligible
 * @desc    Get a count of elections the voter is eligible for
 * @access  Voter only
 */
router.get('/status/eligible', async (_req: AuthenticatedRequest, res: Response) => {
  try {
    // Mock response
    const stats = {
      activeElections: 1,
      upcomingElections: 1,
      pendingVotes: 1, // Active elections where the voter hasn't voted yet
      completedElections: 2,
      totalVotesCast: 2
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router; 