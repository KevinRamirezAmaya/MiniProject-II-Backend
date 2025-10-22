import Film, { IRating } from '../models/Rating';
import GlobalDAO from './GlobalDAO';


class RatingDAO extends GlobalDAO<IRating> {

  constructor() {
    super(Film);
  }
}


export default new RatingDAO();