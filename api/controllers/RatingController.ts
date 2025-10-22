import GlobalController from './GlobalController';
import RatingDAO from '../dao/RatingDAO';
import { IRating } from '../models/Rating';
import { Request, Response } from 'express';
import Rating from '../models/Rating';
import { AuthRequest } from '../middleware/auth';
import Film from '../models/Film';


class RatingController extends GlobalController<IRating> {

    constructor() {
        super(RatingDAO);
    }

    private async updateFilmAverageRating(filmId: string): Promise<void> {
        try {
            // Get all ratings for this film
            const ratings = await Rating.find({ film: filmId });
            
            const totalRatings = ratings.length;
            const rating = totalRatings > 0 
                ? Math.round((ratings.reduce((sum, rating) => sum + rating.rate, 0) / totalRatings) * 10) / 10
                : 0;

            // Update film document with new rating statistics
            await Film.findByIdAndUpdate(filmId, {
                rating,
                totalRatings
            });
            
            console.log(`Film ${filmId} rating updated: ${rating} (${totalRatings} ratings)`);
        } catch (error) {
            console.error('Error updating film average rating:', error);
        }
    }

    // Create a new rating for a film
    async createRating(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { filmId } = req.params;
            const { rate } = req.body;
            const userId = req.user?.userId;

            // Validate required fields
            if (!rate || rate < 0 || rate > 5) {
                res.status(400).json({ 
                    message: 'Rating must be a number between 0 and 5' 
                });
                return;
            }

            // Check if film exists
            const film = await Film.findById(filmId);
            if (!film) {
                res.status(404).json({ message: 'Film not found' });
                return;
            }

            // Check if user already rated this film
            const existingRating = await Rating.findOne({ 
                user: userId, 
                film: filmId 
            });

            if (existingRating) {
                res.status(400).json({ 
                    message: 'You have already rated this film. Use PUT to update your rating.' 
                });
                return;
            }

            // Create the new rating
            const newRating = new Rating({
                user: userId,
                film: filmId,
                rate: Number(rate)
            });

            await newRating.save();

            // Update film's average rating
            await this.updateFilmAverageRating(filmId);

            // Get updated film data
            const updatedFilm = await Film.findById(filmId, 'name rating totalRatings');

            res.status(201).json({
                message: 'Rating created successfully',
                rating: {
                    id: newRating._id,
                    user: userId,
                    film: filmId,
                    rate: newRating.rate,
                    createdAt: newRating.createdAt
                },
                filmRating: {
                    filmName: updatedFilm?.name,
                    averageRating: updatedFilm?.rating,
                    totalRatings: updatedFilm?.totalRatings
                }
            });

        } catch (error: any) {
            console.error('Create rating error:', error);
            res.status(500).json({ 
                message: 'An error occurred while creating the rating' 
            });
        }
    }

    async getRatingsByFilm(req: Request, res: Response): Promise<void>{
        try {
            const { filmId } = req.params;
            
            const [ratings, film] = await Promise.all([
                Rating.find({ film: filmId })
                    .populate('user', 'firstName lastName')
                    .sort({ createdAt: -1 }),
                Film.findById(filmId, 'name averageRating totalRatings')
            ]);
            
            res.status(200).json({
                message: 'Film ratings retrieved successfully',
                ratings,
                film: {
                    id: film?._id,
                    name: film?.name,
                    averageRating: film?.rating || 0,
                    totalRatings: film?.totalRatings || 0
                }
            });
            
        } catch (error: any) {
            console.error('Get film ratings error:', error);
            res.status(500).json({ 
                message: 'An error occurred while retrieving film ratings' 
            });
        }
    }

    async getRatingsByUser(req: Request, res: Response): Promise<void>{
        try {
            const { userId } = req.params;
            
            const ratings = await Rating.find({ user: userId })
                .populate('film', 'name')
                .sort({ createdAt: -1 });
            
            res.status(200).json({
                message: 'User ratings retrieved successfully',
                ratings,
                count: ratings.length
            });
            
        } catch (error: any) {
            console.error('Get user ratings error:', error);
            res.status(500).json({ 
                message: 'An error occurred while retrieving user ratings' 
            });
        }
    }
}

/**
 * Export a singleton instance of UserController.
 * 
 * This allows the same controller to be reused across routes
 * without creating multiple instances.
 */
export default new RatingController();