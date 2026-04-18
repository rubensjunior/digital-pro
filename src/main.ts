import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'node:path';
import crypto from 'node:crypto';
import fs from 'node:fs';
import started from 'electron-squirrel-startup';
import { updateElectronApp } from 'update-electron-app';

updateElectronApp({
  repo: 'rubensjunior/digital-pro',
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// ─── SQLite — Brain Vault ─────────────────────────────────────────────────────
// O banco fica em %APPDATA%\rks-digital-pro\brainvault.db (Windows)
// Importação dinâmica para compatibilidade com o empacotamento do Electron Forge

let db: import('better-sqlite3').Database;

function initDatabase() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Database = require('better-sqlite3');
  const dbPath = path.join(app.getPath('userData'), 'brainvault.db');
  db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS ideias (
      id             TEXT PRIMARY KEY,
      nome           TEXT NOT NULL,
      tipo           TEXT NOT NULL,
      status         TEXT NOT NULL DEFAULT 'bruta',
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
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
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

// ─── IPC Handlers — Brain Vault ───────────────────────────────────────────────
function registerIdeiaHandlers() {
  // GET ALL
  ipcMain.handle('ideias:getAll', () => {
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
        nome: payload.nome ?? '',
        tipo: payload.tipo ?? 'Outro',
        status: payload.status ?? 'bruta',
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
          id, nome, tipo, status, score,
          descricao, contexto, problema, transformacao, publico_alvo,
          tags_avatar, tags_nicho, tags_dor, tags_desejo, tags_mecanismo,
          is_arquivada, is_favorita, parent_id, relationship_type, last_accessed_at,
          created_at, updated_at
        ) VALUES (
          @id, @nome, @tipo, @status, @score,
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
        CASE WHEN c.ideia_a_id = ? THEN i_b.status ELSE i_a.status END as correlata_status
      FROM ideia_correlacoes c
      LEFT JOIN ideias i_a ON c.ideia_a_id = i_a.id
      LEFT JOIN ideias i_b ON c.ideia_b_id = i_b.id
      WHERE c.ideia_a_id = ? OR c.ideia_b_id = ?
      ORDER BY c.created_at DESC
    `).all(ideia_id, ideia_id, ideia_id, ideia_id, ideia_id, ideia_id);
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
  initDatabase();
  registerIdeiaHandlers();
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
