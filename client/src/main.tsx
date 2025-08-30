// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'
// import { Provider } from 'react-redux'
// import { store } from './app/store';
// import apiClient from './api/axiosConfig'; 

// apiClient.interceptors.request.use((config) => {
//     const state = store.getState(); 
//     const token = state.auth.token;

//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <Provider store = {store}>
//       <App />
//     </Provider>
//   </StrictMode>,
// )
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store';
import apiClient from './api/axiosConfig';
import { syncNotes } from './features/notes/notesSlice'; // 1. Import the sync action

// Setup the Axios interceptor (your existing code is correct)
apiClient.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- 2. ADD OFFLINE SYNC LOGIC ---
window.addEventListener('online', () => {
  console.log('App is back online, syncing notes...');
  store.dispatch(syncNotes());
});

window.addEventListener('offline', () => {
  console.log('App is offline.');
});

// Initial sync check on app load to handle any notes that were unsynced
// from a previous session.
if (navigator.onLine) {
    store.dispatch(syncNotes());
}


const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <Provider store = {store}>
      <App />
    </Provider>
  </StrictMode>,
);
