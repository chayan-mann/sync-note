import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './app/store';
import './index.css'
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
    // 1. Read the current theme and font size from the Redux store
    const { theme, fontSize } = useSelector((state: RootState) => state.settings);

    return (
        // 2. Apply the theme and font size classes to the root container div.
        // - The 'theme' variable will add the 'dark' class, enabling Tailwind's dark mode.
        // - The 'fontSize' variable will apply the global font size (e.g., 'text-base').
        <div className={`${theme} ${fontSize}`}>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* Private Routes */}
                    <Route path="/" element={<PrivateRoute />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                    </Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
