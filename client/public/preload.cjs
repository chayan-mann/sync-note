const { contextBridge, ipcRenderer } = require('electron');

// Expose a secure API to your React app
contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        send: (channel, data) => {
            // Whitelist valid channels for security
            const validChannels = ['resize-window'];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        // You could add 'on' or 'invoke' methods here if you needed
        // two-way communication from the main process to the renderer.
    },
});
