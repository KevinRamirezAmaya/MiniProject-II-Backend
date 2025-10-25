import express, { Router, Request, Response } from 'express';
import FilmController from '../controllers/FilmController';
import CommentController from '../controllers/CommentController';
import { authenticate, AuthRequest } from '../middleware/auth';

const router: Router = express.Router();

router.get("/", (req: Request, res: Response) => FilmController.getAll(req, res));
router.get("/:id", (req: Request, res: Response) => FilmController.read(req, res));
router.post("/", (req: Request, res: Response) => FilmController.create(req, res));
router.get("/genre/:genre", (req: Request, res: Response) => FilmController.getByGenre(req,res));
router.get("/:id/stream", (req: Request, res: Response)=> FilmController.getStreamingInfo(req, res))

/**
 * Comment routes for films
 * All comment routes require authentication
 */

/**
 * GET /films/:filmId/comments
 * Get all comments for a specific film
 * Authentication: Not required for viewing
 */
router.get(
    "/:filmId/comments",
    (req: Request, res: Response) => CommentController.getByFilmId(req as AuthRequest, res)
);

/**
 * POST /films/:filmId/comments
 * Create a new comment on a film
 * Authentication: Required
 * Body: { text: string }
 */
router.post(
    "/:filmId/comments",
    authenticate,
    (req: AuthRequest, res: Response) => CommentController.create(req, res)
);

/**
 * Export the router instance to be mounted in the main routes file.
 */
export default router;