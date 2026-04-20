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

  // ─── Brain Vault — Workspaces / Config ────────────────────────────────────
  workspaces: {
    getAll: () => ipcRenderer.invoke('workspaces:getAll'),
    create: (payload: Record<string, unknown>) => ipcRenderer.invoke('workspaces:create', payload),
    update: (payload: Record<string, unknown>) => ipcRenderer.invoke('workspaces:update', payload),
    delete: (id: string) => ipcRenderer.invoke('workspaces:delete', id),
    setupTemplate: (templateId: string) => ipcRenderer.invoke('workspaces:setupTemplate', templateId),
  },
  taxonomia: {
    tipos: {
      getAll: (workspace_id: string) => ipcRenderer.invoke('taxonomia:tipos:getAll', workspace_id),
      create: (payload: Record<string, unknown>) => ipcRenderer.invoke('taxonomia:tipos:create', payload),
      update: (payload: Record<string, unknown>) => ipcRenderer.invoke('taxonomia:tipos:update', payload),
      delete: (id: string) => ipcRenderer.invoke('taxonomia:tipos:delete', id),
    },
    status: {
      getAll: (workspace_id: string) => ipcRenderer.invoke('taxonomia:status:getAll', workspace_id),
      create: (payload: Record<string, unknown>) => ipcRenderer.invoke('taxonomia:status:create', payload),
      update: (payload: Record<string, unknown>) => ipcRenderer.invoke('taxonomia:status:update', payload),
      delete: (id: string) => ipcRenderer.invoke('taxonomia:status:delete', id),
    },
    relacionamentos: {
      getAll: (workspace_id: string) => ipcRenderer.invoke('taxonomia:relacionamentos:getAll', workspace_id),
      create: (payload: Record<string, unknown>) => ipcRenderer.invoke('taxonomia:relacionamentos:create', payload),
      update: (payload: Record<string, unknown>) => ipcRenderer.invoke('taxonomia:relacionamentos:update', payload),
      delete: (id: string) => ipcRenderer.invoke('taxonomia:relacionamentos:delete', id),
    }
  },

  // ─── Brain Vault — Ideias ─────────────────────────────────────────────────
  ideias: {
    getAll: (workspace_id?: string) => ipcRenderer.invoke('ideias:getAll', workspace_id),
    getHistorico: (id: string) => ipcRenderer.invoke('ideias:getHistorico', id),
    create: (payload: Record<string, unknown>) => ipcRenderer.invoke('ideias:create', payload),
    update: (payload: Record<string, unknown>) => ipcRenderer.invoke('ideias:update', payload),
    delete: (id: string) => ipcRenderer.invoke('ideias:delete', id),
    updateStatus: (id: string, status: string) => ipcRenderer.invoke('ideias:updateStatus', { id, status }),
    updateAcesso: (id: string) => ipcRenderer.invoke('ideias:updateAcesso', id),
    toggleFavorita: (id: string, is_favorita: number) => ipcRenderer.invoke('ideias:toggleFavorita', { id, is_favorita }),
    toggleArquivada: (id: string, is_arquivada: number) => ipcRenderer.invoke('ideias:toggleArquivada', { id, is_arquivada }),
  },

  // ─── Brain Vault — Notas ──────────────────────────────────────────────────
  notas: {
    getAll: (ideia_id: string) => ipcRenderer.invoke('ideias:notas:getAll', ideia_id),
    create: (payload: Record<string, unknown>) => ipcRenderer.invoke('ideias:notas:create', payload),
    update: (payload: Record<string, unknown>) => ipcRenderer.invoke('ideias:notas:update', payload),
    delete: (id: string) => ipcRenderer.invoke('ideias:notas:delete', id),
  },

  // ─── Brain Vault — Links ──────────────────────────────────────────────────
  links: {
    getAll: (ideia_id: string) => ipcRenderer.invoke('ideias:links:getAll', ideia_id),
    create: (payload: Record<string, unknown>) => ipcRenderer.invoke('ideias:links:create', payload),
    delete: (id: string) => ipcRenderer.invoke('ideias:links:delete', id),
  },

  // ─── Brain Vault — Arquivos ───────────────────────────────────────────────
  arquivos: {
    getAll: (ideia_id: string) => ipcRenderer.invoke('ideias:arquivos:getAll', ideia_id),
    save: (ideia_id: string, nome: string, base64: string, tipo: string, tamanho: number) =>
      ipcRenderer.invoke('ideias:arquivos:save', { ideia_id, nome, base64, tipo, tamanho }),
    delete: (id: string) => ipcRenderer.invoke('ideias:arquivos:delete', id),
    open: (id: string) => ipcRenderer.invoke('ideias:arquivos:open', id),
  },

  // ─── Brain Vault — Correlações ────────────────────────────────────────────
  correlacoes: {
    getAll: (ideia_id: string) => ipcRenderer.invoke('ideias:correlacoes:getAll', ideia_id),
    getAllTodos: () => ipcRenderer.invoke('ideias:correlacoes:getAllTodos'),
    create: (payload: Record<string, unknown>) => ipcRenderer.invoke('ideias:correlacoes:create', payload),
    update: (payload: Record<string, unknown>) => ipcRenderer.invoke('ideias:correlacoes:update', payload),
    delete: (id: string) => ipcRenderer.invoke('ideias:correlacoes:delete', id),
  },
});

