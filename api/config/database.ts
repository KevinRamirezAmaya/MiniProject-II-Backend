import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Establish a connection to the MongoDB database.
 *
 * Uses the connection string provided in the environment variable `MONGO_URI`.
 * On success, logs a confirmation message. On failure, logs the error and
 * terminates the process with exit code 1.
 *
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolves when the connection is established.
 * @throws Will terminate the process if the connection fails.
 */
export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log("Connected to MongoDB");
  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

/**
 * Disconnect from the MongoDB database.
 *
 * Gracefully closes the active connection and logs the result.
 * If an error occurs, it is logged to the console.
 *
 * @async
 * @function disconnectDB
 * @returns {Promise<void>} Resolves when the connection is closed.
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error: any) {
    console.error("Error disconnecting from MongoDB:", error.message);
  }
};