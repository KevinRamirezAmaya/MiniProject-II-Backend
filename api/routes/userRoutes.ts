import express, { Router, Request, Response } from 'express';
import UserController from '../controllers/UserController';
import { authenticate, isOwnAccount } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';

const router: Router = express.Router();
router.get("/favorites", authenticate, (req: AuthRequest, res: Response) => 
  UserController.getFavorites(req, res)
);
/**
 * @route GET /users
 * @description Retrieve all users.
 * @access Public
 */
router.get("/", (req: Request, res: Response) => UserController.getAll(req, res));

/**
 * @route GET /users/:id
 * @description Retrieve a user by ID.
 * @param {string} id - The unique identifier of the user.
 * @access Public
 */
router.get("/:id", (req: Request, res: Response) => UserController.read(req, res));

/**
 * @route POST /users
 * @description Create a new user.
 * @body {string} username - The username of the user.
 * @body {string} password - The password of the user.
 * @access Public
 */
router.post("/", (req: Request, res: Response) => UserController.create(req, res));

/**
 * @route PUT /users/:id
 * @description Update an existing user by ID.
 * @param {string} id - The unique identifier of the user.
 * @body {string} [username] - Updated username (optional).
 * @body {string} [password] - Updated password (optional).
 * @access Private - Requires authentication and user can only modify their own account
 */
router.put("/:id", authenticate, isOwnAccount, (req: Request, res: Response) => UserController.update(req, res));

/**
 * @route DELETE /users/:id
 * @description Delete a user by ID.
 * @param {string} id - The unique identifier of the user.
 * @access Private - Requires authentication and user can only delete their own account
 */
router.delete("/:id", authenticate, isOwnAccount, (req: Request, res: Response) => UserController.delete(req, res));

/**
 * @route POST /users/forgot-password
 * @description Request a password reset.
 * @body {string} email - Email address for the account to reset.
 * @access Public
 */
router.post("/forgot-password", (req: Request, res: Response) => 
  UserController.requestPasswordReset(req, res)
);

/**
 * @route POST /users/reset-password
 * @description Reset password using a valid token.
 * @body {string} token - Password reset token.
 * @body {string} newPassword - New password for the account.
 * @access Public
 */
router.post("/reset-password", (req: Request, res: Response) => 
  UserController.resetPassword(req, res)
);

/**
 * @route POST /users/login
 * @description Authenticate a user and provide a JWT token.
 * @body {string} email - User's email.
 * @body {string} password - User's password.
 * @access Public
 */
router.post("/login", (req: Request, res: Response) => 
  UserController.login(req, res)
);

router.post("/favorites/:filmId", authenticate, (req: AuthRequest, res: Response) => 
  UserController.addFavorite(req, res)
);

/**
 * @route DELETE /users/favorites/:filmId
 * @description Remove a film from the authenticated user's favorites.
 * @param {string} filmId - The unique identifier of the film to remove from favorites.
 * @access Private - Requires authentication
 */
router.delete("/favorites/:filmId", authenticate, (req: AuthRequest, res: Response) => 
  UserController.removeFavorite(req, res)
);



export default router;