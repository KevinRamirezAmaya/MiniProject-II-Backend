import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * Interface representing a User document in MongoDB
 * 
 * @interface IUser
 * @extends {Document}
 */
export interface IUser extends Document {
    /** User's first name */
    firstName: string;
    /** User's last name */
    lastName: string;
    /** User's email address - must be unique */
    email: string;
    /** User's hashed password */
    password: string;
    /** User's age */
    age: number;
    /** Array of film IDs that the user has marked as favorites */
    favorites: string[]
    /** Timestamp when the user was created */
    createdAt: Date;
    /** Timestamp when the user was last updated */
    updatedAt: Date;
    /** Method to compare password with hashed password */
    comparePassword(candidatePassword: string): Promise<boolean>;

}

/**
 * Regular expression for email validation
 * This regex checks for:
 * - A valid username (alphanumeric, dots, underscores, hyphens)
 * - @ symbol
 * - Valid domain (alphanumeric, dots, hyphens)
 * - Valid TLD (.com, .org, etc.) with 2 or more characters
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Regular expression for password validation
 * This regex checks for:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * User schema definition.
 * 
 * Represents application users stored in MongoDB.
 * Includes authentication fields with validation and automatic timestamps.
 */
const UserSchema: Schema = new Schema(
    {
        /**
         * The first name of the user.
         * @type {String}
         * @required
         */
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true
        },
        
        /**
         * The last name of the user.
         * @type {String}
         * @required
         */
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true
        },
        
        /**
         * The email address of the user.
         * Must be unique and match a valid email format.
         * @type {String}
         * @required
         * @unique
         */
        email: {
            type: String,
            required: [true, 'Email address is required'],
            unique: [true, 'This email address is already in use'],
            trim: true,
            lowercase: true,
            validate: {
                validator: function(v: string) {
                    return EMAIL_REGEX.test(v);
                },
                message: (props: { value: string }) => `${props.value} is not a valid email address`
                
            }
        },
        
        /**
         * The password of the user.
         * Must meet complexity requirements:
         * - At least 8 characters
         * - At least one uppercase letter
         * - At least one lowercase letter
         * - At least one number
         * - At least one special character
         * 
         * Will be hashed before saving.
         * @type {String}
         * @required
         */
        password: { 
            type: String, 
            required: [true, 'Password is required'],
            validate: {
                validator: function(v: string) {
                    return PASSWORD_REGEX.test(v);
                },
                message: (_props: any) => 'Password must be at least 8 characters long and include uppercase, lowercase, number and special character'
            }
        },
        
        /**
         * The age of the user in years.
         * @type {Number}
         * @required
         */
        age: {
            type: Number,
            required: [true, 'Age is required'],
            min: [0, 'Age cannot be negative'],
            max: [120, 'Age must be less than 120 years'],
            validate: {
                validator: function(value: number) {
                    return Number.isInteger(value);
                },
                message: () => 'Age must be a whole number'
            }
        },

        favorites: [String]
    },
    {
        /**
         * Adds `createdAt` and `updatedAt` timestamp fields automatically.
         */
        timestamps: true
    }
);

/**
 * Create indexes for faster queries
 * - Email index for quick lookups by email
 * - Name index for search functionality
 */
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ firstName: 1, lastName: 1 });

/**
 * Handle duplicate key errors for unique fields
 * This provides better error messages when unique constraints are violated
 */
UserSchema.post('save', function(error: any, doc: any, next: any) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        let errorMessage = 'Duplicate field error';
        
        if (field === 'email') {
            errorMessage = 'This email address is already registered';
        }
        
        next(new Error(errorMessage));
    } else {
        next(error);
    }
});

/**
 * Pre-save hook to hash the password before saving to the database
 */
UserSchema.pre('save', async function(this: IUser, next) {
    try {
        // Only hash the password if it's modified (or new)
        if (!this.isModified('password')) return next();
        
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

/**
 * Method to compare a candidate password with the hashed password
 * @param candidatePassword - The plain text password to compare
 * @returns Promise<boolean> - True if passwords match, false otherwise
 */
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

/**
 * Mongoose model for the User collection.
 * Provides an interface to interact with user documents.
 */
export default mongoose.model<IUser>('User', UserSchema);