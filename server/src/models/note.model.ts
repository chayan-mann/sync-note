import { Schema, model, Document, Types } from 'mongoose';

export interface INote extends Document {
    title: string;
    content: string;
    userId: Types.ObjectId;
    createdAt: Date;
}

const NoteSchema = new Schema<INote>({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Note = model<INote>('Note', NoteSchema);