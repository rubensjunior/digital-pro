import { app, BrowserWindow, ipcMain, shell, protocol, dialog } from 'electron';
import path from 'node:path';
import crypto from 'node:crypto';
import fs from 'node:fs';
import started from 'electron-squirrel-startup';
import { updateElectronApp } from 'update-electron-app';
import Module from 'node:module';

updateElectronApp({
  repo: 'rubensjunior/digital-pro',
});

// Correção para módulos nativos no Electron + Vite
if (app.isPackaged) {
  const moduleRoot = path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules');
  (Module as unknown as { _initPaths: () => { push: (p: string) => void } })._initPaths().push(moduleRoot);
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// Registrar schemas privilegiados antes do app estar pronto
protocol.registerSchemesAsPrivileged([
  { scheme: 'brainvault', privileges: { standard: true, secure: true, supportFetchAPI: true } }
]);

// ─── SQLite — Brain Vault ─────────────────────────────────────────────────────
// O banco fica em %APPDATA%\rks-digital-pro\brainvault.db (Windows)
// Importação dinâmica para compatibilidade com o empacotamento do Electron Forge

let db: import('better-sqlite3').Database;

function initDatabase(userId: string) {
  if (db) {
    try {
      db.close();
    } catch (e) {
      console.error('Erro ao fechar DB anterior:', e);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Database = require('better-sqlite3');
  const dbPath = path.join(app.getPath('userData'), `brainvault_${userId}.db`);
  db = new Database(dbPath);

  // Evolução 5: Workspaces & Data-Driven Taxonomy
  db.exec(`
    CREATE TABLE IF NOT EXISTS workspaces (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      icon       TEXT,
      color      TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS workspace_tipos (
      id           TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      label        TEXT NOT NULL,
      grupo        TEXT,
      icon         TEXT,
      color        TEXT,
      created_at   TEXT DEFAULT (datetime('now')),
      updated_at   TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS workspace_status (
      id           TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      label        TEXT NOT NULL,
      grupo        TEXT,
      meta_status  TEXT NOT NULL DEFAULT 'in_progress',
      color        TEXT,
      order_index  INTEGER DEFAULT 0,
      created_at   TEXT DEFAULT (datetime('now')),
      updated_at   TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS workspace_relacionamentos (
      id           TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      label        TEXT NOT NULL,
      color        TEXT,
      created_at   TEXT DEFAULT (datetime('now')),
      updated_at   TEXT DEFAULT (datetime('now'))
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS ideias (
      id             TEXT PRIMARY KEY,
      workspace_id   TEXT NOT NULL DEFAULT 'default_workspace',
      nome           TEXT NOT NULL,
      tipo           TEXT NOT NULL,
      status         TEXT NOT NULL,
      score          INTEGER NOT NULL DEFAULT 1,
      descricao      TEXT,
      contexto       TEXT,
      problema       TEXT,
      transformacao  TEXT,
      publico_alvo   TEXT,
      tags_avatar    TEXT NOT NULL DEFAULT '[]',
      tags_nicho     TEXT NOT NULL DEFAULT '[]',
      tags_dor       TEXT NOT NULL DEFAULT '[]',
      tags_desejo    TEXT NOT NULL DEFAULT '[]',
      tags_mecanismo TEXT NOT NULL DEFAULT '[]',
      parent_id      TEXT,
      relationship_type TEXT,
      created_at     TEXT DEFAULT (datetime('now')),
      updated_at     TEXT DEFAULT (datetime('now'))
    );
  `);

  // Evolução 1: Novas colunas (try/catch pois add column falha se já existe)
  try { db.exec('ALTER TABLE ideias ADD COLUMN is_arquivada INTEGER NOT NULL DEFAULT 0;'); } catch (e) { /* ignore */ }
  try { db.exec('ALTER TABLE ideias ADD COLUMN is_favorita INTEGER NOT NULL DEFAULT 0;'); } catch (e) { /* ignore */ }
  try { db.exec('ALTER TABLE ideias ADD COLUMN last_accessed_at TEXT;'); } catch (e) { /* ignore */ }

  // Evolução 3: Hierarquia de Ideias
  try { db.exec('ALTER TABLE ideias ADD COLUMN parent_id TEXT;'); } catch (e) { /* ignore */ }
  try { db.exec('ALTER TABLE ideias ADD COLUMN relationship_type TEXT;'); } catch (e) { /* ignore */ }

  // Evolução 5.1: Chave de Workspace
  try { db.exec('ALTER TABLE ideias ADD COLUMN workspace_id TEXT NOT NULL DEFAULT "default_workspace";'); } catch (e) { /* ignore */ }
  try { db.exec('ALTER TABLE workspaces ADD COLUMN updated_at TEXT;'); } catch (e) { /* ignore */ }
  try { db.exec('ALTER TABLE workspace_tipos ADD COLUMN updated_at TEXT;'); } catch (e) { /* ignore */ }
  try { db.exec('ALTER TABLE workspace_status ADD COLUMN updated_at TEXT;'); } catch (e) { /* ignore */ }
  try { db.exec('ALTER TABLE ideia_correlacoes ADD COLUMN updated_at TEXT;'); } catch (e) { /* ignore */ }
  try { db.exec('ALTER TABLE workspace_relacionamentos ADD COLUMN updated_at TEXT;'); } catch (e) { /* ignore */ }

  // Evolução 2: Tabela de histórico
  db.exec(`
    CREATE TABLE IF NOT EXISTS ideias_historico (
      id         TEXT PRIMARY KEY,
      ideia_id   TEXT NOT NULL,
      acao       TEXT NOT NULL,
      detalhes   TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Evolução 4: Documentação Complementar
  db.exec(`
    CREATE TABLE IF NOT EXISTS ideia_notas (
      id         TEXT PRIMARY KEY,
      ideia_id   TEXT NOT NULL,
      titulo     TEXT,
      conteudo   TEXT NOT NULL,
      cor        TEXT NOT NULL DEFAULT '#1e293b',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ideia_links (
      id         TEXT PRIMARY KEY,
      ideia_id   TEXT NOT NULL,
      url        TEXT NOT NULL,
      titulo     TEXT,
      descricao  TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ideia_arquivos (
      id            TEXT PRIMARY KEY,
      ideia_id      TEXT NOT NULL,
      nome_original TEXT NOT NULL,
      caminho       TEXT NOT NULL,
      tipo_mime     TEXT,
      tamanho       INTEGER,
      created_at    TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ideia_correlacoes (
      id         TEXT PRIMARY KEY,
      ideia_a_id TEXT NOT NULL,
      ideia_b_id TEXT NOT NULL,
      descricao  TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS user_profile (
      id          TEXT PRIMARY KEY,
      nickname    TEXT,
      profession  TEXT,
      avatar_path TEXT,
      updated_at  TEXT DEFAULT (datetime('now'))
    );
  `);

  // Garantir usuário padrão
  try {
    const user = db.prepare('SELECT id FROM user_profile WHERE id = ?').get('default');
    if (!user) {
      db.prepare('INSERT INTO user_profile (id, nickname) VALUES (?, ?)').run('default', 'Usuário');
    }
  } catch (e) {
    console.warn('Erro ao inicializar perfil:', e);
  }

  // Limpeza automática de conexões e relações órfãs por segurança
  db.exec(`
    DELETE FROM ideia_correlacoes 
    WHERE ideia_a_id NOT IN (SELECT id FROM ideias) 
       OR ideia_b_id NOT IN (SELECT id FROM ideias);
  `);

  runDataMigration();
}

function runDataMigration() {
  const countRes = db.prepare('SELECT count(*) as c FROM workspaces').get() as { c: number };
  
  // Se já existem workspaces, não fazemos nada de semeadura automática.
  // A semeadura agora é disparada pelo Onboarding no frontend via IPC.
  
  if (countRes.c === 0) {
    console.log('Banco de dados vazio. Aguardando Onboarding...');
    return;
  }

  // Semente: Garantir que todo workspace tenha relacionamentos padrão
  const wsIds = db.prepare('SELECT id FROM workspaces').all() as { id: string }[];
  for (const ws of wsIds) {
    const relsCount = db.prepare('SELECT count(*) as c FROM workspace_relacionamentos WHERE workspace_id = ?').get(ws.id) as { c: number };
    if (relsCount.c === 0) {
      console.log(`Semeando relacionamentos padrão para o workspace: ${ws.id}`);
      const DEFAULTS = ['Complementa', 'Feature de', 'Upsell de', 'Downsell de', 'Order bump de', 'Extensão de', 'Versão de', 'Subproduto de', 'Outro'];
      const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1', '#ec4899', '#14b8a6', '#64748b'];
      for (let i = 0; i < DEFAULTS.length; i++) {
        db.prepare('INSERT INTO workspace_relacionamentos (id, workspace_id, label, color) VALUES (?, ?, ?, ?)').run(
          crypto.randomUUID(),
          ws.id,
          DEFAULTS[i],
          COLORS[i]
        );
      }
    }
  }
}

// ── Funções Auxiliares de Histórico ───────────────────────────────────────────
function logHistorico(ideia_id: string, acao: string, detalhes?: string) {
  const hRow = {
    id: crypto.randomUUID(),
    ideia_id,
    acao,
    detalhes: detalhes ?? null,
    created_at: new Date().toISOString()
  };
  db.prepare(`
    INSERT INTO ideias_historico (id, ideia_id, acao, detalhes, created_at)
    VALUES (@id, @ideia_id, @acao, @detalhes, @created_at)
  `).run(hRow);
}

// ─── Interfaces de Tipagem ────────────────────────────────────────────────────
interface TemplateEntry {
  correlation?: { from: string; to: string; desc: string };
  tipo?: string;
  status?: string;
  parent_key?: string;
  nome?: string;
  descricao?: string;
  id_key?: string;
}

// ─── IPC Handlers — Brain Vault ───────────────────────────────────────────────
function registerIdeiaHandlers() {
  // ─── Workspaces e Taxonomia ────────────────────────────────────────────────
  ipcMain.handle('workspaces:getAll', () => {
    if (!db) return [];
    return db.prepare('SELECT * FROM workspaces ORDER BY created_at ASC').all();
  });
  ipcMain.handle('workspaces:create', (_, payload: { name: string; color?: string; icon?: string }) => {
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO workspaces (id, name, color, icon) VALUES (?, ?, ?, ?)').run(id, payload.name, payload.color ?? null, payload.icon ?? null);
    return db.prepare('SELECT * FROM workspaces WHERE id = ?').get(id);
  });
  ipcMain.handle('workspaces:update', (_, payload: { id: string; name: string; color?: string; icon?: string }) => {
    const now = new Date().toISOString();
    db.prepare('UPDATE workspaces SET name = ?, color = ?, icon = ?, updated_at = ? WHERE id = ?').run(payload.name, payload.color ?? null, payload.icon ?? null, now, payload.id);
    return db.prepare('SELECT * FROM workspaces WHERE id = ?').get(payload.id);
  });
  
  ipcMain.handle('workspaces:delete', (_, id: string) => {
    db.prepare('DELETE FROM workspaces WHERE id = ?').run(id);
    return true;
  });

  ipcMain.handle('workspaces:setupTemplate', (_, templateId: string) => {
    try {
      const dbTransaction = db.transaction(() => {
        const id = crypto.randomUUID();
        let name = 'Meu Workspace';
        let color = '#3b82f6';
        let types: { label: string; grupo: string }[] = [];
        let statuses: { label: string; grupo: string; meta: string }[] = [];
        let relacionamentos: { label: string; color: string }[] = [];
        let ideas: TemplateEntry[] = [];

        if (templateId === 'marketing') {
          name = 'Marketing & Infoprodutos';
          color = '#f59e0b';
          types = [
            { label: 'Produto', grupo: '📣 Ofertas' },
            { label: 'VSL (Vídeo de Vendas)', grupo: '🎬 Conteúdo' },
            { label: 'Headline', grupo: '✍️ Copywriting' },
            { label: 'Funil de Vendas', grupo: '📈 Estratégia' },
            { label: 'Criativo (Anúncio)', grupo: '📺 Tráfego' },
            { label: 'Página de Vendas', grupo: '🌐 Web' }
          ];
          statuses = [
            { label: 'Capturada (Bruta)', grupo: 'Fluxo', meta: 'backlog' },
            { label: 'Em Pesquisa', grupo: 'Fluxo', meta: 'in_progress' },
            { label: 'Redação/Copy', grupo: 'Fluxo', meta: 'in_progress' },
            { label: 'Validada', grupo: 'Fluxo', meta: 'done' }
          ];
          ideas = [
            { id_key: 'p1', nome: 'Lançamento: Workshop Digital', tipo: 'Funil de Vendas', status: 'Em Pesquisa', descricao: 'Evento de 3 dias para vender o curso principal.' },
            { id_key: 'p1_f1', parent_key: 'p1', nome: 'Página de Inscrição (Capture)', tipo: 'Página de Vendas', status: 'Validada', descricao: 'Focada em leads frios do Instagram.' },
            { id_key: 'p1_f1_n1', parent_key: 'p1_f1', nome: 'Headline: O Fim do Caos Digital', tipo: 'Headline', status: 'Validada', descricao: 'Gancho principal da página de captura.' },
            { id_key: 'p2', nome: 'Ebook: 101 Headlines de Alta Conversão', tipo: 'Produto', status: 'Capturada (Bruta)', descricao: 'Isca digital para alimentar o funil.' }
          ];
          // Exemplo de correlação livre
          ideas.push({ correlation: { from: 'p1', to: 'p2', desc: 'Ebook serve como order-bump deste lançamento.' } });

          // Relacionamentos específicos
          relacionamentos = [
            { label: 'Upsell de', color: '#f59e0b' },
            { label: 'Downsell de', color: '#ef4444' },
            { label: 'Order bump de', color: '#10b981' },
            { label: 'Bônus de', color: '#8b5cf6' },
            { label: 'Anúncio de', color: '#3b82f6' },
            { label: 'Página de', color: '#6366f1' },
            { label: 'Outro', color: '#64748b' }
          ];

        } else if (templateId === 'software') {
          name = 'Software & SaaS';
          color = '#6366f1';
          types = [
            { label: 'Sprint', grupo: '📅 Gestão' },
            { label: 'Nova Feature', grupo: '💻 Dev' },
            { label: 'Bugfix', grupo: '💻 Dev' },
            { label: 'Interface (UI/UX)', grupo: '🎨 Design' },
            { label: 'Bug', grupo: '🐞 QA' }
          ];
          statuses = [
            { label: 'Backlog', grupo: 'Kanban', meta: 'backlog' },
            { label: 'Priorizado', grupo: 'Kanban', meta: 'backlog' },
            { label: 'Em Desenvolvimento', grupo: 'Kanban', meta: 'in_progress' },
            { label: 'Implementado', grupo: 'Kanban', meta: 'done' }
          ];
          ideas = [
            { id_key: 'p1', nome: 'Sprint #42: Dashboard', tipo: 'Sprint', status: 'Em Desenvolvimento', descricao: 'Ciclo de 15 dias focado em métricas.' },
            { id_key: 'p1_f1', parent_key: 'p1', nome: 'Visualização de Gráficos Reais', tipo: 'Nova Feature', status: 'Priorizado', descricao: 'Migrar de dados mockados para o banco.' },
            { id_key: 'p1_f1_n1', parent_key: 'p1_f1', nome: 'Componente: LineChart Avançado', tipo: 'Interface (UI/UX)', status: 'Backlog', descricao: 'Usar Chart.js com cores do sistema.' },
            { id_key: 'p2', nome: 'Bug: Flicker no Header', tipo: 'Bug', status: 'Backlog', descricao: 'Correção prioritária para o Safari.' }
          ];
          ideas.push({ correlation: { from: 'p1_f1', to: 'p2', desc: 'Bug impede a finalização desta feature.' } });

          // Relacionamentos específicos
          relacionamentos = [
            { label: 'Bloqueia', color: '#ef4444' },
            { label: 'Parte de', color: '#3b82f6' },
            { label: 'Implementa', color: '#10b981' },
            { label: 'Fix de', color: '#f59e0b' },
            { label: 'Depende de', color: '#8b5cf6' },
            { label: 'Relacionado', color: '#64748b' }
          ];

        } else if (templateId === 'business') {
          name = 'Negócios & Gestão';
          color = '#10b981';
          types = [
            { label: 'Estruturação', grupo: '🏢 Corporativo' },
            { label: 'OKR (Objetivo)', grupo: '🎯 Metas' },
            { label: 'KPI (Métrica)', grupo: '🎯 Metas' },
            { label: 'Processo / Workflow', grupo: '⚙️ Operação' },
            { label: 'Insight de Negócio', grupo: '💡 Estratégia' }
          ];
          statuses = [
            { label: 'Pendente', grupo: 'Status', meta: 'backlog' },
            { label: 'Agendado', grupo: 'Status', meta: 'backlog' },
            { label: 'Em Execução', grupo: 'Status', meta: 'in_progress' },
            { label: 'Aprovado', grupo: 'Status', meta: 'done' }
          ];
          ideas = [
            { id_key: 'p1', nome: 'Meta 2026: Escala 7 Dígitos', tipo: 'OKR (Objetivo)', status: 'Em Execução', descricao: 'Objetivo macro da empresa para este ano.' },
            { id_key: 'p1_f1', parent_key: 'p1', nome: 'OKR Q1: Retenção de Clientes', tipo: 'OKR (Objetivo)', status: 'Pendente', descricao: 'Foco em diminuir o Churn no primeiro trimestre.' },
            { id_key: 'p1_f1_n1', parent_key: 'p1_f1', nome: 'Métrica: Churn Rate < 3%', tipo: 'KPI (Métrica)', status: 'Em Execução', descricao: 'KPI principal do squad de retenção.' },
            { id_key: 'p2', nome: 'Manual de Onboarding do Cliente', tipo: 'Processo / Workflow', status: 'Aprovado', descricao: 'Checkout assistido por consultor.' }
          ];
          ideas.push({ correlation: { from: 'p1_f1', to: 'p2', desc: 'Este processo é a ferramenta para bater o OKR.' } });

          // Relacionamentos específicos
          relacionamentos = [
            { label: 'Alinhado com', color: '#10b981' },
            { label: 'Monitora', color: '#0ea5e9' },
            { label: 'Influencia', color: '#f59e0b' },
            { label: 'Suporta', color: '#8b5cf6' },
            { label: 'Responsável por', color: '#3b82f6' },
            { label: 'Outro', color: '#64748b' }
          ];

        } else if (templateId === 'education') {
          name = 'Estudos & Pesquisa';
          color = '#ec4899';
          types = [
            { label: 'Projeto de Estudo', grupo: '🎓 Acadêmico' },
            { label: 'Módulo / Capítulo', grupo: '📖 Estrutura' },
            { label: 'Aula / Seção', grupo: '📝 Notas' },
            { label: 'Framework', grupo: '🧠 Modelos' },
            { label: 'Insight de Leitura', grupo: '💡 Ideias' }
          ];
          statuses = [
            { label: 'Para Iniciar', grupo: 'Progresso', meta: 'backlog' },
            { label: 'Em Estudo', grupo: 'Progresso', meta: 'in_progress' },
            { label: 'Revisado', grupo: 'Progresso', meta: 'review' },
            { label: 'Concluído/Masterizado', grupo: 'Progresso', meta: 'done' }
          ];
          ideas = [
            { id_key: 'p1', nome: 'Mastery: Neurociência do Foco', tipo: 'Projeto de Estudo', status: 'Em Estudo', descricao: 'Estudo aprofundado sobre atenção sustentada.' },
            { id_key: 'p1_f1', parent_key: 'p1', nome: 'Módulo: Ciclo Dopaminérgico', tipo: 'Módulo / Capítulo', status: 'Revisado', descricao: 'Como a recompensa afeta a concentração.' },
            { id_key: 'p1_f1_n1', parent_key: 'p1_f1', nome: 'Nota: O Efeito Zeigarnik', tipo: 'Aula / Seção', status: 'Para Iniciar', descricao: 'Tarefas inacabadas e carga cognitiva.' },
            { id_key: 'p2', nome: 'Técnica de Pomodoro 2.0', tipo: 'Framework', status: 'Concluído/Masterizado', descricao: 'Ajuste de ciclos baseados em cronotipos.' }
          ];
          ideas.push({ correlation: { from: 'p1', to: 'p2', desc: 'Pomodoro é aplicado durante as sessões deste estudo.' } });

          // Relacionamentos específicos
          relacionamentos = [
            { label: 'Cita / Referencia', color: '#ec4899' },
            { label: 'Resumo de', color: '#3b82f6' },
            { label: 'Aprofunda', color: '#8b5cf6' },
            { label: 'Contradiz', color: '#ef4444' },
            { label: 'Corrobora', color: '#10b981' },
            { label: 'Prática de', color: '#f59e0b' },
            { label: 'Relacionado', color: '#64748b' }
          ];
        }

        // 1. Criar Workspace
        db.prepare('INSERT INTO workspaces (id, name, color) VALUES (?, ?, ?)').run(id, name, color);

        // 2. Criar Tipos
        const tipoMap = new Map<string, string>();
        for (const t of types) {
          const tId = crypto.randomUUID();
          db.prepare('INSERT INTO workspace_tipos (id, workspace_id, label, grupo) VALUES (?, ?, ?, ?)').run(tId, id, t.label, t.grupo);
          tipoMap.set(t.label, tId);
        }

        // 3. Criar Status
        const statusMap = new Map<string, string>();
        let orderIndex = 0;
        for (const s of statuses) {
          const sId = crypto.randomUUID();
          db.prepare('INSERT INTO workspace_status (id, workspace_id, label, grupo, meta_status, order_index) VALUES (?, ?, ?, ?, ?, ?)').run(sId, id, s.label, s.grupo, s.meta, orderIndex++);
          statusMap.set(s.label, sId);
        }

        // 4. Criar Relacionamentos (Ecossistema)
        for (const rel of relacionamentos) {
          db.prepare('INSERT INTO workspace_relacionamentos (id, workspace_id, label, color) VALUES (?, ?, ?, ?)').run(
            crypto.randomUUID(),
            id,
            rel.label,
            rel.color
          );
        }

        // 5. Criar Ideias e Conexões
        const now = new Date().toISOString();
        const ideaIdMap = new Map<string, string>();
        const correlationsToCreate: Array<{ from: string, to: string, desc: string }> = [];

        for (const entry of ideas) {
          if (entry.correlation) {
            correlationsToCreate.push(entry.correlation);
            continue;
          }

          const ideaId = crypto.randomUUID();
          const tId = (entry.tipo ? tipoMap.get(entry.tipo) : null) || Array.from(tipoMap.values())[0];
          const sId = (entry.status ? statusMap.get(entry.status) : null) || Array.from(statusMap.values())[0];
          const parentId = entry.parent_key ? ideaIdMap.get(entry.parent_key) : null;
          
          db.prepare(`
            INSERT INTO ideias (
              id, workspace_id, parent_id, nome, tipo, status, score, descricao,
              tags_avatar, tags_nicho, tags_dor, tags_desejo, tags_mecanismo,
              created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, '[]', '[]', '[]', '[]', '[]', ?, ?)
          `).run(ideaId, id, parentId, entry.nome || 'Nova Ideia', tId, sId, 3, entry.descricao || '', now, now);

          if (entry.id_key) {
            ideaIdMap.set(entry.id_key, ideaId);
          }
        }

        // 6. Criar Correlações Manuais
        for (const cor of correlationsToCreate) {
          const fromId = ideaIdMap.get(cor.from);
          const toId = ideaIdMap.get(cor.to);
          if (fromId && toId) {
            db.prepare('INSERT INTO ideia_correlacoes (id, ideia_a_id, ideia_b_id, descricao, created_at) VALUES (?, ?, ?, ?, ?)').run(
              crypto.randomUUID(),
              fromId,
              toId,
              cor.desc,
              now
            );
          }
        }

        return id;
      });
      
      const newWorkspaceId = dbTransaction();
      return db.prepare('SELECT * FROM workspaces WHERE id = ?').get(newWorkspaceId);
    } catch (error) {
      console.error('[workspaces:setupTemplate] Erro:', error);
      throw error;
    }
  });

  ipcMain.handle('taxonomia:tipos:getAll', (_, workspace_id: string) => {
    if (!db) return [];
    return db.prepare('SELECT * FROM workspace_tipos WHERE workspace_id = ? ORDER BY label ASC').all(workspace_id);
  });

  ipcMain.handle('taxonomia:tipos:create', (_, payload: { workspace_id: string; label: string; color?: string; icon?: string }) => {
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO workspace_tipos (id, workspace_id, label, color, icon) VALUES (?, ?, ?, ?, ?)').run(id, payload.workspace_id, payload.label, payload.color ?? null, payload.icon ?? null);
    return db.prepare('SELECT * FROM workspace_tipos WHERE id = ?').get(id);
  });
  
  ipcMain.handle('taxonomia:tipos:update', (_, payload: { id: string; label: string; color?: string; icon?: string }) => {
    const now = new Date().toISOString();
    db.prepare('UPDATE workspace_tipos SET label = ?, color = ?, icon = ?, updated_at = ? WHERE id = ?').run(payload.label, payload.color ?? null, payload.icon ?? null, now, payload.id);
    return db.prepare('SELECT * FROM workspace_tipos WHERE id = ?').get(payload.id);
  });

  ipcMain.handle('taxonomia:tipos:delete', (_, id: string) => {
    db.prepare('DELETE FROM workspace_tipos WHERE id = ?').run(id);
    return true;
  });

  ipcMain.handle('taxonomia:status:getAll', (_, workspace_id: string) => {
    if (!db) return [];
    return db.prepare('SELECT * FROM workspace_status WHERE workspace_id = ? ORDER BY order_index ASC').all(workspace_id);
  });

  ipcMain.handle('taxonomia:status:create', (_, payload: { workspace_id: string; label: string; color?: string; grouping?: string; order_index?: number }) => {
    const id = crypto.randomUUID();
    db.prepare('INSERT INTO workspace_status (id, workspace_id, label, color, grupo, order_index) VALUES (?, ?, ?, ?, ?, ?)').run(id, payload.workspace_id, payload.label, payload.color ?? null, payload.grouping ?? null, payload.order_index ?? 0);
    return db.prepare('SELECT * FROM workspace_status WHERE id = ?').get(id);
  });

  ipcMain.handle('taxonomia:status:update', (_, payload: { id: string; label: string; color?: string; grouping?: string; order_index?: number }) => {
    const now = new Date().toISOString();
    db.prepare('UPDATE workspace_status SET label = ?, color = ?, grupo = ?, order_index = ?, updated_at = ? WHERE id = ?').run(payload.label, payload.color ?? null, payload.grouping ?? null, payload.order_index ?? 0, now, payload.id);
    return db.prepare('SELECT * FROM workspace_status WHERE id = ?').get(payload.id);
  });

  ipcMain.handle('taxonomia:status:delete', (_, id: string) => {
    db.prepare('DELETE FROM workspace_status WHERE id = ?').run(id);
    return true;
  });

  // Relações (Ecossistema)
  ipcMain.handle('taxonomia:relacionamentos:getAll', (_, workspace_id: string) => {
    if (!db) return [];
    return db.prepare('SELECT * FROM workspace_relacionamentos WHERE workspace_id = ? ORDER BY label ASC').all(workspace_id);
  });

  ipcMain.handle('taxonomia:relacionamentos:create', (_, payload: { workspace_id: string; label: string; color?: string }) => {
    try {
      const id = crypto.randomUUID();
      db.prepare('INSERT INTO workspace_relacionamentos (id, workspace_id, label, color) VALUES (?, ?, ?, ?)').run(id, payload.workspace_id, payload.label, payload.color ?? null);
      return db.prepare('SELECT * FROM workspace_relacionamentos WHERE id = ?').get(id);
    } catch (e) {
      console.error('[taxonomia:relacionamentos:create] Erro:', e);
      throw e;
    }
  });

  ipcMain.handle('taxonomia:relacionamentos:update', (_, payload: { id: string; label: string; color?: string }) => {
    try {
      const now = new Date().toISOString();
      db.prepare('UPDATE workspace_relacionamentos SET label = ?, color = ?, updated_at = ? WHERE id = ?').run(payload.label, payload.color ?? null, now, payload.id);
      return db.prepare('SELECT * FROM workspace_relacionamentos WHERE id = ?').get(payload.id);
    } catch (e) {
      console.error('[taxonomia:relacionamentos:update] Erro:', e);
      throw e;
    }
  });

  ipcMain.handle('taxonomia:relacionamentos:delete', (_, id: string) => {
    try {
      db.prepare('DELETE FROM workspace_relacionamentos WHERE id = ?').run(id);
      return true;
    } catch (e) {
      console.error('[taxonomia:relacionamentos:delete] Erro:', e);
      throw e;
    }
  });

  // GET ALL (Com Soft Boundary / Filtro)
  ipcMain.handle('ideias:getAll', (_, workspace_id?: string) => {
    if (workspace_id) {
      return db.prepare('SELECT * FROM ideias WHERE workspace_id = ? ORDER BY created_at DESC').all(workspace_id);
    }
    return db.prepare('SELECT * FROM ideias ORDER BY created_at DESC').all();
  });

  // GET HISTÓRICO
  ipcMain.handle('ideias:getHistorico', (_, ideia_id: string) => {
    return db.prepare('SELECT * FROM ideias_historico WHERE ideia_id = ? ORDER BY created_at DESC').all(ideia_id);
  });

  // CREATE
  ipcMain.handle('ideias:create', (_, payload: Record<string, unknown>) => {
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const row = {
        id,
        workspace_id: payload.workspace_id ?? 'default_workspace',
        nome: payload.nome ?? '',
        tipo: payload.tipo ?? '',
        status: payload.status ?? '',
        score: payload.score ?? 1,
        descricao: payload.descricao ?? null,
        contexto: payload.contexto ?? null,
        problema: payload.problema ?? null,
        transformacao: payload.transformacao ?? null,
        publico_alvo: payload.publico_alvo ?? null,
        tags_avatar: JSON.stringify(payload.tags_avatar ?? []),
        tags_nicho: JSON.stringify(payload.tags_nicho ?? []),
        tags_dor: JSON.stringify(payload.tags_dor ?? []),
        tags_desejo: JSON.stringify(payload.tags_desejo ?? []),
        tags_mecanismo: JSON.stringify(payload.tags_mecanismo ?? []),
        is_arquivada: payload.is_arquivada ? 1 : 0,
        is_favorita: payload.is_favorita ? 1 : 0,
        parent_id: payload.parent_id ?? null,
        relationship_type: payload.relationship_type ?? null,
        last_accessed_at: now,
        created_at: now,
        updated_at: now,
      };

      db.prepare(`
        INSERT INTO ideias (
          id, workspace_id, nome, tipo, status, score,
          descricao, contexto, problema, transformacao, publico_alvo,
          tags_avatar, tags_nicho, tags_dor, tags_desejo, tags_mecanismo,
          is_arquivada, is_favorita, parent_id, relationship_type, last_accessed_at,
          created_at, updated_at
        ) VALUES (
          @id, @workspace_id, @nome, @tipo, @status, @score,
          @descricao, @contexto, @problema, @transformacao, @publico_alvo,
          @tags_avatar, @tags_nicho, @tags_dor, @tags_desejo, @tags_mecanismo,
          @is_arquivada, @is_favorita, @parent_id, @relationship_type, @last_accessed_at,
          @created_at, @updated_at
        )
      `).run(row);

      // Salva histórico
      logHistorico(id, 'Criou a ideia', 'Status inicial: ' + row.status);

      return db.prepare('SELECT * FROM ideias WHERE id = ?').get(id);
    } catch (e) {
      console.error('ERRO NO CREATE IDEIA:', e);
      throw e;
    }
  });

  // UPDATE
  ipcMain.handle('ideias:update', (_, payload: Record<string, unknown>) => {
    const { id, ...fields } = payload;

    // Serializa arrays de tags para JSON
    const tagFields = ['tags_avatar', 'tags_nicho', 'tags_dor', 'tags_desejo', 'tags_mecanismo'];
    for (const f of tagFields) {
      if (Array.isArray(fields[f])) {
        fields[f] = JSON.stringify(fields[f]);
      }
    }

    if ('is_arquivada' in fields) fields.is_arquivada = fields.is_arquivada ? 1 : 0;
    if ('is_favorita' in fields) fields.is_favorita = fields.is_favorita ? 1 : 0;

    fields.updated_at = new Date().toISOString();

    const setClauses = Object.keys(fields).map(k => `${k} = @${k}`).join(', ');
    db.prepare(`UPDATE ideias SET ${setClauses} WHERE id = @id`).run({ id, ...fields });

    // Salva histórico
    logHistorico(id as string, 'Editou a ideia', 'Atualização de campos descritivos.');

    return db.prepare('SELECT * FROM ideias WHERE id = ?').get(id);
  });

  // DELETE
  ipcMain.handle('ideias:delete', (_, id: string) => {
    // Remove arquivos físicos antes de deletar registros
    const arquivos = db.prepare('SELECT caminho FROM ideia_arquivos WHERE ideia_id = ?').all(id) as { caminho: string }[];
    for (const arq of arquivos) {
      try { if (fs.existsSync(arq.caminho)) fs.unlinkSync(arq.caminho); } catch { /* ignore */ }
    }
    db.prepare('DELETE FROM ideia_notas WHERE ideia_id = ?').run(id);
    db.prepare('DELETE FROM ideia_links WHERE ideia_id = ?').run(id);
    db.prepare('DELETE FROM ideia_arquivos WHERE ideia_id = ?').run(id);
    db.prepare('DELETE FROM ideia_correlacoes WHERE ideia_a_id = ? OR ideia_b_id = ?').run(id, id);
    
    // Desvincular ideias filhas (torná-las raízes) ao invés de apagá-las
    db.prepare('UPDATE ideias SET parent_id = NULL WHERE parent_id = ?').run(id);
    
    db.prepare('DELETE FROM ideias WHERE id = ?').run(id);
    db.prepare('DELETE FROM ideias_historico WHERE ideia_id = ?').run(id);
    return true;
  });

  // UPDATE STATUS (atalho para drag & drop do Kanban)
  ipcMain.handle('ideias:updateStatus', (_, { id, status }: { id: string; status: string }) => {
    db.prepare(`UPDATE ideias SET status = ?, updated_at = datetime('now') WHERE id = ?`).run(status, id);
    logHistorico(id, 'Mudou o status', `Novo status: ${status}`);
    return true;
  });

  // UPDATE ACESSO (Últimas Acessadas)
  ipcMain.handle('ideias:updateAcesso', (_, id: string) => {
    db.prepare(`UPDATE ideias SET last_accessed_at = datetime('now') WHERE id = ?`).run(id);
    return true;
  });

  // TOGGLE FAVORITA
  ipcMain.handle('ideias:toggleFavorita', (_, { id, is_favorita }: { id: string; is_favorita: number }) => {
    db.prepare(`UPDATE ideias SET is_favorita = ? WHERE id = ?`).run(is_favorita, id);
    return true;
  });

  // ── Notas ──────────────────────────────────────────────────────────────────
  ipcMain.handle('ideias:notas:getAll', (_, ideia_id: string) => {
    return db.prepare('SELECT * FROM ideia_notas WHERE ideia_id = ? ORDER BY created_at DESC').all(ideia_id);
  });

  ipcMain.handle('ideias:notas:create', (_, payload: Record<string, unknown>) => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO ideia_notas (id, ideia_id, titulo, conteudo, cor, created_at, updated_at)
      VALUES (@id, @ideia_id, @titulo, @conteudo, @cor, @created_at, @updated_at)
    `).run({
      id,
      ideia_id: payload.ideia_id,
      titulo: payload.titulo ?? null,
      conteudo: payload.conteudo ?? '',
      cor: payload.cor ?? '#1e293b',
      created_at: now,
      updated_at: now,
    });
    return db.prepare('SELECT * FROM ideia_notas WHERE id = ?').get(id);
  });

  ipcMain.handle('ideias:notas:update', (_, payload: Record<string, unknown>) => {
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE ideia_notas SET titulo = @titulo, conteudo = @conteudo, cor = @cor, updated_at = @updated_at
      WHERE id = @id
    `).run({
      id: payload.id,
      titulo: payload.titulo ?? null,
      conteudo: payload.conteudo ?? '',
      cor: payload.cor ?? '#1e293b',
      updated_at: now,
    });
    return db.prepare('SELECT * FROM ideia_notas WHERE id = ?').get(payload.id);
  });

  ipcMain.handle('ideias:notas:delete', (_, id: string) => {
    db.prepare('DELETE FROM ideia_notas WHERE id = ?').run(id);
    return true;
  });

  // ── Links ──────────────────────────────────────────────────────────────────
  ipcMain.handle('ideias:links:getAll', (_, ideia_id: string) => {
    return db.prepare('SELECT * FROM ideia_links WHERE ideia_id = ? ORDER BY created_at DESC').all(ideia_id);
  });

  ipcMain.handle('ideias:links:create', (_, payload: Record<string, unknown>) => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO ideia_links (id, ideia_id, url, titulo, descricao, created_at)
      VALUES (@id, @ideia_id, @url, @titulo, @descricao, @created_at)
    `).run({
      id,
      ideia_id: payload.ideia_id,
      url: payload.url ?? '',
      titulo: payload.titulo ?? null,
      descricao: payload.descricao ?? null,
      created_at: now,
    });
    return db.prepare('SELECT * FROM ideia_links WHERE id = ?').get(id);
  });

  ipcMain.handle('ideias:links:delete', (_, id: string) => {
    db.prepare('DELETE FROM ideia_links WHERE id = ?').run(id);
    return true;
  });

  // ── Arquivos ───────────────────────────────────────────────────────────────
  ipcMain.handle('ideias:arquivos:getAll', (_, ideia_id: string) => {
    return db.prepare('SELECT * FROM ideia_arquivos WHERE ideia_id = ? ORDER BY created_at DESC').all(ideia_id);
  });

  ipcMain.handle('ideias:arquivos:save', (_, payload: { ideia_id: string; nome: string; base64: string; tipo: string; tamanho: number }) => {
    try {
      const attachDir = path.join(app.getPath('userData'), 'attachments', payload.ideia_id);
      if (!fs.existsSync(attachDir)) fs.mkdirSync(attachDir, { recursive: true });
      const ext = path.extname(payload.nome);
      const fileName = `${crypto.randomUUID()}${ext}`;
      const filePath = path.join(attachDir, fileName);
      fs.writeFileSync(filePath, Buffer.from(payload.base64, 'base64'));
      const id = crypto.randomUUID();
      db.prepare(`
        INSERT INTO ideia_arquivos (id, ideia_id, nome_original, caminho, tipo_mime, tamanho, created_at)
        VALUES (@id, @ideia_id, @nome_original, @caminho, @tipo_mime, @tamanho, @created_at)
      `).run({
        id,
        ideia_id: payload.ideia_id,
        nome_original: payload.nome,
        caminho: filePath,
        tipo_mime: payload.tipo ?? null,
        tamanho: payload.tamanho ?? null,
        created_at: new Date().toISOString(),
      });
      return db.prepare('SELECT * FROM ideia_arquivos WHERE id = ?').get(id);
    } catch (e) {
      console.error('ERRO AO SALVAR ARQUIVO:', e);
      throw e;
    }
  });

  ipcMain.handle('ideias:arquivos:delete', (_, id: string) => {
    const row = db.prepare('SELECT caminho FROM ideia_arquivos WHERE id = ?').get(id) as { caminho: string } | undefined;
    if (row) {
      try { if (fs.existsSync(row.caminho)) fs.unlinkSync(row.caminho); } catch { /* ignore */ }
    }
    db.prepare('DELETE FROM ideia_arquivos WHERE id = ?').run(id);
    return true;
  });

  ipcMain.handle('ideias:arquivos:open', (_, id: string) => {
    const row = db.prepare('SELECT caminho FROM ideia_arquivos WHERE id = ?').get(id) as { caminho: string } | undefined;
    if (row && fs.existsSync(row.caminho)) {
      shell.openPath(row.caminho);
    }
    return true;
  });

  // TOGGLE ARQUIVADA
  ipcMain.handle('ideias:toggleArquivada', (_, { id, is_arquivada }: { id: string; is_arquivada: number }) => {
    db.prepare(`UPDATE ideias SET is_arquivada = ? WHERE id = ?`).run(is_arquivada, id);
    logHistorico(id, is_arquivada ? 'Arquivou a ideia' : 'Desarquivou a ideia');
    return true;
  });

  // ── Correlacoes (Ecossistema Geral) ───────────────────────────────────────
  ipcMain.handle('ideias:correlacoes:getAll', (_, ideia_id: string) => {
    // Retorna as correlações onde a ideia aparece como a ou b
    return db.prepare(`
      SELECT 
        c.*,
        CASE WHEN c.ideia_a_id = ? THEN c.ideia_b_id ELSE c.ideia_a_id END as correlata_id,
        CASE WHEN c.ideia_a_id = ? THEN i_b.nome ELSE i_a.nome END as correlata_nome,
        CASE WHEN c.ideia_a_id = ? THEN i_b.tipo ELSE i_a.tipo END as correlata_tipo,
        CASE WHEN c.ideia_a_id = ? THEN i_b.status ELSE i_a.status END as correlata_status,
        CASE WHEN c.ideia_a_id = ? THEN i_b.workspace_id ELSE i_a.workspace_id END as correlata_workspace_id
      FROM ideia_correlacoes c
      LEFT JOIN ideias i_a ON c.ideia_a_id = i_a.id
      LEFT JOIN ideias i_b ON c.ideia_b_id = i_b.id
      WHERE c.ideia_a_id = ? OR c.ideia_b_id = ?
      ORDER BY c.created_at DESC
    `).all(ideia_id, ideia_id, ideia_id, ideia_id, ideia_id, ideia_id, ideia_id);
  });

  ipcMain.handle('ideias:correlacoes:getAllTodos', () => {
    return db.prepare('SELECT * FROM ideia_correlacoes').all();
  });

  ipcMain.handle('ideias:correlacoes:create', (_, payload: { ideia_a_id: string; ideia_b_id: string; descricao?: string }) => {
    const id = crypto.randomUUID();
    db.prepare(`
      INSERT INTO ideia_correlacoes (id, ideia_a_id, ideia_b_id, descricao, created_at)
      VALUES (@id, @ideia_a_id, @ideia_b_id, @descricao, datetime('now'))
    `).run({
      id,
      ideia_a_id: payload.ideia_a_id,
      ideia_b_id: payload.ideia_b_id,
      descricao: payload.descricao ?? null
    });
    return true;
  });

  ipcMain.handle('ideias:correlacoes:update', (_, payload: { id: string; descricao?: string }) => {
    const now = new Date().toISOString();
    db.prepare('UPDATE ideia_correlacoes SET descricao = ?, updated_at = ? WHERE id = ?').run(payload.descricao ?? null, now, payload.id);
    return true;
  });

  ipcMain.handle('ideias:correlacoes:delete', (_, id: string) => {
    db.prepare('DELETE FROM ideia_correlacoes WHERE id = ?').run(id);
    return true;
  });
}

// ─── Janela Principal ─────────────────────────────────────────────────────────
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    frame: false,
    titleBarStyle: 'hidden',
    icon: app.isPackaged
      ? path.join(process.resourcesPath, 'images', 'logotipo.png')
      : path.join(__dirname, '../../src/images/logotipo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Maximiza a janela ao iniciar
  mainWindow.maximize();

  // IPC básicos
  ipcMain.handle('ping', () => 'pong');

  ipcMain.on('window-minimize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) win.minimize();
  });

  ipcMain.on('window-maximize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
    }
  });

  ipcMain.on('window-close', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) win.close();
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  mainWindow.webContents.openDevTools();
};

// ─── Lifecycle ────────────────────────────────────────────────────────────────
app.on('ready', () => {
  // Registrar handler para o protocolo brainvault://
  protocol.handle('brainvault', (request) => {
    try {
      const urlStr = request.url;
      const pathPart = urlStr.replace('brainvault://', '');
      
      let fullPath = '';
      let fileName = '';

      if (pathPart.startsWith('avatars/')) {
        fileName = pathPart.replace('avatars/', '');
        fullPath = path.join(app.getPath('userData'), 'avatars', fileName);
      } else {
        // Formato original: <ideia_id>/<file_name>
        const [ideiaId, ...fileParts] = pathPart.split('/');
        fileName = decodeURIComponent(fileParts.join('/'));
        fullPath = path.join(app.getPath('userData'), 'attachments', ideiaId, fileName);
      }

      if (!fs.existsSync(fullPath)) {
        return new Response('File not found', { status: 404 });
      }

      const data = fs.readFileSync(fullPath);
      const ext = path.extname(fileName).toLowerCase();
      let contentType = 'application/octet-stream';
      if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.gif') contentType = 'image/gif';
      else if (ext === '.webp') contentType = 'image/webp';
      else if (ext === '.svg') contentType = 'image/svg+xml';

      return new Response(data, {
        headers: { 'Content-Type': contentType }
      });
    } catch (e) {
      console.error('Erro no protocolo brainvault:', e);
      return new Response('Internal Server Error', { status: 500 });
    }
  });

  // initDatabase() será chamado via IPC quando o frontend validar o login
  ipcMain.handle('database:init', (_, userId: string) => {
    initDatabase(userId);
    return true;
  });

  registerIdeiaHandlers();
  registerUserHandlers();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function registerUserHandlers() {
  // ─── Manutenção de Perfil do Usuário ──────────────────────────────────────────
  ipcMain.handle('user:getProfile', () => {
    try {
      if (!db) return null;
      return db.prepare('SELECT * FROM user_profile WHERE id = ?').get('default');
    } catch (e) {
      console.error('Erro ao buscar perfil:', e);
      return null;
    }
  });

  ipcMain.handle('user:selectAvatar', async () => {
    console.log('Handler user:selectAvatar iniciado');
    try {
      const win = BrowserWindow.getFocusedWindow();
      const result = await dialog.showOpenDialog(win || undefined, {
        properties: ['openFile'],
        filters: [{ name: 'Imagens', extensions: ['jpg', 'png', 'gif', 'webp', 'jpeg'] }]
      });

      if (result.canceled || result.filePaths.length === 0) return null;

      const sourcePath = result.filePaths[0];
      const ext = path.extname(sourcePath);
      const fileName = `avatar_${Date.now()}${ext}`;
      const targetDir = path.join(app.getPath('userData'), 'avatars');

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const targetPath = path.join(targetDir, fileName);
      fs.copyFileSync(sourcePath, targetPath);

      return `brainvault://avatars/${fileName}`;
    } catch (e) {
      console.error('Erro ao selecionar avatar:', e);
      return null;
    }
  });

  ipcMain.handle('user:updateProfile', (_, { nickname, profession, avatarPath }) => {
    try {
      db.prepare(`
        UPDATE user_profile 
        SET nickname = ?, profession = ?, avatar_path = ?, updated_at = datetime('now')
        WHERE id = 'default'
      `).run(nickname, profession, avatarPath);
      return { success: true };
    } catch (e) {
      console.error('Erro ao atualizar perfil:', e);
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle('user:clearDatabase', () => {
    try {
      db.exec(`
        DELETE FROM ideia_arquivos;
        DELETE FROM ideia_links;
        DELETE FROM ideia_notas;
        DELETE FROM ideia_correlacoes;
        DELETE FROM ideias_historico;
        DELETE FROM ideias;
        DELETE FROM workspace_relacionamentos;
        DELETE FROM workspace_status;
        DELETE FROM workspace_tipos;
        DELETE FROM workspaces;
      `);
      return { success: true };
    } catch (e) {
      console.error('Erro ao limpar o banco:', e);
      return { success: false, error: e.message };
    }
  });
}
