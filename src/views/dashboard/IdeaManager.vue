<template>
  <div class="bv-root">

    <!-- ════════════════════════════════════════════ HEADER -->
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
      <!-- Botões removidos aqui pois agora estão no subheader do layout -->
    </div>

    <!-- ════════════════════════════════════════════ METRICS -->
    <div v-if="!loading && ideiasFilradas.length > 0" class="bv-metrics-grid">
      <div class="bv-metric-card">
        <div class="bv-metric-header">
          <span class="bv-metric-title">Total de Ideias</span>
          <span class="bv-metric-icon">💡</span>
        </div>
        <div class="bv-metric-value">{{ ideiasFilradas.length }}</div>
        <div class="bv-metric-trend">🧠 Banco de ideias</div>
      </div>
      <div class="bv-metric-card">
        <div class="bv-metric-header">
          <span class="bv-metric-title">Validadas / Escaladas</span>
          <span class="bv-metric-icon">🎯</span>
        </div>
        <div class="bv-metric-value">{{ porStatus.validada.length + porStatus.escalada.length }}</div>
        <div class="bv-metric-trend" :class="taxaSucesso >= 20 ? 'bv-trend-up' : 'bv-trend-flat'">
          {{ taxaSucesso }}% de taxa de sucesso
        </div>
      </div>
      <div class="bv-metric-card">
        <div class="bv-metric-header">
          <span class="bv-metric-title">Alto Potencial</span>
          <span class="bv-metric-icon">🔥</span>
        </div>
        <div class="bv-metric-value">{{ deAltoPotencial }}</div>
        <div class="bv-metric-trend bv-trend-star">⭐ Score 3 ou 4</div>
      </div>
      <div class="bv-metric-card">
        <div class="bv-metric-header">
          <span class="bv-metric-title">Em Teste</span>
          <span class="bv-metric-icon">🧪</span>
        </div>
        <div class="bv-metric-value">{{ porStatus.em_teste.length }}</div>
        <div class="bv-metric-trend bv-trend-test">Em validação atual</div>
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
        <optgroup v-for="grupo in TIPOS_AGRUPADOS" :key="grupo.label" :label="grupo.label">
          <option v-for="t in grupo.options" :key="t" :value="t">{{ t }}</option>
        </optgroup>
      </select>

      <select v-model="filtro.status" class="bv-select">
        <option value="">Todos os status</option>
        <optgroup v-for="grupo in statusFiltrados" :key="grupo.label" :label="grupo.label">
          <option v-for="s in grupo.options" :key="s.value" :value="s.value">{{ s.label }}</option>
        </optgroup>
      </select>

      <select v-model="filtro.score" class="bv-select">
        <option value="">Qualquer score</option>
        <option value="4">⭐⭐⭐⭐ Muito alto</option>
        <option value="3">⭐⭐⭐ Alto</option>
        <option value="2">⭐⭐ Médio</option>
        <option value="1">⭐ Baixo</option>
      </select>

      <select v-model="filtro.ordenacao" class="bv-select">
        <option value="nova">Mais recentes</option>
        <option value="recente">Últimas acessadas</option>
      </select>

      <label class="bv-toggle-label">
        <input type="checkbox" v-model="filtro.apenasFavoritas" />
        ⭐ Só Favoritas
      </label>

      <label class="bv-toggle-label">
        <input type="checkbox" v-model="filtro.emArquivo" />
        🗃️ Ver Arquivo
      </label>
    </div>

    <!-- ════════════════════════════════════════════ LOADING -->
    <div v-if="loading" class="bv-loading">
      <div class="bv-spinner"></div>
      <span>Carregando ideias...</span>
    </div>

    <!-- ════════════════════════════════════════════ EMPTY STATE -->
    <div v-else-if="!loading && ideiasFilradas.length === 0 && view === 'lista'" class="bv-empty">
      <div class="bv-empty-icon">🧠</div>
      <h3>Nenhuma ideia encontrada</h3>
      <p v-if="ideias.length === 0">Comece capturando sua primeira ideia agora!</p>
      <p v-else>Tente ajustar os filtros de busca.</p>
      <button v-if="ideias.length === 0" class="bv-btn-primary" @click="abrirModal()">
        Capturar primeira ideia
      </button>
    </div>

    <!-- ════════════════════════════════════════════ LISTA -->
    <div v-else-if="view === 'lista'" class="bv-list">
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
              {{ ideia.is_favorita ? '⭐' : '☆' }}
            </span>
            <div class="bv-card-tipo-badge" :data-tipo="ideia.tipo">{{ ideia.tipo }}</div>
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
          <span class="bv-status-badge" :data-status="ideia.status">{{ statusLabel(ideia.status) }}</span>
          <div class="bv-stars">
            <span v-for="n in 4" :key="n" :class="n <= ideia.score ? 'bv-star-on' : 'bv-star-off'">★</span>
          </div>
          <div class="bv-card-date">{{ formatDate(ideia.created_at) }}</div>
        </div>
      </div>
    </div>

    <!-- ════════════════════════════════════════════ KANBAN -->
    <div v-else class="bv-kanban">
      <div
        v-for="col in colunasVisiveis"
        :key="col.status"
        class="bv-kanban-col"
        :data-status="col.status"
        @dragover.prevent
        @drop="onDrop($event, col.status)"
      >
        <div class="bv-kanban-col-header">
          <span class="bv-kanban-col-dot" :data-status="col.status"></span>
          <span class="bv-kanban-col-title">{{ col.label }}</span>
          <span class="bv-kanban-col-count">{{ porStatusKanban[col.status].length }}</span>
        </div>

        <div
          v-for="ideia in porStatusKanban[col.status]"
          :key="ideia.id"
          class="bv-kanban-card"
          draggable="true"
          @dragstart="onDragStart($event, ideia.id)"
          @dblclick="abrirDrawer(ideia)"
        >
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <div class="bv-kanban-card-tipo">{{ ideia.tipo }}</div>
            <span class="bv-fav-star" :class="{ 'is-fav': ideia.is_favorita }" @click.stop="handleToggleFavorita(ideia)">
              {{ ideia.is_favorita ? '⭐' : '☆' }}
            </span>
          </div>
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

        <div v-if="porStatusKanban[col.status].length === 0" class="bv-kanban-empty">
          Arraste ideias aqui
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
import { TIPOS_AGRUPADOS, STATUS_AGRUPADOS, getStatusGroupsForTipo, getStatusLabel as getStatusLabelHelper } from '../../types/ideia';
import IdeaDetailDrawer from '../../components/IdeaDetailDrawer.vue';
import IdeaFormModal from '../../components/IdeaFormModal.vue';

// ─── Composable ───────────────────────────────────────────────────────────────────
const { 
  ideias, loading, fetchIdeias, 
  updateStatus, toggleFavorita, toggleArquivada, duplicarIdeia 
} = useIdeias();

const router = useRouter();
const route  = useRoute();

const ideaDrawerRef = ref<InstanceType<typeof IdeaDetailDrawer> | null>(null);
const ideaFormRef = ref<InstanceType<typeof IdeaFormModal> | null>(null);

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
  ideaFormRef.value?.abrirModal(parentId);
}

function abrirModal() {
  ideaFormRef.value?.abrirModal();
}

function abrirEdicao(ideia: Ideia) {
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

// ─── View mode ───────────────────────────────────────────────────────────────
const view = ref<'lista' | 'kanban'>('lista');

// Sincronizar view com parâmetro da URL
watch(() => route.query, (q) => {
  console.log('IdeiaManager: Mudança de filtros detectada:', q);
  if (q.v === 'kanban') view.value = 'kanban';
  else view.value = 'lista';

  if (q.tipo) filtro.tipo = q.tipo as string;
  if (q.status) filtro.status = q.status as string;
}, { immediate: true, deep: true });

// ─── Filtros ─────────────────────────────────────────────────────────────────
const filtro = reactive({ 
  busca: '', tipo: '', status: '', score: '', 
  apenasFavoritas: false, emArquivo: false, ordenacao: 'nova' 
});

const statusFiltrados = computed(() => {
  const tipo = filtro.tipo;
  if (!tipo) return STATUS_AGRUPADOS;

  const grupoTipo = TIPOS_AGRUPADOS.find(g => g.options.includes(tipo as IdeiaTipo))?.label || '';
  const gruposParaMostrar = ['Geral'];

  if (grupoTipo.includes('Programação') || grupoTipo.includes('SaaS') || grupoTipo.includes('Gestão')) {
    gruposParaMostrar.push('Desenvolvimento');
  } else if (grupoTipo.includes('Marketing') || grupoTipo.includes('Publicidade')) {
    gruposParaMostrar.push('Produção');
  } else if (grupoTipo.includes('Jurídico') || grupoTipo.includes('Administrativo')) {
    gruposParaMostrar.push('Jurídico');
  }

  return STATUS_AGRUPADOS.filter(g => gruposParaMostrar.some(keyword => g.label.includes(keyword)));
});

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

const porStatus = computed(() => ({
  validada: ideias.value.filter(i => i.status === 'validada'),
  escalada: ideias.value.filter(i => i.status === 'escalada'),
  em_teste: ideias.value.filter(i => i.status === 'em_teste'),
  bruta: ideias.value.filter(i => i.status === 'bruta'),
}));

const porStatusKanban = computed(() => {
  const res: Record<string, Ideia[]> = {};
  colunasVisiveis.value.forEach(col => {
    res[col.status] = ideiasFilradas.value.filter(i => i.status === col.status);
  });
  return res;
});

const colunasVisiveis = computed(() => {
  const grupos = getStatusGroupsForTipo(filtro.tipo as IdeiaTipo);
  const cols: { status: IdeiaStatus; label: string }[] = [];
  
  grupos.forEach(g => {
    g.options.forEach(opt => {
      // Evita duplicados (como 'validada' que pode estar em mais de um grupo se a lógica mudar no futuro)
      if (!cols.some(c => c.status === opt.value)) {
        cols.push({ status: opt.value, label: opt.label.split(' (')[0] });
      }
    });
  });

  return cols;
});

const taxaSucesso = computed(() => {
  if (ideias.value.length === 0) return 0;
  const count = porStatus.value.validada.length + porStatus.value.escalada.length;
  return Math.round((count / ideias.value.length) * 100);
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

// ─── Drag & Drop ─────────────────────────────────────────────────────────────
const draggedId = ref<string | null>(null);
function onDragStart(event: DragEvent, id: string) {
  draggedId.value = id;
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
}
async function onDrop(event: DragEvent, novoStatus: IdeiaStatus) {
  event.preventDefault();
  if (!draggedId.value) return;
  await updateStatus(draggedId.value, novoStatus);
  draggedId.value = null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function allTags(ideia: Ideia): string[] {
  return [
    ...ideia.tags_avatar, ...ideia.tags_nicho, ...ideia.tags_dor, 
    ...ideia.tags_desejo, ...ideia.tags_mecanismo
  ];
}

function statusLabel(status: IdeiaStatus): string {
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
  font-size: 20px;
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
  border: 1px solid var(--border);
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

.is-fav { color: #f59e0b; }

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
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
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
  font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 6px;
}
.bv-status-badge[data-status="bruta"],
.bv-status-badge[data-status="backlog"],
.bv-status-badge[data-status="rascunho"],
.bv-status-badge[data-status="pendente"] { background: rgba(100,116,139,0.12); color: #94a3b8; }

.bv-status-badge[data-status="em_teste"] { background: rgba(234,179,8,0.12);   color: #eab308; }

.bv-status-badge[data-status="em_desenvolvimento"],
.bv-status-badge[data-status="em_revisao"],
.bv-status-badge[data-status="em_analise"] { background: rgba(59,130,246,0.12); color: #60a5fa; }

.bv-status-badge[data-status="validada"],
.bv-status-badge[data-status="implementado"],
.bv-status-badge[data-status="publicado"],
.bv-status-badge[data-status="aprovado"],
.bv-status-badge[data-status="assinado_deferido"] { background: rgba(34,197,94,0.12); color: #22c55e; }

.bv-status-badge[data-status="escalada"] { background: rgba(59,130,246,0.12);  color: #60a5fa; }

.bv-status-badge[data-status="nao_validada"],
.bv-status-badge[data-status="pausado"],
.bv-status-badge[data-status="cancelado_indeferido"] { background: rgba(239,68,68,0.12); color: #ef4444; }

.bv-status-badge[data-status="arquivada"] { background: rgba(100,116,139,0.12); color: #94a3b8; opacity: 0.6; }

.bv-stars { display: flex; gap: 2px; margin: 4px 0; }
.bv-star-on { color: #f59e0b; }
.bv-star-off { color: var(--border); }

.bv-card-date { font-size: 11px; color: var(--text-secondary); }

</style>
