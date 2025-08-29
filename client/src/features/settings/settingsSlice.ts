import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';
type FontSize = 'small' | 'medium' | 'large';

interface SettingsState {
    theme: Theme;
    fontSize: FontSize;
}

const initialState: SettingsState = {
    theme: (localStorage.getItem('theme') as Theme) || 'light',
    fontSize: (localStorage.getItem('fontSize') as FontSize) || 'medium',
};

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload;
            localStorage.setItem('theme', action.payload);
        },
        setFontSize: (state, action: PayloadAction<FontSize>) => {
            state.fontSize = action.payload;
            localStorage.setItem('fontSize', action.payload);
        },
    },
});

export const { setTheme, setFontSize } = settingsSlice.actions;
export default settingsSlice.reducer;

