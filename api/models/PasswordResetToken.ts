import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface for the Password Reset Token document
 */
export interface IPasswordResetToken extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    token: string;
    createdAt: Date;
    expiresAt: Date;
    used: boolean;
}

/**
 * Schema for password reset tokens
 * 
 * Used to store and validate tokens for password reset functionality.
 * Each token is associated with a user and has an expiration date.
 */
const PasswordResetTokenSchema: Schema = new Schema({
    /**
     * Reference to the user requesting the password reset
     */
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    
    /**
     * The token string used to validate the reset request
     */
    token: {
        type: String,
        required: true
    },
    
    /**
     * Timestamp when the token was created
     */
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    
    /**
     * Timestamp when the token will expire
     * Default: 1 hour after creation
     */
    expiresAt: {
        type: Date,
        required: true,
        default: function() {
            return new Date(Date.now() + 3600000); // 1 hour in milliseconds
        }
    },
    
    /**
     * Whether this token has been used already
     */
    used: {
        type: Boolean,
        default: false
    }
});

/**
 * Index to efficiently find tokens by user ID
 */
PasswordResetTokenSchema.index({ userId: 1 });

/**
 * Index to efficiently check token expiration
 */
PasswordResetTokenSchema.index({ expiresAt: 1 });

/**
 * Compound index for looking up valid tokens
 */
PasswordResetTokenSchema.index({ token: 1, used: 1, expiresAt: 1 });

export default mongoose.model<IPasswordResetToken>(
    'PasswordResetToken',
    PasswordResetTokenSchema
);