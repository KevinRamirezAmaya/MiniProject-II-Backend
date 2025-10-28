import Film, { IFilm } from '../models/Film';
import GlobalDAO from './GlobalDAO';

/**
 * Data Access Object (DAO) for the Film model
 *
 * Extends the generic {@link GlobalDAO} class to provide
 * database operations (create, read, update, delete, getAll)
 * specifically for Film documents.
 * 
 * @class FilmDAO
 * @extends {GlobalDAO<IFilm>}
 */
class FilmDAO extends GlobalDAO<IFilm> {
  /**
   * Create a new FilmDAO instance
   *
   * Passes the Film Mongoose model to the parent class so that
   * all inherited CRUD methods operate on the Film collection.
   * 
   * @constructor
   */
  constructor() {
    super(Film);
  }
}

/**
 * Export a singleton instance of FilmDAO
 *
 * This ensures the same DAO instance is reused across the app,
 * avoiding redundant instantiations.
 * 
 * @exports FilmDAO
 */
export default new FilmDAO();