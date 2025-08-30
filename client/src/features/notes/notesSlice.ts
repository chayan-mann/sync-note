import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../api/axiosConfig';
import { db } from '../../db';
import type {Note} from '../../db'
import { v4 as uuidv4 } from 'uuid';

interface NotesState {
    notes: Note[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
}

const initialState: NotesState = {
    notes: [],
    status: 'idle',
    error: null,
    currentPage: 0,
    totalPages: 1,
    hasMore: true,
};

// --- ASYNC THUNKS ---

export const fetchNotes = createAsyncThunk<
    { notes: Note[], totalPages: number, currentPage: number },
    number,
    { rejectValue: { notes: Note[], message: string } }
>('notes/fetchNotes', async (page, { rejectWithValue }) => {
    try {
        const response = await apiClient.get(`/notes?page=${page}&limit=20`);
        const { notes, totalPages, currentPage } = response.data;
        if (notes.length > 0) {
            await db.notes.bulkPut(notes);
        }
        return { notes, totalPages, currentPage };
    } catch (error: any) {
        const localNotes = await db.notes.orderBy('createdAt').reverse().toArray();
        return rejectWithValue({ notes: localNotes, message: 'Network failed, loaded from cache.' });
    }
});

export const addNewNote = createAsyncThunk(
    'notes/addNewNote',
    async (initialNote: { title: string; content: string }, { getState }) => {
        const state: any = getState();
        const userId = state.auth.user._id;

        const tempNote: Note = {
            ...initialNote,
            _id: uuidv4(),
            userId,
            createdAt: new Date().toISOString(),
            needsSync: true,
        };

        await db.notes.add(tempNote);

        try {
            const response = await apiClient.post('/notes', { title: tempNote.title, content: tempNote.content });
            await db.transaction('rw', db.notes, async () => {
                await db.notes.delete(tempNote._id);
                await db.notes.add({ ...response.data, needsSync: false });
            });
            return response.data;
        } catch (error) {
            return tempNote;
        }
    }
);

export const syncNotes = createAsyncThunk<Note[]>('notes/syncNotes', async () => {
    const notesToSync = await db.notes.filter(note => note.needsSync === true).toArray();

    if (notesToSync.length > 0) {
        for (const note of notesToSync) {
            try {
                const { title, content } = note;
                const response = await apiClient.post('/notes', { title, content });
                await db.transaction('rw', db.notes, async () => {
                    await db.notes.delete(note._id);
                    await db.notes.add({ ...response.data, needsSync: false });
                });
            } catch (error) {
                console.error('Failed to sync note:', note._id, error);
            }
        }
    }
    const allNotes = await db.notes.orderBy('createdAt').reverse().toArray();
    return allNotes;
});


export const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.notes = action.payload.currentPage === 1
                    ? action.payload.notes
                    : [...state.notes, ...action.payload.notes.filter(n => !state.notes.some(sn => sn._id === n._id))];
                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
                state.hasMore = action.payload.currentPage < action.payload.totalPages;
                state.error = null;
            })
            .addCase(fetchNotes.rejected, (state, action) => {
                state.status = 'failed';
                if (action.payload) {
                    state.notes = action.payload.notes;
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message || 'Failed to fetch notes';
                }
                state.hasMore = false;
            })
            .addCase(addNewNote.fulfilled, (state, action) => {
                
                const existingIndex = state.notes.findIndex(note => note._id === action.payload._id);

                if (existingIndex === -1) {
                    state.notes.unshift(action.payload);
                }
            })
            .addCase(syncNotes.fulfilled, (state, action: PayloadAction<Note[]>) => {
                if (action.payload) {
                   state.notes = action.payload;
                }
                state.status = 'succeeded';
            });
    },
});

export default notesSlice.reducer;

