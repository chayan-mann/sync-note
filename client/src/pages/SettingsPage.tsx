import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, setFontSize } from '../features/settings/settingsSlice.ts';
import type { AppDispatch, RootState } from '../app/store.ts';
import { Link } from 'react-router-dom';

const SettingsPage = () => {
    const dispatch: AppDispatch = useDispatch();
    const { theme, fontSize } = useSelector((state: RootState) => state.settings);

    return (
        <div>
            <h2>Settings</h2>
            <Link to="/">Back to Dashboard</Link>
            <div>
                <label>Theme: </label>
                <select value={theme} onChange={(e) => dispatch(setTheme(e.target.value as any))}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
            </div>
            <div>
                <label>Font Size: </label>
                <select value={fontSize} onChange={(e) => dispatch(setFontSize(e.target.value as any))}>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                </select>
            </div>
        </div>
    );
};

export default SettingsPage;

