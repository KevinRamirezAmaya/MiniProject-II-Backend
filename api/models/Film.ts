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

}

const FilmSchema: Schema = new Schema(
    {
        name: {type: String, required: true},
        genre: {type: String, required: true},
        releaseDate: {type: Date, required: true},
        description: {type: String, required: true},
        url: {type: String, required: true},
        posterImage: {type: String, required: true}
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IFilm>('Film', FilmSchema);
