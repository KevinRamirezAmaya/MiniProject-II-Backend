import GlobalController from './GlobalController';
import FilmDAO from '../dao/FilmDAO';
import { IFilm } from '../models/Film';
import { Request, Response } from 'express';
import Film from '../models/Film';

/**
 * Controller class for handling film-related operations.
 * Extends GlobalController to inherit CRUD operations and adds specialized film methods.
 * 
 * @class FilmController
 * @extends {GlobalController<IFilm>}
 */
class FilmController extends GlobalController<IFilm> {
    /**
     * Constructor for FilmController.
     * Initializes the controller with FilmDAO for database operations.
     */
    constructor() {
        super(FilmDAO);
    }

    /**
     * Retrieves films filtered by a specific genre.
     * Performs case-insensitive genre matching and returns all films that match the specified genre.
     * 
     * @async
     * @method getByGenre
     * @param {Request} req - Express request object containing genre parameter
     * @param {Response} res - Express response object
     * @returns {Promise<void>} Promise that resolves when the operation is complete
     * 
     * @throws {404} When no films are found for the specified genre
     * @throws {500} When there's an error fetching films from the database
     * 
     * @example
     * GET /api/films/genre/action
     * Response: [{ id, name, genre, description, ... }]
     */
    async getByGenre(req: Request, res: Response): Promise<void> {
        try {
            // Extract genre parameter from request URL
            const { genre } = req.params;
            
            // Fetch all films from database
            const films: IFilm[] = await this.dao.getAll();
            
            // Filter films by genre (case-insensitive comparison)
            const filmsByGenre = films.filter((f: IFilm) => f.genre.toLowerCase() === genre.toLowerCase());
            
            // Check if any films were found for the specified genre
            if (filmsByGenre.length === 0) {
                res.status(404).json({
                    message: `No films found for genre: ${genre}`
                });
                return;
            }
            
            // Return filtered films
            res.status(200).json(filmsByGenre);
        } catch (err: any) {
            // Handle any database or processing errors
            res.status(500).json({ error: 'Failed to fetch films by genre' });
        }
    }

    /**
     * Retrieves streaming information for a specific film.
     * Returns the streaming URL and essential film details for video playback.
     * 
     * @async
     * @method getStreamingInfo
     * @param {Request} req - Express request object containing film ID parameter
     * @param {Response} res - Express response object
     * @returns {Promise<void>} Promise that resolves when the operation is complete
     * 
     * @throws {404} When the specified film is not found
     * @throws {500} When there's an error retrieving streaming information
     * 
     * @example
     * GET /api/films/60d5ec49eb09c8001f4e1234/stream
     * Response: {
     *   streamUrl: "https://example.com/video.mp4",
     *   film: { id, name, genre, description, releaseDate, subtitles }
     * }
     */
        async getStreamingInfo(req: Request, res: Response): Promise<void> {
        try {
            // Extract film ID from request parameters
            const { id } = req.params;
            
            // Retrieve film from database using the ID
            const film = await this.dao.read(id);
            
            // Check if film exists
            if (!film) {
                res.status(404).json({ message: 'Film not found' });
                return;
            }

            // Return streaming URL and film details
            res.status(200).json({
                streamUrl: film.url,
                film: {
                    id: film._id || film.id,
                    name: film.name,
                    genre: film.genre,
                    description: film.description,
                    releaseDate: film.releaseDate,
                    subtitles: film.subtitles
                }
            });

        } catch (error: any) {
            // Log error for debugging purposes
            console.error('Error getting streaming info:', error);
            
            // Return generic error response
            res.status(500).json({ 
                message: 'An error occurred while getting streaming info' 
            });
        }
    }

}

/**
 * Export singleton instance of FilmController.
 * This ensures a single instance is used throughout the application.
 * 
 * @exports FilmController
 */
export default new FilmController();