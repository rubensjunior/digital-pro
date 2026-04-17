<template>
  <div class="bv-root">

    <!-- ═══════════════════════════════════════════════════════════ HEADER -->
    <!-- TOAST NOTIFICATION -->
    <div v-if="toast.visible" :class="['bv-toast', `bv-toast-${toast.type}`]">
      {{ toast.message }}
    </div>

    <div class="bv-header">
      <div class="bv-header-text">
        <h1 class="bv-title">
          <span class="bv-title-icon">🧠</span>
          Brain Vault
        </h1>
        <p class="bv-subtitle">
          {{ ideias.length }} ideia{{ ideias.length !== 1 ? 's' : '' }} registrada{{ ideias.length !== 1 ? 's' : '' }}
          · {{ porStatus.validada.length }} validada{{ porStatus.validada.length !== 1 ? 's' : '' }}
          · {{ porStatus.escalada.length }} escalada{{ porStatus.escalada.length !== 1 ? 's' : '' }}
        </p>
      </div>
      <button class="bv-btn-primary" @click="abrirModal()">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Nova Ideia
      </button>
    </div>

    <!-- ═══════════════════════════════════════════════════════════ TOOLBAR -->
    <div class="bv-toolbar">
      <div class="bv-search-wrap">
        <svg class="bv-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          v-model="filtro.busca"
          class="bv-search"
          placeholder="Buscar ideia..."
          type="text"
        />
      </div>

      <select v-model="filtro.tipo" class="bv-select">
        <option value="">Todos os tipos</option>
        <option v-for="t in TIPOS" :key="t" :value="t">{{ t }}</option>
      </select>

      <select v-model="filtro.status" class="bv-select">
        <option value="">Todos os status</option>
        <option value="bruta">Bruta</option>
        <option value="em_teste">Em Teste</option>
        <option value="validada">Validada</option>
        <option value="nao_validada">Não Validada</option>
        <option value="escalada">Escalada</option>
      </select>

      <select v-model="filtro.score" class="bv-select">
        <option value="">Qualquer score</option>
        <option value="4">⭐⭐⭐⭐ Muito alto</option>
        <option value="3">⭐⭐⭐ Alto</option>
        <option value="2">⭐⭐ Médio</option>
        <option value="1">⭐ Baixo</option>
      </select>

      <!-- View toggle -->
      <div class="bv-view-toggle">
        <button :class="['bv-toggle-btn', { active: view === 'lista' }]" @click="view = 'lista'" title="Lista">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
          </svg>
        </button>
        <button :class="['bv-toggle-btn', { active: view === 'kanban' }]" @click="view = 'kanban'" title="Kanban">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════ LOADING -->
    <div v-if="loading" class="bv-loading">
      <div class="bv-spinner"></div>
      <span>Carregando ideias...</span>
    </div>

    <!-- ═══════════════════════════════════════════════════════ EMPTY STATE -->
    <div v-else-if="!loading && ideiasFilradas.length === 0 && view === 'lista'" class="bv-empty">
      <div class="bv-empty-icon">🧠</div>
      <h3>Nenhuma ideia encontrada</h3>
      <p v-if="ideias.length === 0">Comece capturando sua primeira ideia agora!</p>
      <p v-else>Tente ajustar os filtros de busca.</p>
      <button v-if="ideias.length === 0" class="bv-btn-primary" @click="abrirModal()">
        Capturar primeira ideia
      </button>
    </div>

    <!-- ══════════════════════════════════════════════════════════ LISTA -->
    <div v-else-if="view === 'lista'" class="bv-list">
      <div
        v-for="ideia in ideiasFilradas"
        :key="ideia.id"
        class="bv-card"
        @click="abrirDrawer(ideia)"
      >
        <div class="bv-card-left">
          <div class="bv-card-tipo-badge" :data-tipo="ideia.tipo">{{ ideia.tipo }}</div>
          <div class="bv-card-nome">{{ ideia.nome }}</div>
          <div v-if="ideia.descricao" class="bv-card-desc">{{ ideia.descricao }}</div>
          <div class="bv-card-tags">
            <span v-for="t in allTags(ideia).slice(0, 4)" :key="t" class="bv-tag">{{ t }}</span>
            <span v-if="allTags(ideia).length > 4" class="bv-tag bv-tag-more">+{{ allTags(ideia).length - 4 }}</span>
          </div>
        </div>
        <div class="bv-card-right">
          <span class="bv-status-badge" :data-status="ideia.status">{{ statusLabel(ideia.status) }}</span>
          <div class="bv-stars">
            <span v-for="n in 4" :key="n" :class="n <= ideia.score ? 'bv-star-on' : 'bv-star-off'">★</span>
          </div>
          <div class="bv-card-date">{{ formatDate(ideia.created_at) }}</div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════ KANBAN -->
    <div v-else class="bv-kanban">
      <div
        v-for="col in COLUNAS"
        :key="col.status"
        class="bv-kanban-col"
        :data-status="col.status"
        @dragover.prevent
        @drop="onDrop($event, col.status)"
      >
        <div class="bv-kanban-col-header">
          <span class="bv-kanban-col-dot" :data-status="col.status"></span>
          <span class="bv-kanban-col-title">{{ col.label }}</span>
          <span class="bv-kanban-col-count">{{ porStatus[col.status].length }}</span>
        </div>

        <div
          v-for="ideia in porStatus[col.status]"
          :key="ideia.id"
          class="bv-kanban-card"
          draggable="true"
          @dragstart="onDragStart($event, ideia.id)"
          @click="abrirDrawer(ideia)"
        >
          <div class="bv-kanban-card-tipo">{{ ideia.tipo }}</div>
          <div class="bv-kanban-card-nome">{{ ideia.nome }}</div>
          <div v-if="ideia.descricao" class="bv-kanban-card-desc">{{ ideia.descricao }}</div>
          <div class="bv-kanban-card-footer">
            <div class="bv-stars bv-stars-sm">
              <span v-for="n in 4" :key="n" :class="n <= ideia.score ? 'bv-star-on' : 'bv-star-off'">★</span>
            </div>
            <div class="bv-kanban-tags">
              <span v-for="t in allTags(ideia).slice(0,2)" :key="t" class="bv-tag bv-tag-sm">{{ t }}</span>
            </div>
          </div>
        </div>

        <div v-if="porStatus[col.status].length === 0" class="bv-kanban-empty">
          Arraste ideias aqui
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════ MODAL -->
    <Teleport to="body">
      <div v-if="modalAberto" class="bv-overlay" @click.self="fecharModal">
        <div class="bv-modal" @click.stop>
          <div class="bv-modal-header">
            <div class="bv-modal-header-left">
              <div class="bv-modal-header-icon">🧠</div>
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
                  <option v-for="t in TIPOS" :key="t" :value="t">{{ t }}</option>
                </select>
                <span v-if="formErros.tipo" class="bv-error-msg">Tipo é obrigatório</span>
              </div>

              <div class="bv-field">
                <label class="bv-label">Status</label>
                <div class="bv-status-group">
                  <button
                    v-for="s in STATUS_OPTIONS"
                    :key="s.value"
                    :class="['bv-status-opt', { active: form.status === s.value }]"
                    :data-status="s.value"
                    @click="form.status = s.value"
                    type="button"
                  >
                    <span class="bv-status-dot" :data-status="s.value"></span>
                    {{ s.label }}
                  </button>
                </div>
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
                <label class="bv-label">Contexto</label>
                <textarea v-model="form.contexto" class="bv-textarea" rows="2" placeholder="De onde surgiu essa ideia?"/>
              </div>
              <div class="bv-field">
                <label class="bv-label">Problema que resolve</label>
                <textarea v-model="form.problema" class="bv-textarea" rows="2" placeholder="Qual dor esta ideia ataca?"/>
              </div>
              <div class="bv-field">
                <label class="bv-label">Transformação prometida</label>
                <textarea v-model="form.transformacao" class="bv-textarea" rows="2" placeholder="Qual o resultado esperado?"/>
              </div>
              <div class="bv-field">
                <label class="bv-label">Público-alvo</label>
                <input v-model="form.publico_alvo" class="bv-input" placeholder="Ex: Iniciantes em tráfego pago" type="text"/>
              </div>
            </div>

            <!-- ABA 3 — Tags -->
            <div v-show="tabAtiva === 2" class="bv-tab-pane">
              <div v-for="tagGroup in TAG_GROUPS" :key="tagGroup.key" class="bv-field">
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

    <!-- ══════════════════════════════════════════════════════════ DRAWER -->
    <Teleport to="body">
      <div v-if="drawerIdeia" class="bv-drawer-overlay" @click.self="fecharDrawer">
        <div class="bv-drawer">
          <div class="bv-drawer-header">
            <div>
              <div class="bv-card-tipo-badge" :data-tipo="drawerIdeia.tipo">{{ drawerIdeia.tipo }}</div>
              <h2 class="bv-drawer-title">{{ drawerIdeia.nome }}</h2>
            </div>
            <button class="bv-modal-close" @click="fecharDrawer">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="bv-drawer-body">
            <!-- Status + Score -->
            <div class="bv-drawer-row">
              <span class="bv-status-badge" :data-status="drawerIdeia.status">{{ statusLabel(drawerIdeia.status) }}</span>
              <div class="bv-stars">
                <span v-for="n in 4" :key="n" :class="n <= drawerIdeia.score ? 'bv-star-on' : 'bv-star-off'">★</span>
              </div>
            </div>

            <!-- Mudar status rápido -->
            <div class="bv-drawer-section">
              <div class="bv-drawer-section-title">Mover para</div>
              <div class="bv-status-group">
                <button
                  v-for="s in STATUS_OPTIONS"
                  :key="s.value"
                  :class="['bv-status-opt', { active: drawerIdeia.status === s.value }]"
                  :data-status="s.value"
                  @click="mudarStatus(drawerIdeia.id, s.value)"
                  type="button"
                >{{ s.label }}</button>
              </div>
            </div>

            <!-- Campos descritivos -->
            <div v-if="drawerIdeia.descricao" class="bv-drawer-section">
              <div class="bv-drawer-section-title">Descrição</div>
              <p class="bv-drawer-text">{{ drawerIdeia.descricao }}</p>
            </div>
            <div v-if="drawerIdeia.contexto" class="bv-drawer-section">
              <div class="bv-drawer-section-title">Contexto</div>
              <p class="bv-drawer-text">{{ drawerIdeia.contexto }}</p>
            </div>
            <div v-if="drawerIdeia.problema" class="bv-drawer-section">
              <div class="bv-drawer-section-title">Problema que resolve</div>
              <p class="bv-drawer-text">{{ drawerIdeia.problema }}</p>
            </div>
            <div v-if="drawerIdeia.transformacao" class="bv-drawer-section">
              <div class="bv-drawer-section-title">Transformação prometida</div>
              <p class="bv-drawer-text">{{ drawerIdeia.transformacao }}</p>
            </div>
            <div v-if="drawerIdeia.publico_alvo" class="bv-drawer-section">
              <div class="bv-drawer-section-title">Público-alvo</div>
              <p class="bv-drawer-text">{{ drawerIdeia.publico_alvo }}</p>
            </div>

            <!-- Tags -->
            <div v-if="allTags(drawerIdeia).length > 0" class="bv-drawer-section">
              <div class="bv-drawer-section-title">Tags</div>
              <div class="bv-drawer-tags">
                <span v-for="t in allTags(drawerIdeia)" :key="t" class="bv-tag">{{ t }}</span>
              </div>
            </div>

            <div class="bv-drawer-date">Criada em {{ formatDate(drawerIdeia.created_at) }}</div>
          </div>

          <div class="bv-drawer-footer">
            <button class="bv-btn-danger" @click="confirmarDelete(drawerIdeia.id)" type="button">Excluir</button>
            <button class="bv-btn-primary" @click="abrirEdicao(drawerIdeia)" type="button">Editar</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ══════════════════════════════════════════════════════ CONFIRM DELETE -->
    <Teleport to="body">
      <div v-if="deleteConfirmId" class="bv-overlay" @click.self="deleteConfirmId = null">
        <div class="bv-confirm">
          <div class="bv-confirm-icon">🗑️</div>
          <h3>Excluir ideia?</h3>
          <p>Esta ação não pode ser desfeita.</p>
          <div class="bv-confirm-actions">
            <button class="bv-btn-ghost" @click="deleteConfirmId = null">Cancelar</button>
            <button class="bv-btn-danger" @click="executarDelete">Sim, excluir</button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useIdeias } from '../../composables/useIdeias';
import type { Ideia, IdeiaStatus, IdeiaTipo } from '../../types/ideia';

// ─── Composable ───────────────────────────────────────────────────────────────
const { ideias, loading, porStatus, fetchIdeias, createIdeia, updateIdeia, deleteIdeia, updateStatus } = useIdeias();

onMounted(fetchIdeias);

// ─── Constantes ───────────────────────────────────────────────────────────────
const TIPOS: IdeiaTipo[] = ['Produto', 'Promessa', 'Ângulo', 'Headline', 'Hook', 'Big Idea', 'VSL', 'Funil', 'Lançamento', 'Outro'];
const TABS = ['Identificação', 'Descrição', 'Tags'];
const SCORE_LABELS = ['Baixo', 'Médio', 'Alto', 'Muito alto'];
const STATUS_OPTIONS = [
  { value: 'bruta' as IdeiaStatus,    label: 'Bruta' },
  { value: 'em_teste' as IdeiaStatus, label: 'Em Teste' },
  { value: 'validada' as IdeiaStatus, label: 'Validada' },
  { value: 'nao_validada' as IdeiaStatus, label: 'Não Validada' },
  { value: 'escalada' as IdeiaStatus, label: 'Escalada' },
];
const COLUNAS = [
  { status: 'bruta' as IdeiaStatus,    label: 'Bruta' },
  { status: 'em_teste' as IdeiaStatus, label: 'Em Teste' },
  { status: 'validada' as IdeiaStatus, label: 'Validada' },
  { status: 'nao_validada' as IdeiaStatus, label: 'Não Validada' },
  { status: 'escalada' as IdeiaStatus, label: 'Escalada' },
];
const TAG_GROUPS = [
  { key: 'tags_avatar',    label: 'Avatar',    placeholder: 'Ex: iniciante  — Enter para adicionar' },
  { key: 'tags_nicho',     label: 'Nicho',     placeholder: 'Ex: fitness' },
  { key: 'tags_dor',       label: 'Dor',       placeholder: 'Ex: falta de dinheiro' },
  { key: 'tags_desejo',    label: 'Desejo',    placeholder: 'Ex: liberdade financeira' },
  { key: 'tags_mecanismo', label: 'Mecanismo', placeholder: 'Ex: novo método' },
];

// ─── View mode ────────────────────────────────────────────────────────────────
const view = ref<'lista' | 'kanban'>('lista');

// ─── Filtros ──────────────────────────────────────────────────────────────────
const filtro = reactive({ busca: '', tipo: '', status: '', score: '' });

const ideiasFilradas = computed(() => {
  return ideias.value.filter(i => {
    const buscaOk = !filtro.busca || i.nome.toLowerCase().includes(filtro.busca.toLowerCase());
    const tipoOk  = !filtro.tipo   || i.tipo   === filtro.tipo;
    const stOk    = !filtro.status || i.status  === filtro.status;
    const scoreOk = !filtro.score  || i.score   >= Number(filtro.score);
    return buscaOk && tipoOk && stOk && scoreOk;
  });
});

// ─── Modal ────────────────────────────────────────────────────────────────────
const modalAberto = ref(false);
const editando = ref<string | null>(null);
const tabAtiva = ref(0);

const formVazio = () => ({
  nome: '',
  tipo: '' as IdeiaTipo | '',
  status: 'bruta' as IdeiaStatus,
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
});

const form = reactive(formVazio());
const formErros = reactive({ nome: false, tipo: false });

const toast = reactive({ visible: false, message: '', type: 'success' });
let toastTimeout: ReturnType<typeof setTimeout> | null = null;

function showToast(msg: string, type: 'success' | 'error' = 'success') {
  toast.message = msg;
  toast.type = type;
  toast.visible = true;
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toast.visible = false; }, 3000);
}

function abrirModal() {
  Object.assign(form, formVazio());
  formErros.nome = false;
  formErros.tipo = false;
  editando.value = null;
  tabAtiva.value = 0;
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
  });
  formErros.nome = false;
  formErros.tipo = false;
  editando.value = ideia.id;
  tabAtiva.value = 0;
  drawerIdeia.value = null;
  modalAberto.value = true;
}

function fecharModal() {
  modalAberto.value = false;
  editando.value = null;
}

async function salvar(fechar: boolean = true) {
  formErros.nome = !form.nome.trim();
  formErros.tipo = !form.tipo;

  if (formErros.nome || formErros.tipo) {
    showToast('Preencha os campos obrigatórios.', 'error');
    tabAtiva.value = 0; // Volta para aba 0 se houver erro
    return;
  }

  const payload = {
    nome: form.nome.trim(),
    tipo: form.tipo as IdeiaTipo,
    status: form.status,
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
  };

  if (editando.value) {
    const res = await updateIdeia({ id: editando.value, ...payload });
    if (res) {
      showToast('Ideia atualizada com sucesso!');
      fecharModal();
    } else {
      showToast('Erro ao atualizar ideia.', 'error');
    }
  } else {
    const res = await createIdeia(payload);
    if (res) {
      showToast('Ideia salva com sucesso!');
      if (fechar) {
        fecharModal();
      } else {
        Object.assign(form, formVazio());
        tabAtiva.value = 0;
      }
    } else {
      showToast('Erro ao criar ideia.', 'error');
    }
  }
}

// ─── Tags (chips input) ───────────────────────────────────────────────────────
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

// ─── Drawer ───────────────────────────────────────────────────────────────────
const drawerIdeia = ref<Ideia | null>(null);

function abrirDrawer(ideia: Ideia) {
  drawerIdeia.value = ideia;
}

function fecharDrawer() {
  drawerIdeia.value = null;
}

async function mudarStatus(id: string, status: string) {
  await updateStatus(id, status as IdeiaStatus);
  if (drawerIdeia.value?.id === id) {
    drawerIdeia.value = { ...drawerIdeia.value, status: status as IdeiaStatus };
  }
}

// ─── Delete ───────────────────────────────────────────────────────────────────
const deleteConfirmId = ref<string | null>(null);

function confirmarDelete(id: string) {
  deleteConfirmId.value = id;
}

async function executarDelete() {
  if (!deleteConfirmId.value) return;
  const res = await deleteIdeia(deleteConfirmId.value);
  if (res) {
    showToast('Ideia excluída com sucesso!');
  } else {
    showToast('Erro ao excluir ideia.', 'error');
  }
  deleteConfirmId.value = null;
  drawerIdeia.value = null;
}

// ─── Drag & Drop (Kanban) ─────────────────────────────────────────────────────
const draggedId = ref<string | null>(null);

function onDragStart(event: DragEvent, id: string) {
  draggedId.value = id;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
  }
}

async function onDrop(event: DragEvent, novoStatus: IdeiaStatus) {
  event.preventDefault();
  if (!draggedId.value) return;
  const ideia = ideias.value.find(i => i.id === draggedId.value);
  if (ideia && ideia.status !== novoStatus) {
    await updateStatus(draggedId.value, novoStatus);
  }
  draggedId.value = null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function allTags(ideia: Ideia): string[] {
  return [
    ...ideia.tags_avatar,
    ...ideia.tags_nicho,
    ...ideia.tags_dor,
    ...ideia.tags_desejo,
    ...ideia.tags_mecanismo,
  ];
}

function statusLabel(status: IdeiaStatus): string {
  const map: Record<IdeiaStatus, string> = {
    bruta: 'Bruta',
    em_teste: 'Em Teste',
    validada: 'Validada',
    nao_validada: 'Não Validada',
    escalada: 'Escalada',
  };
  return map[status] ?? status;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}
</script>

<style scoped>
.bv-root,
.bv-overlay,
.bv-drawer-overlay,
.bv-confirm {
  --bg: #f1f5f9;
  --surface: #ffffff;
  --border: #e2e8f0;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --accent: #3b82f6;
  --accent-end: #2563eb;
}

.bv-root {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 100%;
  position: relative;
}

/* ═══════════════════════════════════════════════════════════════ TOAST */
.bv-toast {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  z-index: 9999;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  animation: slideDownToast 0.3s ease-out forwards;
}

.bv-toast-success { background: #10b981; }
.bv-toast-error { background: #ef4444; }

@keyframes slideDownToast {
  from { opacity: 0; transform: translate(-50%, -20px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}

/* ═══════════════════════════════════════════════════════════════ HEADER */
.bv-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.bv-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 8px;
}

.bv-title-icon {
  font-size: 20px;
}

.bv-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
}

/* ═══════════════════════════════════════════════════════════════ BUTTONS */
.bv-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, var(--accent), var(--accent-end));
  color: #fff;
  border: none;
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 600;
  padding: 9px 16px;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  white-space: nowrap;
  flex-shrink: 0;
}

.bv-btn-primary:hover { opacity: 0.9; }
.bv-btn-primary:active { transform: scale(0.97); }
.bv-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

.bv-btn-primary svg {
  width: 16px;
  height: 16px;
}

.bv-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 500;
  padding: 9px 16px;
  cursor: pointer;
  transition: all 0.15s;
}

.bv-btn-ghost:hover {
  background: var(--border);
  color: var(--text-primary);
}

.bv-btn-danger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 600;
  padding: 9px 16px;
  cursor: pointer;
  transition: all 0.15s;
}

.bv-btn-danger:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* ═══════════════════════════════════════════════════════════════ TOOLBAR */
.bv-toolbar {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.bv-search-wrap {
  position: relative;
  flex: 1;
  min-width: 180px;
}

.bv-search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 15px;
  height: 15px;
  color: var(--text-secondary);
  pointer-events: none;
}

.bv-search {
  width: 100%;
  padding: 8px 12px 8px 32px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.bv-search::placeholder { color: var(--text-secondary); }
.bv-search:focus { border-color: var(--accent); }

.bv-select {
  padding: 8px 28px 8px 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 13px;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%2364748b' viewBox='0 0 24 24'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 14px;
  transition: border-color 0.15s;
}

.bv-select:focus { border-color: var(--accent); }

.bv-view-toggle {
  display: flex;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.bv-toggle-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--surface);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.bv-toggle-btn svg { width: 16px; height: 16px; }

.bv-toggle-btn.active {
  background: var(--accent);
  color: #fff;
}

.bv-toggle-btn:first-child { border-right: 1px solid var(--border); }

/* ═══════════════════════════════════════════════════════════════ LOADING */
.bv-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px;
  color: var(--text-secondary);
  font-size: 14px;
}

.bv-spinner {
  width: 22px;
  height: 22px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ═══════════════════════════════════════════════════════════════ EMPTY */
.bv-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 80px 20px;
  text-align: center;
  background: var(--surface);
  border: 1px dashed var(--border);
  border-radius: 16px;
}

.bv-empty-icon {
  font-size: 40px;
  margin-bottom: 4px;
}

.bv-empty h3 {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.bv-empty p {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
}

/* ═══════════════════════════════════════════════════════════════ LISTA */
.bv-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bv-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.1s;
}

.bv-card:hover {
  border-color: var(--accent);
  box-shadow: 0 4px 16px rgba(59,130,246,0.08);
  transform: translateY(-1px);
}

.bv-card-left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.bv-card-nome {
  font-size: 14.5px;
  font-weight: 600;
  color: var(--text-primary);
}

.bv-card-desc {
  font-size: 12.5px;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.45;
}

.bv-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 2px;
}

.bv-card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
}

.bv-card-date {
  font-size: 11px;
  color: var(--text-secondary);
}

/* ═══════════════════════════════════════════════════════════════ TIPO BADGE */
.bv-card-tipo-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(99,102,241,0.12);
  color: #818cf8;
  letter-spacing: 0.01em;
  width: fit-content;
}

/* ═══════════════════════════════════════════════════════════════ STATUS BADGE */
.bv-status-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.bv-status-badge[data-status="bruta"]    { background: rgba(100,116,139,0.12); color: #94a3b8; }
.bv-status-badge[data-status="em_teste"] { background: rgba(234,179,8,0.12);   color: #eab308; }
.bv-status-badge[data-status="validada"] { background: rgba(34,197,94,0.12);   color: #22c55e; }
.bv-status-badge[data-status="escalada"] { background: rgba(59,130,246,0.12);  color: #60a5fa; }

/* ═══════════════════════════════════════════════════════════════ STARS */
.bv-stars {
  display: flex;
  gap: 1px;
  font-size: 14px;
}

.bv-stars-sm { font-size: 11px; }

.bv-star-on  { color: #f59e0b; }
.bv-star-off { color: var(--border); }

/* ═══════════════════════════════════════════════════════════════ TAGS */
.bv-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  background: var(--bg);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.bv-tag-sm { font-size: 10px; padding: 1px 5px; }

.bv-tag-more {
  background: transparent;
  border-color: transparent;
  color: var(--text-secondary);
  font-style: italic;
}

/* ═══════════════════════════════════════════════════════════════ KANBAN */
.bv-kanban {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  align-items: start;
}

.bv-kanban-col {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px;
  min-height: 200px;
  transition: background 0.15s;
}

.bv-kanban-col[data-status="em_teste"] { border-top: 2px solid #eab308; }
.bv-kanban-col[data-status="validada"] { border-top: 2px solid #22c55e; }
.bv-kanban-col[data-status="escalada"] { border-top: 2px solid #60a5fa; }
.bv-kanban-col[data-status="bruta"]    { border-top: 2px solid #475569; }

.bv-kanban-col-header {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 10px;
}

.bv-kanban-col-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.bv-kanban-col-dot[data-status="bruta"]    { background: #475569; }
.bv-kanban-col-dot[data-status="em_teste"] { background: #eab308; }
.bv-kanban-col-dot[data-status="validada"] { background: #22c55e; }
.bv-kanban-col-dot[data-status="escalada"] { background: #60a5fa; }

.bv-kanban-col-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  flex: 1;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.bv-kanban-col-count {
  font-size: 11px;
  font-weight: 600;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  border-radius: 12px;
  padding: 1px 7px;
}

.bv-kanban-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 9px;
  padding: 11px 12px;
  margin-bottom: 7px;
  cursor: grab;
  transition: box-shadow 0.15s, transform 0.1s;
}

.bv-kanban-card:hover {
  box-shadow: 0 3px 12px rgba(0,0,0,0.08);
  transform: translateY(-1px);
}

.bv-kanban-card:active { cursor: grabbing; }

.bv-kanban-card-tipo {
  font-size: 10px;
  font-weight: 600;
  color: #818cf8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.bv-kanban-card-nome {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  line-height: 1.3;
}

.bv-kanban-card-desc {
  font-size: 11.5px;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  margin-bottom: 6px;
}

.bv-kanban-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.bv-kanban-tags {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
}

.bv-kanban-empty {
  text-align: center;
  font-size: 12px;
  color: var(--text-secondary);
  padding: 20px 8px;
  opacity: 0.5;
  border: 2px dashed var(--border);
  border-radius: 8px;
}

/* ═══════════════════════════════════════════════════════════════ OVERLAY */
.bv-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.15s ease;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* ═══════════════════════════════════════════════════════════════ MODAL */
.bv-modal {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  width: 540px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 60px);
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

/* ═══════════════════════════════════════════════════════════════ TABS */
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

/* ═══════════════════════════════════════════════════════════════ MODAL BODY */
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

.bv-input::placeholder { color: #94a3b8; opacity: 1; }
.bv-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
  background: #ffffff;
}

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

/* ═══════════════════════════════════════════════════════════════ MODAL FOOTER */
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

/* ═══════════════════════════════════════════════════════════════ DRAWER */
.bv-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: flex-end;
  z-index: 9998;
  animation: fadeIn 0.15s ease;
}

.bv-drawer {
  width: 400px;
  max-width: calc(100vw - 40px);
  height: 100%;
  background: #ffffff;
  border-left: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  box-shadow: -12px 0 40px rgba(0,0,0,0.15);
  animation: slideRight 0.2s cubic-bezier(0.16,1,0.3,1);
  color: #1e293b;
}

@keyframes slideRight {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}

.bv-drawer-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
}

.bv-drawer-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 6px 0 0;
  line-height: 1.3;
}

.bv-drawer-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f8fafc;
}

.bv-drawer-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bv-drawer-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bv-drawer-section-title {
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.bv-drawer-text {
  font-size: 13.5px;
  color: #1e293b;
  line-height: 1.55;
  margin: 0;
}

.bv-drawer-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.bv-drawer-date {
  font-size: 11.5px;
  color: #64748b;
  margin-top: auto;
}

.bv-drawer-footer {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
  background: #ffffff;
}

/* ═══════════════════════════════════════════════════════════════ CONFIRM */
.bv-confirm {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px 28px;
  max-width: 340px;
  width: 100%;
  text-align: center;
  box-shadow: 0 24px 60px rgba(0,0,0,0.25);
  animation: slideUp 0.2s cubic-bezier(0.16,1,0.3,1);
}

.bv-confirm-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.bv-confirm h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 6px;
}

.bv-confirm p {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0 0 20px;
}

.bv-confirm-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}
</style>
