import mongoose, { Document, Schema } from 'mongoose';
import User from './User';

/**
 * Interface representing a User document in MongoDB
 */
export interface IRating extends Document {
    user: mongoose.Types.ObjectId;
    film: mongoose.Types.ObjectId;
rate: number;
createdAt: Date;
updatedAt: Date;
}

const RatingSchema: Schema = new Schema(
    {
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        film: {type: mongoose.Schema.Types.ObjectId, ref: 'Film', required: true},
        rate: {type: Number, required: true}
    },
    {
        /**
         * Adds `createdAt` and `updatedAt` timestamp fields automatically.
         */
        timestamps: true
    }
);

export default mongoose.model<IRating>('Rating', RatingSchema);