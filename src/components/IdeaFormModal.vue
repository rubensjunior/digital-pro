<template>
  <Teleport to="body">
    <div v-if="modalAberto" class="bv-overlay" @click.self="fecharModal">
      <div class="bv-modal" @click.stop>
        <div class="bv-modal-header">
          <div class="bv-modal-header-left">
            <div class="bv-modal-header-icon">💡</div>
            <div>
              <h2>{{ editando ? 'Editar Ideia' : 'Nova Ideia' }}</h2>
              <p class="bv-modal-header-sub">{{ editando ? 'Atualize os dados da ideia' : 'Capture e classifique sua ideia' }}</p>
            </div>
          </div>
          <button class="bv-modal-close" @click="fecharModal">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Abas -->
        <div class="bv-tabs">
          <button
            v-for="(tab, i) in TABS"
            :key="i"
            :class="['bv-tab', { 'bv-tab-active': tabAtiva === i }]"
            @click="tabAtiva = i"
          >
            {{ tab }}
          </button>
        </div>

        <div class="bv-modal-body">
          <!-- ABA 1 — Identificação -->
          <div v-show="tabAtiva === 0" class="bv-tab-pane">
            <div class="bv-field">
              <label class="bv-label">Nome da ideia *</label>
              <input v-model="form.nome" :class="['bv-input', { 'has-error': formErros.nome }]" placeholder="Ex: Método das 3 Perguntas" type="text" @input="formErros.nome = false" />
              <span v-if="formErros.nome" class="bv-error-msg">Nome é obrigatório</span>
            </div>

            <div class="bv-field">
              <label class="bv-label">Tipo *</label>
              <select v-model="form.tipo" :class="['bv-input bv-select-field', { 'has-error': formErros.tipo }]" @change="formErros.tipo = false">
                <option value="">Selecione o tipo</option>
                <optgroup v-for="grupo in tiposAgrupados" :key="grupo.label" :label="grupo.label">
                  <option v-for="t in grupo.options" :key="t.id" :value="t.id">{{ t.label }}</option>
                </optgroup>
              </select>
              <span v-if="formErros.tipo" class="bv-error-msg">Tipo é obrigatório</span>
            </div>

            <div class="bv-field">
              <label class="bv-label">Status</label>
              <select v-model="form.status" class="bv-input bv-select-field">
                <optgroup v-for="grupo in statusAgrupados" :key="grupo.label" :label="grupo.label">
                  <option v-for="s in grupo.options" :key="s.id" :value="s.id">{{ s.label }}</option>
                </optgroup>
              </select>
            </div>

            <div class="bv-field">
              <label class="bv-label">Score de Potencial</label>
              <div class="bv-score-wrap">
                <div class="bv-score-group">
                  <button
                    v-for="n in 4"
                    :key="n"
                    class="bv-score-star"
                    :class="{ active: n <= form.score }"
                    @click="form.score = n"
                    type="button"
                  >★</button>
                </div>
                <span class="bv-score-badge" :data-score="form.score">{{ SCORE_LABELS[form.score - 1] }}</span>
              </div>
            </div>
          </div>

          <!-- ABA 2 — Descrição -->
          <div v-show="tabAtiva === 1" class="bv-tab-pane">
            <div class="bv-field">
              <label class="bv-label">Descrição geral</label>
              <textarea v-model="form.descricao" class="bv-textarea" rows="3" placeholder="Descreva a ideia em poucas palavras..."/>
            </div>
            <div class="bv-field">
              <label class="bv-label">{{ labelsAdaptativos.contexto.label }}</label>
              <textarea v-model="form.contexto" class="bv-textarea" rows="2" :placeholder="labelsAdaptativos.contexto.placeholder"/>
            </div>
            <div class="bv-field">
              <label class="bv-label">{{ labelsAdaptativos.problema.label }}</label>
              <textarea v-model="form.problema" class="bv-textarea" rows="2" :placeholder="labelsAdaptativos.problema.placeholder"/>
            </div>
            <div class="bv-field">
              <label class="bv-label">{{ labelsAdaptativos.transformacao.label }}</label>
              <textarea v-model="form.transformacao" class="bv-textarea" rows="2" :placeholder="labelsAdaptativos.transformacao.placeholder"/>
            </div>
            <div class="bv-field">
              <label class="bv-label">{{ labelsAdaptativos.publico.label }}</label>
              <input v-model="form.publico_alvo" class="bv-input" :placeholder="labelsAdaptativos.publico.placeholder" type="text"/>
            </div>
          </div>

          <!-- ABA 3 — Tags -->
          <div v-show="tabAtiva === 2" class="bv-tab-pane">
            <div v-for="tagGroup in labelsAdaptativos.tags" :key="tagGroup.key" class="bv-field">
              <label class="bv-label">{{ tagGroup.label }}</label>
              <div class="bv-chips-input">
                <span
                  v-for="tag in (form as any)[tagGroup.key]"
                  :key="tag"
                  class="bv-chip"
                >
                  {{ tag }}
                  <button @click="removeTag(tagGroup.key, tag)" type="button">×</button>
                </span>
                <input
                  :placeholder="tagGroup.placeholder"
                  class="bv-chips-field"
                  @keydown.enter.prevent="addTag(tagGroup.key, $event)"
                  @keydown.tab.prevent="addTag(tagGroup.key, $event)"
                />
              </div>
            </div>
          </div>

          <!-- ABA 4 — Ecossistema -->
          <div v-show="tabAtiva === 3" class="bv-tab-pane">
            <div class="bv-field">
              <label class="bv-label">Ideia Principal (Opcional)</label>
              <select v-model="form.parent_id" class="bv-input bv-select-field">
                <option value="">Nenhuma (Esta é uma ideia principal)</option>
                <option v-for="i in opcoesPaiDisponiveis" :key="i.id" :value="i.id">
                  {{ i.nome }}
                </option>
              </select>
              <span class="bv-drawer-text" style="font-size: 11px;">A qual ideia macro esta ideia pertence?</span>
            </div>
            <div class="bv-field" v-if="form.parent_id">
              <label class="bv-label">Tipo de Relação *</label>
              <select v-model="form.relationship_type" class="bv-input bv-select-field">
                <option value="">Selecione o tipo de relação</option>
                <option v-for="rel in relacionamentos" :key="rel.id" :value="rel.label">{{ rel.label }}</option>
              </select>
            </div>
          </div>

        </div>

        <div class="bv-modal-footer">
          <button class="bv-btn-ghost" @click="fecharModal" type="button">Cancelar</button>
          <div class="bv-footer-acoes">
            <button class="bv-btn-primary" @click="salvar(true)" type="button">
              {{ editando ? 'Salvar alterações' : 'Salvar' }}
            </button>
          </div>
        </div>
      </div>
    </div>


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

// ─── Constantes ───────────────────────────────────────────────────────────────
const TABS = ['Identificação', 'Descrição', 'Tags', 'Ecossistema'];
const SCORE_LABELS = ['Baixo', 'Médio', 'Alto', 'Muito alto'];
// ─── Lógica Adaptativa de UI ──────────────────────────────────────────────────
const labelsAdaptativos = computed(() => {
  const tipo = form.tipo;
  if (!tipo) return defaultLabels;

  // Encontrar o grupo ao qual o tipo pertence
  const grupo = tiposAgrupados.value.find(g => g.options.some((t: any) => t.id === tipo))?.label || '';

  if (grupo.includes('Programação')) {
    return {
      contexto: { label: 'Requisitos / Contexto', placeholder: 'Quais os requisitos ou cenário técnico?' },
      problema: { label: 'Problema / Bug', placeholder: 'O que precisa ser resolvido ou corrigido?' },
      transformacao: { label: 'Solução Técnica', placeholder: 'Como a solução será implementada?' },
      publico: { label: 'Stakeholders / Usuários', placeholder: 'Quem será afetado ou usará esta feature?' },
      tags: [
        { key: 'tags_avatar',    label: 'Tecnologias', placeholder: 'Ex: Vue, Node.js' },
        { key: 'tags_nicho',     label: 'Plataforma',  placeholder: 'Ex: Web, iOS' },
        { key: 'tags_dor',       label: 'Limitação',   placeholder: 'Ex: Performance, Memória' },
        { key: 'tags_desejo',    label: 'Objetivo',    placeholder: 'Ex: Velocidade, SEO' },
        { key: 'tags_mecanismo', label: 'Arquitetura', placeholder: 'Ex: Microserviços, SSR' }
      ]
    };
  }

  if (grupo.includes('Jurídico') || grupo.includes('Administrativo')) {
    return {
      contexto: { label: 'Fatos / Antecedentes', placeholder: 'Quais os fatos geradores ou histórico?' },
      problema: { label: 'Questão Jurídica / Base', placeholder: 'Qual a base legal ou problema a resolver?' },
      transformacao: { label: 'Pedido / Resultado', placeholder: 'O que se pretende obter ou decidir?' },
      publico: { label: 'Partes Envolvidas', placeholder: 'Quem são os interessados ou partes?' },
      tags: [
        { key: 'tags_avatar',    label: 'Jurisprudência', placeholder: 'Ex: STF, Súmula 123' },
        { key: 'tags_nicho',     label: 'Área do Direito', placeholder: 'Ex: Civil, Penal' },
        { key: 'tags_dor',       label: 'Tese',           placeholder: 'Ex: Danos Morais' },
        { key: 'tags_desejo',    label: 'Decisões',       placeholder: 'Ex: Liminar, Sentença' },
        { key: 'tags_mecanismo', label: 'Prazos',         placeholder: 'Ex: 15 dias, Urgente' }
      ]
    };
  }

  if (grupo.includes('Estudos')) {
    return {
      contexto: { label: 'Referência / Origem', placeholder: 'De qual livro, curso ou autor surgiu?' },
      problema: { label: 'Dúvida / Lacuna', placeholder: 'O que ainda não está claro ou precisa ser focado?' },
      transformacao: { label: 'Resumo / Conclusão', placeholder: 'Qual a lição principal desta ideia?' },
      publico: { label: 'Matéria / Disciplina', placeholder: 'A qual área do conhecimento pertence?' },
      tags: [
        { key: 'tags_avatar',    label: 'Autor',          placeholder: 'Ex: Peter Drucker' },
        { key: 'tags_nicho',     label: 'Tema',           placeholder: 'Ex: Gestão' },
        { key: 'tags_dor',       label: 'Conceito Chave', placeholder: 'Ex: Eficácia' },
        { key: 'tags_desejo',    label: 'Exemplo',        placeholder: 'Ex: Caso Ford' },
        { key: 'tags_mecanismo', label: 'Aplicação',      placeholder: 'Ex: Dia a dia' }
      ]
    };
  }

  // Padrão (Marketing/Geral)
  return defaultLabels;
});

const defaultLabels = {
  contexto: { label: 'Contexto', placeholder: 'De onde surgiu essa ideia?' },
  problema: { label: 'Problema que resolve', placeholder: 'Qual dor esta ideia ataca?' },
  transformacao: { label: 'Transformação prometida', placeholder: 'Qual o resultado esperado?' },
  publico: { label: 'Público-alvo', placeholder: 'Ex: Iniciantes em tráfego pago' },
  tags: [
    { key: 'tags_avatar',    label: 'Avatar',    placeholder: 'Ex: iniciante  — Enter para adicionar' },
    { key: 'tags_nicho',     label: 'Nicho',     placeholder: 'Ex: fitness' },
    { key: 'tags_dor',       label: 'Dor',       placeholder: 'Ex: falta de dinheiro' },
    { key: 'tags_desejo',    label: 'Desejo',    placeholder: 'Ex: liberdade financeira' },
    { key: 'tags_mecanismo', label: 'Mecanismo', placeholder: 'Ex: novo método' }
  ]
};

// ─── Estado do Modal ──────────────────────────────────────────────────────────
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

// Ações
function addTag(key: string, event: Event) {
  const input = event.target as HTMLInputElement;
  const val = input.value.trim();
  if (!val) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const arr: string[] = (form as any)[key];
  if (!arr.includes(val)) arr.push(val);
  input.value = '';
}

function removeTag(key: string, tag: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  
  if (parentId) {
    form.parent_id = parentId;
    tabAtiva.value = 0; // Abre na aba identificação (0) conforme pedido
  }
  
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
    bvAlert({
      title: 'Campos Obrigatórios',
      message: 'Os campos obrigatórios (marcados em vermelho) devem ser preenchidos antes de salvar a ideia.',
      type: 'warning'
    });
    tabAtiva.value = 0; // Volta para aba 0 se houver erro
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
    if (res) {
      fecharModal();
      emit('saved', res);
    } else {
      bvAlert({ title: 'Erro ao atualizar', message: 'Ocorreu um erro ao atualizar a ideia. Tente novamente.', type: 'danger' });
    }
  } else {
    const res = await createIdeia(payload);
    if (res) {
      if (fechar) {
        fecharModal();
      } else {
        Object.assign(form, formVazio());
        tabAtiva.value = 0;
      }
      emit('saved', res);
    } else {
      bvAlert({ title: 'Erro ao criar', message: 'Ocorreu um erro ao criar a ideia. Tente novamente.', type: 'danger' });
    }
  }
}

// Expõe para o componente pai
defineExpose({
  abrirModal,
  abrirEdicao
});
</script>

<style scoped>
.bv-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000; /* Acima do drawer se possível, mas dentro de bounds */
  animation: fadeIn 0.15s ease;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.bv-modal {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  width: 540px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 84px); /* 32px top + 32px bottom + gaps */
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 32px 80px rgba(0,0,0,0.15), 0 0 0 1px #e2e8f0;
  animation: slideUp 0.22s cubic-bezier(0.16,1,0.3,1);
  overflow: hidden;
  color: #1e293b;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(24px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.bv-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 22px;
  gap: 12px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.bv-modal-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bv-modal-header-icon {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: rgba(59,130,246,0.1);
  border: 1px solid rgba(59,130,246,0.2);
  border-radius: 12px;
  flex-shrink: 0;
}

.bv-modal-header h2 {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 3px;
  letter-spacing: -0.01em;
}

.bv-modal-header-sub {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.bv-modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  background: transparent;
  color: #64748b;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
}

.bv-modal-close:hover { background: #f1f5f9; color: #0f172a; border-color: #cbd5e1; }
.bv-modal-close svg   { width: 15px; height: 15px; }

/* TABS */
.bv-tabs {
  display: flex;
  gap: 0;
  padding: 0 22px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.bv-tab {
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  background: transparent;
  border: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all 0.15s;
  white-space: nowrap;
}

.bv-tab:hover { color: #1e293b; }

.bv-tab-active {
  color: #3b82f6 !important;
  border-bottom-color: #3b82f6 !important;
  font-weight: 600;
}

/* MODAL BODY */
.bv-modal-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 22px;
  background: #f8fafc;
}

.bv-tab-pane {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.bv-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bv-label {
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;
}

.bv-input {
  padding: 11px 14px;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  color: #1e293b;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  width: 100%;
  box-sizing: border-box;
  font-family: inherit;
}

.bv-input.has-error { border-color: #ef4444; }
.bv-input::placeholder { color: #94a3b8; opacity: 1; }
.bv-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
  background: #ffffff;
}

.bv-error-msg { font-size: 11px; color: #ef4444; }

.bv-textarea {
  padding: 11px 14px;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  color: #1e293b;
  font-size: 13.5px;
  outline: none;
  resize: vertical;
  font-family: inherit;
  line-height: 1.55;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.bv-textarea::placeholder { color: #94a3b8; opacity: 1; }
.bv-textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
  background: #ffffff;
}

.bv-select-field {
  padding: 11px 36px 11px 14px;
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%2364748b' viewBox='0 0 24 24'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 14px;
  background-color: #ffffff;
  cursor: pointer;
}

/* Status group */
.bv-status-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.bv-status-opt {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 15px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: #ffffff;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.bv-status-opt:hover {
  border-color: #cbd5e1;
  color: #1e293b;
  background: #f8fafc;
}

.bv-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #94a3b8;
  flex-shrink: 0;
}

.bv-status-dot[data-status="bruta"]    { background: #64748b; }
.bv-status-dot[data-status="em_teste"] { background: #eab308; }
.bv-status-dot[data-status="validada"] { background: #22c55e; }
.bv-status-dot[data-status="escalada"] { background: #3b82f6; }

.bv-status-opt[data-status="bruta"].active    { background: rgba(100,116,139,0.1);   border-color: #64748b;   color: #334155;  font-weight: 600; }
.bv-status-opt[data-status="em_teste"].active { background: rgba(234,179,8,0.1);  border-color: #eab308;   color: #a16207; font-weight: 600; }
.bv-status-opt[data-status="validada"].active { background: rgba(34,197,94,0.1);  border-color: #22c55e;   color: #15803d; font-weight: 600; }
.bv-status-opt[data-status="escalada"].active { background: rgba(59,130,246,0.1); border-color: #3b82f6;  color: #1d4ed8; font-weight: 600; }

/* Score */
.bv-score-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
}

.bv-score-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.bv-score-star {
  font-size: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #cbd5e1;
  transition: color 0.15s, transform 0.12s;
  padding: 0 3px;
  line-height: 1;
}

.bv-score-star.active { color: #f59e0b; }
.bv-score-star:hover  { transform: scale(1.2); color: #fbbf24; }

.bv-score-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  background: rgba(245,158,11,0.1);
  color: #d97706;
  border: 1px solid rgba(245,158,11,0.2);
  white-space: nowrap;
}

/* Chips */
.bv-chips-input {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 12px;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  cursor: text;
  min-height: 44px;
  transition: border-color 0.15s, box-shadow 0.15s;
  align-items: center;
}

.bv-chips-input:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
}

.bv-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  background: rgba(59,130,246,0.1);
  color: #2563eb;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(59,130,246,0.2);
}

.bv-chip button {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 15px;
  line-height: 1;
  padding: 0;
  opacity: 0.6;
  transition: opacity 0.1s;
  display: flex;
  align-items: center;
}

.bv-chip button:hover { opacity: 1; }

.bv-chips-field {
  flex: 1;
  border: none;
  background: transparent;
  color: #1e293b;
  font-size: 13.5px;
  outline: none;
  min-width: 100px;
  font-family: inherit;
  padding: 2px 0;
}

.bv-chips-field::placeholder { color: #94a3b8; font-size: 12.5px; opacity: 1; }

/* MODAL FOOTER */
.bv-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 22px;
  border-top: 1px solid #e2e8f0;
  background: #ffffff;
}

.bv-footer-acoes {
  display: flex;
  gap: 8px;
}

.bv-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 500;
  padding: 9px 16px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.bv-btn-ghost:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.bv-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  border: none;
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 600;
  padding: 9px 16px;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  white-space: nowrap;
}

.bv-btn-primary:hover { opacity: 0.9; }
.bv-btn-primary:active { transform: scale(0.97); }

.bv-drawer-text { font-size: 13.5px; color: #1e293b; line-height: 1.55; margin: 0; }
</style>
