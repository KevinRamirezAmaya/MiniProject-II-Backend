import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

// Load environment variables
config();

/**
 * Interface to extend Express Request with authenticated user information
 * 
 * @interface AuthRequest
 * @extends {Request}
 */
export interface AuthRequest extends Request {
  /** Authenticated user information extracted from JWT token */
  user?: {
    /** The unique identifier of the authenticated user */
    userId: string;
    /** The email address of the authenticated user */
    email: string;
  };
}

/**
 * Middleware to verify JWT tokens and authenticate requests
 * 
 * Extracts and validates JWT tokens from the Authorization header,
 * adds user information to the request object for authenticated routes.
 * 
 * @function authenticate
 * @param {AuthRequest} req - Express request object (extended with user info)
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function to continue middleware chain
 * @returns {void}
 * 
 * @throws {401} When no token is provided or token format is invalid
 * @throws {401} When JWT token is invalid or expired
 * @throws {500} When JWT_SECRET environment variable is not configured
 * 
 * @example
 * ```typescript
 * // Usage in route
 * router.get('/protected', authenticate, (req: AuthRequest, res) => {
 *   console.log(req.user?.userId); // Access authenticated user ID
 * });
 * ```
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