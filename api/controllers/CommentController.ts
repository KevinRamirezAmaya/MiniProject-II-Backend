import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import CommentDAO from '../dao/CommentDAO';
import mongoose from 'mongoose';

/**
 * Controller for handling comment-related operations.
 * All methods require authentication (AuthRequest instead of Request).
 */
class CommentController {
    
    /**
     * Create a new comment on a film
     * POST /films/:filmId/comments
     * 
     * @param req - AuthRequest object with user info and request body
     * @param res - Response object
     * @returns JSON response with created comment or error
     */
    async create(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { filmId } = req.params;
            const { text } = req.body;
            const userId = req.user?.userId;
            
            if (!userId) {
                res.status(401).json({ 
                    message: 'Authentication required to create a comment' 
                });
                return;
            }
            
            if (!mongoose.Types.ObjectId.isValid(filmId)) {
                res.status(400).json({ 
                    message: 'Invalid film ID format' 
                });
                return;
            }
            
            if (!text || text.trim().length === 0) {
                res.status(400).json({ 
                    message: 'Comment text is required' 
                });
                return;
            }
            
            if (text.length > 1000) {
                res.status(400).json({ 
                    message: 'Comment cannot exceed 1000 characters' 
                });
                return;
            }
            
            const comment = await CommentDAO.create(filmId, userId, text.trim());
            
            res.status(201).json({
                message: 'Comment created successfully',
                comment
            });
            
        } catch (error) {
            console.error('Error in create comment:', error);
            res.status(500).json({ 
                message: 'Error creating comment',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    
    /**
     * Get all comments for a specific film
     * GET /films/:filmId/comments
     * 
     * @param req - AuthRequest object
     * @param res - Response object
     * @returns JSON response with comments array or error
     */
    async getByFilmId(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { filmId } = req.params;
            
            if (!mongoose.Types.ObjectId.isValid(filmId)) {
                res.status(400).json({ 
                    message: 'Invalid film ID format' 
                });
                return;
            }
            
            const comments = await CommentDAO.getByFilmId(filmId);
            const totalComments = comments.length;
            
            res.status(200).json({
                message: 'Comments retrieved successfully',
                totalComments,
                comments
            });
            
        } catch (error) {
            console.error('Error in get comments by film:', error);
            res.status(500).json({ 
                message: 'Error retrieving comments',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    
    /**
     * Get all comments by a specific user
     * GET /users/:userId/comments
     * 
     * @param req - AuthRequest object
     * @param res - Response object
     * @returns JSON response with comments array or error
     */
    async getByUserId(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                res.status(400).json({ 
                    message: 'Invalid user ID format' 
                });
                return;
            }
            
            const comments = await CommentDAO.getByUserId(userId);
            
            res.status(200).json({
                message: 'User comments retrieved successfully',
                totalComments: comments.length,
                comments
            });
            
        } catch (error) {
            console.error('Error in get comments by user:', error);
            res.status(500).json({ 
                message: 'Error retrieving user comments',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    
    /**
     * Get a specific comment by ID
     * GET /comments/:commentId
     * 
     * @param req - AuthRequest object
     * @param res - Response object
     * @returns JSON response with comment or error
     */
    async getById(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { commentId } = req.params;
            
            if (!mongoose.Types.ObjectId.isValid(commentId)) {
                res.status(400).json({ 
                    message: 'Invalid comment ID format' 
                });
                return;
            }
            
            const comment = await CommentDAO.getById(commentId);
            
            if (!comment) {
                res.status(404).json({ 
                    message: 'Comment not found' 
                });
                return;
            }
            
            res.status(200).json({
                message: 'Comment retrieved successfully',
                comment
            });
            
        } catch (error) {
            console.error('Error in get comment by ID:', error);
            res.status(500).json({ 
                message: 'Error retrieving comment',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    
    /**
     * Update a comment (only by the comment owner)
     * PUT /comments/:commentId
     * 
     * @param req - AuthRequest object with user info and new text
     * @param res - Response object
     * @returns JSON response with updated comment or error
     */
    async update(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { commentId } = req.params;
            const { text } = req.body;
            const userId = req.user?.userId;
            
            if (!userId) {
                res.status(401).json({ 
                    message: 'Authentication required to update a comment' 
                });
                return;
            }
            
            if (!mongoose.Types.ObjectId.isValid(commentId)) {
                res.status(400).json({ 
                    message: 'Invalid comment ID format' 
                });
                return;
            }
            
            if (!text || text.trim().length === 0) {
                res.status(400).json({ 
                    message: 'Comment text is required' 
                });
                return;
            }
            
            if (text.length > 1000) {
                res.status(400).json({ 
                    message: 'Comment cannot exceed 1000 characters' 
                });
                return;
            }
            
            const isOwner = await CommentDAO.isOwner(commentId, userId);
            
            if (!isOwner) {
                res.status(403).json({ 
                    message: 'You can only edit your own comments' 
                });
                return;
            }
            
            const updatedComment = await CommentDAO.update(commentId, text.trim());
            
            if (!updatedComment) {
                res.status(404).json({ 
                    message: 'Comment not found' 
                });
                return;
            }
            
            res.status(200).json({
                message: 'Comment updated successfully',
                comment: updatedComment
            });
            
        } catch (error) {
            console.error('Error in update comment:', error);
            res.status(500).json({ 
                message: 'Error updating comment',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    
    /**
     * Delete a comment (only by the comment owner)
     * DELETE /comments/:commentId
     * 
     * @param req - AuthRequest object with user info
     * @param res - Response object
     * @returns JSON response with success message or error
     */
    async delete(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { commentId } = req.params;
            const userId = req.user?.userId;
            
            if (!userId) {
                res.status(401).json({ 
                    message: 'Authentication required to delete a comment' 
                });
                return;
            }
            
            if (!mongoose.Types.ObjectId.isValid(commentId)) {
                res.status(400).json({ 
                    message: 'Invalid comment ID format' 
                });
                return;
            }
            
            const isOwner = await CommentDAO.isOwner(commentId, userId);
            
            if (!isOwner) {
                res.status(403).json({ 
                    message: 'You can only delete your own comments' 
                });
                return;
            }
            
            const deletedComment = await CommentDAO.delete(commentId);
            
            if (!deletedComment) {
                res.status(404).json({ 
                    message: 'Comment not found' 
                });
                return;
            }
            
            res.status(200).json({
                message: 'Comment deleted successfully',
                comment: deletedComment
            });
            
        } catch (error) {
            console.error('Error in delete comment:', error);
            res.status(500).json({ 
                message: 'Error deleting comment',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}

export default new CommentController();
