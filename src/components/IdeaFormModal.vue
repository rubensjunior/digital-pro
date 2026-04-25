<template>
  <Teleport to="body">
    <Transition name="dp-modal-fade">
      <div v-if="modalAberto" class="dp-modal-overlay" @click.self="fecharModal">
        <div class="dp-modal-container idea-modal-width">
          <div class="dp-modal-header">
            <div class="idea-header-left">
              <div class="idea-icon-box">💡</div>
              <div>
                <h2 class="dp-modal-title">{{ editando ? 'Editar Ideia' : 'Nova Ideia' }}</h2>
                <p class="idea-header-sub">{{ editando ? 'Atualize os dados da ideia' : 'Capture e classifique sua ideia' }}</p>
              </div>
            </div>
            <button class="dp-close-btn" @click="fecharModal" title="Fechar">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div class="modal-tabs-container">
            <div class="dp-tabs">
              <button
                v-for="(tab, i) in TABS"
                :key="i"
                :class="['dp-tab', { 'active': tabAtiva === i }]"
                @click="tabAtiva = i"
              >
                {{ tab }}
              </button>
            </div>
          </div>

          <div class="dp-modal-body">
            <!-- ABA 1 — Identificação -->
            <div v-show="tabAtiva === 0" class="tab-pane">
              <div class="dp-field">
                <label class="dp-label">Nome da ideia *</label>
                <input v-model="form.nome" :class="['dp-input', { 'has-error': formErros.nome }]" placeholder="Ex: Método das 3 Perguntas" type="text" @input="formErros.nome = false" />
                <span v-if="formErros.nome" class="field-error-msg">Nome é obrigatório</span>
              </div>

              <div class="field-grid">
                <div class="dp-field">
                  <label class="dp-label">Tipo *</label>
                  <select v-model="form.tipo" :class="['dp-input dp-select', { 'has-error': formErros.tipo }]" @change="formErros.tipo = false">
                    <option value="">Selecione o tipo</option>
                    <optgroup v-for="grupo in tiposAgrupados" :key="grupo.label" :label="grupo.label">
                      <option v-for="t in grupo.options" :key="t.id" :value="t.id">{{ t.label }}</option>
                    </optgroup>
                  </select>
                  <span v-if="formErros.tipo" class="field-error-msg">Tipo é obrigatório</span>
                </div>

                <div class="dp-field">
                  <label class="dp-label">Status</label>
                  <select v-model="form.status" class="dp-input dp-select">
                    <optgroup v-for="grupo in statusAgrupados" :key="grupo.label" :label="grupo.label">
                      <option v-for="s in grupo.options" :key="s.id" :value="s.id">{{ s.label }}</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div class="dp-field">
                <label class="dp-label">Score de Potencial</label>
                <div class="score-container">
                  <div class="score-stars">
                    <button
                      v-for="n in 4"
                      :key="n"
                      class="score-star-btn"
                      :class="{ active: n <= form.score }"
                      @click="form.score = n"
                      type="button"
                    >★</button>
                  </div>
                  <span class="score-label-badge">{{ SCORE_LABELS[form.score - 1] }}</span>
                </div>
              </div>
            </div>

            <!-- ABA 2 — Descrição -->
            <div v-show="tabAtiva === 1" class="tab-pane">
              <div class="dp-field">
                <label class="dp-label">Descrição geral</label>
                <textarea v-model="form.descricao" class="dp-textarea" rows="3" placeholder="Descreva a ideia em poucas palavras..."/>
              </div>
              <div class="dp-field">
                <label class="dp-label">{{ labelsAdaptativos.contexto.label }}</label>
                <textarea v-model="form.contexto" class="dp-textarea" rows="2" :placeholder="labelsAdaptativos.contexto.placeholder"/>
              </div>
              <div class="field-grid">
                <div class="dp-field">
                  <label class="dp-label">{{ labelsAdaptativos.problema.label }}</label>
                  <textarea v-model="form.problema" class="dp-textarea" rows="2" :placeholder="labelsAdaptativos.problema.placeholder"/>
                </div>
                <div class="dp-field">
                  <label class="dp-label">{{ labelsAdaptativos.transformacao.label }}</label>
                  <textarea v-model="form.transformacao" class="dp-textarea" rows="2" :placeholder="labelsAdaptativos.transformacao.placeholder"/>
                </div>
              </div>
              <div class="dp-field">
                <label class="dp-label">{{ labelsAdaptativos.publico.label }}</label>
                <input v-model="form.publico_alvo" class="dp-input" :placeholder="labelsAdaptativos.publico.placeholder" type="text"/>
              </div>
            </div>

            <!-- ABA 3 — Tags -->
            <div v-show="tabAtiva === 2" class="tab-pane">
              <div v-for="tagGroup in labelsAdaptativos.tags" :key="tagGroup.key" class="dp-field">
                <label class="dp-label">{{ tagGroup.label }}</label>
                <div class="tags-input-container">
                  <div class="tags-list">
                    <span
                      v-for="tag in (form as any)[tagGroup.key]"
                      :key="tag"
                      class="dp-chip"
                    >
                      {{ tag }}
                      <button @click="removeTag(tagGroup.key, tag)" type="button">×</button>
                    </span>
                  </div>
                  <input
                    :placeholder="tagGroup.placeholder"
                    class="tags-bare-input"
                    @keydown.enter.prevent="addTag(tagGroup.key, $event)"
                    @keydown.tab.prevent="addTag(tagGroup.key, $event)"
                  />
                </div>
              </div>
            </div>

            <!-- ABA 4 — Relacionamento -->
            <div v-show="tabAtiva === 3" class="tab-pane">
              <div class="dp-field">
                <label class="dp-label">Ideia Principal (Opcional)</label>
                <select v-model="form.parent_id" class="dp-input dp-select">
                  <option value="">Nenhuma (Esta é uma ideia principal)</option>
                  <option v-for="i in opcoesPaiDisponiveis" :key="i.id" :value="i.id">
                    {{ i.nome }}
                  </option>
                </select>
                <span class="helper-text">A qual ideia macro esta ideia pertence?</span>
              </div>
              <div class="dp-field" v-if="form.parent_id">
                <label class="dp-label">Tipo de Relação *</label>
                <select v-model="form.relationship_type" class="dp-input dp-select">
                  <option value="">Selecione o tipo de relação</option>
                  <option v-for="rel in relacionamentos" :key="rel.id" :value="rel.label">{{ rel.label }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="dp-modal-footer">
            <button class="dp-btn dp-btn-ghost" @click="fecharModal" type="button">Cancelar</button>
            <button class="dp-btn dp-btn-primary" @click="salvar(true)" type="button">
              {{ editando ? 'Salvar alterações' : 'Criar Ideia' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import type { Ideia, IdeiaStatus, IdeiaTipo } from '../types/ideia';
import { useIdeias } from '../composables/useIdeias';
import { useTaxonomy } from '../composables/useTaxonomy';
import { useWorkspaces } from '../composables/useWorkspaces';
import { useConfirm } from '../composables/useConfirm';

const { tiposAgrupados, statusAgrupados, status, relacionamentos } = useTaxonomy();
const { currentWorkspaceId } = useWorkspaces();

const props = defineProps<{
  ideias: Ideia[];
}>();

const emit = defineEmits<{
  (e: 'saved', ideia: any): void;
  (e: 'closed'): void;
}>();

const { createIdeia, updateIdeia } = useIdeias();
const { alert: bvAlert } = useConfirm();

const TABS = ['Identificação', 'Descrição', 'Tags', 'Relacionamento'];
const SCORE_LABELS = ['Baixo', 'Médio', 'Alto', 'Muito alto'];

const defaultLabels = {
  contexto: { label: 'Contexto', placeholder: 'De onde surgiu a ideia?' },
  problema: { label: 'Problema', placeholder: 'O que resolve ou pretende resolver?' },
  transformacao: { label: 'Transformação', placeholder: 'Resultado esperado.' },
  publico: { label: 'Público-alvo / Persona', placeholder: 'Para quem é esta ideia?' },
  tags: [
    { key: 'tags_avatar',    label: 'Avatar', placeholder: 'Ex: iniciante' },
    { key: 'tags_nicho',     label: 'Nicho',     placeholder: 'Ex: fitness, dev' },
    { key: 'tags_dor',       label: 'Dor / Necessidade', placeholder: 'Ex: falta de tempo' },
    { key: 'tags_desejo',    label: 'Desejo / Objetivo', placeholder: 'Ex: produtividade' },
    { key: 'tags_mecanismo', label: 'Diferencial',       placeholder: 'Ex: método rápido' }
  ]
};

const labelsAdaptativos = computed(() => defaultLabels);

const modalAberto = ref(false);
const editando = ref<string | null>(null);
const tabAtiva = ref(0);

const formVazio = () => ({
  nome: '',
  tipo: '' as IdeiaTipo | '',
  status: (status.value[0]?.id || '') as IdeiaStatus,
  workspace_id: currentWorkspaceId.value || '',
  score: 2,
  descricao: '',
  contexto: '',
  problema: '',
  transformacao: '',
  publico_alvo: '',
  tags_avatar: [] as string[],
  tags_nicho: [] as string[],
  tags_dor: [] as string[],
  tags_desejo: [] as string[],
  tags_mecanismo: [] as string[],
  parent_id: '',
  relationship_type: '',
});

const form = reactive(formVazio());
const formErros = reactive({ nome: false, tipo: false });

const opcoesPaiDisponiveis = computed(() => {
  if (!editando.value) return props.ideias;
  const getDescendentes = (id: string): Set<string> => {
    const result = new Set<string>();
    const filhos = props.ideias.filter(i => i.parent_id === id);
    for (const filho of filhos) {
      result.add(filho.id);
      getDescendentes(filho.id).forEach(d => result.add(d));
    }
    return result;
  };
  const descendentes = getDescendentes(editando.value);
  return props.ideias.filter(i => i.id !== editando.value && !descendentes.has(i.id));
});

function addTag(key: string, event: Event) {
  const input = event.target as HTMLInputElement;
  const val = input.value.trim();
  if (!val) return;
  const arr: string[] = (form as any)[key];
  if (!arr.includes(val)) arr.push(val);
  input.value = '';
}

function removeTag(key: string, tag: string) {
  const arr: string[] = (form as any)[key];
  const idx = arr.indexOf(tag);
  if (idx !== -1) arr.splice(idx, 1);
}

function abrirModal(parentId?: string) {
  Object.assign(form, formVazio());
  formErros.nome = false;
  formErros.tipo = false;
  editando.value = null;
  tabAtiva.value = 0;
  if (parentId) form.parent_id = parentId;
  modalAberto.value = true;
}

function abrirEdicao(ideia: Ideia) {
  Object.assign(form, {
    nome: ideia.nome,
    tipo: ideia.tipo,
    status: ideia.status,
    score: ideia.score,
    descricao: ideia.descricao ?? '',
    contexto: ideia.contexto ?? '',
    problema: ideia.problema ?? '',
    transformacao: ideia.transformacao ?? '',
    publico_alvo: ideia.publico_alvo ?? '',
    tags_avatar: [...ideia.tags_avatar],
    tags_nicho: [...ideia.tags_nicho],
    tags_dor: [...ideia.tags_dor],
    tags_desejo: [...ideia.tags_desejo],
    tags_mecanismo: [...ideia.tags_mecanismo],
    parent_id: ideia.parent_id ?? '',
    relationship_type: ideia.relationship_type ?? '',
  });
  formErros.nome = false;
  formErros.tipo = false;
  editando.value = ideia.id;
  tabAtiva.value = 0;
  modalAberto.value = true;
}

function fecharModal() {
  modalAberto.value = false;
  editando.value = null;
  emit('closed');
}

async function salvar(fechar: boolean = true) {
  formErros.nome = !form.nome.trim();
  formErros.tipo = !form.tipo;
  if (formErros.nome || formErros.tipo) {
    bvAlert({ title: 'Campos Obrigatórios', message: 'Preencha os campos marcados em vermelho.', type: 'warning' });
    tabAtiva.value = 0;
    return;
  }
  const payload = {
    nome: form.nome.trim(),
    tipo: form.tipo as IdeiaTipo,
    status: form.status,
    workspace_id: form.workspace_id,
    score: form.score,
    descricao: form.descricao || undefined,
    contexto: form.contexto || undefined,
    problema: form.problema || undefined,
    transformacao: form.transformacao || undefined,
    publico_alvo: form.publico_alvo || undefined,
    tags_avatar: [...form.tags_avatar],
    tags_nicho: [...form.tags_nicho],
    tags_dor: [...form.tags_dor],
    tags_desejo: [...form.tags_desejo],
    tags_mecanismo: [...form.tags_mecanismo],
    parent_id: form.parent_id || null,
    relationship_type: form.relationship_type || null,
  };
  if (editando.value) {
    const res = await updateIdeia({ id: editando.value, ...payload });
    if (res) { fecharModal(); emit('saved', res); }
    else bvAlert({ title: 'Erro', message: 'Não foi possível salvar.', type: 'danger' });
  } else {
    const res = await createIdeia(payload);
    if (res) {
      if (fechar) fecharModal();
      else { Object.assign(form, formVazio()); tabAtiva.value = 0; }
      emit('saved', res);
    } else bvAlert({ title: 'Erro', message: 'Não foi possível criar.', type: 'danger' });
  }
}

defineExpose({ abrirModal, abrirEdicao });
</script>

<style scoped>
.idea-modal-width {
  width: 580px;
  max-width: 95vw;
}

.idea-header-left { display: flex; align-items: center; gap: 16px; }
.idea-icon-box {
  width: 44px; height: 44px; border-radius: 12px; background: rgba(59,130,246,0.1);
  display: flex; align-items: center; justify-content: center; font-size: 24px;
}
.idea-header-sub { font-size: 13px; color: var(--dp-modal-text-secondary); margin: 0; }



.modal-tabs-container { padding: 0 24px; border-bottom: 1px solid var(--dp-modal-border); background: rgba(0,0,0,0.01); }
.dark .modal-tabs-container { background: rgba(255,255,255,0.01); }

.dp-tabs { display: flex; gap: 20px; }
.dp-tab {
  background: none; border: none; padding: 14px 4px; font-size: 14px; font-weight: 600;
  color: var(--dp-modal-text-secondary); cursor: pointer; border-bottom: 2px solid transparent;
  transition: all 0.2s;
}
.dp-tab.active { color: #3b82f6; border-bottom-color: #3b82f6; }

.tab-pane { display: flex; flex-direction: column; gap: 20px; animation: dp-fade-in 0.2s ease; }

.dp-field { display: flex; flex-direction: column; gap: 8px; }
.dp-label { font-size: 11px; font-weight: 700; color: var(--dp-modal-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }

.field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.dp-input, .dp-textarea {
  background: var(--dp-modal-bg); border: 1px solid var(--dp-modal-border);
  border-radius: 12px; padding: 12px 16px; font-size: 14px; color: var(--dp-modal-text-primary);
  outline: none; transition: all 0.2s; width: 100%;
}
.dp-input:focus, .dp-textarea:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
.dp-input.has-error { border-color: #ef4444; }

.dp-select {
  appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%2364748b' viewBox='0 0 24 24'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 16px center; background-size: 14px;
}

.field-error-msg { font-size: 11px; color: #ef4444; margin-top: -4px; }

.score-container {
  display: flex; align-items: center; gap: 16px; padding: 12px 16px; 
  background: rgba(0,0,0,0.02); border: 1px solid var(--dp-modal-border); border-radius: 12px;
}
.dark .score-container { background: rgba(255,255,255,0.02); }
.score-stars { display: flex; gap: 4px; }
.score-star-btn { background: none; border: none; font-size: 24px; color: var(--dp-modal-border); cursor: pointer; transition: all 0.2s; }
.score-star-btn.active { color: #f59e0b; }
.score-star-btn:hover { transform: scale(1.1); }
.score-label-badge { font-size: 11px; font-weight: 700; color: #f59e0b; background: rgba(245,158,11,0.1); padding: 2px 8px; border-radius: 20px; }

.tags-input-container {
  background: var(--dp-modal-bg); border: 1px solid var(--dp-modal-border); border-radius: 12px;
  padding: 8px 12px; min-height: 48px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
}
.tags-list { display: flex; flex-wrap: wrap; gap: 6px; }
.dp-chip {
  background: rgba(59,130,246,0.1); color: #3b82f6; border: 1px solid rgba(59,130,246,0.2);
  padding: 2px 8px; border-radius: 8px; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 6px;
}
.dp-chip button { background: none; border: none; color: inherit; cursor: pointer; font-size: 16px; opacity: 0.6; }
.dp-chip button:hover { opacity: 1; }
.tags-bare-input { flex: 1; background: none; border: none; outline: none; font-size: 13px; color: var(--dp-modal-text-primary); min-width: 100px; }

.helper-text { font-size: 11px; color: var(--dp-modal-text-secondary); margin-top: 4px; }

.dp-modal-fade-enter-active, .dp-modal-fade-leave-active { transition: opacity 0.2s ease; }
.dp-modal-fade-enter-from, .dp-modal-fade-leave-to { opacity: 0; }
</style>
