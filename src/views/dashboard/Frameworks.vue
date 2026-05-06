<template>
  <div class="bv-root">

    <!-- TOAST -->
    <div v-if="toast.visible" :class="['bv-toast', `bv-toast-${toast.type}`]">{{ toast.message }}</div>

    <!-- HEADER -->
    <div class="bv-header">
      <div class="bv-header-text">
        <p class="bv-subtitle" style="margin-top: -12px;">
          <strong>Workspace Atual:</strong>
          {{ frameworks.length }} ferramenta{{ frameworks.length !== 1 ? 's' : '' }} de análise
        </p>
      </div>
    </div>

    <!-- METRICS -->
    <div v-if="frameworks.length > 0" class="bv-metrics-grid">
      <div class="bv-metric-card bv-metric-blue">
        <div class="bv-metric-header">
          <span class="bv-metric-title">Total de Ferramentas</span>
          <div class="bv-metric-icon-wrap">
            <svg class="bv-metric-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div class="bv-metric-value">{{ frameworks.length }}</div>
        <div class="bv-metric-trend">Análises no workspace</div>
      </div>
      <div class="bv-metric-card bv-metric-green">
        <div class="bv-metric-header">
          <span class="bv-metric-title">Matrizes SWOT</span>
          <div class="bv-metric-icon-wrap">
            <svg class="bv-metric-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
        </div>
        <div class="bv-metric-value">{{ countByType('swot') }}</div>
        <div class="bv-metric-trend">Forças, Fraquezas, Oportunidades, Ameaças</div>
      </div>
      <div class="bv-metric-card bv-metric-purple">
        <div class="bv-metric-header">
          <span class="bv-metric-title">Canvas BMC</span>
          <div class="bv-metric-icon-wrap">
            <svg class="bv-metric-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
        <div class="bv-metric-value">{{ countByType('bmc') }}</div>
        <div class="bv-metric-trend">Business Model Canvas</div>
      </div>
      <div class="bv-metric-card bv-metric-orange">
        <div class="bv-metric-header">
          <span class="bv-metric-title">Vinculadas a Ideias</span>
          <div class="bv-metric-icon-wrap">
            <svg class="bv-metric-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        <div class="bv-metric-value">{{ linkedCount }}</div>
        <div class="bv-metric-trend">Conectadas a uma ideia</div>
      </div>
    </div>

    <!-- TOOLBAR -->
    <div class="bv-toolbar">
      <div class="bv-search-wrap">
        <svg class="bv-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="busca" class="bv-search" placeholder="Buscar ferramenta..." type="text" />
      </div>
      <select v-model="filtroTipo" class="bv-select">
        <option value="">Todos os tipos</option>
        <option value="swot">Matriz SWOT</option>
        <option value="bmc">Canvas BMC</option>
      </select>
    </div>

    <!-- EMPTY STATE -->
    <div v-if="filteredFrameworks.length === 0" class="bv-empty">
      <div class="bv-empty-icon">
        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <h3>Nenhuma ferramenta encontrada</h3>
      <p v-if="frameworks.length === 0">Crie sua primeira análise estratégica agora!</p>
      <p v-else>Tente ajustar os filtros de busca.</p>
      <button v-if="frameworks.length === 0" class="bv-btn-primary" @click="showNewModal = true">
        Criar primeira ferramenta
      </button>
    </div>

    <div v-else class="bv-list">
      <div v-for="fw in filteredFrameworks" :key="fw.id" class="bv-card" @dblclick="openEditor(fw)">
        <div class="bv-card-left">
          <div style="display: flex; gap: 8px; align-items: center;">
            <div class="bv-card-tipo-badge">{{ fw.framework === 'swot' ? 'SWOT' : 'BMC' }}</div>
            <div v-if="fw.ideia_id" class="bv-card-rel-badge">Vinculada a Ideia</div>
          </div>
          <div class="bv-card-nome">
            {{ fw.nome || (fw.framework === 'swot' ? '📊 Matriz SWOT' : '🧩 Canvas BMC') }}
          </div>
          <div class="bv-card-tipo">
            {{ fw.framework === 'swot' ? '📊 Matriz SWOT' : '🧩 Canvas BMC' }}
          </div>
          <div class="bv-card-desc">Criada em {{ formatDate(fw.created_at) }} · Última atualização: {{ formatDate(fw.updated_at) }}</div>
        </div>
        <div class="bv-card-right">
          <div class="fw-card-actions">
            <button class="bv-action-btn" @click.stop="openEditor(fw)" title="Abrir">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
              Editar
            </button>
            <button class="bv-action-btn bv-action-danger" @click.stop="handleDelete(fw.id)" title="Excluir">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="15" height="15">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: NOVA FERRAMENTA -->
    <Teleport to="body">
      <div v-if="showNewModal" class="dp-modal-overlay" @mousedown.self="showNewModal = false">
        <div class="dp-modal-container" style="max-width: 440px; width: 95vw;">
          <div class="dp-modal-header">
            <h3 class="dp-modal-title">Nova Ferramenta de Análise</h3>
            <button class="dp-close-btn" @click="showNewModal = false">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="dp-modal-body">
            <div class="fw-options">
              <button class="fw-option-btn" @click="createNew('swot')">
                <span class="fw-option-emoji">📊</span>
                <div class="fw-option-text">
                  <strong>Matriz SWOT</strong>
                  <small>Forças, Fraquezas, Oportunidades e Ameaças</small>
                </div>
              </button>
              <button class="fw-option-btn" @click="createNew('bmc')">
                <span class="fw-option-emoji">🧩</span>
                <div class="fw-option-text">
                  <strong>Canvas BMC</strong>
                  <small>Business Model Canvas — 9 blocos estratégicos</small>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- CONFIRM DELETE MODAL -->
    <ConfirmModal
      :show="confirmDelete.show"
      title="Excluir Ferramenta"
      message="Deseja realmente excluir esta ferramenta? Todos os dados preenchidos serão perdidos permanentemente."
      type="danger"
      icon="🗑️"
      confirm-text="Sim, excluir"
      @confirm="doDelete"
      @cancel="confirmDelete.show = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useWorkspaces } from '../../composables/useWorkspaces';
import { useBus } from '../../composables/useBus';
import type { Framework } from '../../types/ideia';
import ConfirmModal from '../../components/ConfirmModal.vue';

const { currentWorkspaceId } = useWorkspaces();
const { on, off } = useBus();
const router = useRouter();
const frameworks = ref<Framework[]>([]);
const showNewModal = ref(false);
const busca = ref('');
const filtroTipo = ref('');
const confirmDelete = reactive({ show: false, id: '' });

const toast = reactive({ visible: false, message: '', type: 'success' });
let toastTimer: ReturnType<typeof setTimeout> | null = null;

function showToast(msg: string, type: 'success' | 'error' = 'success') {
  toast.message = msg; toast.type = type; toast.visible = true;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.visible = false; }, 3000);
}

const filteredFrameworks = computed(() => {
  return frameworks.value.filter(fw => {
    const tipoOk = !filtroTipo.value || fw.framework === filtroTipo.value;
    const buscaOk = !busca.value || fw.framework.includes(busca.value.toLowerCase());
    return tipoOk && buscaOk;
  });
});

const countByType = (type: string) => frameworks.value.filter(f => f.framework === type).length;
const linkedCount = computed(() => frameworks.value.filter(f => f.ideia_id).length);

async function loadFrameworks() {
  if (!currentWorkspaceId.value) return;
  const data = await window.electronAPI.frameworks.getAll({ workspace_id: currentWorkspaceId.value });
  frameworks.value = data;
}

onMounted(() => {
  loadFrameworks();
  on('abrirNovaFerramenta', () => { showNewModal.value = true; });
});
watch(currentWorkspaceId, loadFrameworks);

onUnmounted(() => {
  off('abrirNovaFerramenta', () => { showNewModal.value = true; });
});

async function createNew(type: string) {
  if (!currentWorkspaceId.value) return;
  const saved = await window.electronAPI.frameworks.save({
    workspace_id: currentWorkspaceId.value,
    framework: type,
    dados: '{}'
  });
  frameworks.value.unshift(saved);
  showNewModal.value = false;
  router.push(`/dashboard/frameworks/${type}/${saved.id}`);
}

function openEditor(fw: Framework) {
  router.push(`/dashboard/frameworks/${fw.framework}/${fw.id}`);
}

async function handleSave(dados: string) {
  if (!editingFramework.value || !currentWorkspaceId.value) return;
  const saved = await window.electronAPI.frameworks.save({
    workspace_id: currentWorkspaceId.value,
    framework: editingFramework.value.framework,
    dados
  });
  const idx = frameworks.value.findIndex(f => f.id === saved.id);
  if (idx !== -1) frameworks.value[idx] = saved;
  editingFramework.value = null;
  showToast('Ferramenta salva com sucesso!');
}

function handleDelete(id: string) {
  confirmDelete.id = id;
  confirmDelete.show = true;
}

async function doDelete() {
  await window.electronAPI.frameworks.delete(confirmDelete.id);
  frameworks.value = frameworks.value.filter(f => f.id !== confirmDelete.id);
  confirmDelete.show = false;
  confirmDelete.id = '';
  showToast('Ferramenta removida.');
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}
</script>

<style scoped>
/* ─── Reutilizando o mesmo sistema de design do IdeaManager ─── */
.bv-root { display: flex; flex-direction: column; gap: 24px; }

.bv-toast {
  position: fixed; top: 24px; left: 50%; transform: translateX(-50%);
  padding: 12px 24px; border-radius: 8px; color: white;
  font-weight: 600; font-size: 14px; z-index: 9999;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  animation: slideDownToast 0.3s ease-out forwards;
}
.bv-toast-success { background: #10b981; }
.bv-toast-error { background: #ef4444; }
@keyframes slideDownToast {
  from { opacity: 0; transform: translate(-50%, -20px); }
  to   { opacity: 1; transform: translate(-50%, 0); }
}

.bv-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.bv-subtitle { font-size: 13px; color: var(--text-secondary); margin: 0; }

.bv-metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px; margin-bottom: 8px;
}
.bv-metric-card {
  border-radius: 12px; padding: 20px;
  display: flex; flex-direction: column; gap: 6px;
  box-shadow: 0 0.1rem 0.5rem 0.1rem rgba(0,0,0,0.03);
  transition: all 0.3s; color: #fff;
}
.bv-metric-card:hover { transform: translateY(-2px); box-shadow: 0 0.5rem 1.5rem -0.5rem rgba(0,0,0,0.15); }
.bv-metric-blue { background: #3b82f6; }
.bv-metric-green { background: #10b981; }
.bv-metric-orange { background: #f59e0b; }
.bv-metric-purple { background: #8b5cf6; }
.bv-metric-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.bv-metric-title { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.9); }
.bv-metric-icon-wrap { width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; border-radius: 8px; background: rgba(255,255,255,0.2); }
.bv-metric-svg { width: 20px; height: 20px; }
.bv-metric-value { font-size: 28px; font-weight: 700; color: #fff; line-height: 1.1; letter-spacing: -0.02em; }
.bv-metric-trend { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.8); margin-top: 4px; }

.bv-toolbar { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.bv-search-wrap { position: relative; flex: 1; min-width: 180px; }
.bv-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); width: 15px; height: 15px; color: var(--text-secondary); }
.bv-search { width: 100%; padding: 8px 12px 8px 32px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; color: var(--text-primary); font-size: 13px; outline: none; }
.bv-select { padding: 8px 28px 8px 10px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; color: var(--text-primary); font-size: 13px; outline: none; cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%2364748b' viewBox='0 0 24 24'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 8px center; background-size: 14px; }
.bv-btn-primary { display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: var(--accent); color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity 0.2s; white-space: nowrap; }
.bv-btn-primary:hover { opacity: 0.9; }

.bv-empty { text-align: center; padding: 80px 20px; color: var(--text-secondary); }
.bv-empty-icon { width: 48px; height: 48px; margin: 0 auto 16px; color: #94a3b8; }
.bv-empty-icon svg { width: 100%; height: 100%; }
.bv-empty h3 { font-size: 18px; font-weight: 600; color: var(--text-primary); margin: 0 0 8px; }
.bv-empty p { margin: 0 0 20px; }

.bv-list { display: flex; flex-direction: column; gap: 12px; }
.bv-card {
  position: relative; background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 16px; display: flex;
  justify-content: space-between; align-items: center; gap: 16px;
  transition: all 0.25s cubic-bezier(0.4,0,0.2,1); cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}
.bv-card:hover { border-color: var(--accent); transform: translateX(4px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.bv-card-left { display: flex; flex-direction: column; gap: 6px; flex: 1; }
.bv-card-tipo-badge { font-size: 10px; font-weight: 700; text-transform: uppercase; background: var(--border); color: var(--text-secondary); padding: 2px 8px; border-radius: 99px; width: fit-content; }
.bv-card-rel-badge { font-size: 10px; font-weight: 700; background: rgba(59,130,246,0.1); color: #3b82f6; padding: 2px 8px; border-radius: 99px; width: fit-content; }
.bv-card-nome { font-size: 15px; font-weight: 600; color: var(--text-primary); }
.bv-card-tipo { font-size: 12px; color: var(--text-secondary); }
.bv-card-desc { font-size: 12px; color: var(--text-secondary); }
.bv-card-right { display: flex; align-items: center; }
.fw-card-actions { display: flex; gap: 8px; }
.bv-action-btn { display: flex; align-items: center; gap: 4px; padding: 6px 12px; font-size: 12px; font-weight: 500; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; color: var(--text-primary); cursor: pointer; transition: all 0.2s; }
.bv-action-btn:hover { border-color: var(--accent); color: var(--accent); }
.bv-action-danger:hover { border-color: #ef4444; color: #ef4444; }

/* Modal de Nova Ferramenta */
.fw-options { display: flex; flex-direction: column; gap: 12px; padding: 4px 0; }
.fw-option-btn { display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; cursor: pointer; text-align: left; transition: all 0.2s; width: 100%; }
.fw-option-btn:hover { border-color: var(--accent); background: rgba(0,158,247,0.04); }
.fw-option-emoji { font-size: 2rem; flex-shrink: 0; }
.fw-option-text { display: flex; flex-direction: column; gap: 4px; }
.fw-option-text strong { font-size: 1rem; color: var(--text-color); }
.fw-option-text small { color: var(--text-muted); font-size: 0.8rem; }

/* Editor Modal - não mais utilizado mas mantido para compatibilidade futura */
.fw-editor-body { flex: 1; overflow-y: auto; }
</style>
