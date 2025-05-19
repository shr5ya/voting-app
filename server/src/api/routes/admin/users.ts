import { Router } from 'express';
import { authenticateUser, authorizeAdmin, AuthenticatedRequest } from '../../../middleware/auth';
import { UserRole } from '../../../types/user';
import { Response } from 'express';

const router = Router();

// Middleware that applies to all routes in this router
router.use(authenticateUser, authorizeAdmin);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with pagination and filtering
 * @access  Admin only
 */
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const role = req.query.role as UserRole;
    const searchTerm = req.query.search as string;
    const isActive = req.query.isActive === 'true';
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as 'asc' | 'desc' || 'desc';

    // Mock response
    const users = [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
        isActive: true,
      },
      {
        id: '2',
        name: 'Voter One',
        email: 'voter1@example.com',
        role: UserRole.VOTER,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null,
        isActive: true,
        voterId: 'V001',
      }
    ];

    // Filter users based on query parameters
    let filteredUsers = [...users];
    
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term)
      );
    }
    
    if (req.query.isActive !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.isActive === isActive);
    }

    // In a real implementation, fetch from database with filters
    res.json({
      data: filteredUsers,
      pagination: {
        total: filteredUsers.length,
        page,
        limit,
        pages: Math.ceil(filteredUsers.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get a single user by ID
 * @access  Admin only
 */
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.id;
    
    // Mock response
    const user = {
      id: userId,
      name: 'Voter One',
      email: 'voter1@example.com',
      role: UserRole.VOTER,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null,
      isActive: true,
      voterId: 'V001',
      // Additional voter specific info
      elections: [
        {
          id: '1',
          title: 'Board Election 2025',
          hasVoted: false
        }
      ]
    };
    
    // In a real implementation, check if user exists
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/admin/users
 * @desc    Create a new user (admin or voter)
 * @access  Admin only
 */
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, role, password } = req.body;
    
    // Validate required fields
    if (!name || !email || !role || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if role is valid
    if (![UserRole.ADMIN, UserRole.VOTER].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    // Mock response
    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      registrationVerified: false,
      voterId: role === UserRole.VOTER ? `V${Math.floor(1000 + Math.random() * 9000)}` : undefined
    };
    
    // In a real implementation, save to database
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   PUT /api/admin/users/:id
 * @desc    Update an existing user
 * @access  Admin only
 */
router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.id;
    const { name, email, isActive, role } = req.body;
    
    // Mock response
    const updatedUser = {
      id: userId,
      name: name || 'Voter One',
      email: email || 'voter1@example.com',
      role: role || UserRole.VOTER,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null,
      isActive: isActive !== undefined ? isActive : true,
      voterId: role === UserRole.VOTER ? 'V001' : undefined
    };
    
    // In a real implementation, update in database
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user (or soft delete by deactivating)
 * @access  Admin only
 */
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.id;
    
    // In a real implementation, check if user exists and perform soft delete
    res.json({ message: `User ${userId} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   PATCH /api/admin/users/:id/activate
 * @desc    Activate a user
 * @access  Admin only
 */
router.patch('/:id/activate', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.id;
    
    // In a real implementation, update user status in database
    res.json({ 
      message: `User ${userId} activated successfully`,
      isActive: true
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   PATCH /api/admin/users/:id/deactivate
 * @desc    Deactivate a user
 * @access  Admin only
 */
router.patch('/:id/deactivate', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.id;
    
    // In a real implementation, update user status in database
    res.json({ 
      message: `User ${userId} deactivated successfully`,
      isActive: false
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/admin/users/:id/reset-password
 * @desc    Trigger password reset for a user
 * @access  Admin only
 */
router.post('/:id/reset-password', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.id;
    
    // In a real implementation, generate password reset token and send email
    res.json({ 
      message: `Password reset initiated for user ${userId}. An email has been sent to the user.`
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   GET /api/admin/users/stats
 * @desc    Get user statistics
 * @access  Admin only
 */
router.get('/stats/summary', async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Mock response
    const stats = {
      totalUsers: 125,
      activeUsers: 110,
      adminUsers: 5,
      voterUsers: 120,
      usersRegisteredToday: 3,
      usersRegisteredThisWeek: 12,
      usersRegisteredThisMonth: 28,
      usersLoggedInToday: 45
    };
    
    // In a real implementation, calculate stats from database
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router; 