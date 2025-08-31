const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            // In a packaged app, __dirname is the root of the asar archive.
            // This path will now correctly find preload.cjs at the root.
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    // This loads your React app's index.html file, which is also at the root.
    win.loadURL(`file://${path.join(__dirname, 'index.html')}`);
}

app.whenReady().then(createWindow);

// Handle window resize events from the renderer (your React app)
ipcMain.on('resize-window', (event, { width, height }) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
        win.setSize(width, height, true); // true for animated resize
    }
});

// Standard macOS window management
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
