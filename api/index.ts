import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/database';
import routes from './routes/routes';

dotenv.config();

const app: Express = express();

/**
 * Middleware configuration
 * - Parse JSON request bodies
 * - Parse URL-encoded request bodies
 * - Enable Cross-Origin Resource Sharing (CORS)
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/**
 * Initialize database connection.
 * Exits the process if the connection fails.
 */
connectDB();

/**
 * Mount the API routes.
 * All feature routes are grouped under `/api`.
 */
app.use("/api", routes);

/**
 * Health check endpoint.
 * Useful to verify that the server is up and running.
 */
app.get("/", (_req: Request, res: Response) => res.send("Server is running"));

/**
 * Start the server only if this file is run directly
 * (prevents multiple servers when testing with imports).
 */
if (require.main === module) {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default app;