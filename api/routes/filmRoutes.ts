import express, { Router, Request, Response } from 'express';
import FilmController from '../controllers/FilmController';

const router: Router = express.Router();

router.get("/", (req: Request, res: Response) => FilmController.getAll(req, res));
router.get("/:id", (req: Request, res: Response) => FilmController.read(req, res));
router.delete("/:id", (req: Request, res: Response) => FilmController.delete(req, res));
router.post("/", (req: Request, res: Response) => FilmController.create(req, res));
router.put("/:id", (req: Request, res: Response)=> FilmController.update(req, res))
router.get("/genre/:genre", (req: Request, res: Response) => FilmController.getByGenre(req,res));
router.get("/:id/stream", (req: Request, res: Response)=> FilmController.getStreamingInfo(req, res))

/**
 * Export the router instance to be mounted in the main routes file.
 */
export default router;