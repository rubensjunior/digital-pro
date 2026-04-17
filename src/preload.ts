import { contextBridge, ipcRenderer } from 'electron';

// Expose safe APIs to the frontend
contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => ipcRenderer.invoke('ping'),
  windowMinimize: () => ipcRenderer.send('window-minimize'),
  windowMaximize: () => ipcRenderer.send('window-maximize'),
  windowClose: () => ipcRenderer.send('window-close'),
  versions: {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
  },

  // ─── Brain Vault — Ideias ─────────────────────────────────────────────────
  ideias: {
    getAll: () => ipcRenderer.invoke('ideias:getAll'),
    create: (payload: Record<string, unknown>) => ipcRenderer.invoke('ideias:create', payload),
    update: (payload: Record<string, unknown>) => ipcRenderer.invoke('ideias:update', payload),
    delete: (id: string) => ipcRenderer.invoke('ideias:delete', id),
    updateStatus: (id: string, status: string) => ipcRenderer.invoke('ideias:updateStatus', { id, status }),
  },
});
