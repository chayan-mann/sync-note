import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme, setFontSize } from '../features/settings/settingsSlice';
import type { AppDispatch, RootState } from '../app/store';
import { Link } from 'react-router-dom';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send: (channel: string, _data?: unknown) => void;
      };
    };
  }
}

const SettingsPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { theme, fontSize } = useSelector((state: RootState) => state.settings);

    const handleResize = (mode: 'compact' | 'expand') => {
        const size = mode === 'compact' ? { width: 400, height: 450 } : { width: 1200, height: 800 };
        // Check if the electron object exists before sending (for web compatibility)
        if (window.electron && window.electron.ipcRenderer) {
          window.electron.ipcRenderer.send('resize-window', size);
        } else {
          console.log("Resize functionality is only available in the Electron app.");
        }
    };

    const SettingRow: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
              <h3 className="font-semibold text-slate-200">{title}</h3>
              <p className="text-sm text-slate-400">{description}</p>
          </div>
          <div>{children}</div>
      </div>
    );


    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-white flex justify-center p-4 sm:p-8">
            <div className="w-full max-w-2xl">
                <Link to="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Dashboard
                </Link>

                <header className="mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-100">Settings</h1>
                    <p className="mt-2 text-slate-400">Customize your application experience.</p>
                </header>

                <div className="space-y-8">
                    {/* --- Appearance Section --- */}
                    <section className="space-y-6 rounded-2xl border border-slate-800/60 bg-slate-900/50 p-6 ring-1 ring-white/5">
                        <h2 className="text-xl font-semibold border-b border-slate-800/60 pb-3">Appearance</h2>
                        
                        <SettingRow title="Theme" description="Choose a light or dark theme for the app.">
                            <div className="flex items-center gap-2 rounded-lg bg-slate-800/60 p-1">
                                <button
                                    onClick={() => dispatch(setTheme('light'))}
                                    className={`px-4 py-1.5 text-sm rounded-md transition-colors ${theme === 'light' ? 'bg-cyan-600 text-white' : 'hover:bg-slate-700/80 text-slate-300'}`}
                                >
                                    Light
                                </button>
                                <button
                                    onClick={() => dispatch(setTheme('dark'))}
                                    className={`px-4 py-1.5 text-sm rounded-md transition-colors ${theme === 'dark' ? 'bg-cyan-600 text-white' : 'hover:bg-slate-700/80 text-slate-300'}`}
                                >
                                    Dark
                                </button>
                            </div>
                        </SettingRow>

                        <SettingRow title="Font Size" description="Adjust the text size across the application.">
                            <div className="flex items-center gap-2 rounded-lg bg-slate-800/60 p-1">
                                <button
                                    onClick={() => dispatch(setFontSize('small'))}
                                    className={`px-4 py-1.5 text-sm rounded-md transition-colors ${fontSize === 'small' ? 'bg-cyan-600 text-white' : 'hover:bg-slate-700/80 text-slate-300'}`}
                                >
                                    Small
                                </button>
                                <button
                                    onClick={() => dispatch(setFontSize('medium'))}
                                    className={`px-4 py-1.5 text-md rounded-md transition-colors ${fontSize === "medium" ? 'bg-cyan-600 text-white' : 'hover:bg-slate-700/80 text-slate-300'}`}
                                >
                                    Normal
                                </button>
                                <button
                                    onClick={() => dispatch(setFontSize('large'))}
                                    className={`px-4 py-1.5 text-lg rounded-md transition-colors ${fontSize === 'large' ? 'bg-cyan-600 text-white' : 'hover:bg-slate-700/80 text-slate-300'}`}
                                >
                                    Large
                                </button>
                            </div>
                        </SettingRow>
                    </section>

                    {/* --- Window Management Section --- */}
                    <section className="space-y-6 rounded-2xl border border-slate-800/60 bg-slate-900/50 p-6 ring-1 ring-white/5">
                        <h2 className="text-xl font-semibold border-b border-slate-800/60 pb-3">Window Management</h2>
                        <SettingRow title="Window Mode" description="Quickly resize the app window.">
                            <div className="flex gap-4">
                                <button onClick={() => handleResize('compact')} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-sm font-medium">
                                    Compact Mode
                                </button>
                                <button onClick={() => handleResize('expand')} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-sm font-medium">
                                    Expand Mode
                                </button>
                            </div>
                        </SettingRow>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;

