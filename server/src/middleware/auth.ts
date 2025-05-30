import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../types/user';

// Interfaces for request with user
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

// JWT secret - should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'electra-secret-key';

// Set to true to disable auth for development
const DISABLE_AUTH_FOR_DEV = true;

/**
 * Middleware to verify if the user is authenticated
 */
export const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Skip authentication in development mode
  if (DISABLE_AUTH_FOR_DEV) {
    console.log('⚠️ Authentication disabled for development');
    // Set a default admin user
    req.user = {
      id: 'admin-user-id',
      email: 'admin@example.com',
      role: UserRole.ADMIN
    };
    next();
    return;
  }

  try {
    // Get the token from headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: UserRole;
    };
    
    // Add user info to request object
    req.user = decoded;
    next();
    return;
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Middleware to verify if the user is an admin
 */
export const authorizeAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Skip authorization in development mode
  if (DISABLE_AUTH_FOR_DEV) {
    next();
    return;
  }

  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role !== UserRole.ADMIN) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
  return;
};

/**
 * Middleware to check voter eligibility for a specific election
 */
export const checkVoterEligibility = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Skip eligibility check in development mode
  if (DISABLE_AUTH_FOR_DEV) {
    next();
    return;
  }

  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role !== UserRole.VOTER) {
    return res.status(403).json({ message: 'Voter access required' });
  }

  // In a real implementation, we would check if the voter is eligible for the election
  // This would involve database queries to check if the voter is registered for the election
  // For now, we'll just pass the request to the next middleware
  
  next();
  return;
}; 