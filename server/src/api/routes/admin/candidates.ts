import { Router } from 'express';
import { authenticateUser, authorizeAdmin, AuthenticatedRequest } from '../../../middleware/auth';
import { Response } from 'express';

const router = Router();

// Middleware that applies to all routes in this router
router.use(authenticateUser, authorizeAdmin);

/**
 * @route   GET /api/admin/elections/:electionId/candidates
 * @desc    Get all candidates for an election
 * @access  Admin only
 */
router.get('/:electionId/candidates', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const electionId = req.params.electionId;
    
    // Mock response
    const candidates = [
      {
        id: '1',
        electionId,
        name: 'John Doe',
        description: 'Experienced board member',
        position: 'Chairman',
        imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
        voteCount: 12,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        electionId,
        name: 'Jane Smith',
        description: 'Financial expert with 10 years experience',
        position: 'Treasurer',
        imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
        voteCount: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // In a real implementation, fetch from database
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   GET /api/admin/elections/:electionId/candidates/:id
 * @desc    Get a single candidate by ID
 * @access  Admin only
 */
router.get('/:electionId/candidates/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const electionId = req.params.electionId;
    const candidateId = req.params.id;
    
    // Mock response
    const candidate = {
      id: candidateId,
      electionId,
      name: 'John Doe',
      description: 'Experienced board member',
      position: 'Chairman',
      imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
      voteCount: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // In a real implementation, check if candidate exists
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/admin/elections/:electionId/candidates
 * @desc    Create a new candidate for an election
 * @access  Admin only
 */
router.post('/:electionId/candidates', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const electionId = req.params.electionId;
    const { name, description, position, imageUrl } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    // Mock response
    const newCandidate = {
      id: Math.random().toString(36).substring(2, 9),
      electionId,
      name,
      description,
      position,
      imageUrl,
      voteCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // In a real implementation, save to database
    res.status(201).json(newCandidate);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   PUT /api/admin/elections/:electionId/candidates/:id
 * @desc    Update an existing candidate
 * @access  Admin only
 */
router.put('/:electionId/candidates/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const electionId = req.params.electionId;
    const candidateId = req.params.id;
    const { name, description, position, imageUrl } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    // Mock response
    const updatedCandidate = {
      id: candidateId,
      electionId,
      name,
      description,
      position,
      imageUrl,
      voteCount: 12, // Existing vote count remains unchanged
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // In a real implementation, update in database
    res.json(updatedCandidate);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   DELETE /api/admin/elections/:electionId/candidates/:id
 * @desc    Delete a candidate
 * @access  Admin only
 */
router.delete('/:electionId/candidates/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const electionId = req.params.electionId;
    const candidateId = req.params.id;
    
    // In a real implementation, check if election is in a state where candidates can be deleted
    
    // Mock response
    res.json({ 
      message: `Candidate ${candidateId} deleted successfully from election ${electionId}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/admin/elections/:electionId/candidates/reorder
 * @desc    Reorder candidates (set display order)
 * @access  Admin only
 */
router.post('/:electionId/candidates/reorder', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const electionId = req.params.electionId;
    const { candidateOrder } = req.body;
    
    // Validate candidateOrder is an array of IDs
    if (!Array.isArray(candidateOrder)) {
      return res.status(400).json({ message: 'candidateOrder must be an array of candidate IDs' });
    }
    
    // Mock response
    res.json({ 
      message: `Candidates for election ${electionId} reordered successfully`,
      order: candidateOrder
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/admin/elections/:electionId/candidates/bulk
 * @desc    Bulk create candidates
 * @access  Admin only
 */
router.post('/:electionId/candidates/bulk', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const electionId = req.params.electionId;
    const { candidates } = req.body;
    
    // Validate candidates is an array
    if (!Array.isArray(candidates)) {
      return res.status(400).json({ message: 'candidates must be an array' });
    }
    
    // Validate each candidate has a name
    for (const candidate of candidates) {
      if (!candidate.name) {
        return res.status(400).json({ message: 'Each candidate must have a name' });
      }
    }
    
    // Mock response with generated IDs
    const createdCandidates = candidates.map(candidate => ({
      id: Math.random().toString(36).substring(2, 9),
      electionId,
      name: candidate.name,
      description: candidate.description || '',
      position: candidate.position || '',
      imageUrl: candidate.imageUrl || '',
      voteCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // In a real implementation, bulk save to database
    res.status(201).json(createdCandidates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router; 