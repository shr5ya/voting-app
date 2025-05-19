import { Router } from 'express';
import { authenticateUser, authorizeAdmin, AuthenticatedRequest } from '../../../middleware/auth';
import { 
  ElectionStatus, 
  CreateElectionRequest, 
  UpdateElectionRequest 
} from '../../../types/election';
import { Response } from 'express';

const router = Router();

// Middleware that applies to all routes in this router
router.use(authenticateUser, authorizeAdmin);

/**
 * @route   GET /api/admin/elections
 * @desc    Get all elections with pagination and filtering
 * @access  Admin only
 */
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as ElectionStatus;
    const searchTerm = req.query.search as string;
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as 'asc' | 'desc' || 'desc';

    // Mock response
    const elections = [
      {
        id: '1',
        title: 'Board Election 2025',
        description: 'Election for new board members',
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-01-20'),
        status: ElectionStatus.UPCOMING,
        createdBy: req.user?.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: true,
        resultsPublished: false,
        voterCount: 120,
        totalVotes: 0
      }
    ];

    // In a real implementation, fetch from database with filters
    res.json({
      data: elections,
      pagination: {
        total: 1,
        page,
        limit,
        pages: Math.ceil(1 / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   GET /api/admin/elections/:id
 * @desc    Get a single election by ID
 * @access  Admin only
 */
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const electionId = req.params.id;
    
    // Mock response
    const election = {
      id: electionId,
      title: 'Board Election 2025',
      description: 'Election for new board members',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-01-20'),
      status: ElectionStatus.UPCOMING,
      createdBy: req.user?.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: true,
      resultsPublished: false,
      voterCount: 120,
      totalVotes: 0,
      candidates: [
        {
          id: '1',
          name: 'John Doe',
          description: 'Experienced board member',
          position: 'Chairman',
          voteCount: 0
        }
      ]
    };
    
    // In a real implementation, check if election exists
    res.json(election);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/admin/elections
 * @desc    Create a new election
 * @access  Admin only
 */
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const electionData: CreateElectionRequest = req.body;
    
    // Validate election dates
    const startDate = new Date(electionData.startDate);
    const endDate = new Date(electionData.endDate);
    
    if (endDate <= startDate) {
      return res.status(400).json({ 
        message: 'End date must be after start date' 
      });
    }
    
    // Mock response
    const newElection = {
      id: Math.random().toString(36).substring(2, 9),
      ...electionData,
      status: ElectionStatus.DRAFT,
      createdBy: req.user?.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      voterCount: 0,
      totalVotes: 0
    };
    
    // In a real implementation, save to database
    res.status(201).json(newElection);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   PUT /api/admin/elections/:id
 * @desc    Update an existing election
 * @access  Admin only
 */
router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const electionId = req.params.id;
    const updateData: UpdateElectionRequest = req.body;
    
    // Mock response
    const updatedElection = {
      id: electionId,
      title: updateData.title || 'Board Election 2025',
      description: updateData.description || 'Election for new board members',
      startDate: updateData.startDate || new Date('2025-01-15'),
      endDate: updateData.endDate || new Date('2025-01-20'),
      status: updateData.status || ElectionStatus.UPCOMING,
      createdBy: req.user?.id,
      updatedBy: req.user?.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: updateData.isPublic !== undefined ? updateData.isPublic : true,
      resultsPublished: updateData.resultsPublished !== undefined ? updateData.resultsPublished : false,
      voterCount: 120,
      totalVotes: 0
    };
    
    // In a real implementation, update in database
    res.json(updatedElection);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   DELETE /api/admin/elections/:id
 * @desc    Delete an election
 * @access  Admin only
 */
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const electionId = req.params.id;
    
    // In a real implementation, perform checks before deletion
    // For example, don't allow deletion of active elections
    
    // Mock response
    res.json({ message: `Election ${electionId} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/admin/elections/:id/publish
 * @desc    Publish election results
 * @access  Admin only
 */
router.post('/:id/publish', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const electionId = req.params.id;
    
    // Mock response
    res.json({ 
      message: `Election ${electionId} results published successfully`,
      resultsPublished: true
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/admin/elections/:id/status
 * @desc    Update election status (activate, complete, cancel)
 * @access  Admin only
 */
router.post('/:id/status', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const electionId = req.params.id;
    const { status } = req.body;
    
    if (!Object.values(ElectionStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid election status' });
    }
    
    // Mock response
    res.json({ 
      message: `Election ${electionId} status updated to ${status}`,
      status
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router; 