import express, { Router } from 'express';
import userRoutes from './userRoutes';
import filmRoutes from './filmRoutes'
import ratingRoutes from './ratingRoutes';

const router: Router = express.Router();

/**
 * Mount user-related routes.
 *
 * All routes defined in {@link userRoutes} will be accessible under `/users`.
 * Example:
 *   - GET  /users        → Get all users
 *   - POST /users        → Create a new user
 *   - GET  /users/:id    → Get a user by ID
 *   - PUT  /users/:id    → Update a user by ID
 *   - DELETE /users/:id  → Delete a user by ID
 */
router.use("/users", userRoutes);
router.use("/films", filmRoutes);
router.use("/rating", ratingRoutes)

/**
 * Export the main router instance.
 * This is imported in `index.ts` and mounted under `/api/v1`.
 */
export default router;