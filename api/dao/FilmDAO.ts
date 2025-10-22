import Film, { IFilm } from '../models/Film';
import GlobalDAO from './GlobalDAO';

/**
 * Data Access Object (DAO) for the User model.
 *
 * Extends the generic {@link GlobalDAO} class to provide
 * database operations (create, read, update, delete, getAll)
 * specifically for User documents.
 */
class FilmDAO extends GlobalDAO<IFilm> {
  /**
   * Create a new UserDAO instance.
   *
   * Passes the User Mongoose model to the parent class so that
   * all inherited CRUD methods operate on the User collection.
   */
  constructor() {
    super(Film);
  }
}

/**
 * Export a singleton instance of UserDAO.
 *
 * This ensures the same DAO instance is reused across the app,
 * avoiding redundant instantiations.
 */
export default new FilmDAO();