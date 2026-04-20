<template>
  <Teleport to="body">
    <div v-if="modalAberto" class="metronic-overlay" @click.self="fecharModal">
      <div class="metronic-modal">
        
        <!-- Header minimalista -->
        <div class="metronic-modal-header">
          <h2 class="metronic-modal-title">Configurações do Workspace</h2>
          <button class="metronic-modal-close" @click="fecharModal">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Centralized Tabs -->
        <div class="metronic-tabs-wrapper">
          <div class="metronic-tabs">
            <button :class="['metronic-tab', { 'active': tabAtiva === 'workspaces' }]" @click="tabAtiva = 'workspaces'">Gerenciar Workspaces</button>
            <template v-if="selectedWorkspace">
              <button :class="['metronic-tab', { 'active': tabAtiva === 'detalhes' }]" @click="tabAtiva = 'detalhes'">Detalhes do Workspace</button>
              <button :class="['metronic-tab', { 'active': tabAtiva === 'tipos' }]" @click="tabAtiva = 'tipos'">Tipos de Ideia</button>
              <button :class="['metronic-tab', { 'active': tabAtiva === 'status' }]" @click="tabAtiva = 'status'">Status (Colunas)</button>
              <button :class="['metronic-tab', { 'active': tabAtiva === 'relacionamentos' }]" @click="tabAtiva = 'relacionamentos'">Ecossistema</button>
            </template>
          </div>
        </div>

        <div class="metronic-modal-body">
          
          <!-- ABA GERENCIAR COFRES -->
          <div v-show="tabAtiva === 'workspaces'" class="metronic-tab-pane">
            <div class="pane-header">
              <h3>Seus Workspaces de Ideias</h3>
              <p>Crie novos espaços ou gerencie os existentes.</p>
            </div>

            <div class="metronic-list" style="margin-bottom: 24px;">
              <div class="metronic-list-header">
                <span>Novo Workspace (Em Branco)</span>
              </div>
              <div class="metronic-form-group" style="margin: 0; max-width: 100%;">
                <div style="display:flex; gap: 12px;">
                  <input v-model="newWsName" class="metronic-input" style="flex:1" placeholder="Nome do novo workspace..." @keyup.enter="handleCreateNewWs" />
                  <button class="metronic-btn-primary" @click="handleCreateNewWs" :disabled="!newWsName.trim()">Criar Workspace</button>
                </div>
              </div>
            </div>

            <div class="metronic-list" style="margin-bottom: 40px;">
              <div class="metronic-list-header">
                <span>Criar a partir de Modelo</span>
              </div>
              <div class="templates-grid-modal">
                <div 
                  v-for="t in TEMPLATES" 
                  :key="t.id" 
                  class="template-card-modal"
                  @click="handleCreateFromTemplate(t.id)"
                >
                  <div class="card-icon-modal" :style="{ background: t.color + '20', color: t.color }">
                    <span v-html="t.icon"></span>
                  </div>
                  <div class="card-title-modal">{{ t.name }}</div>
                </div>
              </div>
            </div>

            <div class="metronic-list">
              <div class="metronic-list-header">
                <span>Workspaces Ativos ({{ workspaces.length }})</span>
              </div>

              <div class="metronic-list-body">
                <div v-for="ws in workspaces" :key="ws.id" class="metronic-list-item" :class="{ 'is-active': ws.id === selectedWorkspaceId }">
                  <div class="item-view">
                    <div class="item-color-indicator" :style="{ background: ws.color || '#009ef7' }"></div>
                    <div class="item-label">
                      {{ ws.name }}
                      <span v-if="ws.id === selectedWorkspaceId" class="active-badge">Atual</span>
                    </div>
                    <div class="item-actions">
                      <button class="action-icon" @click="selecionarParaConfig(ws.id)" title="Configurar este workspace">⚙️</button>
                      <button class="action-icon danger" @click="handleDeleteWs(ws)" title="Excluir workspace">✖</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <template v-if="selectedWorkspace">
          
          <!-- ABA DETALHES -->
          <div v-show="tabAtiva === 'detalhes'" class="metronic-tab-pane">
            <div class="pane-header">
              <h3>Detalhes Básicos</h3>
              <p>Gerencie o nome e a cor temática do seu workspace de ideias.</p>
            </div>

            <div class="metronic-form-group">
              <label>Nome do Workspace <span class="text-danger">*</span></label>
              <div style="display:flex; gap: 12px;">
                <input v-model="editWsNameForm" class="metronic-input" style="flex:1" placeholder="Ex: Projetos Pessoais" />
                <button class="metronic-btn-primary" @click="salvarNomeWs">Salvar Alterações</button>
              </div>
            </div>

            <div class="metronic-form-group">
              <label>Cor de Destaque <span class="text-danger">*</span></label>
              <div class="metronic-color-picker">
                <button 
                  v-for="hex in COLORS" 
                  :key="hex" 
                  class="color-btn" 
                  :class="{ active: selectedWorkspace.color === hex }"
                  :style="{ background: hex }"
                  @click="atualizarCorWs(hex)"
                ></button>
              </div>
            </div>

            <div class="metronic-danger-zone">
              <div class="danger-info">
                <h4>Excluir Workspace</h4>
                <p>Esta ação apagará permanentemente o workspace e todas as ideias atreladas a ele.</p>
              </div>
              <button class="metronic-btn-danger" @click="confirmarDeleteWs">Excluir Permanentemente</button>
            </div>
          </div>

          <!-- ABA TIPOS -->
          <div v-show="tabAtiva === 'tipos'" class="metronic-tab-pane">
            <div class="pane-header">
              <h3>Gestão de Tipos</h3>
              <p>Configure que tipos de ideias você quer que existam neste workspace.</p>
            </div>

            <div class="metronic-list">
              <div class="metronic-list-header">
                <span>Tipos Atuais</span>
                <button class="metronic-btn-light-primary" @click="addTipo">+ Adicionar Tipo</button>
              </div>

              <div class="metronic-list-body">
                <div v-for="t in tipos" :key="t.id" class="metronic-list-item">
                  <div v-if="editTipoId !== t.id" class="item-view">
                    <div class="item-color-indicator" :style="{ background: t.color || '#94a3b8' }"></div>
                    <div class="item-label">{{ t.label }}</div>
                    <div class="item-actions">
                      <button class="action-icon" @click="iniciarEditTipo(t)">✎</button>
                      <button class="action-icon danger" @click="deleteTipo(t.id)">✖</button>
                    </div>
                  </div>
                  <div v-else class="item-edit">
                    <input v-model="editTipoForm.label" class="metronic-input sm" placeholder="Nome do Tipo" style="flex: 1" />
                    <input type="color" v-model="editTipoForm.color" class="html-color-picker" />
                    <button class="metronic-btn-primary sm" @click="salvarTipo(t.id)">Salvar</button>
                    <button class="metronic-btn-light sm" @click="editTipoId = null">Cancelar</button>
                  </div>
                </div>

                <!-- Novo Tipo Row -->
                <div v-if="addingTipo" class="metronic-list-item is-new">
                  <div class="item-edit">
                    <input v-model="newTipoForm.label" class="metronic-input sm" placeholder="Ex: Produto, Post Instagram..." style="flex: 1" />
                    <input type="color" v-model="newTipoForm.color" class="html-color-picker" />
                    <button class="metronic-btn-primary sm" @click="salvarNovoTipo">Criar</button>
                    <button class="metronic-btn-light sm" @click="addingTipo = false">Cancelar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ABA STATUS -->
          <div v-show="tabAtiva === 'status'" class="metronic-tab-pane">
            <div class="pane-header">
              <h3>Status do Kanban</h3>
              <p>Define as colunas que seu quadro deste workspace possuirá.</p>
            </div>

            <div class="metronic-list">
              <div class="metronic-list-header">
                <span>Colunas / Status</span>
                <button class="metronic-btn-light-primary" @click="addStatus">+ Adicionar Status</button>
              </div>

              <div class="metronic-list-body">
                <div v-for="s in status" :key="s.id" class="metronic-list-item">
                  <div v-if="editStatusId !== s.id" class="item-view">
                    <div class="item-color-indicator" :style="{ background: s.color || '#94a3b8' }"></div>
                    <div class="item-label">{{ s.label }}</div>
                    <div class="item-actions">
                      <button class="action-icon" @click="iniciarEditStatus(s)">✎</button>
                      <button class="action-icon danger" @click="deleteStatus(s.id)">✖</button>
                    </div>
                  </div>
                  <div v-else class="item-edit">
                    <input v-model="editStatusForm.label" class="metronic-input sm" placeholder="Ex: Em Andamento" style="flex: 1" />
                    <input type="color" v-model="editStatusForm.color" class="html-color-picker" />
                    <button class="metronic-btn-primary sm" @click="salvarStatus(s.id)">Salvar</button>
                    <button class="metronic-btn-light sm" @click="editStatusId = null">Cancelar</button>
                  </div>
                </div>

                <!-- Novo Status Row -->
                <div v-if="addingStatus" class="metronic-list-item is-new">
                  <div class="item-edit">
                    <input v-model="newStatusForm.label" class="metronic-input sm" placeholder="Ex: Finalizado" style="flex: 1" />
                    <input type="color" v-model="newStatusForm.color" class="html-color-picker" />
                    <button class="metronic-btn-primary sm" @click="salvarNovoStatus">Criar</button>
                    <button class="metronic-btn-light sm" @click="addingStatus = false">Cancelar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ABA RELACIONAMENTOS (ECOSSISTEMA) -->
          <div v-show="tabAtiva === 'relacionamentos'" class="metronic-tab-pane">
            <div class="pane-header">
              <h3>Taxonomia do Ecossistema</h3>
              <p>Gerencie os tipos de relações que definem como suas ideias se conectam hierarquicamente.</p>
            </div>

            <div class="metronic-list">
              <div class="metronic-list-header">
                <span>Tipos de Relação</span>
                <button class="metronic-btn-light-primary" @click="addRel">+ Adicionar Relação</button>
              </div>

              <div class="metronic-list-body">
                <div v-for="r in relacionamentos" :key="r.id" class="metronic-list-item">
                  <div v-if="editRelId !== r.id" class="item-view">
                    <div class="item-color-indicator" :style="{ background: r.color || '#94a3b8' }"></div>
                    <div class="item-label">{{ r.label }}</div>
                    <div class="item-actions">
                      <button class="action-icon" @click="iniciarEditRel(r)">✎</button>
                      <button class="action-icon danger" @click="handleDeleteRel(r.id)">✖</button>
                    </div>
                  </div>
                  <div v-else class="item-edit">
                    <input v-model="editRelForm.label" class="metronic-input sm" placeholder="Nome da Relação" style="flex: 1" />
                    <input type="color" v-model="editRelForm.color" class="html-color-picker" />
                    <button class="metronic-btn-primary sm" @click="salvarRel(r.id)">Salvar</button>
                    <button class="metronic-btn-light sm" @click="editRelId = null">Cancelar</button>
                  </div>
                </div>

                <!-- Novo Relacionamento Row -->
                <div v-if="addingRel" class="metronic-list-item is-new">
                  <div class="item-edit">
                    <input v-model="newRelForm.label" class="metronic-input sm" placeholder="Ex: Módulo de, Upsell de..." style="flex: 1" />
                    <input type="color" v-model="newRelForm.color" class="html-color-picker" />
                    <button class="metronic-btn-primary sm" @click="salvarNovoRel">Criar</button>
                    <button class="metronic-btn-light sm" @click="addingRel = false">Cancelar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </template>

        </div>
        
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useWorkspaces, type Workspace } from '../composables/useWorkspaces';
import { useTaxonomy, type TaxonomyTipo, type TaxonomyStatus } from '../composables/useTaxonomy';
import { useConfirm } from '../composables/useConfirm';
import { TEMPLATES } from '../lib/templates';

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
    bvAlert({ title: 'Sucesso!', message: 'Novo workspace criado com êxito.', type: 'success' });
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
    bvAlert({ title: 'Salvo!', message: 'O nome do workspace foi atualizado com sucesso.', type: 'success' });
  } else {
    bvAlert({ title: 'Erro', message: 'Não foi possível salvar as alterações. Verifique se o app precisa ser reiniciado.', type: 'danger' });
  }
}

async function atualizarCorWs(color: string) {
  if (!selectedWorkspaceId.value || !selectedWorkspace.value) return;
  const res = await updateWorkspace(selectedWorkspaceId.value, selectedWorkspace.value.name, color, selectedWorkspace.value.icon);
  if (res) {
    bvAlert({ title: 'Cor Atualizada!', message: 'A cor de destaque do workspace foi alterada.', type: 'success' });
  } else {
    bvAlert({ title: 'Erro', message: 'Falha ao atualizar a cor.', type: 'danger' });
  }
}

async function confirmarDeleteWs() {
  if (!selectedWorkspaceId.value) return;
  const ok = await bvConfirm({
    title: 'Excluir Workspace?',
    message: 'Tem certeza? Isso apagará permanentemente este workspace e todas as ideias vinculadas a ele. Esta ação não pode ser desfeita.',
    type: 'danger',
    confirmText: 'Sim, excluir tudo'
  });
  
  if (ok) {
    await deleteWorkspace(selectedWorkspaceId.value);
    tabAtiva.value = 'workspaces';
    selectedWorkspaceId.value = null;
  }
}

// -- Relacionamentos CRUD
const editRelId = ref<string | null>(null);
const editRelForm = ref({ label: '', color: '#94a3b8' });
const addingRel = ref(false);
const newRelForm = ref({ label: '', color: '#94a3b8' });

function addRel() {
  addingRel.value = true;
  newRelForm.value = { label: '', color: '#3b82f6' };
}

function iniciarEditRel(r: any) {
  editRelId.value = r.id;
  editRelForm.value = { label: r.label, color: r.color || '#94a3b8' };
}

async function salvarNovoRel() {
  if (!newRelForm.value.label.trim()) return;
  const res = await createRelacionamento({
    workspace_id: selectedWorkspaceId.value,
    label: newRelForm.value.label.trim(),
    color: newRelForm.value.color
  });
  if (res) {
    addingRel.value = false;
    bvAlert({ title: 'Sucesso!', message: 'Novo tipo de relação adicionado.', type: 'success' });
  } else {
    bvAlert({ title: 'Erro', message: 'Não foi possível criar a relação. Verifique se reiniciou o app.', type: 'danger' });
  }
}

async function salvarRel(id: string) {
  if (!editRelForm.value.label.trim()) return;
  const res = await updateRelacionamento({
    id,
    label: editRelForm.value.label.trim(),
    color: editRelForm.value.color
  });
  if (res) {
    editRelId.value = null;
    bvAlert({ title: 'Atualizado!', message: 'O tipo de relação foi alterado.', type: 'success' });
  } else {
    bvAlert({ title: 'Erro', message: 'Falha ao atualizar a relação.', type: 'danger' });
  }
}

async function handleDeleteRel(id: string) {
  const ok = await bvConfirm({
    title: 'Excluir Relação?',
    message: 'Isso não removerá as relações das ideias existentes, mas este tipo não constará mais no catálogo do workspace.',
    type: 'danger'
  });
  if (ok) {
    await deleteRelacionamento(id);
    bvAlert({ title: 'Removido', message: 'Relação excluída com sucesso.', type: 'success' });
  }
}

async function handleDeleteWs(ws: Workspace) {
  const ok = await bvConfirm({
    title: `Excluir "${ws.name}"?`,
    message: 'Esta ação apagará permanentemente o workspace e todas as ideias nele contidas.',
    type: 'danger'
  });
  
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
  newTipoForm.value = { label: '', color: '#7e22ce' }; // Metronic purple baseline
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
  const res = await updateTipo({ id, label: editTipoForm.value.label, color: editTipoForm.value.color });
  if (res) {
    bvAlert({ title: 'Tipo Atualizado!', message: 'O tipo de ideia foi modificado com sucesso.', type: 'success' });
  } else {
    bvAlert({ title: 'Erro', message: 'Falha ao atualizar o tipo. Verifique o terminal.', type: 'danger' });
  }
  editTipoId.value = null;
}

// -- Status
const addingStatus = ref(false);
const newStatusForm = ref({ label: '', color: '#a1a5b7' });
const editStatusId = ref<string | null>(null);
const editStatusForm = ref({ label: '', color: '#a1a5b7' });

function addStatus() {
  addingStatus.value = true;
  newStatusForm.value = { label: '', color: '#009ef7' }; // Metronic blue baseline
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
  const res = await updateStatus({ id, label: editStatusForm.value.label, color: editStatusForm.value.color });
  if (res) {
    bvAlert({ title: 'Status Atualizado!', message: 'A coluna de status foi modificada com sucesso.', type: 'success' });
  } else {
    bvAlert({ title: 'Erro', message: 'Falha ao atualizar o status.', type: 'danger' });
  }
  editStatusId.value = null;
}

defineExpose({ abrirModal });
</script>

<style scoped>
.metronic-overlay {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 11000;
  animation: fadeIn 0.15s ease;
}

.metronic-modal {
  background: #ffffff;
  border-radius: 12px;
  width: 900px;
  max-width: 95vw;
  max-height: calc(100vh - 84px);
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  animation: slideUp 0.22s cubic-bezier(0.16,1,0.3,1);
}

.metronic-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 30px;
}

.metronic-modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #181c32;
  margin: 0;
}

.metronic-modal-close {
  background: none;
  border: none;
  color: #a1a5b7;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.metronic-modal-close:hover {
  background: #f5f8fa;
  color: #009ef7;
}

.metronic-modal-close svg {
  width: 20px;
  height: 20px;
}

/* Tabs */
.metronic-tabs-wrapper {
  padding: 0 30px;
  border-bottom: 1px solid #e4e6ef;
  display: flex;
  justify-content: center;
}

.metronic-tabs {
  display: flex;
  gap: 32px;
}

.metronic-tab {
  background: none;
  border: none;
  padding: 12px 4px;
  font-size: 14px;
  font-weight: 600;
  color: #a1a5b7;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.metronic-tab:hover {
  color: #7e22ce; /* Purple accent */
}

.metronic-tab.active {
  color: #7e22ce;
  border-bottom-color: #7e22ce;
}

/* Body & Content */
.metronic-modal-body {
  padding: 30px;
  overflow-y: auto;
  flex: 1;
  background: #fcfcfd;
}

.metronic-empty {
  padding: 40px;
  text-align: center;
  color: #a1a5b7;
}

.pane-header {
  margin-bottom: 30px;
  text-align: center;
}

.pane-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #181c32;
  margin: 0 0 6px 0;
}

.pane-header p {
  font-size: 13px;
  color: #a1a5b7;
  margin: 0;
}

.metronic-form-group {
  margin-bottom: 25px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.metronic-form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #3f4254;
  margin-bottom: 8px;
}

.text-danger { color: #f1416c; }

.metronic-input {
  background: #f5f8fa;
  border: none;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 500;
  color: #181c32;
  outline: none;
  transition: background 0.2s;
}
.metronic-input:focus { background: #eef3f7; }
.metronic-input.sm { padding: 8px 12px; font-size: 13px; }

.metronic-btn-primary {
  background: #009ef7;
  color: #fff;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.metronic-btn-primary:hover { background: #0095e8; }
.metronic-btn-primary.sm { padding: 8px 14px; font-size: 13px; }

.metronic-btn-light {
  background: #f5f8fa;
  color: #7e8299;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.metronic-btn-light:hover { background: #e4e6ef; color: #3f4254; }
.metronic-btn-light.sm { padding: 8px 14px; font-size: 13px; }

.metronic-color-picker {
  display: flex; gap: 10px; flex-wrap: wrap; background: #f5f8fa; padding: 16px; border-radius: 8px;
}

.color-btn {
  width: 32px; height: 32px; border-radius: 8px; border: 2px solid transparent; cursor: pointer; transition: transform 0.1s;
}
.color-btn:hover { transform: scale(1.1); }
.color-btn.active { border-color: #181c32; padding: 2px; background-clip: content-box; }

.metronic-danger-zone {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 40px; padding: 20px; background: #fff5f8; border: 1px dashed #f1416c; border-radius: 8px;
  max-width: 600px; margin-left: auto; margin-right: auto;
}
.danger-info h4 { margin: 0 0 4px; color: #181c32; font-size: 15px; font-weight: 700; }
.danger-info p { margin: 0; color: #f1416c; font-size: 13px; font-weight: 500; }

.metronic-btn-danger {
  background: #f1416c; color: #fff; border: none; padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s;
}
.metronic-btn-danger:hover { background: #d9214e; }

/* Lists UI */
.metronic-list {
  max-width: 650px;
  margin: 0 auto;
}

.metronic-list-header {
  display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid #e4e6ef; margin-bottom: 12px;
}
.metronic-list-header span { font-size: 14px; font-weight: 600; color: #3f4254; }

.metronic-btn-light-primary {
  background: #f1faff; color: #009ef7; border: none; padding: 10px 18px; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; transition: background 0.2s;
}
.metronic-btn-light-primary:hover { background: #e1f4ff; }

.metronic-list-body {
  display: flex; flex-direction: column; gap: 8px;
}

.metronic-list-item {
  background: #f5f8fa; border-radius: 8px; overflow: hidden;
}

.item-view {
  display: flex; align-items: center; padding: 12px 16px; gap: 16px;
}

.item-color-indicator { width: 12px; height: 12px; border-radius: 50%; }
.item-label { flex: 1; font-size: 14px; font-weight: 600; color: #181c32; }
.item-actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.2s; }
.metronic-list-item:hover .item-actions { opacity: 1; }

.action-icon {
  background: #fff; border: none; width: 30px; height: 30px; border-radius: 6px; cursor: pointer;
  color: #a1a5b7; font-size: 13px; display: flex; align-items: center; justify-content: center;
}
.action-icon:hover { color: #009ef7; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.action-icon.danger:hover { color: #f1416c; background: #fff5f8; }

.active-badge {
  font-size: 10px;
  background: #e1f4ff;
  color: #009ef7;
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: 8px;
  font-weight: 700;
  text-transform: uppercase;
}

.metronic-list-item.is-active {
  background: #ffffff;
  border: 1px solid #e1f4ff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
}

.item-edit {
  display: flex; align-items: center; padding: 12px 16px; gap: 10px; background: #f1faff;
}
.html-color-picker {
  width: 34px; height: 34px; border: none; padding: 0; border-radius: 8px; cursor: pointer; background: transparent;
}
.html-color-picker::-webkit-color-swatch-wrapper { padding: 0; }
.html-color-picker::-webkit-color-swatch { border: none; border-radius: 6px; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* Template Grid in Modal */
.templates-grid-modal {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 4px 0;
}

.template-card-modal {
  background: #f8fafc;
  border: 1px solid #e4e6ef;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.template-card-modal:hover {
  background: #ffffff;
  border-color: #009ef7;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transform: translateY(-2px);
}

.card-icon-modal {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon-modal :deep(svg) {
  width: 20px;
  height: 20px;
}

.card-title-modal {
  font-size: 14px;
  font-weight: 700;
  color: #181c32;
}
</style>
