import express, { Router, Response } from 'express';
import CommentController from '../controllers/CommentController';
import { authenticate, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();

/**
 * Comment Routes
 * 
 * All routes in this file require authentication via JWT token.
 * Token must be provided in the Authorization header as: Bearer <token>
 */

/**
 * GET /comments/:commentId
 * Get a specific comment by ID
 * Authentication: Required
 */
router.get(
    "/:commentId", 
    authenticate,
    (req: AuthRequest, res: Response) => CommentController.getById(req, res)
);

/**
 * PUT /comments/:commentId
 * Update a comment (only the owner can edit)
 * Authentication: Required
 * Body: { text: string }
 */
router.put(
    "/:commentId",
    authenticate,
    (req: AuthRequest, res: Response) => CommentController.update(req, res)
);

/**
 * DELETE /comments/:commentId
 * Delete a comment (only the owner can delete)
 * Authentication: Required
 */
router.delete(
    "/:commentId",
    authenticate,
    (req: AuthRequest, res: Response) => CommentController.delete(req, res)
);

/**
 * Export the router instance to be mounted in the main routes file.
 */
export default router;
