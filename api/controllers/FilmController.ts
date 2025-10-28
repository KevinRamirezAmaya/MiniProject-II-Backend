import GlobalController from './GlobalController';
import FilmDAO from '../dao/FilmDAO';
import { IFilm } from '../models/Film';
import { Request, Response } from 'express';
import Film from '../models/Film';


class FilmController extends GlobalController<IFilm> {
    constructor() {
        super(FilmDAO);
    }

    async getByGenre(req: Request, res: Response): Promise<void> {
        try {
            const { genre } = req.params;
            const films: IFilm[] = await this.dao.getAll();
            const filmsByGenre = films.filter((f: IFilm) => f.genre.toLowerCase() === genre.toLowerCase());
            if (filmsByGenre.length === 0) {
                res.status(404).json({
                    message: `No films found for genre: ${genre}`
                });
                return;
            }
            res.status(200).json(filmsByGenre);
        } catch (err: any) {
            res.status(500).json({ error: 'Failed to fetch films by genre' });
        }
    }

        async getStreamingInfo(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            
            const film = await this.dao.read(id);
            if (!film) {
                res.status(404).json({ message: 'Film not found' });
                return;
            }

            res.status(200).json({
                streamUrl: film.url,
                film: {
                    id: film._id || film.id,
                    name: film.name,
                    genre: film.genre,
                    description: film.description,
                    // rate: film.rate,
                    releaseDate: film.releaseDate,
                    subtitles: film.subtitles
                }
            });

        } catch (error: any) {
            console.error('Error getting streaming info:', error);
            res.status(500).json({ 
                message: 'An error occurred while getting streaming info' 
            });
        }
    }

}


export default new FilmController();