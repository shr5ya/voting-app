import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../../types/user';

const router = Router();

// JWT secret - should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'electra-secret-key';
const TOKEN_EXPIRY = '24h';

// In-memory store for registered users (would be a database in production)
interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  registrationVerified?: boolean;
  voterId?: string;
}

const registeredUsers: RegisteredUser[] = [
  {
    id: 'admin-user-id',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: UserRole.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  },
  {
    id: 'voter-user-id',
    name: 'John Voter',
    email: 'voter@example.com',
    password: 'voter123',
    role: UserRole.VOTER,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    voterId: 'V12345'
  }
];

/**
 * @route   POST /api/auth/login
 * @desc    Login as admin or regular user
 * @access  Public
 */
router.post('/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user in our registered users
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
      );

      // Create a user response object without the password
      const { password: _, ...userResponse } = user;

      return res.json({
        token,
        expiresIn: 24 * 60 * 60, // 24 hours in seconds
        user: userResponse
      });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validate request
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    if (registeredUsers.some(user => user.email === email)) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Create new user
    const newUser: RegisteredUser = {
      id: `user-${Math.random().toString(36).substring(2, 9)}`,
      name,
      email,
      password,
      role: UserRole.VOTER,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      registrationVerified: false
    };
    
    // Add to our in-memory store
    registeredUsers.push(newUser);
    
    // Create a user response object without the password
    const { password: _, ...userResponse } = newUser;
    
    // For demo, return success
    return res.status(201).json({
      message: 'User registered successfully',
      user: userResponse
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/auth/voter/login
 * @desc    Login as a voter using voter ID and access code
 * @access  Public
 */
router.post('/voter/login', (req: Request, res: Response) => {
  try {
    const { voterId, accessCode } = req.body;

    // Validate request
    if (!voterId || !accessCode) {
      return res.status(400).json({ message: 'Voter ID and access code are required' });
    }

    // In a real implementation, verify voter credentials from database
    // Mock voter login for demo
    if (voterId === 'V12345' && accessCode === '123456') {
      const token = jwt.sign(
        { id: 'voter-user-id', email: 'voter@example.com', role: UserRole.VOTER },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
      );

      return res.json({
        token,
        expiresIn: 24 * 60 * 60, // 24 hours in seconds
        user: {
          id: 'voter-user-id',
          name: 'John Voter',
          email: 'voter@example.com',
          role: UserRole.VOTER,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          voterId: 'V12345'
        }
      });
    }

    return res.status(401).json({ message: 'Invalid voter credentials' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   GET /api/auth/verify/:token
 * @desc    Verify email with token
 * @access  Public
 */
router.get('/verify/:token', (req: Request, res: Response) => {
  try {
    const { token: _token } = req.params;

    // In a real implementation, verify the token and update user status in database
    
    // For demo, return success
    return res.json({
      message: 'Email verified successfully'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset link
 * @access  Public
 */
router.post('/forgot-password', (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Validate request
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // In a real implementation, generate reset token and send email
    
    // For demo, return success
    return res.json({
      message: 'Password reset link sent to your email'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password/:token', (req: Request, res: Response) => {
  try {
    const { token: _token } = req.params;
    const { password } = req.body;

    // Validate request
    if (!password) {
      return res.status(400).json({ message: 'New password is required' });
    }

    // In a real implementation, verify token and update password in database
    
    // For demo, return success
    return res.json({
      message: 'Password reset successful'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   GET /api/auth/debug/users
 * @desc    Get all registered users (for debugging only, would not exist in production)
 * @access  Public
 */
router.get('/debug/users', (_req: Request, res: Response) => {
  // Create a safe list of users without passwords
  const safeUsers = registeredUsers.map(user => {
    const { password, ...safeUser } = user;
    return safeUser;
  });
  
  return res.json({
    message: 'Registered users',
    users: safeUsers
  });
});

export default router; 