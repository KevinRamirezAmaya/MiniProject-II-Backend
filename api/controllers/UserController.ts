import GlobalController from './GlobalController';
import UserDAO from '../dao/UserDAO';
import { IUser } from '../models/User';
import { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import PasswordResetToken from '../models/PasswordResetToken';
import EmailService from '../services/EmailService';
import User from '../models/User';

/**
 * Controller class for managing User resources.
 * 
 * Extends the generic {@link GlobalController} to inherit
 * CRUD operations, using the {@link UserDAO} as the data access layer.
 * Adds password recovery functionality.
 */
class UserController extends GlobalController<IUser> {
    /**
     * Create a new UserController instance.
     * 
     * The constructor passes the UserDAO to the parent class so that
     * all inherited methods (create, read, update, delete, getAll)
     * operate on the User model.
     */
    constructor() {
        super(UserDAO);
    }
    
    /**
     * Request a password reset for a user account
     * 
     * @param req - Express request with user's email
     * @param res - Express response
     */
    async requestPasswordReset(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            
            // Validate email was provided
            if (!email) {
                res.status(400).json({ message: 'Email address is required' });
                return;
            }
            
            // Find user by email
            const user = await User.findOne({ email });
            
            // For security, don't reveal if the user exists or not
            if (!user) {
                res.status(200).json({ 
                    message: 'If your email is registered, you will receive instructions to reset your password' 
                });
                return;
            }
            
            // Generate a unique token
            const token = crypto.randomBytes(32).toString('hex');
            
            // Save token to database
            await PasswordResetToken.create({
                userId: user._id,
                token,
                expiresAt: new Date(Date.now() + 3600000) // 1 hour expiry
            });
            
            // Generate password reset link
            const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${token}`;
            
            // Send email with reset link
            const emailSent = await EmailService.sendPasswordResetEmail(
                user.email,
                resetLink,
                user.firstName
            );
            
            if (!emailSent) {
                res.status(500).json({ message: 'Failed to send password reset email' });
                return;
            }
            
            res.status(200).json({ 
                message: 'If your email is registered, you will receive instructions to reset your password' 
            });
            
        } catch (error: any) {
            console.error('Password reset request error:', error);
            res.status(500).json({ message: 'An error occurred during password reset request' });
        }
    }
    
    /**
     * Reset a user's password using a valid token
     * 
     * @param req - Express request with token and new password
     * @param res - Express response
     */
    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { token, newPassword } = req.body;
            
            // Validate input
            if (!token || !newPassword) {
                res.status(400).json({ message: 'Token and new password are required' });
                return;
            }
            
            // Find valid token
            const resetToken = await PasswordResetToken.findOne({
                token,
                used: false,
                expiresAt: { $gt: new Date() }
            });
            
            if (!resetToken) {
                res.status(400).json({ message: 'Invalid or expired password reset token' });
                return;
            }
            
            // Find user
            const user = await User.findById(resetToken.userId);
            
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            
            // Update password (will be hashed by pre-save hook)
            user.password = newPassword;
            await user.save();
            
            // Mark token as used
            resetToken.used = true;
            await resetToken.save();
            
            res.status(200).json({ message: 'Password has been reset successfully' });
            
        } catch (error: any) {
            console.error('Password reset error:', error);
            
            // Handle validation errors specifically
            if (error.name === 'ValidationError') {
                res.status(400).json({ 
                    message: 'Password does not meet requirements',
                    details: error.message
                });
                return;
            }
            
            res.status(500).json({ message: 'An error occurred during password reset' });
        }
    }
    
    /**
     * Authenticate a user and generate a JWT token
     * 
     * @param req - Express request with email and password
     * @param res - Express response
     */
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            
            // Validate input
            if (!email || !password) {
                res.status(400).json({ message: 'Email and password are required' });
                return;
            }
            
            // Find user by email
            const user = await User.findOne({ email });
            
            if (!user) {
                res.status(401).json({ message: 'Invalid email or password' });
                return;
            }
            
            // Verify password
            const isPasswordValid = await user.comparePassword(password);
            
            if (!isPasswordValid) {
                res.status(401).json({ message: 'Invalid email or password' });
                return;
            }
            
            // Get JWT secret from environment variables
            const jwtSecret = process.env.JWT_SECRET;
            
            if (!jwtSecret) {
                console.error('JWT_SECRET not defined in environment variables');
                res.status(500).json({ message: 'Internal server error. Authentication configuration missing.' });
                return;
            }
            
            // Generate token with 10 hours expiration (36000 seconds)
            const token = jwt.sign(
                { 
                    userId: user._id,
                    email: user.email
                },
                jwtSecret,
                { expiresIn: '10h' }
            );
            
            // Return user info and token
            res.status(200).json({
                message: 'Authentication successful',
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                },
                token,
                expiresIn: 36000 // seconds (10 hours)
            });
            
        } catch (error: any) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'An error occurred during authentication' });
        }
    }
}

/**
 * Export a singleton instance of UserController.
 * 
 * This allows the same controller to be reused across routes
 * without creating multiple instances.
 */
export default new UserController();