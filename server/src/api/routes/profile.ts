import { Router, Response } from 'express';
import { authenticateUser, AuthenticatedRequest } from '../../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

/**
 * @route   GET /api/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  try {
    // User ID is available from the auth middleware
    const userId = req.user?.id;
    
    // In a real implementation, fetch user details from database
    // For demo, return mock user data based on user role
    if (req.user?.role === 'admin') {
      return res.json({
        id: userId,
        name: 'Admin User',
        email: req.user.email,
        role: req.user.role,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
        isActive: true
      });
    } else {
      return res.json({
        id: userId,
        name: 'John Voter',
        email: req.user?.email,
        role: req.user?.role,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
        isActive: true,
        voterId: 'V12345',
        elections: {
          eligible: 3,
          voted: 1,
          upcoming: 1
        }
      });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   PUT /api/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email } = req.body;
    
    // Validate request
    if (!name && !email) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    // In a real implementation, update user in database
    
    // Return updated profile
    return res.json({
      id: req.user?.id,
      name: name || 'Updated User',
      email: email || req.user?.email,
      role: req.user?.role,
      updatedAt: new Date()
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   PUT /api/profile/password
 * @desc    Change password
 * @access  Private
 */
router.put('/password', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validate request
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    // In a real implementation, verify current password and update in database
    
    // For demo, return success
    return res.json({
      message: 'Password updated successfully'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   GET /api/profile/activity
 * @desc    Get user activity log
 * @access  Private
 */
router.get('/activity', (req: AuthenticatedRequest, res: Response) => {
  try {
    // In a real implementation, fetch user activity from database
    
    // For demo, return mock activity data
    return res.json({
      activities: [
        {
          id: '1',
          type: 'login',
          description: 'User logged in',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          ipAddress: '192.168.1.1'
        },
        {
          id: '2',
          type: 'vote',
          description: 'Voted in Community Council Election',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          ipAddress: '192.168.1.1'
        },
        {
          id: '3',
          type: 'profile_update',
          description: 'Updated profile information',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          ipAddress: '192.168.1.2'
        }
      ]
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   GET /api/profile/notifications
 * @desc    Get user notifications
 * @access  Private
 */
router.get('/notifications', (req: AuthenticatedRequest, res: Response) => {
  try {
    // In a real implementation, fetch user notifications from database
    
    // For demo, return mock notification data
    return res.json({
      notifications: [
        {
          id: '1',
          type: 'election_reminder',
          message: 'Community Council Election is now active',
          isRead: false,
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000)
        },
        {
          id: '2',
          type: 'vote_confirmation',
          message: 'Your vote was recorded successfully',
          isRead: true,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: '3',
          type: 'new_election',
          message: 'You are eligible to vote in School Board Members election',
          isRead: true,
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        }
      ]
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   PUT /api/profile/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.put('/notifications/:id/read', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // In a real implementation, update notification status in database
    
    // For demo, return success
    return res.json({
      message: 'Notification marked as read',
      notificationId: id
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

export default router; 