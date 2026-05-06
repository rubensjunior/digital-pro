import { Ideia, IdeiaHistorico, IdeiaNote, IdeiaLink, IdeiaArquivo, IdeiaCorrelacao, Framework } from './ideia';

export interface IElectronAPI {
  appVersion: () => Promise<string>;
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
    getAll: (workspace_id?: string) => Promise<Record<string, unknown>[]>;
    getHistorico: (id: string) => Promise<IdeiaHistorico[]>;
    create: (payload: Record<string, unknown>) => Promise<Ideia>;
    update: (payload: Record<string, unknown>) => Promise<Ideia>;
    delete: (id: string) => Promise<boolean>;
    updateStatus: (id: string, status: string) => Promise<boolean>;
    updateAcesso: (id: string) => Promise<boolean>;
    toggleFavorita: (id: string, is_favorita: number) => Promise<boolean>;
    toggleArquivada: (id: string, is_arquivada: number) => Promise<boolean>;
  };

  workspaces: {
    getAll: () => Promise<Record<string, unknown>[]>;
    create: (payload: Record<string, unknown>) => Promise<Record<string, unknown>>;
    update: (payload: Record<string, unknown>) => Promise<Record<string, unknown>>;
    delete: (id: string) => Promise<boolean>;
    setupTemplate: (templateId: string) => Promise<Record<string, unknown>>;
  };

  taxonomia: {
    tipos: {
      getAll: (workspace_id: string) => Promise<Record<string, unknown>[]>;
      create: (payload: Record<string, unknown>) => Promise<Record<string, unknown>>;
      update: (payload: Record<string, unknown>) => Promise<Record<string, unknown>>;
      delete: (id: string) => Promise<boolean>;
    },
    status: {
      getAll: (workspace_id: string) => Promise<Record<string, unknown>[]>;
      create: (payload: Record<string, unknown>) => Promise<Record<string, unknown>>;
      update: (payload: Record<string, unknown>) => Promise<Record<string, unknown>>;
      delete: (id: string) => Promise<boolean>;
    },
    relacionamentos: {
      getAll: (workspace_id: string) => Promise<Record<string, unknown>[]>;
      create: (payload: Record<string, unknown>) => Promise<Record<string, unknown>>;
      update: (payload: Record<string, unknown>) => Promise<Record<string, unknown>>;
      delete: (id: string) => Promise<boolean>;
    }
  };

  notas: {
    getAll: (ideia_id: string) => Promise<IdeiaNote[]>;
    create: (payload: Record<string, unknown>) => Promise<IdeiaNote>;
    update: (payload: Record<string, unknown>) => Promise<IdeiaNote>;
    delete: (id: string) => Promise<boolean>;
  };

  links: {
    getAll: (ideia_id: string) => Promise<IdeiaLink[]>;
    create: (payload: Record<string, unknown>) => Promise<IdeiaLink>;
    delete: (id: string) => Promise<boolean>;
  };

  arquivos: {
    getAll: (ideia_id: string) => Promise<IdeiaArquivo[]>;
    save: (ideia_id: string, nome: string, base64: string, tipo: string, tamanho: number) => Promise<IdeiaArquivo>;
    delete: (id: string) => Promise<boolean>;
    open: (id: string) => Promise<boolean>;
  };

  correlacoes: {
    getAll: (ideia_id: string) => Promise<IdeiaCorrelacao[]>;
    getAllTodos: () => Promise<IdeiaCorrelacao[]>;
    create: (payload: Record<string, unknown>) => Promise<boolean>;
    update: (payload: Record<string, unknown>) => Promise<boolean>;
    delete: (id: string) => Promise<boolean>;
  };

  frameworks: {
    getAll: (payload: { workspace_id: string; ideia_id?: string }) => Promise<Framework[]>;
    save: (payload: { workspace_id: string; ideia_id?: string; framework: string; nome?: string; dados: string }) => Promise<Framework>;
    delete: (id: string) => Promise<boolean>;
  };
  user: {
    initDb: (userId: string) => Promise<boolean>;
    getProfile: () => Promise<Record<string, unknown>>;
    updateProfile: (payload: Record<string, unknown>) => Promise<Record<string, unknown>>;
    selectAvatar: () => Promise<string | null>;
    clearDatabase: () => Promise<{ success: boolean; error?: string }>;
    sanitizeDatabase: () => Promise<{ success: boolean; error?: string }>;
  };
  backup: {
    export: (type: 'full' | 'partial') => Promise<{ success: boolean; date?: string; canceled?: boolean; error?: string }>;
    import: () => Promise<{ success: boolean; canceled?: boolean; error?: string }>;
  };
  dashboard: {
    getStats: () => Promise<{
      ideasCount: number;
      workspacesCount: number;
      ideasByStatus: { status_name: string; count: number }[];
      ideasByWorkspace: { workspace_name: string; count: number }[];
    } | null>;
  };
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
