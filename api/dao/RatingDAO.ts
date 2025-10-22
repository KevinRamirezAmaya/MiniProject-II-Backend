import Rating, { IRating } from '../models/Rating';
import GlobalDAO from './GlobalDAO';


class RatingDAO extends GlobalDAO<IRating> {

  constructor() {
    super(Rating);
  }
}


export default new RatingDAO();