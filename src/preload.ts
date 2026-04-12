import { contextBridge, ipcRenderer } from 'electron';

// Expose safe APIs to the frontend
contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => ipcRenderer.invoke('ping'),
  versions: {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
  }
  // Add other safe functions here
});
