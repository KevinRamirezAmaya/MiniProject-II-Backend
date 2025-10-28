import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface representing a Comment document in MongoDB
 * 
 * @interface IComment
 * @extends {Document}
 */
export interface IComment extends Document {
    /** Reference to the film being commented on */
    filmId: mongoose.Types.ObjectId;
    /** Reference to the user who created the comment */
    userId: mongoose.Types.ObjectId;
    /** The comment text content */
    text: string;
    /** Timestamp when the comment was created */
    createdAt: Date;
    /** Timestamp when the comment was last updated */
    updatedAt: Date;
}

/**
 * Comment schema definition.
 * 
 * Represents comments that users make on films.
 * Each comment is associated with a specific film and user.
 */
const CommentSchema: Schema = new Schema(
    {
        /**
         * Reference to the film being commented on.
         * @type {ObjectId}
         * @required
         * @ref Film
         */
        filmId: {
            type: Schema.Types.ObjectId,
            ref: 'Film',
            required: [true, 'Film ID is required'],
            index: true
        },
        
        /**
         * Reference to the user who created the comment.
         * @type {ObjectId}
         * @required
         * @ref User
         */
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            index: true
        },
        
        /**
         * The text content of the comment.
         * @type {String}
         * @required
         */
        text: {
            type: String,
            required: [true, 'Comment text is required'],
            trim: true,
            minlength: [1, 'Comment cannot be empty'],
            maxlength: [1000, 'Comment cannot exceed 1000 characters']
        }
    },
    {
        /**
         * Adds `createdAt` and `updatedAt` timestamp fields automatically.
         * createdAt: When the comment was first created
         * updatedAt: When the comment was last edited
         */
        timestamps: true
    }
);

/**
 * Create compound indexes for better query performance
 * - Index for finding all comments on a specific film
 * - Index for finding all comments by a specific user
 */
CommentSchema.index({ filmId: 1, createdAt: -1 });
CommentSchema.index({ userId: 1, createdAt: -1 });

/**
 * Mongoose model for the Comment collection.
 * Provides an interface to interact with comment documents.
 */
export default mongoose.model<IComment>('Comment', CommentSchema);
