<template>
  <Teleport to="body">
    <Transition name="dp-modal-fade">
      <div v-if="modalAberto" class="dp-modal-overlay" @click.self="fecharModal">
        <div class="dp-modal-container workspace-modal-width">
          
          <div class="dp-modal-header">
            <h2 class="dp-modal-title">Configurações do Workspace</h2>
            <button class="dp-close-btn" @click="fecharModal" title="Fechar">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div class="modal-tabs-container">
            <div class="dp-tabs">
              <button :class="['dp-tab', { 'active': tabAtiva === 'workspaces' }]" @click="tabAtiva = 'workspaces'">Meus Espaços</button>
              <template v-if="selectedWorkspace">
                <button :class="['dp-tab', { 'active': tabAtiva === 'detalhes' }]" @click="tabAtiva = 'detalhes'">Detalhes</button>
                <button :class="['dp-tab', { 'active': tabAtiva === 'tipos' }]" @click="tabAtiva = 'tipos'">Tipos</button>
                <button :class="['dp-tab', { 'active': tabAtiva === 'status' }]" @click="tabAtiva = 'status'">Status</button>
                <button :class="['dp-tab', { 'active': tabAtiva === 'relacionamentos' }]" @click="tabAtiva = 'relacionamentos'">Ecossistema</button>
              </template>
            </div>
          </div>

          <div class="dp-modal-body">
            <!-- ABA GERENCIAR COFRES -->
            <div v-show="tabAtiva === 'workspaces'" class="tab-pane">
              <div class="pane-intro">
                <h3>Seus Workspaces de Ideias</h3>
                <p>Crie novos espaços ou gerencie os existentes.</p>
              </div>

              <div class="settings-card">
                <div class="card-label">Novo Workspace (Em Branco)</div>
                <div class="inline-form">
                  <input v-model="newWsName" class="dp-input" placeholder="Nome do novo workspace..." @keyup.enter="handleCreateNewWs" />
                  <button class="dp-btn dp-btn-primary" @click="handleCreateNewWs" :disabled="!newWsName.trim()">Criar</button>
                </div>
              </div>

              <div class="settings-card">
                <div class="card-label">Criar a partir de Modelo</div>
                <div class="templates-grid">
                  <div 
                    v-for="t in TEMPLATES" 
                    :key="t.id" 
                    class="template-item"
                    @click="handleCreateFromTemplate(t.id)"
                  >
                    <div class="item-icon-box" :style="{ background: t.color + '15', color: t.color }">
                      <span v-html="t.icon"></span>
                    </div>
                    <div class="item-name">{{ t.name }}</div>
                  </div>
                </div>
              </div>

              <div class="settings-card">
                <div class="card-label">Workspaces Ativos ({{ workspaces.length }})</div>
                <div class="item-list">
                  <div v-for="ws in workspaces" :key="ws.id" class="list-item" :class="{ 'is-active': ws.id === selectedWorkspaceId }">
                    <div class="item-dot" :style="{ background: ws.color || '#009ef7' }"></div>
                    <div class="item-text">
                      {{ ws.name }}
                      <span v-if="ws.id === selectedWorkspaceId" class="badge">Atual</span>
                    </div>
                    <div class="item-actions">
                      <button class="small-btn" @click="selecionarParaConfig(ws.id)" title="Configurar">⚙️</button>
                      <button class="small-btn danger" @click="handleDeleteWs(ws)" title="Excluir">✖</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <template v-if="selectedWorkspace">
              <!-- ABA DETALHES -->
              <div v-show="tabAtiva === 'detalhes'" class="tab-pane">
                <div class="pane-intro">
                  <h3>Detalhes Básicos</h3>
                  <p>Gerencie o nome e a cor temática do seu workspace.</p>
                </div>

                <div class="field-row">
                  <label>Nome do Workspace</label>
                  <div class="inline-form">
                    <input v-model="editWsNameForm" class="dp-input" placeholder="Ex: Projetos Pessoais" />
                    <button class="dp-btn dp-btn-primary" @click="salvarNomeWs">Salvar</button>
                  </div>
                </div>

                <div class="field-row">
                  <label>Cor de Destaque</label>
                  <div class="color-picker-container">
                    <ModernColorPicker 
                      :model-value="selectedWorkspace.color || '#009ef7'" 
                      @update:model-value="atualizarCorWs"
                    />
                    <span class="helper-text">Toque para selecionar a cor principal.</span>
                  </div>
                </div>

                <div class="danger-zone-box">
                  <div class="danger-text-content">
                    <h4>Excluir Workspace</h4>
                    <p>Esta ação apagará permanentemente o workspace e todas as ideias.</p>
                  </div>
                  <button class="dp-btn dp-btn-danger sm" @click="confirmarDeleteWs">Excluir Tudo</button>
                </div>
              </div>

              <!-- ABA TIPOS -->
              <div v-show="tabAtiva === 'tipos'" class="tab-pane">
                <div class="pane-intro">
                  <h3>Tipos de Ideia</h3>
                  <p>Configure que categorias de ideias existem neste espaço.</p>
                </div>

                <div class="settings-card">
                  <div class="card-header-actions">
                    <div class="card-label">Categorias Atuais</div>
                    <button class="dp-btn dp-btn-ghost sm accent-text" @click="addTipo">+ Novo Tipo</button>
                  </div>

                  <div class="item-list">
                    <div v-for="t in tipos" :key="t.id" class="list-item">
                      <div v-if="editTipoId !== t.id" class="item-content-view">
                        <div class="item-dot" :style="{ background: t.color || '#94a3b8' }"></div>
                        <div class="item-text">{{ t.label }}</div>
                        <div class="item-actions">
                          <button class="small-btn" @click="iniciarEditTipo(t)">✎</button>
                          <button class="small-btn danger" @click="deleteTipo(t.id)">✖</button>
                        </div>
                      </div>
                      <div v-else class="item-edit-view">
                        <input v-model="editTipoForm.label" class="dp-input sm" placeholder="Nome" />
                        <div class="mini-picker">
                          <ModernColorPicker v-model="editTipoForm.color" />
                        </div>
                        <button class="dp-btn dp-btn-primary sm" @click="salvarTipo(t.id)">Ok</button>
                        <button class="dp-btn dp-btn-ghost sm" @click="editTipoId = null">X</button>
                      </div>
                    </div>

                    <div v-if="addingTipo" class="list-item is-adding">
                      <div class="item-edit-view">
                        <input v-model="newTipoForm.label" class="dp-input sm" placeholder="Ex: Produto" />
                        <div class="mini-picker">
                          <ModernColorPicker v-model="newTipoForm.color" />
                        </div>
                        <button class="dp-btn dp-btn-primary sm" @click="salvarNovoTipo">Criar</button>
                        <button class="dp-btn dp-btn-ghost sm" @click="addingTipo = false">X</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ABA STATUS -->
              <div v-show="tabAtiva === 'status'" class="tab-pane">
                <div class="pane-intro">
                  <h3>Status do Kanban</h3>
                  <p>Define as colunas que seu quadro possuirá.</p>
                </div>

                <div class="settings-card">
                  <div class="card-header-actions">
                    <div class="card-label">Colunas Configuradas</div>
                    <button class="dp-btn dp-btn-ghost sm accent-text" @click="addStatus">+ Novo Status</button>
                  </div>

                  <div class="item-list">
                    <div v-for="s in status" :key="s.id" class="list-item">
                      <div v-if="editStatusId !== s.id" class="item-content-view">
                        <div class="item-dot" :style="{ background: s.color || '#94a3b8' }"></div>
                        <div class="item-text">{{ s.label }}</div>
                        <div class="item-actions">
                          <button class="small-btn" @click="iniciarEditStatus(s)">✎</button>
                          <button class="small-btn danger" @click="deleteStatus(s.id)">✖</button>
                        </div>
                      </div>
                      <div v-else class="item-edit-view">
                        <input v-model="editStatusForm.label" class="dp-input sm" placeholder="Nome" />
                        <div class="mini-picker">
                          <ModernColorPicker v-model="editStatusForm.color" />
                        </div>
                        <button class="dp-btn dp-btn-primary sm" @click="salvarStatus(s.id)">Ok</button>
                        <button class="dp-btn dp-btn-ghost sm" @click="editStatusId = null">X</button>
                      </div>
                    </div>

                    <div v-if="addingStatus" class="list-item is-adding">
                      <div class="item-edit-view">
                        <input v-model="newStatusForm.label" class="dp-input sm" placeholder="Ex: Finalizado" />
                        <div class="mini-picker">
                          <ModernColorPicker v-model="newStatusForm.color" />
                        </div>
                        <button class="dp-btn dp-btn-primary sm" @click="salvarNovoStatus">Criar</button>
                        <button class="dp-btn dp-btn-ghost sm" @click="addingStatus = false">X</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ABA RELACIONAMENTOS -->
              <div v-show="tabAtiva === 'relacionamentos'" class="tab-pane">
                <div class="pane-intro">
                  <h3>Ecossistema e Relações</h3>
                  <p>Como suas ideias se conectam hierarquicamente.</p>
                </div>

                <div class="settings-card">
                  <div class="card-header-actions">
                    <div class="card-label">Tipos de Relação</div>
                    <button class="dp-btn dp-btn-ghost sm accent-text" @click="addRel">+ Nova Relação</button>
                  </div>

                  <div class="item-list">
                    <div v-for="r in relacionamentos" :key="r.id" class="list-item">
                      <div v-if="editRelId !== r.id" class="item-content-view">
                        <div class="item-dot" :style="{ background: r.color || '#94a3b8' }"></div>
                        <div class="item-text">{{ r.label }}</div>
                        <div class="item-actions">
                          <button class="small-btn" @click="iniciarEditRel(r)">✎</button>
                          <button class="small-btn danger" @click="handleDeleteRel(r.id)">✖</button>
                        </div>
                      </div>
                      <div v-else class="item-edit-view">
                        <input v-model="editRelForm.label" class="dp-input sm" placeholder="Nome" />
                        <div class="mini-picker">
                          <ModernColorPicker v-model="editRelForm.color" />
                        </div>
                        <button class="dp-btn dp-btn-primary sm" @click="salvarRel(r.id)">Ok</button>
                        <button class="dp-btn dp-btn-ghost sm" @click="editRelId = null">X</button>
                      </div>
                    </div>

                    <div v-if="addingRel" class="list-item is-adding">
                      <div class="item-edit-view">
                        <input v-model="newRelForm.label" class="dp-input sm" placeholder="Ex: Parte de" />
                        <div class="mini-picker">
                          <ModernColorPicker v-model="newRelForm.color" />
                        </div>
                        <button class="dp-btn dp-btn-primary sm" @click="salvarNovoRel">Criar</button>
                        <button class="dp-btn dp-btn-ghost sm" @click="addingRel = false">X</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useWorkspaces, type Workspace } from '../composables/useWorkspaces';
import { useTaxonomy, type TaxonomyTipo, type TaxonomyStatus } from '../composables/useTaxonomy';
import { useConfirm } from '../composables/useConfirm';
import { TEMPLATES } from '../lib/templates';
import ModernColorPicker from './ModernColorPicker.vue';

const emit = defineEmits<{
  (e: 'closed'): void;
}>();

const { 
  workspaces, updateWorkspace, deleteWorkspace, createWorkspace, 
  setupTemplateWorkspace, currentWorkspaceId: globalCurrentId 
} = useWorkspaces();
const { 
  tipos, status, relacionamentos, fetchTaxonomies, 
  createTipo, updateTipo, deleteTipo, 
  createStatus, updateStatus, deleteStatus,
  createRelacionamento, updateRelacionamento, deleteRelacionamento
} = useTaxonomy();
const { confirm: bvConfirm, alert: bvAlert } = useConfirm();

const modalAberto = ref(false);
const tabAtiva = ref('workspaces');
const selectedWorkspaceId = ref<string | null>(null);

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#64748b'];

function getRandomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

const selectedWorkspace = computed(() => workspaces.value.find(w => w.id === selectedWorkspaceId.value));

// -- Workspaces Edit
const editWsNameForm = ref('');

function abrirModal(workspace_id?: string) {
  modalAberto.value = true;
  if (workspace_id) {
    selectedWorkspaceId.value = workspace_id;
    editWsNameForm.value = workspaces.value.find(w => w.id === workspace_id)?.name || '';
    fetchTaxonomies(workspace_id);
    tabAtiva.value = 'detalhes';
  } else {
    tabAtiva.value = 'workspaces';
  }
}

function selecionarParaConfig(id: string) {
  selectedWorkspaceId.value = id;
  editWsNameForm.value = workspaces.value.find(w => w.id === id)?.name || '';
  fetchTaxonomies(id);
  tabAtiva.value = 'detalhes';
}

const newWsName = ref('');
async function handleCreateNewWs() {
  if (!newWsName.value.trim()) return;
  const ws = await createWorkspace(newWsName.value.trim(), '#009ef7');
  if (ws) {
    newWsName.value = '';
    selecionarParaConfig(ws.id);
    bvAlert({ title: 'Sucesso!', message: 'Novo workspace criado.', type: 'success' });
  }
}

async function handleCreateFromTemplate(templateId: string) {
  const ws = await setupTemplateWorkspace(templateId);
  if (ws) {
    selecionarParaConfig(ws.id);
    bvAlert({ title: 'Sucesso!', message: 'Workspace configurado a partir do modelo.', type: 'success' });
  }
}

function fecharModal() {
  modalAberto.value = false;
  emit('closed');
}

async function salvarNomeWs() {
  if (!selectedWorkspaceId.value || !editWsNameForm.value.trim()) return;
  const res = await updateWorkspace(selectedWorkspaceId.value, editWsNameForm.value.trim(), selectedWorkspace.value?.color, selectedWorkspace.value?.icon);
  if (res) {
    bvAlert({ title: 'Salvo!', message: 'Nome do workspace atualizado.', type: 'success' });
  }
}

async function atualizarCorWs(color: string) {
  if (!selectedWorkspaceId.value || !selectedWorkspace.value) return;
  await updateWorkspace(selectedWorkspaceId.value, selectedWorkspace.value.name, color, selectedWorkspace.value.icon);
}

async function confirmarDeleteWs() {
  if (!selectedWorkspaceId.value) return;
  const ok = await bvConfirm({
    title: 'Excluir Workspace?',
    message: 'Esta ação apagará tudo vinculado a ele. Deseja continuar?',
    type: 'danger',
    confirmText: 'Sim, excluir'
  });
  
  if (ok) {
    await deleteWorkspace(selectedWorkspaceId.value);
    tabAtiva.value = 'workspaces';
    selectedWorkspaceId.value = null;
  }
}

// -- Relacionamentos
const editRelId = ref<string | null>(null);
const editRelForm = ref({ label: '', color: '#94a3b8' });
const addingRel = ref(false);
const newRelForm = ref({ label: '', color: '#94a3b8' });

function addRel() {
  addingRel.value = true;
  newRelForm.value = { label: '', color: getRandomColor() };
}

function iniciarEditRel(r: any) {
  editRelId.value = r.id;
  editRelForm.value = { label: r.label, color: r.color || '#94a3b8' };
}

async function salvarNovoRel() {
  if (!newRelForm.value.label.trim()) return;
  await createRelacionamento({
    workspace_id: selectedWorkspaceId.value,
    label: newRelForm.value.label.trim(),
    color: newRelForm.value.color
  });
  addingRel.value = false;
}

async function salvarRel(id: string) {
  if (!editRelForm.value.label.trim()) return;
  await updateRelacionamento({ id, label: editRelForm.value.label.trim(), color: editRelForm.value.color });
  editRelId.value = null;
}

async function handleDeleteRel(id: string) {
  const ok = await bvConfirm({ title: 'Excluir Relação?', message: 'Deseja remover este tipo de relação?', type: 'danger' });
  if (ok) await deleteRelacionamento(id);
}

async function handleDeleteWs(ws: Workspace) {
  const ok = await bvConfirm({ title: `Excluir "${ws.name}"?`, message: 'Esta ação é irreversível.', type: 'danger' });
  if (ok) {
    await deleteWorkspace(ws.id);
    if (selectedWorkspaceId.value === ws.id) {
      selectedWorkspaceId.value = null;
      tabAtiva.value = 'workspaces';
    }
  }
}

watch(selectedWorkspaceId, (val) => {
  if (val && selectedWorkspace.value) {
    editWsNameForm.value = selectedWorkspace.value.name;
    tabAtiva.value = 'detalhes';
  }
});

// -- Tipos
const addingTipo = ref(false);
const newTipoForm = ref({ label: '', color: '#50cd89' });
const editTipoId = ref<string | null>(null);
const editTipoForm = ref({ label: '', color: '#50cd89' });

function addTipo() {
  addingTipo.value = true;
  newTipoForm.value = { label: '', color: getRandomColor() };
}
async function salvarNovoTipo() {
  if (!selectedWorkspaceId.value || !newTipoForm.value.label.trim()) return;
  await createTipo({ workspace_id: selectedWorkspaceId.value, label: newTipoForm.value.label, color: newTipoForm.value.color });
  addingTipo.value = false;
}
function iniciarEditTipo(t: TaxonomyTipo) {
  editTipoId.value = t.id;
  editTipoForm.value = { label: t.label, color: t.color || '#7e22ce' };
}
async function salvarTipo(id: string) {
  if (!editTipoForm.value.label.trim()) return;
  await updateTipo({ id, label: editTipoForm.value.label, color: editTipoForm.value.color });
  editTipoId.value = null;
}

// -- Status
const addingStatus = ref(false);
const newStatusForm = ref({ label: '', color: '#a1a5b7' });
const editStatusId = ref<string | null>(null);
const editStatusForm = ref({ label: '', color: '#a1a5b7' });

function addStatus() {
  addingStatus.value = true;
  newStatusForm.value = { label: '', color: getRandomColor() };
}
async function salvarNovoStatus() {
  if (!selectedWorkspaceId.value || !newStatusForm.value.label.trim()) return;
  await createStatus({ workspace_id: selectedWorkspaceId.value, label: newStatusForm.value.label, color: newStatusForm.value.color });
  addingStatus.value = false;
}
function iniciarEditStatus(s: TaxonomyStatus) {
  editStatusId.value = s.id;
  editStatusForm.value = { label: s.label, color: s.color || '#009ef7' };
}
async function salvarStatus(id: string) {
  if (!editStatusForm.value.label.trim()) return;
  await updateStatus({ id, label: editStatusForm.value.label, color: editStatusForm.value.color });
  editStatusId.value = null;
}

defineExpose({ abrirModal });
</script>

<style scoped>
.workspace-modal-width {
  width: 900px;
  max-width: 95vw;
  max-height: calc(100vh - 80px);
}



.modal-tabs-container {
  padding: 0 24px;
  border-bottom: 1px solid var(--dp-modal-border);
  background: rgba(0,0,0,0.01);
}
.dark .modal-tabs-container { background: rgba(255,255,255,0.01); }

.dp-tabs { display: flex; gap: 24px; }
.dp-tab {
  background: none; border: none; padding: 16px 4px; font-size: 14px; font-weight: 600;
  color: var(--dp-modal-text-secondary); cursor: pointer; border-bottom: 2px solid transparent;
  transition: all 0.2s; white-space: nowrap;
}
.dp-tab:hover { color: var(--dp-modal-text-primary); }
.dp-tab.active { color: #3b82f6; border-bottom-color: #3b82f6; }

.tab-pane { display: flex; flex-direction: column; gap: 24px; animation: dp-fade-in 0.2s ease; }
.pane-intro { margin-bottom: 8px; }
.pane-intro h3 { margin: 0 0 4px; font-size: 18px; font-weight: 700; color: var(--dp-modal-text-primary); }
.pane-intro p { margin: 0; font-size: 13px; color: var(--dp-modal-text-secondary); }

.settings-card {
  background: rgba(0,0,0,0.02); border: 1px solid var(--dp-modal-border);
  border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 16px;
}
.dark .settings-card { background: rgba(255,255,255,0.02); }
.card-label { font-size: 12px; font-weight: 700; color: var(--dp-modal-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }

.inline-form { display: flex; gap: 12px; }
.dp-input {
  flex: 1; background: var(--dp-modal-bg); border: 1px solid var(--dp-modal-border);
  border-radius: 12px; padding: 10px 16px; font-size: 14px; color: var(--dp-modal-text-primary);
  outline: none; transition: all 0.2s;
}
.dp-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
.dp-input.sm { padding: 8px 12px; font-size: 13px; }

.templates-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
.template-item {
  background: var(--dp-modal-bg); border: 1px solid var(--dp-modal-border);
  border-radius: 12px; padding: 14px; display: flex; align-items: center; gap: 12px;
  cursor: pointer; transition: all 0.2s;
}
.template-item:hover { transform: translateY(-2px); border-color: #3b82f6; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.item-icon-box { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.item-icon-box :deep(svg) { width: 18px; height: 18px; }
.item-name { font-size: 13px; font-weight: 600; color: var(--dp-modal-text-primary); }

.item-list { display: flex; flex-direction: column; gap: 8px; }
.list-item {
  background: var(--dp-modal-bg); border: 1px solid var(--dp-modal-border);
  border-radius: 12px; padding: 10px 16px; display: flex; align-items: center; gap: 12px;
  transition: all 0.2s;
}
.list-item.is-active { border-color: #3b82f6; background: rgba(59,130,246,0.03); }
.item-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.item-text { flex: 1; font-size: 14px; font-weight: 600; color: var(--dp-modal-text-primary); display: flex; align-items: center; }
.badge { font-size: 10px; background: #3b82f6; color: #fff; padding: 2px 8px; border-radius: 20px; margin-left: 8px; }

.item-actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.2s; }
.list-item:hover .item-actions { opacity: 1; }
.small-btn {
  width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
  border: none; background: rgba(0,0,0,0.05); border-radius: 8px; cursor: pointer; color: var(--dp-modal-text-secondary);
}
.dark .small-btn { background: rgba(255,255,255,0.05); }
.small-btn:hover { color: #3b82f6; background: rgba(59,130,246,0.1); }
.small-btn.danger:hover { color: #ef4444; background: rgba(239,68,68,0.1); }

.field-row { display: flex; flex-direction: column; gap: 8px; }
.field-row label { font-size: 13px; font-weight: 600; color: var(--dp-modal-text-secondary); }

.color-picker-container { display: flex; align-items: center; gap: 16px; background: rgba(0,0,0,0.02); padding: 12px 16px; border-radius: 12px; }
.dark .color-picker-container { background: rgba(255,255,255,0.02); }
.helper-text { font-size: 12px; color: var(--dp-modal-text-secondary); }

.danger-zone-box {
  margin-top: 16px; padding: 20px; background: rgba(239,68,68,0.05); border: 1px dashed rgba(239,68,68,0.3);
  border-radius: 16px; display: flex; justify-content: space-between; align-items: center;
}
.danger-text-content h4 { margin: 0 0 4px; color: #ef4444; font-size: 15px; font-weight: 700; }
.danger-text-content p { margin: 0; color: var(--dp-modal-text-secondary); font-size: 13px; }

.card-header-actions { display: flex; justify-content: space-between; align-items: center; }
.accent-text { color: #3b82f6 !important; }

.item-content-view { display: flex; align-items: center; gap: 12px; width: 100%; }
.item-edit-view { display: flex; align-items: center; gap: 8px; width: 100%; }
.mini-picker { width: 32px; height: 32px; overflow: hidden; border-radius: 8px; flex-shrink: 0; }

/* Transições customizadas */
.dp-modal-fade-enter-active, .dp-modal-fade-leave-active { transition: opacity 0.2s ease; }
.dp-modal-fade-enter-from, .dp-modal-fade-leave-to { opacity: 0; }

.card-title-modal {
  font-size: 14px;
  font-weight: 700;
  color: #181c32;
}
</style>

