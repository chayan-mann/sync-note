import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.ts';
import settingsReducer from '../features/settings/settingsSlice.ts';
import notesReducer from '../features/notes/notesSlice.ts';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        settings: settingsReducer,
        notes: notesReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

