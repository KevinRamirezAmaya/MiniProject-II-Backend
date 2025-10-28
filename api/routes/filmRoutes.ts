import express, { Router, Request, Response } from 'express';
import FilmController from '../controllers/FilmController';
import CommentController from '../controllers/CommentController';
import { authenticate, AuthRequest } from '../middleware/auth';

/**
 * Express router for film-related routes
 * 
 * Handles all HTTP operations for films including CRUD operations,
 * genre filtering, streaming information, and comment management.
 * 
 * @type {Router}
 */
const router: Router = express.Router();

/**
 * @route GET /films
 * @description Retrieve all films in the database
 * @access Public
 * @returns {Array<Film>} Array of all film objects
 */
router.get("/", (req: Request, res: Response) => FilmController.getAll(req, res));

/**
 * @route GET /films/:id
 * @description Retrieve a specific film by its ID
 * @access Public
 * @param {string} id - The unique identifier of the film
 * @returns {Film} The film object with the specified ID
 */
router.get("/:id", (req: Request, res: Response) => FilmController.read(req, res));

/**
 * @route DELETE /films/:id
 * @description Delete a film by its ID
 * @access Public (should be restricted in production)
 * @param {string} id - The unique identifier of the film to delete
 * @returns {Film} The deleted film object
 */
router.delete("/:id", (req: Request, res: Response) => FilmController.delete(req, res));

/**
 * @route POST /films
 * @description Create a new film
 * @access Public (should be restricted in production)
 * @body {string} name - The name/title of the film
 * @body {string} genre - The genre of the film
 * @body {string} description - Film description
 * @body {string} url - Streaming URL for the film
 * @body {string} posterImage - URL to the poster image
 * @body {Date} releaseDate - The release date of the film
 * @body {string} [subtitles] - Subtitle file path (optional)
 * @returns {Film} The created film object
 */
router.post("/", (req: Request, res: Response) => FilmController.create(req, res));

/**
 * @route PUT /films/:id
 * @description Update an existing film by its ID
 * @access Public (should be restricted in production)
 * @param {string} id - The unique identifier of the film to update
 * @body {Object} updates - Fields to update (any valid film properties)
 * @returns {Film} The updated film object
 */
router.put("/:id", (req: Request, res: Response)=> FilmController.update(req, res))

/**
 * @route GET /films/genre/:genre
 * @description Retrieve all films of a specific genre
 * @access Public
 * @param {string} genre - The genre to filter by (case-insensitive)
 * @returns {Array<Film>} Array of films matching the specified genre
 */
router.get("/genre/:genre", (req: Request, res: Response) => FilmController.getByGenre(req,res));

/**
 * @route GET /films/:id/stream
 * @description Get streaming information for a specific film
 * @access Public
 * @param {string} id - The unique identifier of the film
 * @returns {Object} Object containing streamUrl and film details
 */
router.get("/:id/stream", (req: Request, res: Response)=> FilmController.getStreamingInfo(req, res))

/**
 * Comment routes for films
 * All comment routes require authentication
 */

/**
 * @route GET /films/:filmId/comments
 * @description Get all comments for a specific film
 * @access Public (viewing comments doesn't require authentication)
 * @param {string} filmId - The unique identifier of the film
 * @returns {Object} Object containing comments array and total count
 */
router.get(
    "/:filmId/comments",
    (req: Request, res: Response) => CommentController.getByFilmId(req as AuthRequest, res)
);

/**
 * @route POST /films/:filmId/comments
 * @description Create a new comment on a film
 * @access Private - Requires authentication
 * @param {string} filmId - The unique identifier of the film
 * @body {string} text - The comment text content
 * @returns {Object} Object containing success message and created comment
 */
router.post(
    "/:filmId/comments",
    authenticate,
    (req: AuthRequest, res: Response) => CommentController.create(req, res)
);

/**
 * Export the router instance to be mounted in the main routes file
 * 
 * This router is mounted at `/films` in the main application,
 * making all routes accessible under the `/api/films` path.
 * 
 * @exports {Router} Express router with all film-related routes
 */
export default router;