// import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit';
// import apiClient from '../../api/axiosConfig';

// interface AuthState {
//     user: { _id: string; username: string } | null;
//     token: string | null;
//     isAuthenticated: boolean;
//     status: 'idle' | 'loading' | 'succeeded' | 'failed';
//     error: string | null;
// }

// // Attempt to load user info from localStorage
// const user = JSON.parse(localStorage.getItem('user') || 'null');
// const token = localStorage.getItem('token');

// const initialState: AuthState = {
//     user: user,
//     token: token,
//     isAuthenticated: !!token,
//     status: 'idle',
//     error: null,
// };

// // Async Thunk for user login
// export const loginUser = createAsyncThunk(
//     'auth/loginUser',
//     async (userData: any, { rejectWithValue }) => {
//         try {
//             const response = await apiClient.post('/auth/login', userData);
//             localStorage.setItem('user', JSON.stringify(response.data));
//             localStorage.setItem('token', response.data.token);
//             return response.data;
//         } catch (error: any) {
//             return rejectWithValue(error.response.data.message);
//         }
//     }
// );

// export const authSlice = createSlice({
//     name: 'auth',
//     initialState,
//     reducers: {
//         logout: (state) => {
//             state.user = null;
//             state.token = null;
//             state.isAuthenticated = false;
//             localStorage.removeItem('user');
//             localStorage.removeItem('token');
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(loginUser.pending, (state) => {
//                 state.status = 'loading';
//             })
//             .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
//                 state.status = 'succeeded';
//                 state.isAuthenticated = true;
//                 state.user = action.payload;
//                 state.token = action.payload.token;
//                 state.error = null;
//             })
//             .addCase(loginUser.rejected, (state, action) => {
//                 state.status = 'failed';
//                 state.error = action.payload as string;
//             });
//     },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../../api/axiosConfig';

interface User {
  _id: string;
  username: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  _id: string;
  username: string;
  token: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const userJson = localStorage.getItem('user');
const token = localStorage.getItem('token');
const user: User | null = userJson ? JSON.parse(userJson) : null;

const initialState: AuthState = {
  user,
  token,
  isAuthenticated: !!token,
  status: 'idle',
  error: null,
};

// Async Thunk for user login
export const loginUser = createAsyncThunk<
  LoginResponse,          // Return type
  LoginRequest,           // Argument type
  { rejectValue: string } // Rejection type
>(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/login', userData);
      localStorage.setItem('user', JSON.stringify({
        _id: response.data._id,
        username: response.data.username
      }));
      localStorage.setItem('token', response.data.token);
      return response.data as LoginResponse;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        return rejectWithValue((error.response.data as { message: string }).message);
      }
      return rejectWithValue('An unknown error occurred');
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
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = { _id: action.payload._id, username: action.payload.username };
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
