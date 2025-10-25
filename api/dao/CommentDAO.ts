import Comment, { IComment } from '../models/Comment';
import mongoose from 'mongoose';

/**
 * Data Access Object for Comment operations.
 * Provides methods to interact with the Comment collection in MongoDB.
 */
class CommentDAO {
    
    /**
     * Create a new comment
     * @param filmId - The ID of the film being commented on
     * @param userId - The ID of the user creating the comment
     * @param text - The comment text
     * @returns Promise<IComment> - The created comment document
     */
    async create(filmId: string, userId: string, text: string): Promise<IComment> {
        try {
            const comment = new Comment({
                filmId: new mongoose.Types.ObjectId(filmId),
                userId: new mongoose.Types.ObjectId(userId),
                text
            });
            
            return await comment.save();
        } catch (error) {
            console.error('Error creating comment:', error);
            throw error;
        }
    }
    
    /**
     * Get all comments for a specific film
     * @param filmId - The ID of the film
     * @returns Promise<IComment[]> - Array of comments for the film
     */
    async getByFilmId(filmId: string): Promise<IComment[]> {
        try {
            return await Comment.find({ filmId: new mongoose.Types.ObjectId(filmId) })
                .populate('userId', 'firstName lastName email')
                .sort({ createdAt: -1 })
                .exec();
        } catch (error) {
            console.error('Error getting comments by film ID:', error);
            throw error;
        }
    }
    
    /**
     * Get all comments by a specific user
     * @param userId - The ID of the user
     * @returns Promise<IComment[]> - Array of comments by the user
     */
    async getByUserId(userId: string): Promise<IComment[]> {
        try {
            return await Comment.find({ userId: new mongoose.Types.ObjectId(userId) })
                .populate('filmId', 'name posterImage')
                .sort({ createdAt: -1 })
                .exec();
        } catch (error) {
            console.error('Error getting comments by user ID:', error);
            throw error;
        }
    }
    
    /**
     * Get a specific comment by ID
     * @param commentId - The ID of the comment
     * @returns Promise<IComment | null> - The comment document or null if not found
     */
    async getById(commentId: string): Promise<IComment | null> {
        try {
            return await Comment.findById(commentId)
                .populate('userId', 'firstName lastName email')
                .populate('filmId', 'name posterImage')
                .exec();
        } catch (error) {
            console.error('Error getting comment by ID:', error);
            throw error;
        }
    }
    
    /**
     * Update a comment's text
     * @param commentId - The ID of the comment to update
     * @param text - The new comment text
     * @returns Promise<IComment | null> - The updated comment or null if not found
     */
    async update(commentId: string, text: string): Promise<IComment | null> {
        try {
            return await Comment.findByIdAndUpdate(
                commentId,
                { text },
                { new: true, runValidators: true }
            )
            .populate('userId', 'firstName lastName email')
            .populate('filmId', 'name posterImage')
            .exec();
        } catch (error) {
            console.error('Error updating comment:', error);
            throw error;
        }
    }
    
    /**
     * Delete a comment
     * @param commentId - The ID of the comment to delete
     * @returns Promise<IComment | null> - The deleted comment or null if not found
     */
    async delete(commentId: string): Promise<IComment | null> {
        try {
            return await Comment.findByIdAndDelete(commentId).exec();
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    }
    
    /**
     * Check if a comment exists and belongs to a specific user
     * @param commentId - The ID of the comment
     * @param userId - The ID of the user
     * @returns Promise<boolean> - True if comment exists and belongs to user
     */
    async isOwner(commentId: string, userId: string): Promise<boolean> {
        try {
            const comment = await Comment.findOne({
                _id: new mongoose.Types.ObjectId(commentId),
                userId: new mongoose.Types.ObjectId(userId)
            }).exec();
            
            return comment !== null;
        } catch (error) {
            console.error('Error checking comment ownership:', error);
            throw error;
        }
    }
    
    /**
     * Get total count of comments for a film
     * @param filmId - The ID of the film
     * @returns Promise<number> - Total number of comments
     */
    async getCountByFilmId(filmId: string): Promise<number> {
        try {
            return await Comment.countDocuments({ filmId: new mongoose.Types.ObjectId(filmId) }).exec();
        } catch (error) {
            console.error('Error counting comments for film:', error);
            throw error;
        }
    }
}

export default new CommentDAO();
