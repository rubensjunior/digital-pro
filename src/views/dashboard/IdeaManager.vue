<template>
  <div class="bv-root">

    <!-- ════════════════════════════════════════════ HEADER -->
    <!-- TOAST NOTIFICATION -->
    <div v-if="toast.visible" :class="['bv-toast', `bv-toast-${toast.type}`]">
      {{ toast.message }}
    </div>

    <div class="bv-header">
      <div class="bv-header-text">
        <p class="bv-subtitle" style="margin-top: -12px;">
          <strong>Workspace Atual:</strong>
          {{ ideias.length }} ideia{{ ideias.length !== 1 ? 's' : '' }} registrada{{ ideias.length !== 1 ? 's' : '' }}
          · {{ totalValidadas }} validada{{ totalValidadas !== 1 ? 's' : '' }}
        </p>
      </div>
    </div>

    <!-- ════════════════════════════════════════════ METRICS -->
    <div v-if="!loading && ideiasFilradas.length > 0" class="bv-metrics-grid">
      <div class="bv-metric-card bv-metric-blue">
        <div class="bv-metric-header">
          <span class="bv-metric-title">Total de Ideias</span>
          <div class="bv-metric-icon-wrap">
            <svg class="bv-metric-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
        </div>
        <div class="bv-metric-value">{{ ideiasFilradas.length }}</div>
        <div class="bv-metric-trend">Banco de ideias ativo</div>
      </div>
      <div class="bv-metric-card bv-metric-green">
        <div class="bv-metric-header">
          <span class="bv-metric-title">Taxa de Sucesso</span>
          <div class="bv-metric-icon-wrap">
             <svg class="bv-metric-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
             </svg>
          </div>
        </div>
        <div class="bv-metric-value">{{ taxaSucesso }}%</div>
        <div class="bv-metric-trend">
          Ideias finalizadas ou em escala
        </div>
      </div>
      <div class="bv-metric-card bv-metric-orange">
        <div class="bv-metric-header">
          <span class="bv-metric-title">Alto Potencial</span>
          <div class="bv-metric-icon-wrap">
            <svg class="bv-metric-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
        </div>
        <div class="bv-metric-value">{{ deAltoPotencial }}</div>
        <div class="bv-metric-trend">Score 3 ou superior</div>
      </div>
      <div class="bv-metric-card bv-metric-purple">
        <div class="bv-metric-header">
          <span class="bv-metric-title">Em Validação</span>
          <div class="bv-metric-icon-wrap">
            <svg class="bv-metric-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
            </svg>
          </div>
        </div>
        <div class="bv-metric-value">{{ totalEmProgresso }}</div>
        <div class="bv-metric-trend">Trabalho em andamento</div>
      </div>
    </div>

    <!-- ════════════════════════════════════════════ TOOLBAR -->
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
        <optgroup v-for="grupo in tiposAgrupados" :key="grupo.label" :label="grupo.label">
          <option v-for="t in grupo.options" :key="t.id" :value="t.id">{{ t.label }}</option>
        </optgroup>
      </select>

      <select v-model="filtro.status" class="bv-select">
        <option value="">Todos os status</option>
        <optgroup v-for="grupo in statusAgrupados" :key="grupo.label" :label="grupo.label">
          <option v-for="s in grupo.options" :key="s.id" :value="s.id">{{ s.label }}</option>
        </optgroup>
      </select>

      <select v-model="filtro.score" class="bv-select">
        <option value="">Qualquer score</option>
        <option value="4">4 / 4 - Muito alto</option>
        <option value="3">3 / 4 - Alto</option>
        <option value="2">2 / 4 - Médio</option>
        <option value="1">1 / 4 - Baixo</option>
      </select>

      <select v-model="filtro.ordenacao" class="bv-select">
        <option value="nova">Mais recentes</option>
        <option value="recente">Últimas acessadas</option>
      </select>

      <label class="bv-toggle-label">
        <input type="checkbox" v-model="filtro.apenasFavoritas" />
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width: 14px; height: 14px;"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
        Só Favoritas
      </label>

      <label class="bv-toggle-label">
        <input type="checkbox" v-model="filtro.emArquivo" />
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width: 14px; height: 14px;"><path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
        Ver Arquivo
      </label>
    </div>

    <!-- ════════════════════════════════════════════ LOADING -->
    <div v-if="loading" class="bv-loading">
      <div class="bv-spinner"></div>
      <span>Carregando ideias...</span>
    </div>

    <!-- ════════════════════════════════════════════ EMPTY STATE -->
    <div v-else-if="!loading && ideiasFilradas.length === 0 && view === 'lista'" class="bv-empty">
      <div class="bv-empty-icon">
        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
      </div>
      <h3>Nenhuma ideia encontrada</h3>
      <p v-if="ideias.length === 0">Comece capturando sua primeira ideia agora!</p>
      <p v-else>Tente ajustar os filtros de busca.</p>
      <button v-if="ideias.length === 0" class="bv-btn-primary" @click="abrirModal()">
        Capturar primeira ideia
      </button>
    </div>

    <!-- ════════════════════════════════════════════ LISTA -->
    <div v-else class="bv-list">
      <div
        v-for="ideia in listaHierarquica"
        :key="ideia.id"
        class="bv-card"
        :class="{ 'bv-card-sub': (ideia as any).depth > 0 }"
        :style="(ideia as any).depth > 0 ? { marginLeft: ((ideia as any).depth * 28) + 'px' } : {}"
        @dblclick="abrirDrawer(ideia)"
      >
        <template v-if="(ideia as any).depth > 0">
          <div 
            v-for="(isAncestorLast, i) in (ideia as any).lineage.slice(1, -1)" 
            v-show="!isAncestorLast"
            :key="'anc-' + i"
            class="bv-tree-vline" :style="{ left: (((Number(i) + 1) - Number((ideia as any).depth)) * 28 - 14) + 'px' }"
          ></div>
          <div class="bv-tree-elbow"></div>
          <div v-if="!(ideia as any).isLast" class="bv-tree-vline-continue"></div>
        </template>
        <div class="bv-card-left">
          <div style="display: flex; gap: 8px; align-items: center;">
            <span class="bv-fav-star" :class="{ 'is-fav': ideia.is_favorita }" @click.stop="handleToggleFavorita(ideia)">
              <svg v-if="ideia.is_favorita" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              <svg v-else fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </span>
            <div class="bv-card-tipo-badge" :style="{ backgroundColor: getTipoColor(ideia.tipo) || undefined }">{{ getTipoLabel(ideia.tipo) }}</div>
            <div v-if="(ideia as any).relationship_type && (ideia as any).depth > 0" class="bv-card-rel-badge">
              {{ (ideia as any).relationship_type }}
            </div>
          </div>
          <div class="bv-card-nome">{{ ideia.nome }}</div>
          <div v-if="ideia.descricao" class="bv-card-desc">{{ ideia.descricao }}</div>
          <div class="bv-card-tags">
            <span v-for="t in allTags(ideia).slice(0, 4)" :key="t" class="bv-tag">{{ t }}</span>
            <span v-if="allTags(ideia).length > 4" class="bv-tag bv-tag-more">+{{ allTags(ideia).length - 4 }}</span>
            <button 
              v-if="(ideia as any).derivadasCount > 0"
              class="bv-tag bv-tag-expand"
              @click.stop="toggleExpand(ideia.id)"
              title="Ver/Ocultar ideias derivadas"
            >
              {{ expandedIdeas.includes(ideia.id) ? '▴ Ocultar' : ('▾ ' + (ideia as any).derivadasCount + ' derivada' + ((ideia as any).derivadasCount > 1 ? 's' : '')) }}
            </button>
          </div>
        </div>
        <div class="bv-card-right">
          <span class="bv-status-badge" :style="{ backgroundColor: getStatusColor(ideia.status) || undefined }">{{ statusLabel(ideia.status) }}</span>
          <div class="bv-stars">
            <template v-for="n in 4" :key="n">
              <svg :class="n <= ideia.score ? 'bv-star-on' : 'bv-star-off'" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="14" height="14">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            </template>
          </div>
          <div class="bv-card-date">{{ formatDate(ideia.created_at) }}</div>
        </div>
      </div>
    </div>

    <!-- ════════════════════════════════════════════ MODAL -->
    <IdeaFormModal
      ref="ideaFormRef"
      :ideias="ideias"
      @saved="fetchIdeias"
    />

    <!-- ════════════════════════════════════════════ DRAWER -->
    <IdeaDetailDrawer
      ref="ideaDrawerRef"
      :ideias="ideias"
      @edit="abrirEdicao"
      @navigate="(path: string) => router.push(path)"
      @createDerivada="onCreateDerivada"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive, watch } from 'vue';
import { useIdeias } from '../../composables/useIdeias';
import { useRouter, useRoute } from 'vue-router';
import { useBus } from '../../composables/useBus';
import type { Ideia, IdeiaStatus, IdeiaTipo } from '../../types/ideia';
import { useTaxonomy } from '../../composables/useTaxonomy';
import IdeaDetailDrawer from '../../components/IdeaDetailDrawer.vue';
import IdeaFormModal from '../../components/IdeaFormModal.vue';

// ─── Composable ───────────────────────────────────────────────────────────────────
const { 
  ideias, loading, fetchIdeias, 
  toggleFavorita, toggleArquivada, duplicarIdeia 
} = useIdeias();

const router = useRouter();
const route  = useRoute();

const ideaDrawerRef = ref<InstanceType<typeof IdeaDetailDrawer> | null>(null);
const ideaFormRef = ref<InstanceType<typeof IdeaFormModal> | null>(null);
const view = ref('lista');

function abrirDrawer(ideia: Ideia) {
  ideaDrawerRef.value?.abrirDrawer(ideia);
}

const { on, off } = useBus();

onMounted(async () => {
  await fetchIdeias();

  // Escutar eventos do layout
  on('abrirModalNovaIdeia', abrirModal);
  on('abrirFluxogramaGeral', abrirFluxogramaGeral);
  on('abrirRedeNeuralGeral', abrirRedeNeuralGeral);

  if (route.query.openDrawer) {
    const ideia = ideias.value.find(i => i.id === route.query.openDrawer);
    if (ideia) ideaDrawerRef.value?.abrirDrawer(ideia);
  }
});

onUnmounted(() => {
  // Limpar listeners para evitar vazamento de memória ou chamadas duplas
  off('abrirModalNovaIdeia', abrirModal);
  off('abrirFluxogramaGeral', abrirFluxogramaGeral);
  off('abrirRedeNeuralGeral', abrirRedeNeuralGeral);
});

function onCreateDerivada(parentId: string) {
  ideaDrawerRef.value?.fecharDrawer();
  ideaFormRef.value?.abrirModal(parentId);
}

function abrirModal() {
  ideaFormRef.value?.abrirModal();
}

function abrirEdicao(ideia: Ideia) {
  ideaDrawerRef.value?.fecharDrawer();
  ideaFormRef.value?.abrirEdicao(ideia);
}

// ─── Toast ───────────────────────────────────────────────────────────────────
const toast = reactive({ visible: false, message: '', type: 'success' });
let toastTimeout: ReturnType<typeof setTimeout> | null = null;
function showToast(msg: string, type: 'success' | 'error' = 'success') {
  toast.message = msg;
  toast.type = type;
  toast.visible = true;
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toast.visible = false; }, 3000);
}

// Sincronizar view com parâmetro da URL
watch(() => route.query, (q) => {
  console.log('IdeiaManager: Mudança de filtros detectada:', q);
  if (q.view) view.value = q.view as string;
  if (q.tipo) filtro.tipo = q.tipo as string;
  if (q.status) filtro.status = q.status as string;
}, { immediate: true, deep: true });

// ─── Filtros ─────────────────────────────────────────────────────────────────
const filtro = reactive({ 
  busca: '', tipo: '', status: '', score: '', 
  apenasFavoritas: false, emArquivo: false, ordenacao: 'nova' 
});

const { 
  tipos, status, tiposAgrupados, statusAgrupados, 
  getStatusLabel: getStatusLabelHelper, getTipoLabel, 
  getStatusColor, getTipoColor 
} = useTaxonomy();

const ideiasFilradas = computed(() => {
  const archMap = new Map<string, boolean>();
  const isArchived = (id: string): boolean => {
    if (archMap.has(id)) return archMap.get(id)!;
    const i = ideias.value.find(x => x.id === id);
    if (!i) return false;
    if (i.is_arquivada) {
      archMap.set(id, true);
      return true;
    }
    if (i.parent_id) {
      const res = isArchived(i.parent_id);
      archMap.set(id, res);
      return res;
    }
    archMap.set(id, false);
    return false;
  };

  let list = ideias.value.filter(i => {
    const arquivada = isArchived(i.id);
    if (filtro.emArquivo && !arquivada) return false;
    if (!filtro.emArquivo && arquivada) return false;
    if (filtro.apenasFavoritas && !i.is_favorita) return false;

    const buscaOk = !filtro.busca || i.nome.toLowerCase().includes(filtro.busca.toLowerCase());
    const tipoOk  = !filtro.tipo   || i.tipo   === filtro.tipo;
    const stOk    = !filtro.status || i.status  === filtro.status;
    const scoreOk = !filtro.score  || i.score   >= Number(filtro.score);
    return buscaOk && tipoOk && stOk && scoreOk;
  });

  if (filtro.ordenacao === 'recente' && !filtro.emArquivo) {
    list = list.sort((a, b) => {
      const aTime = a.last_accessed_at ? new Date(a.last_accessed_at).getTime() : 0;
      const bTime = b.last_accessed_at ? new Date(b.last_accessed_at).getTime() : 0;
      return bTime - aTime;
    });
  }

  return list;
});

const expandedIdeas = ref<string[]>([]);
const toggleExpand = (id: string) => {
  const idx = expandedIdeas.value.indexOf(id);
  if (idx > -1) {
    expandedIdeas.value.splice(idx, 1);
  } else {
    expandedIdeas.value.push(id);
  }
};

const listaHierarquica = computed(() => {
  const todas = ideiasFilradas.value;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const arr: any[] = [];
  const addedIds = new Set<string>();

  const inserir = (ideia: typeof todas[0], depth: number, isLast: boolean, lineage: boolean[]) => {
    if (addedIds.has(ideia.id)) return;
    addedIds.add(ideia.id);
    const filhos = todas.filter(i => i.parent_id === ideia.id);
    arr.push({ ...ideia, depth, derivadasCount: filhos.length, isLast, lineage });
    
    if (expandedIdeas.value.includes(ideia.id)) {
      filhos.forEach((filho, idx) => {
        const isLastChild = idx === filhos.length - 1;
        inserir(filho, depth + 1, isLastChild, [...lineage, isLastChild]);
      });
    }
  };

  const raizes = todas.filter(i => !i.parent_id || !todas.some(p => p.id === i.parent_id));
  raizes.forEach((r, idx) => inserir(r, 0, idx === raizes.length - 1, [idx === raizes.length - 1]));
  return arr;
});

const totalValidadas = computed(() => {
  return ideias.value.filter(i => {
    const s = status.value.find(x => x.id === i.status);
    return s?.meta_status === 'done';
  }).length;
});

const totalEmProgresso = computed(() => {
  return ideias.value.filter(i => {
    const s = status.value.find(x => x.id === i.status);
    return s?.meta_status === 'in_progress' || s?.meta_status === 'review';
  }).length;
});

const taxaSucesso = computed(() => {
  if (ideias.value.length === 0) return 0;
  return Math.round((totalValidadas.value / ideias.value.length) * 100);
});

const deAltoPotencial = computed(() => ideias.value.filter(i => i.score >= 3).length);

// ─── Drawer Actions ───────────────────────────────────────────────────────────
async function handleDuplicar(ideia: Ideia) {
  const copia = await duplicarIdeia(ideia);
  if (copia) {
    showToast('Ideia duplicada com sucesso!');
  }
}

async function handleToggleFavorita(ideia: Ideia) {
  const novoEstado = !ideia.is_favorita;
  await toggleFavorita(ideia.id, novoEstado);
  showToast(novoEstado ? 'Favoritada!' : 'Removida dos favoritos.');
}

async function handleToggleArquivar(ideia: Ideia) {
  const novoEstado = !ideia.is_arquivada;
  await toggleArquivada(ideia.id, novoEstado);
  showToast(novoEstado ? 'Ideia arquivada.' : 'Ideia desarquivada.');
}

// ─── Navigation ──────────────────────────────────────────────────────────────
function abrirRedeNeuralGeral() { router.push(`/dashboard/ideas/general-network`); }
function abrirFluxogramaGeral() { router.push(`/dashboard/ideas/general-flowchart`); }

// Não há mais Drag & Drop no Manager
// ─── Helpers ──────────────────────────────────────────────────────────────────
function allTags(ideia: Ideia): string[] {
  return [
    ...ideia.tags_avatar, ...ideia.tags_nicho, ...ideia.tags_dor, 
    ...ideia.tags_desejo, ...ideia.tags_mecanismo
  ];
}

function statusLabel(status: string): string {
  return getStatusLabelHelper(status);
}

function formatDate(iso: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}
</script>

<style scoped>
.bv-root {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

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

/* ──────────────────────────────────────────────── Header */
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
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-radius: 6px;
}
.bv-title-icon svg {
  width: 16px;
  height: 16px;
}

.bv-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
}

/* ──────────────────────────────────────────────── Toolbar */
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
}

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
}

.bv-toggle-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--text-secondary);
  cursor: pointer;
  white-space: nowrap;
}

.bv-toggle-label:hover { color: var(--text-primary); }

/* ──────────────────────────────────────────────── List & Cards */
.bv-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
}

.bv-card {
  position: relative;
  background: var(--surface);
  border: 1px dashed var(--border);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  transition: all 0.2s;
  cursor: pointer;
}

.bv-card:hover { border-color: var(--accent); transform: translateX(4px); }

.bv-fav-star {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}
.bv-fav-star:hover {
  color: #f59e0b;
}

.is-fav { color: #f59e0b; fill: #f59e0b; }

.bv-card-tipo-badge {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  background: var(--border);
  color: var(--text-secondary);
  padding: 2px 8px;
  border-radius: 99px;
}

.bv-card-rel-badge {
  font-size: 10px;
  font-weight: 700;
  background: rgba(59, 132, 246, 0.1);
  color: #3b82f6;
  padding: 2px 8px;
  border-radius: 99px;
}

.bv-card-nome {
  font-size: 15px;
  font-weight: 600;
  margin: 8px 0 4px;
}

.bv-card-desc {
  font-size: 13px;
  color: var(--text-secondary);
  display: -webkit-box; line-clamp: 2; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.bv-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}

.bv-tag {
  font-size: 11.5px;
  background: var(--border);
  color: var(--text-primary);
  padding: 3px 10px;
  border-radius: 6px;
  border: 1px solid transparent;
}

.bv-tag-more { opacity: 0.7; }

/* ──────────────────────────────────────────────── Kanban */
.bv-kanban {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 24px;
}

.bv-kanban-col {
  flex: 0 0 280px;
  background: rgba(148, 163, 184, 0.05);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  min-height: 500px;
}

.bv-kanban-col-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.bv-kanban-col-dot { width: 8px; height: 8px; border-radius: 50%; }
.bv-kanban-col-dot[data-status="bruta"] { background: #94a3b8; }
.bv-kanban-col-dot[data-status="validada"] { background: #10b981; }

.bv-kanban-col-title { font-size: 13px; font-weight: 700; color: var(--text-primary); flex: 1; }
.bv-kanban-col-count { font-size: 11px; font-weight: 600; color: var(--text-secondary); }

.bv-kanban-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px;
  cursor: grab;
  transition: all 0.2s;
}

.bv-kanban-card:hover { transform: translateY(-2px); border-color: var(--accent); }

.bv-kanban-card-nome { font-size: 13.5px; font-weight: 600; margin: 4px 0; }

.bv-tree-vline {
  position: absolute; top: -8px; height: calc(100% + 8px); 
  border-left: 2px solid rgba(148, 163, 184, 0.4);
}
.bv-tree-elbow {
  position: absolute; left: -14px; top: -12px; height: calc(50% + 12px); width: 14px;
  border-left: 2px solid rgba(148, 163, 184, 0.4); border-bottom: 2px solid rgba(148, 163, 184, 0.4);
  border-bottom-left-radius: 6px;
}

.bv-tag-expand {
  background: rgba(139, 92, 246, 0.1); color: #8b5cf6; border-color: rgba(139, 92, 246, 0.2);
  cursor: pointer; font-weight: 600;
}

.bv-status-badge {
  display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 6px;
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  color: #fff;
}

.bv-stars { display: flex; gap: 2px; margin: 4px 0; }
.bv-star-on { color: #f59e0b; fill: #f59e0b; }
.bv-star-off { color: transparent; stroke: var(--border); stroke-width: 2; }
.bv-star-off path { fill: transparent; stroke: var(--border); }

/* ──────────────────────────────────────────────── Metrics Grid */
.bv-metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 8px;
}

.bv-metric-card {
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 0.1rem 0.5rem 0.1rem rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #ffffff;
  border: none;
}

.bv-metric-blue { background: #3b82f6; }
.bv-metric-green { background: #10b981; }
.bv-metric-orange { background: #f59e0b; }
.bv-metric-purple { background: #8b5cf6; }

.bv-metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1.5rem -0.5rem rgba(0, 0, 0, 0.15);
}

.bv-metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.bv-metric-title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.bv-metric-icon-wrap {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.bv-metric-svg {
  width: 20px;
  height: 20px;
}

.bv-metric-value {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.bv-metric-trend {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4px;
}

/* Customizing the empty icon */
.bv-empty-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  color: #94a3b8;
}
.bv-empty-icon svg {
  width: 100%;
  height: 100%;
}


.bv-card-date { font-size: 11px; color: var(--text-secondary); }

</style>
