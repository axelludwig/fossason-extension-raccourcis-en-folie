
const { contextBridge, ipcRenderer } = require('electron');

console.log('preload.js loaded');

contextBridge.exposeInMainWorld('electronAPI', {
    onMediaPlayPause: (cb) => ipcRenderer.on('media-play-pause', cb),
    onMediaNext: (cb) => ipcRenderer.on('media-next', cb),
    onMediaPrev: (cb) => ipcRenderer.on('media-prev', cb),
    onVolumeUp: (cb) => ipcRenderer.on('volume-up', cb),
    onVolumeDown: (cb) => ipcRenderer.on('volume-down', cb),
    onVolumeMute: (cb) => ipcRenderer.on('volume-mute', cb),
    getApiKey: () => ipcRenderer.invoke('get-api-key'),
    setApiKey: (key) => ipcRenderer.invoke('set-api-key', key),
    openAccountPopup: () => ipcRenderer.invoke('open-account-popup')
});
