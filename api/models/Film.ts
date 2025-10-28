import mongoose, { Document, Schema } from 'mongoose';

export interface IFilm extends Document {
    name: string;
    genre: string;
    url: string;
    releaseDate: Date;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    posterImage: string; 
    rating: number;
    totalRatings: number;
    subtitles: string;

}

const FilmSchema: Schema = new Schema(
    {
        name: {type: String, required: true},
        genre: {type: String, required: true},
        releaseDate: {type: Date, required: true},
        description: {type: String, required: true},
        url: {type: String, required: true},
        posterImage: {type: String, required: true},
        rating: {type: Number, default: 0, min: 0, max: 5},
        totalRatings: {type: Number, default: 0},
        subtitles: {type: String},
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IFilm>('Film', FilmSchema);
