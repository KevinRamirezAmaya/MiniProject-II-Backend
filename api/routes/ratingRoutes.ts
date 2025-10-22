import express, { Router, Request, Response } from 'express';
import RatingController from '../controllers/RatingController';
import { authenticate, isOwnAccount } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';

const router: Router = express.Router();

// Depurar lo que devuelven los metodos 

router.get("/", (req: Request, res: Response) => RatingController.getAll(req, res));
router.get("/:id", (req: Request, res: Response) => RatingController.read(req, res));
router.post("/rate/:filmId", authenticate, (req: Request, res: Response) => RatingController.createRating(req, res));

// Revisar rutas para editar y eliminar ratings 
router.put("/:id", (req: Request, res: Response) => RatingController.update(req, res));
router.delete("/:id", (req: Request, res: Response) => RatingController.delete(req, res));

router.get("/user/:userId", (req: Request, res: Response) => RatingController.getRatingsByUser(req, res));
router.get("/film/:filmId", (req: Request, res: Response) => RatingController.getRatingsByFilm(req, res));

export default router;