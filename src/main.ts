import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import crypto from 'node:crypto';
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
      created_at     TEXT DEFAULT (datetime('now')),
      updated_at     TEXT DEFAULT (datetime('now'))
    );
  `);
}

// ─── IPC Handlers — Brain Vault ───────────────────────────────────────────────
function registerIdeiaHandlers() {
  // GET ALL
  ipcMain.handle('ideias:getAll', () => {
    return db.prepare('SELECT * FROM ideias ORDER BY created_at DESC').all();
  });

  // CREATE
  ipcMain.handle('ideias:create', (_, payload: Record<string, unknown>) => {
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
      created_at: now,
      updated_at: now,
    };

    db.prepare(`
      INSERT INTO ideias (
        id, nome, tipo, status, score,
        descricao, contexto, problema, transformacao, publico_alvo,
        tags_avatar, tags_nicho, tags_dor, tags_desejo, tags_mecanismo,
        created_at, updated_at
      ) VALUES (
        @id, @nome, @tipo, @status, @score,
        @descricao, @contexto, @problema, @transformacao, @publico_alvo,
        @tags_avatar, @tags_nicho, @tags_dor, @tags_desejo, @tags_mecanismo,
        @created_at, @updated_at
      )
    `).run(row);

    return db.prepare('SELECT * FROM ideias WHERE id = ?').get(id);
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

    fields.updated_at = new Date().toISOString();

    const setClauses = Object.keys(fields).map(k => `${k} = @${k}`).join(', ');
    db.prepare(`UPDATE ideias SET ${setClauses} WHERE id = @id`).run({ id, ...fields });

    return db.prepare('SELECT * FROM ideias WHERE id = ?').get(id);
  });

  // DELETE
  ipcMain.handle('ideias:delete', (_, id: string) => {
    db.prepare('DELETE FROM ideias WHERE id = ?').run(id);
    return true;
  });

  // UPDATE STATUS (atalho para drag & drop do Kanban)
  ipcMain.handle('ideias:updateStatus', (_, { id, status }: { id: string; status: string }) => {
    db.prepare(`UPDATE ideias SET status = ?, updated_at = datetime('now') WHERE id = ?`).run(status, id);
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
