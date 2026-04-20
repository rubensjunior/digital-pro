export interface IElectronAPI {
  ping: () => Promise<string>;
  windowMinimize: () => void;
  windowMaximize: () => void;
  windowClose: () => void;
  versions: {
    node: () => string;
    chrome: () => string;
    electron: () => string;
  };

  ideias: {
    getAll: (workspace_id?: string) => Promise<any[]>;
    getHistorico: (id: string) => Promise<any[]>;
    create: (payload: Record<string, unknown>) => Promise<any>;
    update: (payload: Record<string, unknown>) => Promise<any>;
    delete: (id: string) => Promise<boolean>;
    updateStatus: (id: string, status: string) => Promise<boolean>;
    updateAcesso: (id: string) => Promise<boolean>;
    toggleFavorita: (id: string, is_favorita: number) => Promise<boolean>;
    toggleArquivada: (id: string, is_arquivada: number) => Promise<boolean>;
  };

  workspaces: {
    getAll: () => Promise<any[]>;
    create: (payload: Record<string, unknown>) => Promise<any>;
    update: (payload: Record<string, unknown>) => Promise<any>;
    delete: (id: string) => Promise<boolean>;
    setupTemplate: (templateId: string) => Promise<any>;
  };

  taxonomia: {
    tipos: {
      getAll: (workspace_id: string) => Promise<any[]>;
      create: (payload: Record<string, unknown>) => Promise<any>;
      update: (payload: Record<string, unknown>) => Promise<any>;
      delete: (id: string) => Promise<boolean>;
    },
    status: {
      getAll: (workspace_id: string) => Promise<any[]>;
      create: (payload: Record<string, unknown>) => Promise<any>;
      update: (payload: Record<string, unknown>) => Promise<any>;
      delete: (id: string) => Promise<boolean>;
    }
  };

  notas: {
    getAll: (ideia_id: string) => Promise<any[]>;
    create: (payload: Record<string, unknown>) => Promise<any>;
    update: (payload: Record<string, unknown>) => Promise<any>;
    delete: (id: string) => Promise<boolean>;
  };

  links: {
    getAll: (ideia_id: string) => Promise<any[]>;
    create: (payload: Record<string, unknown>) => Promise<any>;
    delete: (id: string) => Promise<boolean>;
  };

  arquivos: {
    getAll: (ideia_id: string) => Promise<any[]>;
    save: (ideia_id: string, nome: string, base64: string, tipo: string, tamanho: number) => Promise<any>;
    delete: (id: string) => Promise<boolean>;
    open: (id: string) => Promise<boolean>;
  };

  correlacoes: {
    getAll: (ideia_id: string) => Promise<any[]>;
    getAllTodos: () => Promise<any[]>;
    create: (payload: Record<string, unknown>) => Promise<boolean>;
    update: (payload: Record<string, unknown>) => Promise<boolean>;
    delete: (id: string) => Promise<boolean>;
  };
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
