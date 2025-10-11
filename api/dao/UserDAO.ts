import User, { IUser } from '../models/User';
import GlobalDAO from './GlobalDAO';

/**
 * Data Access Object (DAO) for the User model.
 *
 * Extends the generic {@link GlobalDAO} class to provide
 * database operations (create, read, update, delete, getAll)
 * specifically for User documents.
 */
class UserDAO extends GlobalDAO<IUser> {
  /**
   * Create a new UserDAO instance.
   *
   * Passes the User Mongoose model to the parent class so that
   * all inherited CRUD methods operate on the User collection.
   */
  constructor() {
    super(User);
  }
}

/**
 * Export a singleton instance of UserDAO.
 *
 * This ensures the same DAO instance is reused across the app,
 * avoiding redundant instantiations.
 */
export default new UserDAO();