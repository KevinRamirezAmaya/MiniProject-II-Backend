import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

/**
 * Interface to extend Express Request with user information
 */
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

/**
 * Middleware to verify JWT tokens and authenticate requests
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authentication required. No token provided.' });
      return;
    }
    
    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ message: 'Authentication required. Invalid token format.' });
      return;
    }
    
    // Verify token using secret key
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      console.error('JWT_SECRET not defined in environment variables');
      res.status(500).json({ message: 'Internal server error. Authentication configuration missing.' });
      return;
    }
    
    try {
      // Verify and decode token
      const decoded = jwt.verify(token, jwtSecret) as { userId: string; email: string };
      
      // Add user data to request
      req.user = {
        userId: decoded.userId,
        email: decoded.email
      };
      
      next(); // Proceed to the next middleware/controller
      
    } catch (tokenError) {
      console.error('Token verification failed:', tokenError);
      res.status(401).json({ message: 'Authentication failed. Invalid or expired token.' });
    }
    
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({ message: 'Internal server error during authentication.' });
  }
};

/**
 * Middleware to check if the authenticated user is trying to modify their own data
 * Use this for routes like PUT /users/:id or DELETE /users/:id
 * 
 * @param req - Express request object (with user added by authenticate middleware)
 * @param res - Express response object
 * @param next - Express next function
 */
export const isOwnAccount = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }
    
    const requestedUserId = req.params.id;
    const authenticatedUserId = req.user.userId;
    
    // Check if the authenticated user is trying to modify their own data
    if (requestedUserId !== authenticatedUserId) {
      res.status(403).json({ 
        message: 'Access forbidden. You can only modify your own account information.' 
      });
      return;
    }
    
    next(); // User is modifying their own data, proceed
    
  } catch (error) {
    console.error('Account ownership verification error:', error);
    res.status(500).json({ message: 'Internal server error during authorization check.' });
  }
};