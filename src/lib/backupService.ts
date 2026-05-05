import path from 'node:path';
import fs from 'node:fs';
import AdmZip from 'adm-zip';
import type Database from 'better-sqlite3';

export class BackupService {
  /**
   * Realiza um backup parcial (Apenas o banco de dados)
   */
  async backupPartial(db: Database.Database, destinationZipPath: string): Promise<boolean> {
    const dbPath = db.name;
    const userDataPath = path.dirname(dbPath);
    const dbFileName = path.basename(dbPath);

    const tempDir = path.join(userDataPath, 'temp_backup');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const tempDbPath = path.join(tempDir, dbFileName);

    try {
      // 1. Faz o backup seguro do banco online usando a API nativa
      await db.backup(tempDbPath);

      // 2. Cria o arquivo ZIP
      const zip = new AdmZip();
      zip.addLocalFile(tempDbPath);

      // 3. Salva no caminho escolhido
      zip.writeZip(destinationZipPath);

      // Limpeza
      if (fs.existsSync(tempDbPath)) fs.unlinkSync(tempDbPath);
      return true;
    } catch (e) {
      console.error('[BackupService] Erro no backup parcial:', e);
      throw e;
    }
  }

  /**
   * Realiza um backup completo (Banco de dados + Anexos + Avatares)
   */
  async backupFull(db: Database.Database, destinationZipPath: string): Promise<boolean> {
    const dbPath = db.name;
    const userDataPath = path.dirname(dbPath);
    const dbFileName = path.basename(dbPath);

    const tempDir = path.join(userDataPath, 'temp_backup');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const tempDbPath = path.join(tempDir, dbFileName);

    try {
      // 1. Faz o backup seguro do banco online
      await db.backup(tempDbPath);

      // 2. Inicia o ZIP
      const zip = new AdmZip();
      zip.addLocalFile(tempDbPath);

      // 3. Adiciona a pasta de anexos (se existir)
      const attachmentsPath = path.join(userDataPath, 'attachments');
      if (fs.existsSync(attachmentsPath)) {
        zip.addLocalFolder(attachmentsPath, 'attachments');
      }

      // 4. Adiciona a pasta de avatares (se existir)
      const avatarsPath = path.join(userDataPath, 'avatars');
      if (fs.existsSync(avatarsPath)) {
        zip.addLocalFolder(avatarsPath, 'avatars');
      }

      // 5. Salva no destino final
      zip.writeZip(destinationZipPath);

      // Limpeza
      if (fs.existsSync(tempDbPath)) fs.unlinkSync(tempDbPath);
      return true;
    } catch (e) {
      console.error('[BackupService] Erro no backup completo:', e);
      throw e;
    }
  }

  /**
   * Restaura um backup a partir de um ZIP
   * IMPORTANTE: O banco precisa ser reaberto no main process após isso.
   */
  async restoreBackup(zipPath: string, userDataPath: string, dbFileName: string): Promise<boolean> {
    try {
      const zip = new AdmZip(zipPath);
      
      // Valida se o arquivo principal está no ZIP
      const zipEntries = zip.getEntries();
      const hasDb = zipEntries.some(entry => entry.entryName === dbFileName);

      if (!hasDb) {
        throw new Error('Arquivo de backup inválido: não contém o banco de dados principal.');
      }

      // Descompacta substituindo os arquivos na raiz do userData
      zip.extractAllTo(userDataPath, true);

      return true;
    } catch (e) {
      console.error('[BackupService] Erro ao restaurar backup:', e);
      throw e;
    }
  }
}
