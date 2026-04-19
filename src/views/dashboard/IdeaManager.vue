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
      <div style="display: flex; gap: 12px; align-items: center;">
        <button class="bv-btn-flowchart" @click="abrirFluxogramaGeral()" title="Ver como Fluxograma">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM9 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM9 8v4h6V8" /></svg>
          Fluxograma Geral
        </button>
        <button class="bv-btn-neural" @click="abrirRedeNeuralGeral()" title="Ver como Rede Neural">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          Rede Neural Geral
        </button>
        <button class="bv-btn-primary" @click="abrirModal()">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nova Ideia
        </button>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════ METRICS -->
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
            class="bv-tree-vline" 
            :style="{ left: (((i + 1) - Number((ideia as any).depth)) * 28 - 14) + 'px' }"
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



    <!-- ══════════════════════════════════════════════════════════ KANBAN -->
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

        <div v-if="porStatus[col.status].length === 0" class="bv-kanban-empty">
          Arraste ideias aqui
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════ MODAL -->
    <IdeaFormModal
      ref="ideaFormRef"
      :ideias="ideias"
      @saved="fetchIdeias"
    />

    <!-- ══════════════════════════════════════════════════════════ DRAWER -->
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
import { ref, computed, onMounted, reactive } from 'vue';
import { useIdeias } from '../../composables/useIdeias';
import { useRouter, useRoute } from 'vue-router';
import type { Ideia, IdeiaStatus, IdeiaTipo, IdeiaNote, IdeiaLink, IdeiaArquivo, IdeiaCorrelacao } from '../../types/ideia';
import { TIPOS_AGRUPADOS, STATUS_AGRUPADOS } from '../../types/ideia';
import IdeaDetailDrawer from '../../components/IdeaDetailDrawer.vue';
import IdeaFormModal from '../../components/IdeaFormModal.vue';

// Tipos globais do Electron (preload)
declare const window: Window & {
  electronAPI: {
    notas: {
      getAll: (id: string) => Promise<IdeiaNote[]>;
      create: (p: Record<string, unknown>) => Promise<IdeiaNote>;
      update: (p: Record<string, unknown>) => Promise<IdeiaNote>;
      delete: (id: string) => Promise<boolean>;
    };
    links: {
      getAll: (id: string) => Promise<IdeiaLink[]>;
      create: (p: Record<string, unknown>) => Promise<IdeiaLink>;
      delete: (id: string) => Promise<boolean>;
    };
    arquivos: {
      getAll: (id: string) => Promise<IdeiaArquivo[]>;
      save: (ideia_id: string, nome: string, base64: string, tipo: string, tamanho: number) => Promise<IdeiaArquivo>;
      delete: (id: string) => Promise<boolean>;
      open: (id: string) => Promise<boolean>;
    };
    correlacoes: {
      getAll: (id: string) => Promise<IdeiaCorrelacao[]>;
      create: (p: Record<string, unknown>) => Promise<boolean>;
      delete: (id: string) => Promise<boolean>;
    };
  };
};

// ─── Composable ───────────────────────────────────────────────────────────────
const { 
  ideias, loading, fetchIdeias, createIdeia, 
  updateIdeia, deleteIdeia, updateStatus, getHistorico,
  updateAcesso, toggleFavorita, toggleArquivada, duplicarIdeia 
} = useIdeias();

const router = useRouter();
const route  = useRoute();

const ideaDrawerRef = ref<InstanceType<typeof IdeaDetailDrawer> | null>(null);
const ideaFormRef = ref<InstanceType<typeof IdeaFormModal> | null>(null);

function abrirDrawer(ideia: Ideia) {
  ideaDrawerRef.value?.abrirDrawer(ideia);
}

onMounted(async () => {
  await fetchIdeias();
  // Se voltou da rede neural com ?openDrawer=id, abre o drawer daquela ideia
  if (route.query.openDrawer) {
    const ideia = ideias.value.find(i => i.id === route.query.openDrawer);
    if (ideia) ideaDrawerRef.value?.abrirDrawer(ideia);
  }
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

// ─── Toast ────────────────────────────────────────────────────────────────────
const toast = reactive({ visible: false, message: '', type: 'success' });
let toastTimeout: ReturnType<typeof setTimeout> | null = null;
function showToast(msg: string, type: 'success' | 'error' = 'success') {
  toast.message = msg;
  toast.type = type;
  toast.visible = true;
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toast.visible = false; }, 3000);
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const TABS = ['Identificação', 'Descrição', 'Tags', 'Ecossistema'];
const NOTE_COLORS = ['#fef9c3', '#fce7f3', '#dbeafe', '#dcfce7', '#ffe4e6', '#ede9fe', '#f1f5f9'];
const SCORE_LABELS = ['Baixo', 'Médio', 'Alto', 'Muito alto'];
const RELATIONSHIP_TYPES = ['Complementa', 'Feature de', 'Upsell de', 'Downsell de', 'Order bump de', 'Extensão de', 'Versão de', 'Subproduto de', 'Outro'];
const STATUS_OPTIONS = [
  { value: 'bruta' as IdeiaStatus,    label: 'Bruta' },
  { value: 'em_teste' as IdeiaStatus, label: 'Em Teste' },
  { value: 'validada' as IdeiaStatus, label: 'Validada' },
  { value: 'nao_validada' as IdeiaStatus, label: 'Não Validada' },
  { value: 'escalada' as IdeiaStatus, label: 'Escalada' },
];
const COLUNAS: { status: IdeiaStatus; label: string }[] = [
  { status: 'bruta' as IdeiaStatus,    label: 'Bruta' },
  { status: 'backlog' as IdeiaStatus,  label: 'Backlog' },
  { status: 'em_desenvolvimento' as IdeiaStatus, label: 'Em Desenv.' },
  { status: 'em_teste' as IdeiaStatus, label: 'Testando' },
  { status: 'validada' as IdeiaStatus, label: 'Validada' },
  { status: 'escalada' as IdeiaStatus, label: 'Escalada' },
  { status: 'arquivada' as IdeiaStatus, label: 'Arquivada' },
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
const filtro = reactive({ busca: '', tipo: '', status: '', score: '', apenasFavoritas: false, emArquivo: false, ordenacao: 'nova' });

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
    // Se "emArquivo" for true, mostrar SÓ as arquivadas, senão mostrar SÓ as ativas
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

// Removed opcoesPaiDisponiveis

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

  const idSet = new Set(todas.map(i => i.id));

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

  const raizes = todas.filter(i => !i.parent_id || !idSet.has(i.parent_id));
  raizes.forEach((raiz, idx) => {
    const isLastChild = idx === raizes.length - 1;
    inserir(raiz, 0, isLastChild, [isLastChild]);
  });

  return arr;
});

// Agrupamento para métricas gerais (todas as ideias)
const porStatus = computed(() => {
  const map: Record<string, Ideia[]> = {};
  ['bruta', 'em_teste', 'validada', 'nao_validada', 'escalada', 'backlog', 'em_desenvolvimento', 'arquivada'].forEach(s => {
    map[s] = [];
  });

  ideiasFilradas.value.forEach(ideia => {
    if (!map[ideia.status]) map[ideia.status] = [];
    map[ideia.status].push(ideia);
  });
  return map;
});

// Agrupamento específico para o Kanban (somente ideias principais)
const porStatusKanban = computed(() => {
  const map: Record<string, Ideia[]> = {};
  COLUNAS.forEach(col => {
    map[col.status] = [];
  });

  ideiasFilradas.value.forEach(ideia => {
    // FILTRO: Somente ideias principais no Kanban
    if (ideia.parent_id) return;

    if (!map[ideia.status]) {
      map[ideia.status] = [];
    }
    map[ideia.status].push(ideia);
  });
  return map;
});

const colunasVisiveis = computed(() => {
  return COLUNAS.filter(col => porStatusKanban.value[col.status]?.length > 0);
});

const taxaSucesso = computed(() => {
  if (ideiasFilradas.value.length === 0) return 0;
  const sucesso = porStatus.value.validada.length + porStatus.value.escalada.length;
  const testadas = ideiasFilradas.value.filter(i => i.status !== 'bruta').length;
  if (testadas === 0) return 0;
  return Math.round((sucesso / testadas) * 100);
});

const deAltoPotencial = computed(() => {
  return ideiasFilradas.value.filter(i => i.score >= 3).length;
});



// ─── Drawer ───────────────────────────────────────────────────────────────────
const drawerIdeia = ref<Ideia | null>(null);
const drawerTab   = ref<'geral' | 'doc' | 'conexoes'>('geral');
const historicoIdeia = ref<any[]>([]);

// ─── Conexões (Ecossistema Geral) ─────────────────────────────────────────────
const correlacoes = ref<IdeiaCorrelacao[]>([]);
const novaCorrelacaoForm = reactive({ ideia_id: '', descricao: '' });

const ideiasParaConectar = computed(() => {
  if (!drawerIdeia.value) return [];
  const connectedIds = new Set(correlacoes.value.map(c => c.correlata_id));
  return ideiasFilradas.value.filter(i => i.id !== drawerIdeia.value!.id && !connectedIds.has(i.id));
});

async function carregarCorrelacoes(id: string) {
  try {
    const api = (window as any).electronAPI;
    correlacoes.value = await api.correlacoes.getAll(id);
  } catch (e) {
    console.error('Erro ao buscar correlacoes:', e);
  }
}

async function criarCorrelacao() {
  if (!novaCorrelacaoForm.ideia_id || !drawerIdeia.value) return;
  try {
    const api = (window as any).electronAPI;
    await api.correlacoes.create({
      ideia_a_id: drawerIdeia.value.id,
      ideia_b_id: novaCorrelacaoForm.ideia_id,
      descricao: novaCorrelacaoForm.descricao,
    });
    await carregarCorrelacoes(drawerIdeia.value.id);
    novaCorrelacaoForm.ideia_id = '';
    novaCorrelacaoForm.descricao = '';
    showToast('Conexão estabelecida com sucesso!');
  } catch (e) {
    console.error('Erro ao criar correlacao:', e);
    showToast('Erro ao criar conexão', 'error');
  }
}

function deleteCorrelacao(id: string) {
  confirmarExclusaoGeral('Remover conexão?', 'Deseja realmente remover esta conexão?', async () => {
    try {
      const api = (window as any).electronAPI;
      await api.correlacoes.delete(id);
      if (drawerIdeia.value) await carregarCorrelacoes(drawerIdeia.value.id);
      showToast('Conexão removida.');
    } catch (e) {
      console.error('Erro ao deletar correlacao:', e);
    }
  });
}

const ideiaPai = computed(() => {
  if (!drawerIdeia.value?.parent_id) return null;
  return ideias.value.find(i => i.id === drawerIdeia.value?.parent_id) || null;
});

const ideiasFilhas = computed(() => {
  if (!drawerIdeia.value) return [];
  return ideias.value.filter(i => i.parent_id === drawerIdeia.value?.id);
});

// Árvore completa do ecossistema: sobe até a raiz e desce recursivamente
const ecosistemaArvore = computed(() => {
  if (!drawerIdeia.value) return [];

  // Sobe até a raiz (ideia sem pai)
  const encontrarRaiz = (ideia: Ideia): Ideia => {
    if (!ideia.parent_id) return ideia;
    const pai = ideias.value.find(i => i.id === ideia.parent_id);
    return pai ? encontrarRaiz(pai) : ideia;
  };

  const raiz = encontrarRaiz(drawerIdeia.value);
  const currentId = drawerIdeia.value.id;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const arr: Array<Ideia & { depth: number; isCurrent: boolean }> = [];
  const visitados = new Set<string>();

  const inserir = (ideia: Ideia, depth: number) => {
    if (visitados.has(ideia.id)) return; // evita ciclos
    visitados.add(ideia.id);
    arr.push({ ...ideia, depth, isCurrent: ideia.id === currentId });
    const filhos = ideias.value
      .filter(i => i.parent_id === ideia.id)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    for (const filho of filhos) {
      inserir(filho, depth + 1);
    }
  };

  inserir(raiz, 0);
  return arr;
});

function cadastrarDerivada() {
  if (!drawerIdeia.value) return;
  ideaFormRef.value?.abrirModal(drawerIdeia.value.id);
}



// ─── Documentação — Estado ────────────────────────────────────────────────────
const docTab = ref<'notas' | 'links' | 'arquivos'>('notas');
const notas    = ref<IdeiaNote[]>([]);
const links    = ref<IdeiaLink[]>([]);
const arquivos = ref<IdeiaArquivo[]>([]);

// Notas
const addingNote   = ref(false);
const editingNoteId = ref<string | null>(null);
const newNoteForm   = reactive({ titulo: '', conteudo: '', cor: '#fef9c3' });
const noteEditForm  = reactive({ titulo: '', conteudo: '', cor: '#fef9c3' });

// Links
const addingLink  = ref(false);
const linkErro    = ref('');
const newLinkForm = reactive({ url: '', titulo: '', descricao: '' });

// Arquivos
const fileInputRef   = ref<HTMLInputElement | null>(null);
const uploadando     = ref(false);
const uploadProgress = ref(0);

async function carregarDocumentacao(ideia_id: string) {
  const api = (window as any).electronAPI;
  const [n, l, a] = await Promise.all([
    api.notas.getAll(ideia_id),
    api.links.getAll(ideia_id),
    api.arquivos.getAll(ideia_id),
  ]);
  notas.value    = n ?? [];
  links.value    = l ?? [];
  arquivos.value = a ?? [];
}

// ── Notas ─────────────────────────────────────────────────────────────────────
function openAddNote() {
  Object.assign(newNoteForm, { titulo: '', conteudo: '', cor: '#fef9c3' });
  addingNote.value = true;
}

async function saveNewNote() {
  if (!newNoteForm.conteudo.trim() || !drawerIdeia.value) return;
  const api = (window as any).electronAPI;
  const nota = await api.notas.create({
    ideia_id: drawerIdeia.value.id,
    titulo:   newNoteForm.titulo.trim() || null,
    conteudo: newNoteForm.conteudo.trim(),
    cor: newNoteForm.cor,
  });
  notas.value.unshift(nota);
  addingNote.value = false;
  showToast('Nota salva!');
}

function startEditNote(nota: IdeiaNote) {
  editingNoteId.value = nota.id;
  Object.assign(noteEditForm, { titulo: nota.titulo ?? '', conteudo: nota.conteudo, cor: nota.cor });
}

async function saveEditNote(id: string) {
  const api = (window as any).electronAPI;
  const updated = await api.notas.update({
    id,
    titulo:   noteEditForm.titulo.trim() || null,
    conteudo: noteEditForm.conteudo.trim(),
    cor: noteEditForm.cor,
  });
  const idx = notas.value.findIndex(n => n.id === id);
  if (idx !== -1) notas.value[idx] = updated;
  editingNoteId.value = null;
  showToast('Nota atualizada!');
}

function deleteNota(id: string) {
  confirmarExclusaoGeral('Excluir nota?', 'Esta ação não pode ser desfeita.', async () => {
    const api = (window as any).electronAPI;
    await api.notas.delete(id);
    notas.value = notas.value.filter(n => n.id !== id);
    showToast('Nota removida.');
  });
}

// ── Links ─────────────────────────────────────────────────────────────────────
async function saveNewLink() {
  linkErro.value = '';
  if (!newLinkForm.url.trim()) { linkErro.value = 'URL é obrigatória.'; return; }
  try { new URL(newLinkForm.url.trim()); } catch { linkErro.value = 'URL inválida.'; return; }
  if (!drawerIdeia.value) return;
  const api = (window as any).electronAPI;
  const link = await api.links.create({
    ideia_id: drawerIdeia.value.id,
    url:      newLinkForm.url.trim(),
    titulo:   newLinkForm.titulo.trim() || null,
    descricao: newLinkForm.descricao.trim() || null,
  });
  links.value.unshift(link);
  Object.assign(newLinkForm, { url: '', titulo: '', descricao: '' });
  addingLink.value = false;
  showToast('Link adicionado!');
}

function deleteLink(id: string) {
  confirmarExclusaoGeral('Excluir link?', 'Esta ação não pode ser desfeita.', async () => {
    const api = (window as any).electronAPI;
    await api.links.delete(id);
    links.value = links.value.filter(l => l.id !== id);
    showToast('Link removido.');
  });
}

function openExternalLink(url: string) {
  // Usa o shell do electron via IPC, ou simplesmente window.open
  window.open(url);
}

// ── Arquivos ──────────────────────────────────────────────────────────────────
async function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0 || !drawerIdeia.value) return;
  const api = (window as any).electronAPI;
  uploadando.value = true;
  uploadProgress.value = 0;
  const files = Array.from(input.files);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const base64 = await fileToBase64(file);
    const saved = await api.arquivos.save(
      drawerIdeia.value.id,
      file.name,
      base64,
      file.type,
      file.size,
    );
    arquivos.value.unshift(saved);
    uploadProgress.value = Math.round(((i + 1) / files.length) * 100);
  }
  uploadando.value = false;
  input.value = '';
  showToast(`${files.length} arquivo(s) anexado(s)!`);
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function openArquivo(id: string) {
  const api = (window as any).electronAPI;
  await api.arquivos.open(id);
}

function deleteArquivo(id: string) {
  confirmarExclusaoGeral('Excluir arquivo?', 'Esta ação não pode ser desfeita.', async () => {
    const api = (window as any).electronAPI;
    await api.arquivos.delete(id);
    arquivos.value = arquivos.value.filter(a => a.id !== id);
    showToast('Arquivo removido.');
  });
}

function fileIcon(mime?: string): string {
  if (!mime) return '📄';
  if (mime.startsWith('image/')) return '🖼️';
  if (mime === 'application/pdf') return '📕';
  if (mime.includes('word')) return '📘';
  if (mime.includes('sheet') || mime.includes('excel')) return '📗';
  if (mime.includes('presentation') || mime.includes('powerpoint')) return '📙';
  if (mime.startsWith('video/')) return '🎬';
  if (mime.startsWith('audio/')) return '🎵';
  return '📄';
}

function formatBytes(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function mudarStatus(id: string, status: string) {
  await updateStatus(id, status as IdeiaStatus);
  if (drawerIdeia.value?.id === id) {
    drawerIdeia.value = { ...drawerIdeia.value, status: status as IdeiaStatus };
    historicoIdeia.value = await getHistorico(id);
  }
}

async function handleToggleFavorita(ideia: Ideia) {
  const novoEstado = !ideia.is_favorita;
  await toggleFavorita(ideia.id, novoEstado);
  if (drawerIdeia.value?.id === ideia.id) {
    drawerIdeia.value = { ...drawerIdeia.value, is_favorita: novoEstado };
  }
  showToast(novoEstado ? 'Favoritada!' : 'Removida dos favoritos.');
}

async function handleToggleArquivar(ideia: Ideia) {
  const novoEstado = !ideia.is_arquivada;
  await toggleArquivada(ideia.id, novoEstado);
  if (drawerIdeia.value?.id === ideia.id) {
    drawerIdeia.value = { ...drawerIdeia.value, is_arquivada: novoEstado };
  }
  showToast(novoEstado ? 'Ideia arquivada.' : 'Ideia desarquivada.');
}

function fecharDrawer() {
  // Apenas limpa a variável obsoleta. A gaveta lida com seu próprio estado.
  drawerIdeia.value = null;
}

async function handleDuplicar(ideia: Ideia) {
  const copia = await duplicarIdeia(ideia);
  if (copia) {
    showToast('Ideia duplicada com sucesso!');
  }
}


// ─── Rede Neural ──────────────────────────────────────────────────────────────
function encontrarRaizEcossistema(ideia: Ideia): string {
  if (!ideia.parent_id) return ideia.id;
  const pai = ideias.value.find(i => i.id === ideia.parent_id);
  return pai ? encontrarRaizEcossistema(pai) : ideia.id;
}

function abrirRedeNeural(ideia: Ideia) {
  router.push(`/dashboard/ideas/network/${ideia.id}`);
}

function abrirRedeNeuralGeral() {
  router.push(`/dashboard/ideas/general-network`);
}

function abrirFluxograma(ideia: Ideia) {
  router.push(`/dashboard/ideas/flowchart/${ideia.id}`);
}

function abrirFluxogramaGeral() {
  router.push(`/dashboard/ideas/general-flowchart`);
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
  white-space: nowrap;
  flex-shrink: 0;
}

.bv-btn-ghost:hover {
  background: var(--border);
  color: var(--text-primary);
}

.bv-btn-neural {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(139, 92, 246, 0.08); border: 1px solid rgba(139, 92, 246, 0.3);
  color: #8b5cf6; border-radius: 9px; font-size: 13.5px; font-weight: 600;
  padding: 9px 16px; cursor: pointer; transition: all 0.15s; white-space: nowrap; flex-shrink: 0;
}
.bv-btn-neural:hover {
  background: rgba(139, 92, 246, 0.16); border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 0 12px rgba(139, 92, 246, 0.15);
}

.bv-btn-flowchart {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(6, 182, 212, 0.08); border: 1px solid rgba(6, 182, 212, 0.3);
  color: #06b6d4; border-radius: 9px; font-size: 13.5px; font-weight: 600;
  padding: 9px 16px; cursor: pointer; transition: all 0.15s; white-space: nowrap; flex-shrink: 0;
}
.bv-btn-flowchart:hover {
  background: rgba(6, 182, 212, 0.16); border-color: rgba(6, 182, 212, 0.5);
  box-shadow: 0 0 12px rgba(6, 182, 212, 0.15);
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

.bv-btn-neural {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(139, 92, 246, 0.12);
  color: #a78bfa;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 600;
  padding: 9px 16px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.bv-btn-neural:hover {
  background: rgba(139, 92, 246, 0.22);
  border-color: rgba(139, 92, 246, 0.55);
  color: #c4b5fd;
  box-shadow: 0 0 16px rgba(139, 92, 246, 0.2);
}

/* ═══════════════════════════════════════════════════════════════ METRICS */
.bv-metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-top: 0;
}

.bv-metric-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: transform 0.15s, box-shadow 0.15s;
}

.bv-metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.bv-metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bv-metric-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.bv-metric-icon {
  font-size: 14px;
  opacity: 0.8;
}

.bv-metric-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  letter-spacing: -0.01em;
}

.bv-metric-trend {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
}

.bv-trend-up { color: #10b981; }
.bv-trend-flat { color: #8b5cf6; }
.bv-trend-star { color: #f59e0b; }
.bv-trend-test { color: #3b82f6; }

@media (max-width: 1024px) {
  .bv-metrics-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .bv-metrics-grid { grid-template-columns: 1fr; }
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

.bv-card-sub {
  position: relative;
  background: #ffffff;
  padding: 11px 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.bv-card-sub:hover {
  background: #f8fafc;
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.bv-card-sub .bv-card-nome {
  font-size: 13.5px;
}

.bv-card-sub .bv-card-desc {
  font-size: 12px;
}

.bv-card-rel-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  background: rgba(139, 92, 246, 0.12);
  color: #8b5cf6;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 4px 4px 24px;
  align-items: start;
  min-height: calc(100vh - 350px);
  /* Custom scrollbar for better look */
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

.bv-kanban::-webkit-scrollbar {
  height: 8px;
}
.bv-kanban::-webkit-scrollbar-track {
  background: transparent;
}
.bv-kanban::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 10px;
}
.bv-kanban::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

.bv-kanban-col {
  flex: 0 0 320px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px;
  min-height: 100%;
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
  width: 50vw;
  max-width: calc(100vw - 40px);
  min-width: 480px;
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
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  background: #f8fafc;
}

/* ════════════════════════════════ DRAWER TABS (primeiras) */
.bv-drawer-tabs {
  display: flex;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 20px;
  gap: 0;
  flex-shrink: 0;
}

.bv-drawer-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 14px 18px;
  font-size: 13.5px;
  font-weight: 600;
  color: #64748b;
  background: transparent;
  border: none;
  border-bottom: 2.5px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.bv-drawer-tab svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.bv-drawer-tab:hover { color: #1e293b; }

.bv-drawer-tab.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.bv-drawer-tab-neural {
  margin-left: auto; /* Empurra para o lado direito */
  color: #a855f7;
  font-weight: 700;
  border-bottom: 2.5px solid transparent;
}

.bv-drawer-tab-neural:hover {
  color: #9333ea;
  border-bottom-color: #9333ea;
}

.bv-drawer-tab-neural svg {
  color: #a855f7;
}


.bv-drawer-tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: #3b82f6;
  color: #fff;
  border-radius: 9px;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
}

.bv-drawer-tab-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  overflow-y: auto;
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
  justify-content: flex-start;
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
/* ═══════════════════════════════════════════════════════════════ TOGGLE LABEL */
.bv-toggle-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-primary);
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s;
}

.bv-toggle-label:hover {
  border-color: var(--accent);
}

.bv-toggle-label input {
  cursor: pointer;
}

/* ═══════════════════════════════════════════════════════════════ STARS (FAV) */
.bv-fav-star {
  font-size: 16px;
  cursor: pointer;
  color: #cbd5e1;
  transition: transform 0.15s, color 0.15s;
  user-select: none;
}
.bv-fav-star.is-fav {
  color: #f59e0b;
}
.bv-fav-star:hover {
  transform: scale(1.2);
}

/* ═══════════════════════════════════════════════════════════════ HISTORICO */
.bv-historico-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f8fafc;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  max-height: 250px;
  overflow-y: auto;
}

.bv-historico-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #e2e8f0;
}

.bv-historico-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.bv-historico-date {
  font-size: 11px;
  color: #64748b;
}

.bv-historico-acao {
  font-size: 13px;
  color: #1e293b;
}

.bv-historico-acao strong {
  font-weight: 600;
}

.bv-historico-detalhes {
  color: #64748b;
  font-style: italic;
}

/* ═══════════════════════════════════════════════════════════════ ECOSSISTEMA TREE */
.bv-tree { display: flex; flex-direction: column; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 8px; position: relative; gap: 2px; }
.bv-tree-item { display: flex; align-items: flex-start; gap: 8px; padding: 8px; border-radius: 6px; cursor: pointer; transition: background 0.15s; position: relative; }
.bv-tree-item:hover { background: #f1f5f9; }
.bv-tree-current { background: #f8fafc; cursor: default; }
.bv-tree-current:hover { background: #f8fafc; }
.bv-tree-icon { font-family: monospace; font-size: 14px; color: #94a3b8; width: 16px; text-align: center; line-height: 1.2; margin-top: 1px; flex-shrink: 0; }
.bv-tree-current .bv-tree-icon { color: var(--accent); }
.bv-tree-content { display: flex; flex-direction: column; flex: 1; min-width: 0; gap: 2px; }
.bv-tree-rel { font-size: 10px; color: #8b5cf6; font-weight: 700; text-transform: uppercase; line-height: 1; margin-bottom: 1px; }
.bv-tree-nome { font-size: 13px; color: var(--text-primary); font-weight: 600; line-height: 1.3; }
.bv-tree-child { margin-left: 20px; }
.bv-tree-line { position: absolute; left: 15px; top: -10px; bottom: 50%; width: 1px; background: var(--border); }
.bv-btn-sm { font-size: 12px; padding: 6px 12px; border-radius: 8px; }

/* ═══════════════════════════════════════════════════════ ECOSSISTEMA FULL TREE */
.bv-eco-tree {
  display: flex;
  flex-direction: column;
  gap: 3px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 6px 0;
  overflow: hidden;
}

.bv-eco-node {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-right: 12px;
  border-radius: 0;
  transition: background 0.15s;
  position: relative;
  cursor: pointer;
}

.bv-eco-node:hover {
  background: rgba(139, 92, 246, 0.06);
}

/* Nó raiz */
.bv-eco-node-root {
  border-bottom: 1px solid var(--border);
  margin-bottom: 2px;
}

/* Nó atual — destaque visual */
.bv-eco-node-current {
  background: rgba(139, 92, 246, 0.08);
  cursor: default;
  border-left: 3px solid var(--accent);
}

.bv-eco-node-current:hover {
  background: rgba(139, 92, 246, 0.08);
}

/* Conector ↳ para nós filhos */
.bv-eco-connector {
  font-size: 14px;
  color: #94a3b8;
  flex-shrink: 0;
  line-height: 1.4;
  margin-top: 1px;
}

/* Bolinha indicadora */
.bv-eco-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #cbd5e1;
  flex-shrink: 0;
  margin-top: 5px;
  transition: background 0.15s;
}

.bv-eco-dot-root {
  background: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.bv-eco-dot-current {
  background: var(--accent);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}

.bv-eco-node:hover .bv-eco-dot:not(.bv-eco-dot-root):not(.bv-eco-dot-current) {
  background: #8b5cf6;
}

/* Conteúdo do nó */
.bv-eco-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;
}

.bv-eco-rel {
  font-size: 10px;
  color: #8b5cf6;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  line-height: 1;
}

.bv-eco-nome {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bv-eco-current-badge {
  font-size: 11px;
  font-weight: 400;
  color: var(--accent);
  margin-left: 4px;
}

.bv-eco-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.bv-eco-tipo {
  font-size: 10px;
  color: #64748b;
  font-weight: 500;
}

/* Badge de status pequeno para o ecossistema */
.bv-status-sm {
  font-size: 9px !important;
  padding: 1px 6px !important;
  border-radius: 4px !important;
}

/* ══════════════════════════════════════════════════ DOCUMENTAÇÃO */
.bv-doc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

/* Sub-abas Documentação */
.bv-doc-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 6px;
}

.bv-doc-tab {
  padding: 5px 10px;
  font-size: 11.5px;
  font-weight: 600;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #f8fafc;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.bv-doc-tab:hover { color: #1e293b; border-color: #cbd5e1; }
.bv-doc-tab.active { background: #3b82f6; color: #fff; border-color: #3b82f6; }

.bv-doc-pane {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Botão genérico + Adicionar */
.bv-doc-add-btn {
  align-self: flex-start;
  padding: 6px 14px;
  font-size: 12.5px;
  font-weight: 600;
  background: rgba(59,130,246,0.08);
  color: #3b82f6;
  border: 1.5px dashed #93c5fd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}
.bv-doc-add-btn:hover { background: rgba(59,130,246,0.14); border-style: solid; }
.bv-doc-add-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.bv-doc-input {
  width: 100%;
  padding: 8px 11px;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  color: #1e293b;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
  transition: border-color 0.15s;
}
.bv-doc-input:focus { border-color: #3b82f6; }

.bv-doc-empty {
  font-size: 12.5px;
  color: #94a3b8;
  text-align: center;
  padding: 12px 0;
  font-style: italic;
}

.bv-doc-error {
  font-size: 12px;
  color: #ef4444;
  margin-top: -4px;
}

/* ─── Notas ────────────────────────────── */
.bv-notas-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bv-nota-item {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  transition: border-color 0.15s;
  overflow: hidden;
}

.bv-nota-item:hover { border-color: #93c5fd; }

.bv-nota-view {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
}

.bv-nota-icon {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 2px;
  box-shadow: inset 0 0 0 2px rgba(255,255,255,0.7);
  border: 1px solid rgba(0,0,0,0.1);
}

.bv-nota-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bv-nota-titulo {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.3;
}

.bv-nota-conteudo {
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

.bv-nota-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s;
}

.bv-nota-item:hover .bv-nota-actions { opacity: 1; }

.bv-nota-action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 4px;
  transition: transform 0.15s;
}

.bv-nota-action-btn:hover { transform: scale(1.1); }

.bv-cor-group {
  display: flex;
  gap: 6px;
}

.bv-cor-btn {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  padding: 0;
  transition: transform 0.15s, border-color 0.15s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.bv-cor-btn.active {
  border-color: #0f172a;
  transform: scale(1.15);
}

.bv-nota-save-btn {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.15s;
}

.bv-nota-save-btn:hover { opacity: 0.9; transform: translateY(-1px); }

.bv-nota-cancel-btn {
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 500;
  background: #f1f5f9;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #475569;
  transition: all 0.15s;
}

.bv-nota-cancel-btn:hover { background: #e2e8f0; color: #0f172a; }

/* ─── Links ────────────────────────────── */
.bv-links-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bv-link-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  transition: border-color 0.15s;
}

.bv-link-item:hover { border-color: #93c5fd; }

.bv-link-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }

.bv-link-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bv-link-url {
  font-size: 13px;
  font-weight: 600;
  color: #3b82f6;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.bv-link-url:hover { text-decoration: underline; }

.bv-link-sub {
  font-size: 11px;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bv-link-desc {
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
}

.bv-link-del {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 4px;
  opacity: 0;
  transition: opacity 0.15s;
  flex-shrink: 0;
}

.bv-link-item:hover .bv-link-del { opacity: 1; }

.bv-link-form {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  background: #f1f5f9;
  border-radius: 9px;
  border: 1.5px solid #e2e8f0;
}

/* ─── Arquivos ────────────────────────── */
.bv-files-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bv-file-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  transition: border-color 0.15s;
}

.bv-file-item:hover { border-color: #93c5fd; }

.bv-file-icon { font-size: 22px; flex-shrink: 0; }

.bv-file-info {
  flex: 1;
  min-width: 0;
}

.bv-file-nome {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bv-file-meta {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 1px;
}

.bv-file-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s;
}

.bv-file-item:hover .bv-file-actions { opacity: 1; }

.bv-file-btn {
  background: rgba(0,0,0,0.05);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  padding: 3px 6px;
  transition: background 0.15s;
}

.bv-file-btn:hover { background: rgba(0,0,0,0.12); }

/* Upload progress */
.bv-upload-progress {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0;
}

.bv-upload-bar {
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 99px;
  overflow: hidden;
}

.bv-upload-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 99px;
  transition: width 0.3s ease;
}

.bv-upload-progress span {
  font-size: 11.5px;
  color: #64748b;
}

/* Tree Guidelines */
.bv-tree-vline {
  position: absolute;
  top: -8px; 
  height: calc(100% + 8px); 
  border-left: 2px solid rgba(148, 163, 184, 0.4);
  z-index: 0;
  pointer-events: none;
}
.bv-tree-elbow {
  position: absolute;
  left: -14px;
  top: -12px; 
  height: calc(50% + 12px);
  width: 14px;
  border-left: 2px solid rgba(148, 163, 184, 0.4);
  border-bottom: 2px solid rgba(148, 163, 184, 0.4);
  border-bottom-left-radius: 6px;
  box-sizing: border-box;
  pointer-events: none;
}
.bv-tree-vline-continue {
  position: absolute;
  left: -14px;
  top: calc(50% - 6px); 
  height: calc(50% + 14px); 
  border-left: 2px solid rgba(148, 163, 184, 0.4);
  pointer-events: none;
}

/* Expansion Badge */
.bv-tag-expand {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
  border-color: rgba(139, 92, 246, 0.2);
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
}
.bv-tag-expand:hover {
  background: rgba(139, 92, 246, 0.18);
  color: #7c3aed;
}

</style>
