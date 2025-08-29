import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../api/axiosConfig';

interface Note {
    _id: string;
    title: string;
    content: string;
}

interface NotesState {
    notes: Note[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: NotesState = {
    notes: [],
    status: 'idle',
    error: null,
};

export const fetchNotes = createAsyncThunk('notes/fetchNotes', async () => {
    const response = await apiClient.get('/notes');
    return response.data.notes; // Assuming the API returns { notes: [...] }
});

export const addNewNote = createAsyncThunk(
    'notes/addNewNote',
    async (initialNote: { title: string; content: string }) => {
        const response = await apiClient.post('/notes', initialNote);
        return response.data;
    }
);

export const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotes.fulfilled, (state, action: PayloadAction<Note[]>) => {
                state.status = 'succeeded';
                state.notes = action.payload;
            })
            .addCase(fetchNotes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch notes';
            })
            .addCase(addNewNote.fulfilled, (state, action: PayloadAction<Note>) => {
                state.notes.unshift(action.payload); // Add new note to the beginning
            });
    },
});

export default notesSlice.reducer;

