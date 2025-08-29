import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../api/axiosConfig';

interface AuthState {
    user: { _id: string; username: string } | null;
    token: string | null;
    isAuthenticated: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Attempt to load user info from localStorage
const user = JSON.parse(localStorage.getItem('user') || 'null');
const token = localStorage.getItem('token');

const initialState: AuthState = {
    user: user,
    token: token,
    isAuthenticated: !!token,
    status: 'idle',
    error: null,
};

// Async Thunk for user login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (userData: any, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/auth/login', userData);
            localStorage.setItem('user', JSON.stringify(response.data));
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.user = action.payload;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

