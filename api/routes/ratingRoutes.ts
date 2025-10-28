import express, { Router, Request, Response } from 'express';
import RatingController from '../controllers/RatingController';
import { authenticate, isOwnAccount } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';

/**
 * Express router for rating-related routes
 * 
 * Handles all HTTP operations for film ratings including CRUD operations,
 * user-specific ratings, and film-specific ratings.
 * 
 * @type {Router}
 */
const router: Router = express.Router();

/**
 * @route GET /ratings
 * @description Retrieve all ratings in the database
 * @access Public
 * @returns {Array<Rating>} Array of all rating objects with populated user and film data
 */
router.get("/", (req: Request, res: Response) => RatingController.getAll(req, res));

/**
 * @route GET /ratings/:id
 * @description Retrieve a specific rating by its ID
 * @access Public
 * @param {string} id - The unique identifier of the rating
 * @returns {Rating} The rating object with the specified ID
 */
router.get("/:id", (req: Request, res: Response) => RatingController.read(req, res));

/**
 * @route POST /ratings/rate/:filmId
 * @description Create a new rating for a specific film
 * @access Private - Requires authentication
 * @param {string} filmId - The unique identifier of the film to rate
 * @body {number} rate - The rating value (1-10)
 * @returns {Object} Object containing success message, created rating, and updated film stats
 */
router.post("/rate/:filmId", authenticate, (req: Request, res: Response) => RatingController.createRating(req, res));

/**
 * @route PUT /ratings/:id
 * @description Update an existing rating by its ID
 * @access Public (should be restricted to rating owner in production)
 * @param {string} id - The unique identifier of the rating to update
 * @body {number} [rate] - The new rating value (1-10)
 * @returns {Object} Object containing updated rating and film statistics
 */
router.put("/:id", (req: Request, res: Response) => RatingController.update(req, res));

/**
 * @route DELETE /ratings/:id
 * @description Delete a rating by its ID
 * @access Public (should be restricted to rating owner in production)
 * @param {string} id - The unique identifier of the rating to delete
 * @returns {Rating} The deleted rating object
 */
router.delete("/:id", (req: Request, res: Response) => RatingController.delete(req, res));

/**
 * @route GET /ratings/user/:userId
 * @description Retrieve all ratings made by a specific user
 * @access Public
 * @param {string} userId - The unique identifier of the user
 * @returns {Object} Object containing user's ratings array and count
 */
router.get("/user/:userId", (req: Request, res: Response) => RatingController.getRatingsByUser(req, res));

/**
 * @route GET /ratings/film/:filmId
 * @description Retrieve all ratings for a specific film
 * @access Public
 * @param {string} filmId - The unique identifier of the film
 * @returns {Object} Object containing film's ratings array and film statistics
 */
router.get("/film/:filmId", (req: Request, res: Response) => RatingController.getRatingsByFilm(req, res));

/**
 * Export the router instance to be mounted in the main routes file
 * 
 * This router is mounted at `/ratings` in the main application,
 * making all routes accessible under the `/api/ratings` path.
 * 
 * @exports {Router} Express router with all rating-related routes
 */
export default router;