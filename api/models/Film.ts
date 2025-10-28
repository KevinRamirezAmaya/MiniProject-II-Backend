import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface representing a Film document in MongoDB
 * 
 * @interface IFilm
 * @extends {Document}
 */
export interface IFilm extends Document {
    /** The name/title of the film */
    name: string;
    /** The genre category of the film */
    genre: string;
    /** The streaming URL for the film */
    url: string;
    /** The release date of the film */
    releaseDate: Date;
    /** Timestamp when the film was created in the database */
    createdAt: Date;
    /** Timestamp when the film was last updated */
    updatedAt: Date;
    /** Detailed description of the film */
    description: string;
    /** URL to the film's poster image */
    posterImage: string; 
    /** Average rating of the film (0-5) */
    rating: number;
    /** Total number of ratings received */
    totalRatings: number;
    /** Subtitle file path or URL */
    subtitles: string;

}

/**
 * Film schema definition for MongoDB
 * 
 * Represents films in the streaming platform with all necessary metadata
 * including ratings, streaming information, and timestamps.
 */
const FilmSchema: Schema = new Schema(
    {
        /** Film name/title - required field */
        name: {type: String, required: true},
        /** Film genre - required field */
        genre: {type: String, required: true},
        /** Film release date - required field */
        releaseDate: {type: Date, required: true},
        /** Film description - required field */
        description: {type: String, required: true},
        /** Streaming URL - required field */
        url: {type: String, required: true},
        /** Poster image URL - required field */
        posterImage: {type: String, required: true},
        /** Average rating (0-5) - defaults to 0 */
        rating: {type: Number, default: 0, min: 0, max: 5},
        /** Total number of ratings - defaults to 0 */
        totalRatings: {type: Number, default: 0},
        /** Subtitle file path - optional field */
        subtitles: {type: String},
    },
    {
        /**
         * Adds `createdAt` and `updatedAt` timestamp fields automatically
         */
        timestamps: true
    }
);

/**
 * Mongoose model for the Film collection
 * Provides an interface to interact with film documents in MongoDB
 */
export default mongoose.model<IFilm>('Film', FilmSchema);
