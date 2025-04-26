const { contextBridge, ipcRenderer } = require('electron');

console.log('preload.js loaded');

contextBridge.exposeInMainWorld('electronAPI', {
    getApiKey: () => ipcRenderer.invoke('get-api-key'),
    setApiKey: (key) => ipcRenderer.invoke('set-api-key', key),
    openAccountPage: (callback) => ipcRenderer.on('open-api-key-popup', callback)
});