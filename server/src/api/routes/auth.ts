import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../../types/user';

interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  voterId?: string;
  registrationVerified?: boolean;
}

const router = Router();

// Secret key for JWT signing - in production, use environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'electra-secret-key';
const TOKEN_EXPIRY = '24h';

// Store registered users in memory for demo
// In a real app, this would be a database
// Need to make this persist between server restarts for the demo
let registeredUsers: RegisteredUser[] = [
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

// Save registered users to the file system
const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, '../../../data/users.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load registered users from file if it exists
try {
  if (fs.existsSync(usersFilePath)) {
    const userData = fs.readFileSync(usersFilePath, 'utf8');
    const parsedUsers = JSON.parse(userData);
    
    // Convert string dates back to Date objects
    parsedUsers.forEach((user: any) => {
      user.createdAt = new Date(user.createdAt);
      user.updatedAt = new Date(user.updatedAt);
    });
    
    // Merge with default users, keeping existing users
    const existingEmails = new Set(parsedUsers.map((u: RegisteredUser) => u.email));
    const defaultUsers = registeredUsers.filter(u => !existingEmails.has(u.email));
    registeredUsers = [...parsedUsers, ...defaultUsers];
    
    console.log(`Loaded ${registeredUsers.length} users from storage`);
  } else {
    // Save initial users
    saveUsers();
    console.log('Created initial users file');
  }
} catch (error) {
  console.error('Error loading users:', error);
}

// Function to save users to file
function saveUsers() {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(registeredUsers, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
}

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
    
    // Save updated users to file
    saveUsers();
    
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
    const { email, voterId } = req.body;

    // Check what type of request this is (admin/voter password or voter access code)
    if (email) {
      // Handle admin/user password reset request
      const user = registeredUsers.find(u => u.email === email);
      
      if (user) {
        // Generate a reset token (in a real app this would be a JWT or a random string)
        const resetToken = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '1h' });
        
        // In a real app, send an email with the reset link containing the token
        console.log(`Password reset requested for ${email}. Token: ${resetToken}`);
      }
      
      // For security reasons, always return success even if email doesn't exist
      return res.json({
        message: 'If your email is registered, a password reset link has been sent to your email'
      });
    } else if (voterId) {
      // Handle voter access code reset request
      const voter = registeredUsers.find(u => 
        u.role === UserRole.VOTER && 
        (u.voterId === voterId || u.email === voterId)
      );
      
      if (voter) {
        // Generate a reset token
        const resetToken = jwt.sign({ id: voter.id, voterId }, JWT_SECRET, { expiresIn: '1h' });
        
        // In a real app, send an email with the reset link containing the token
        console.log(`Access code reset requested for voter ${voterId}. Token: ${resetToken}`);
      }
      
      // For security reasons, always return success
      return res.json({
        message: 'If your Voter ID is registered, instructions to reset your access code have been sent'
      });
    } else {
      return res.status(400).json({ message: 'Email or Voter ID is required' });
    }
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
    const { token } = req.params;
    const { password } = req.body;

    // Validate request
    if (!password) {
      return res.status(400).json({ message: 'New password is required' });
    }

    // Verify the token
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string, email?: string, voterId?: string };
      
      // Find the user
      const userIndex = registeredUsers.findIndex(u => u.id === decoded.id);
      
      if (userIndex === -1) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
      
      // Update the password
      registeredUsers[userIndex].password = password;
      
      // Save users to file
      saveUsers();
      
      return res.json({
        message: 'Password has been reset successfully'
      });
    } catch (error) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/auth/reset-access-code/:token
 * @desc    Reset voter access code with token
 * @access  Public
 */
router.post('/reset-access-code/:token', (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { accessCode } = req.body;

    // Validate request
    if (!accessCode) {
      return res.status(400).json({ message: 'New access code is required' });
    }

    // Verify the token
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string, voterId?: string };
      
      // Find the voter
      const voterIndex = registeredUsers.findIndex(u => 
        u.id === decoded.id && u.role === UserRole.VOTER
      );
      
      if (voterIndex === -1) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
      
      // Update the access code (in a real app, this might be stored differently)
      // Here we're using the password field for simplicity
      registeredUsers[voterIndex].password = accessCode;
      
      // Save users to file
      saveUsers();
      
      return res.json({
        message: 'Access code has been reset successfully'
      });
    } catch (error) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
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