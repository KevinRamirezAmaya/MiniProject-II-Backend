import Rating, { IRating } from '../models/Rating';
import GlobalDAO from './GlobalDAO';

/**
 * Data Access Object (DAO) for the Rating model
 *
 * Extends the generic {@link GlobalDAO} class to provide
 * database operations (create, read, update, delete, getAll)
 * specifically for Rating documents.
 * 
 * @class RatingDAO
 * @extends {GlobalDAO<IRating>}
 */
class RatingDAO extends GlobalDAO<IRating> {
  /**
   * Create a new RatingDAO instance
   *
   * Passes the Rating Mongoose model to the parent class so that
   * all inherited CRUD methods operate on the Rating collection.
   * 
   * @constructor
   */
  constructor() {
    super(Rating);
  }
}

/**
 * Export a singleton instance of RatingDAO
 *
 * This ensures the same DAO instance is reused across the app,
 * avoiding redundant instantiations.
 * 
 * @exports RatingDAO
 */
export default new RatingDAO();