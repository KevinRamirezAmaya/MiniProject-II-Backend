import mongoose, { Document, Schema } from 'mongoose';
import User from './User';

/**
 * Interface representing a Rating document in MongoDB
 * 
 * @interface IRating
 * @extends {Document}
 */
export interface IRating extends Document {
    /** Reference to the user who created the rating */
    user: mongoose.Types.ObjectId;
    /** Reference to the film being rated */
    film: mongoose.Types.ObjectId;
    /** The rating value (1-5) */
    rate: number;
    /** Timestamp when the rating was created */
    createdAt: Date;
    /** Timestamp when the rating was last updated */
    updatedAt: Date;
}

/**
 * Rating schema definition for MongoDB
 * 
 * Represents user ratings for films in the streaming platform.
 * Each rating links a user to a film with a numeric score.
 */
const RatingSchema: Schema = new Schema(
    {
        /** Reference to the user who created the rating */
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        /** Reference to the film being rated */
        film: {type: mongoose.Schema.Types.ObjectId, ref: 'Film', required: true},
        /** The rating value (1-10) - required field */
        rate: {type: Number, required: true}
    },
    {
        /**
         * Adds `createdAt` and `updatedAt` timestamp fields automatically.
         */
        timestamps: true
    }
);

/**
 * Mongoose model for the Rating collection
 * Provides an interface to interact with rating documents in MongoDB
 */
export default mongoose.model<IRating>('Rating', RatingSchema);