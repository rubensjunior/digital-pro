<template>
  <div v-if="isOpen" class="modal-overlay" @mousedown.self="fecharModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">Backup & Segurança</h2>
        <button class="close-btn" @click="fecharModal">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="alert-box info" v-if="daysSinceLastBackup === null">
          Você ainda não realizou nenhum backup nesta máquina. Recomendamos fazer um backup inicial agora.
        </div>
        <div class="alert-box success" v-else-if="daysSinceLastBackup <= 7">
          Seu último backup foi há {{ daysSinceLastBackup }} dia(s). Seus dados estão seguros!
        </div>
        <div class="alert-box warning" v-else>
          Atenção! Seu último backup foi há {{ daysSinceLastBackup }} dia(s). Faça um novo backup para evitar perdas!
        </div>

        <div class="backup-options">
          <!-- Status Message -->
          <div v-if="statusMessage" class="alert-box" :class="statusType">
            {{ statusMessage }}
          </div>

          <div class="backup-card">
            <div class="card-icon blue">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
            </div>
            <div class="card-content">
              <h3>Backup Completo</h3>
              <p>Exporta banco de dados, imagens e anexos do workspace.</p>
            </div>
            <button class="action-btn" :disabled="isProcessing" @click="handleExport('full')">
              {{ isProcessing ? 'Aguarde...' : 'Exportar' }}
            </button>
          </div>

          <div class="backup-card">
            <div class="card-icon indigo">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <div class="card-content">
              <h3>Backup Parcial</h3>
              <p>Exporta apenas o banco de dados (textos e configurações).</p>
            </div>
            <button class="action-btn" :disabled="isProcessing" @click="handleExport('partial')">
              {{ isProcessing ? 'Aguarde...' : 'Exportar' }}
            </button>
          </div>
        </div>

        <div class="restore-section">
          <div class="divider"><span>ou restaure um backup existente</span></div>
          <button class="restore-btn" :disabled="isProcessing" @click="handleImport">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Restaurar Backup (.zip)
          </button>
          <p class="restore-hint">Atenção: A restauração substituirá seus dados locais atuais.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const isOpen = ref(false);
const isProcessing = ref(false);
const lastBackupDate = ref<string | null>(null);
const statusMessage = ref<string>('');
const statusType = ref<'success' | 'warning' | 'info'>('info');

const daysSinceLastBackup = computed(() => {
  if (!lastBackupDate.value) return null;
  const lastDate = new Date(lastBackupDate.value);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastDate.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
});

function loadLastBackup() {
  lastBackupDate.value = localStorage.getItem('lastBackupDate');
}

function abrirModal() {
  loadLastBackup();
  statusMessage.value = '';
  isOpen.value = true;
}

function fecharModal() {
  if (isProcessing.value) return;
  isOpen.value = false;
}

function showStatus(msg: string, type: 'success' | 'warning' | 'info') {
  statusMessage.value = msg;
  statusType.value = type;
  if (type === 'success') {
    setTimeout(() => {
      statusMessage.value = '';
    }, 5000);
  }
}

async function handleExport(type: 'full' | 'partial') {
  if (!window.electronAPI?.backup) return;
  
  isProcessing.value = true;
  statusMessage.value = 'Iniciando exportação, aguarde a janela de salvamento...';
  statusType.value = 'info';

  try {
    const response = await window.electronAPI.backup.export(type);
    if (response.canceled) {
      statusMessage.value = ''; // Usuário apenas fechou a janela
    } else if (response.success && response.date) {
      localStorage.setItem('lastBackupDate', response.date);
      lastBackupDate.value = response.date;
      showStatus('Backup exportado com sucesso para o seu computador!', 'success');
    } else if (response.error) {
      showStatus('Erro ao exportar backup: ' + response.error, 'warning');
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    showStatus('Erro crítico: ' + errorMsg, 'warning');
  } finally {
    isProcessing.value = false;
  }
}

async function handleImport() {
  if (!window.electronAPI?.backup) return;

  const confirmou = confirm('Você tem certeza que deseja restaurar um backup? ISSO APAGARÁ SEUS DADOS ATUAIS NÃO SALVOS NO BACKUP.');
  if (!confirmou) return;

  isProcessing.value = true;
  statusMessage.value = 'Aguarde a janela de seleção de arquivo...';
  statusType.value = 'info';

  try {
    const response = await window.electronAPI.backup.import();
    if (response.canceled) {
      statusMessage.value = '';
    } else if (response.error) {
      showStatus('Erro ao restaurar backup: ' + response.error, 'warning');
    }
    // Se for sucesso, o app deve reiniciar (relaunch) e fechar automaticamente.
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    showStatus('Erro crítico: ' + errorMsg, 'warning');
  } finally {
    isProcessing.value = false;
  }
}

defineExpose({ abrirModal, fecharModal });
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--surface, #ffffff);
  width: 500px;
  max-width: 90vw;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  border: 1px solid var(--border, #e4e6ef);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border, #e4e6ef);
}

.modal-title { font-size: 18px; font-weight: 700; color: var(--text-primary, #181c32); margin: 0; }
.close-btn { background: none; border: none; color: var(--text-secondary, #a1a5b7); cursor: pointer; }
.close-btn svg { width: 20px; height: 20px; }

.modal-body {
  padding: 20px;
}

.alert-box {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13.5px;
  margin-bottom: 24px;
}
.alert-box.info { background: rgba(0, 158, 247, 0.1); color: #009ef7; }
.alert-box.success { background: rgba(80, 205, 137, 0.1); color: #50cd89; }
.alert-box.warning { background: rgba(241, 65, 108, 0.1); color: #f1416c; }

.backup-options { display: flex; flex-direction: column; gap: 12px; }

.backup-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid var(--border, #e4e6ef);
  border-radius: 8px;
  background: var(--bg, #f5f8fa);
}

.card-icon {
  width: 42px; height: 42px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}
.card-icon.blue { background: rgba(0, 158, 247, 0.1); color: #009ef7; }
.card-icon.indigo { background: rgba(114, 57, 234, 0.1); color: #7239ea; }
.card-icon svg { width: 22px; height: 22px; }

.card-content { flex: 1; }
.card-content h3 { margin: 0 0 4px; font-size: 15px; font-weight: 600; color: var(--text-primary, #181c32); }
.card-content p { margin: 0; font-size: 12px; color: var(--text-secondary, #a1a5b7); line-height: 1.4; }

.action-btn {
  background: #ffffff;
  border: 1px solid var(--border, #e4e6ef);
  color: var(--text-primary, #181c32);
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}
.action-btn:hover { border-color: var(--accent, #009ef7); color: var(--accent, #009ef7); }
.action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.restore-section {
  margin-top: 24px;
  text-align: center;
}

.divider {
  display: flex; align-items: center; text-align: center; margin-bottom: 16px;
  color: var(--text-secondary, #a1a5b7); font-size: 12px;
}
.divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid var(--border, #e4e6ef); }
.divider span { padding: 0 10px; }

.restore-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%;
  background: var(--surface, #ffffff);
  border: 1px dashed var(--border, #e4e6ef);
  color: var(--text-primary, #181c32);
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.restore-btn svg { width: 18px; height: 18px; }
.restore-btn:hover { border-color: #f1416c; color: #f1416c; background: rgba(241, 65, 108, 0.05); }

.restore-hint {
  font-size: 11px;
  color: var(--text-secondary, #a1a5b7);
  margin-top: 8px;
}
</style>
