// preload.js - Security Bridge between UI and Main Process
const { contextBridge, ipcRenderer } = require('electron');

// This exposes safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // File Operations
  loadPasswords: () => ipcRenderer.invoke('load-passwords'),
  savePasswords: (passwords) => ipcRenderer.invoke('save-passwords', passwords),
  clearAllPasswords: () => ipcRenderer.invoke('clear-all-passwords')
});
