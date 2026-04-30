<template>
  <div class="nn-page" :class="{ 'nn-presentation': isFullscreen }">

    <!-- ═══════════════════════════════════════════════ TOPBAR DA PÁGINA -->
    <div class="nn-topbar">
      <div class="nn-topbar-left">
        <button class="nn-back-btn" @click="voltar">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Voltar à Base de Ideias
        </button>
        <div class="nn-topbar-divider"></div>
        <button class="nn-back-btn" style="padding: 8px;" @click="reorganizar" title="Reorganizar Vista">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:16px; height:16px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>
        <button class="nn-back-btn" style="padding: 8px;" @click="toggleCollapseAll" :title="allExpanded ? 'Colapsar Tudo' : 'Expandir Tudo'">
          <svg v-if="allExpanded" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:16px; height:16px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9V5m0 4H5m4 0L4 4m11 5V5m0 4h4m-4 0l5-5M9 15v4m0-4H5m4 0l-5 5m11-5v4m0-4h4m-4 0l5 5"/>
          </svg>
          <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:16px; height:16px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
          </svg>
        </button>
        <div class="nn-topbar-divider"></div>
        <span class="nn-topbar-orb" style="background:#3b82f6;color:#3b82f6;"></span>
        <div class="nn-topbar-info">
          <span class="nn-topbar-title">Ecossistema Geral</span>
          <span class="nn-topbar-sub">
            {{ nosGrafo.length }} ideia{{ nosGrafo.length !== 1 ? 's' : '' }} principal{{ nosGrafo.length !== 1 ? 'is' : '' }}
            · {{ arestas.length }} conexão{{ arestas.length !== 1 ? 'ões' : '' }}
            · Clique em qualquer nó para ver detalhes
          </span>
        </div>
      </div>

      <div class="nn-topbar-right">
        <button class="nn-ctrl-btn" @click="resetZoom" title="Centralizar (Shift+C)">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
          </svg>
        </button>
        <button class="nn-ctrl-btn" @click="zoom(0.2)" title="Zoom In">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
          </svg>
        </button>
        <button class="nn-ctrl-btn" @click="zoom(-0.2)" title="Zoom Out">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"/>
          </svg>
        </button>
        <button class="nn-ctrl-btn" @click="toggleFullscreen" :title="isFullscreen ? 'Sair da Apresentação' : 'Modo Apresentação'">
          <svg v-if="!isFullscreen" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
          </svg>
          <svg v-else fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
          </svg>
        </button>
        <div class="nn-zoom-badge">{{ Math.round(scale * 100) }}%</div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════ CANVAS -->
    <div class="nn-canvas-wrap" ref="canvasWrap">
      <canvas
        ref="canvasEl"
        class="nn-canvas"
        @mousemove="onMouseMove"
        @mousedown="onMouseDown"
        @mouseup="onMouseUp"
        @mouseleave="onMouseLeave"
        @wheel.prevent="onWheel"
        @click="onCanvasClick"
        @dblclick="onCanvasDblClick"
        @contextmenu.prevent="handleContextMenu"
      ></canvas>

      <!-- Loading state -->
      <div v-if="loading" class="nn-loading">
        <div class="nn-loading-ring"></div>
        <span>Carregando ecossistema...</span>
      </div>

      <!-- Tooltip hover -->
      <div v-if="tooltip.visible" class="nn-tooltip"
        :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }">
        <div class="nn-tooltip-nome">{{ tooltip.nome }}</div>
        <div class="nn-tooltip-meta">
          <span class="nn-tooltip-tipo">{{ tooltip.tipo }}</span>
          <span class="nn-tooltip-status" :data-status="tooltip.status">{{ tooltip.statusLabel }}</span>
        </div>
        <div class="nn-tooltip-stars">
          <span v-for="n in 4" :key="n" :class="n <= tooltip.score ? 'nn-star-on' : 'nn-star-off'">★</span>
        </div>
        <div v-if="tooltip.rel" class="nn-tooltip-rel">↳ {{ tooltip.rel }}</div>
        <div class="nn-tooltip-hint">Clique para ver detalhes · Duplo clique para abrir</div>
      </div>

      <!-- Legenda -->
      <div class="nn-legend">
        <div class="nn-legend-title">Status</div>
        <div v-for="s in STATUS_LIST" :key="s.key" class="nn-legend-item">
          <span class="nn-legend-dot" :style="{ background: s.color, boxShadow: `0 0 6px ${s.color}` }"></span>
          <span>{{ s.label }}</span>
        </div>
      </div>

    </div><!-- /nn-canvas-wrap -->
    
    <!-- Drawer de Detalhes -->
    <IdeaDetailDrawer
      ref="ideaDrawerRef"
      :ideias="ideias"
      :show-brain-vault-link="true"
      @edit="(ideia) => ideaFormRef?.abrirEdicao(ideia)"
      @navigate="(path) => router.push(path)"
      @createDerivada="(parentId) => ideaFormRef?.abrirModal(parentId)"
    />

    <IdeaFormModal
      ref="ideaFormRef"
      :ideias="ideias"
      @saved="handleIdeiaSaved"
    />

      <!-- Hint inicial -->
      <div v-if="!loading && nosGrafo.length > 0 && !hintDismissed" class="nn-hint" @click="hintDismissed = true">
        🕸️ Arraste os nós · Scroll para zoom · Clique para detalhes
        <button @click.stop="hintDismissed = true">✕</button>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useIdeias } from '../../composables/useIdeias';
import { useBus } from '../../composables/useBus';
import type { Ideia, IdeiaStatus, IdeiaCorrelacao } from '../../types/ideia';
import IdeaDetailDrawer from '../../components/IdeaDetailDrawer.vue';
import IdeaFormModal from '../../components/IdeaFormModal.vue';
import { useTaxonomy } from '../../composables/useTaxonomy';

// ─── Router & Dados ───────────────────────────────────────────────────────────
const router = useRouter();
const { ideias, loading, fetchIdeias } = useIdeias();
const { on, off } = useBus();
const { status: taxonomyStatus, getStatusColor, getStatusLabel } = useTaxonomy();

const isFullscreen = ref(false);

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
}

// ─── Estado de Colapso ────────────────────────────────────────────────────────
const expandedNodes = reactive(new Set<string>());
const allExpanded = computed(() => expandedNodes.size > 0);
let cachedCorrelacoes: IdeiaCorrelacao[] = [];

function reorganizar() {
  nosGrafo.value = [];
  construirGrafo(cachedCorrelacoes);
}

function toggleCollapseAll() {
  if (allExpanded.value) {
    expandedNodes.clear();
  } else {
    ideias.value.forEach(i => expandedNodes.add(i.id));
  }
  construirGrafo(cachedCorrelacoes);
}

async function handleIdeiaSaved() {
  await fetchIdeias();
  const api = (window as any).electronAPI;
  cachedCorrelacoes = await api.correlacoes.getAllTodos();
  construirGrafo(cachedCorrelacoes);
}

onMounted(async () => {
  await fetchIdeias();
  
  const api = (window as any).electronAPI;
  cachedCorrelacoes = await api.correlacoes.getAllTodos();

  await nextTick(); // garante que o DOM está pronto
  if (canvasEl.value && canvasWrap.value) {
    const { width, height } = canvasWrap.value.getBoundingClientRect();
    canvasEl.value.width  = Math.floor(width);
    canvasEl.value.height = Math.floor(height);
  }

  construirGrafo(cachedCorrelacoes);
  
  on('abrirModalNovaIdeia', abrirModal);
  
  animFrame = requestAnimationFrame(drawCanvas);
});

onUnmounted(() => { 
  if (animFrame) cancelAnimationFrame(animFrame);
  off('abrirModalNovaIdeia', abrirModal);
});

function abrirModal() {
  ideaFormRef.value?.abrirModal();
}

function voltar() { router.push('/dashboard/ideas'); }
function voltarEAbrirDrawer(ideia: Ideia) {
  router.push({ path: '/dashboard/ideas', query: { openDrawer: ideia.id } });
}
function abrirRedeNeuralDaIdeia(ideia: Ideia) {
  router.push(`/dashboard/ideas/network/${ideia.id}`);
}
function irParaFluxogramaGeral() {
  router.push('/dashboard/ideas/general-flowchart');
}

// ─── Constantes & Helpers Dinâmicos ───────────────────────────────────────────
const SCORE_LABELS = ['Baixo', 'Médio', 'Alto', 'Muito Alto'];

// Mantemos o STATUS_LIST reativo baseado na taxonomia para a legenda
const STATUS_LIST = computed(() => {
  return taxonomyStatus.value.map(s => ({
    key: s.id,
    label: s.label,
    color: s.color || '#4b5563'
  }));
});

function getLocalStatusColor(statusKey: string) {
  return getStatusColor(statusKey) || '#4b5563';
}

function getLocalStatusLabel(statusKey: string) {
  return getStatusLabel(statusKey);
}

function statusLabel(s: IdeiaStatus) { return getLocalStatusLabel(s); }
function allTags(i: Ideia) {
  return [...i.tags_avatar, ...i.tags_nicho, ...i.tags_dor, ...i.tags_desejo, ...i.tags_mecanismo];
}

// ─── Grafo ────────────────────────────────────────────────────────────────────
interface GrafoNo {
  id: string; ideia: Ideia;
  x: number; y: number; vx: number; vy: number;
  radius: number; depth: number; parentId: string | null;
  isCentral: boolean; relType: string | null;
  hasChildren: boolean;
}
interface Aresta { origem: GrafoNo; destino: GrafoNo; label: string; }
interface Particula { arestaIdx: number; t: number; speed: number; alpha: number; }

const nosGrafo   = ref<GrafoNo[]>([]);
const arestas    = ref<Aresta[]>([]);
const particulas = ref<Particula[]>([]);
const hintDismissed = ref(false);

function construirGrafo(correlacoes: IdeiaCorrelacao[]) {
  const oldNos = new Map(nosGrafo.value.map(n => [n.id, n]));
  const nos: GrafoNo[] = [];
  const added = new Set<string>();

  const mapList = new Map(ideias.value.map(i => [i.id, i]));
  const roots = ideias.value.filter(i => {
    if (i.is_arquivada) return false;
    if (!i.parent_id || i.parent_id === 'null' || i.parent_id === 'undefined') return true;
    const pai = mapList.get(i.parent_id);
    if (!pai || pai.is_arquivada) return true;
    return false;
  });

  function addNo(ideia: Ideia, parentId: string | null, depth: number, relType: string | null) {
    if (added.has(ideia.id)) return;
    added.add(ideia.id);
    
    const filhos = ideias.value.filter(i => i.parent_id === ideia.id && !i.is_arquivada);
    const hasChildren = filhos.length > 0;

    const isCentral = depth === 0; 
    const radius = Math.max(22, 18 + ideia.score * 5);
    
    let nx, ny, vx, vy;
    const old = oldNos.get(ideia.id);
    if (old) {
      nx = old.x; ny = old.y; vx = old.vx; vy = old.vy;
    } else {
      if (parentId) {
         const p = nos.find(n => n.id === parentId);
         if (p) {
           nx = p.x + (Math.random() - 0.5) * 60;
           ny = p.y + (Math.random() - 0.5) * 60;
         } else {
           nx = (Math.random() - 0.5) * 400; ny = (Math.random() - 0.5) * 400;
         }
      } else {
         nx = (Math.random() - 0.5) * 400; ny = (Math.random() - 0.5) * 400;
      }
      vx = 0; vy = 0;
    }

    nos.push({ 
      id: ideia.id, 
      ideia, 
      x: nx, 
      y: ny, 
      vx, 
      vy, 
      radius, 
      depth, 
      parentId, 
      isCentral, 
      relType,
      hasChildren
    });

    if (expandedNodes.has(ideia.id)) {
      filhos.forEach(f => addNo(f, ideia.id, depth + 1, f.relationship_type || null));
    }
  }

  roots.forEach(r => addNo(r, null, 0, null));

  const as: Aresta[] = [];
  
  for (const n of nos) {
    if (n.parentId) {
      const pai = nos.find(p => p.id === n.parentId);
      if (pai) as.push({ origem: pai, destino: n, label: n.relType || '' });
    }
  }

  for (const corr of correlacoes) {
    const origem = nos.find(n => n.id === corr.ideia_a_id);
    const destino = nos.find(n => n.id === corr.ideia_b_id);
    if (origem && destino) {
      as.push({ origem, destino, label: corr.descricao || '' });
    }
  }

  const ps: Particula[] = [];
  for (let i = 0; i < as.length; i++) {
    for (let j = 0; j < Math.max(1, Math.floor(Math.random() * 3) + 1); j++) {
      ps.push({ arestaIdx: i, t: Math.random(), speed: 0.003 + Math.random() * 0.004, alpha: 0.7 + Math.random() * 0.3 });
    }
  }

  nosGrafo.value   = nos;
  arestas.value    = as;
  particulas.value = ps;
}

function toggleCollapse(id: string) {
  if (expandedNodes.has(id)) expandedNodes.delete(id);
  else expandedNodes.add(id);
  construirGrafo(cachedCorrelacoes);
}

// ─── Física ───────────────────────────────────────────────────────────────────
const K_REPEL   = 12000;  // repulsão equilibrada
const REST_LEN  = 250;    // comprimento ideal das arestas
const K_SPRING  = 0.035;  // rigidez das molas
const GRAVITY   = 0.005;  // gravidade suficiente para mantê-las no centro visual
const DAMP      = 0.75;   // amortecimento para estabilizar rápido
const DT        = 0.45;   // passo de tempo

function simularFisica() {
  const nos = nosGrafo.value;
  if (!nos.length) return;
  for (const no of nos) {
    let fx = 0, fy = 0;

    // ── Repulsão entre todos os nós ──
    for (const outro of nos) {
      if (outro === no) continue;
      const dx = no.x - outro.x, dy = no.y - outro.y;
      const d2 = Math.max(dx * dx + dy * dy, 1);
      const d  = Math.sqrt(d2);
      if (d < REST_LEN * 3) {
        const f = K_REPEL / d2;
        fx += f * dx / d; fy += f * dy / d;
      }
    }

    // ── Mola ao longo das arestas ──
    for (const a of arestas.value) {
      const outro = a.origem === no ? a.destino : a.destino === no ? a.origem : null;
      if (!outro) continue;
      const dx = outro.x - no.x, dy = outro.y - no.y;
      const d  = Math.sqrt(dx * dx + dy * dy) + 0.01;
      const f  = K_SPRING * (d - REST_LEN);
      fx += f * dx / d; fy += f * dy / d;
    }

    // ── Gravidade suave em direção ao centro ──
    fx -= no.x * GRAVITY;
    fy -= no.y * GRAVITY;

    no.vx = (no.vx + fx * DT) * DAMP;
    no.vy = (no.vy + fy * DT) * DAMP;
    no.x += no.vx; no.y += no.vy;
  }

  // ── Partículas ao longo das arestas ──
  for (const p of particulas.value) {
    p.t += p.speed;
    if (p.t > 1) p.t = 0;
  }
}

// ─── Câmera ───────────────────────────────────────────────────────────────────
const camX  = ref(0);
const camY  = ref(0);
const scale = ref(0.7); // Zoom inicial slightly reduced to see all

const W2S = (wx: number, wy: number, w: number, h: number) => ({
  x: wx * scale.value + camX.value + w / 2,
  y: wy * scale.value + camY.value + h / 2,
});
const S2W = (sx: number, sy: number, w: number, h: number) => ({
  x: (sx - w / 2 - camX.value) / scale.value,
  y: (sy - h / 2 - camY.value) / scale.value,
});

function zoom(d: number) { scale.value = Math.min(3, Math.max(0.15, scale.value + d)); }
function resetZoom() { camX.value = 0; camY.value = 0; scale.value = 0.7; }

// ─── Interação ────────────────────────────────────────────────────────────────
const canvasEl   = ref<HTMLCanvasElement | null>(null);
const canvasWrap = ref<HTMLElement | null>(null);
const hoveredId  = ref<string | null>(null);
const draggedNo  = ref<GrafoNo | null>(null);
const isPanning  = ref(false);
const panStart   = ref({ x: 0, y: 0 });
const ideaDrawerRef = ref<InstanceType<typeof IdeaDetailDrawer> | null>(null);
const ideaFormRef = ref<InstanceType<typeof IdeaFormModal> | null>(null);

const tooltip = ref({
  visible: false, x: 0, y: 0,
  nome: '', tipo: '', status: '' as IdeiaStatus,
  statusLabel: '', score: 0, rel: '',
});

function getNoAtPos(sx: number, sy: number, w: number, h: number): GrafoNo | null {
  for (const no of nosGrafo.value) {
    const s = W2S(no.x, no.y, w, h);
    const dx = sx - s.x, dy = sy - s.y;
    if (Math.sqrt(dx * dx + dy * dy) <= no.radius * scale.value + 6) return no;
  }
  return null;
}

function getToggleBtnAtPos(sx: number, sy: number, w: number, h: number): GrafoNo | null {
  for (const no of nosGrafo.value) {
    if (!no.hasChildren) continue;
    const s = W2S(no.x, no.y + no.radius + 24, w, h);
    const dx = sx - s.x, dy = sy - s.y;
    if (Math.sqrt(dx * dx + dy * dy) <= 7 * scale.value + 4) return no;
  }
  return null;
}

function onMouseMove(e: MouseEvent) {
  const c = canvasEl.value; if (!c) return;
  const r = c.getBoundingClientRect();
  const sx = e.clientX - r.left, sy = e.clientY - r.top;

  if (draggedNo.value) {
    const wp = S2W(sx, sy, c.width, c.height);
    draggedNo.value.x = wp.x; draggedNo.value.y = wp.y;
    draggedNo.value.vx = 0;   draggedNo.value.vy = 0;
    return;
  }
  if (isPanning.value) {
    camX.value += e.clientX - panStart.value.x;
    camY.value += e.clientY - panStart.value.y;
    panStart.value = { x: e.clientX, y: e.clientY };
    return;
  }
  const btn = getToggleBtnAtPos(sx, sy, c.width, c.height);
  const no = getNoAtPos(sx, sy, c.width, c.height);
  if (btn || no) {
    hoveredId.value = (btn || no)!.id;
    if (no) {
      tooltip.value = {
        visible: true,
        x: Math.min(sx + 18, c.width - 250), y: Math.max(sy - 10, 10),
        nome: no.ideia.nome, tipo: no.ideia.tipo, status: no.ideia.status,
        statusLabel: getLocalStatusLabel(no.ideia.status), score: no.ideia.score, rel: no.relType || '',
      };
    } else {
      tooltip.value.visible = false;
    }
    c.style.cursor = 'pointer';
  } else {
    hoveredId.value = null; tooltip.value.visible = false;
    c.style.cursor = isPanning.value ? 'grabbing' : 'grab';
  }
}

function onMouseDown(e: MouseEvent) {
  const c = canvasEl.value; if (!c) return;
  const r = c.getBoundingClientRect();
  const no = getNoAtPos(e.clientX - r.left, e.clientY - r.top, c.width, c.height);
  if (no) { draggedNo.value = no; c.style.cursor = 'grabbing'; }
  else { isPanning.value = true; panStart.value = { x: e.clientX, y: e.clientY }; c.style.cursor = 'grabbing'; }
}

function onMouseUp() {
  draggedNo.value = null; isPanning.value = false;
  if (canvasEl.value) canvasEl.value.style.cursor = hoveredId.value ? 'pointer' : 'grab';
}

function onMouseLeave() {
  tooltip.value.visible = false; hoveredId.value = null;
  draggedNo.value = null; isPanning.value = false;
}

function onWheel(e: WheelEvent) {
  const c = canvasEl.value; if (!c) return;
  const r = c.getBoundingClientRect();
  const mx = e.clientX - r.left, my = e.clientY - r.top;
  const delta = e.deltaY < 0 ? 0.12 : -0.12;
  const oldScale = scale.value;
  scale.value = Math.min(3, Math.max(0.15, scale.value + delta));
  
  const dScale = scale.value / oldScale;
  camX.value = mx - dScale * (mx - camX.value - c.width / 2) - c.width / 2 + camX.value * 0;
  camX.value = (mx - c.width / 2) * (1 - dScale) + camX.value * dScale;
  camY.value = (my - c.height / 2) * (1 - dScale) + camY.value * dScale;
}

function onCanvasClick(e: MouseEvent) {
  const c = canvasEl.value; if (!c) return;
  const r = c.getBoundingClientRect();
  const sx = e.clientX - r.left, sy = e.clientY - r.top;
  
  const btn = getToggleBtnAtPos(sx, sy, c.width, c.height);
  if (btn) { toggleCollapse(btn.id); return; }
}

function onCanvasDblClick(e: MouseEvent) {
  const c = canvasEl.value; if (!c) return;
  const r = c.getBoundingClientRect();
  const no = getNoAtPos(e.clientX - r.left, e.clientY - r.top, c.width, c.height);
  if (no) {
    if (ideaDrawerRef.value) {
      ideaDrawerRef.value.abrirDrawer(no.ideia);
    } else {
      console.warn('[GeneralNetwork] Drawer ref não disponível no duplo clique');
    }
  }
}

function handleContextMenu(e: MouseEvent) {
  const c = canvasEl.value; if (!c) return;
  const r = c.getBoundingClientRect();
  const no = getNoAtPos(e.clientX - r.left, e.clientY - r.top, c.width, c.height);

  // No nível Geral, o Control+Botão Direito não faz nada para não sair da feature
  if (e.ctrlKey) return;

  // Botão Direito Simples: Entrar na ideia
  if (no) {
    abrirRedeNeuralDaIdeia(no.ideia);
  }
}

// ─── Renderização ─────────────────────────────────────────────────────────────
let animFrame: number | null = null;
let tick = 0;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number) {
  const words = text.split(' '), lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  const th = lines.length * lh;
  lines.forEach((l, i) => ctx.fillText(l, x, y - th / 2 + i * lh + lh / 2));
}

function drawCanvas() {
  const c = canvasEl.value; if (!c) return;
  const ctx = c.getContext('2d'); if (!ctx) return;

  const wrap = canvasWrap.value;
  if (wrap) {
    const { width, height } = wrap.getBoundingClientRect();
    if (c.width !== Math.floor(width) || c.height !== Math.floor(height)) {
      c.width = Math.floor(width); c.height = Math.floor(height);
    }
  }

  const W = c.width, H = c.height;
  tick++;
  simularFisica();

  // Fundo
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, W * 0.85);
  bg.addColorStop(0, '#0d1117');
  bg.addColorStop(1, '#060a10');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Grid pontilhada sutil
  ctx.save();
  ctx.strokeStyle = '#ffffff08';
  ctx.lineWidth = 1;
  const gridS = 60 * scale.value;
  const offX = ((camX.value + W / 2) % gridS + gridS) % gridS;
  const offY = ((camY.value + H / 2) % gridS + gridS) % gridS;
  for (let x = offX; x < W; x += gridS) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = offY; y < H; y += gridS) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.restore();

  ctx.save();
  ctx.translate(W / 2 + camX.value, H / 2 + camY.value);
  ctx.scale(scale.value, scale.value);

  // ── Arestas ──
  for (const a of arestas.value) {
    const drawerIdeiaId = ideaDrawerRef.value?.drawerIdeia?.id;
    const isHov = hoveredId.value === a.origem.id || hoveredId.value === a.destino.id;
    const isPainel = drawerIdeiaId === a.origem.id || drawerIdeiaId === a.destino.id;
    const alpha = isHov || isPainel ? 'ee' : '44';
    const c1 = getLocalStatusColor(a.origem.ideia.status);
    const c2 = getLocalStatusColor(a.destino.ideia.status);
    const lg = ctx.createLinearGradient(a.origem.x, a.origem.y, a.destino.x, a.destino.y);
    lg.addColorStop(0, c1 + alpha);
    lg.addColorStop(1, c2 + alpha);
    ctx.beginPath();
    ctx.moveTo(a.origem.x, a.origem.y);
    ctx.lineTo(a.destino.x, a.destino.y);
    ctx.strokeStyle = lg;
    ctx.lineWidth = isHov || isPainel ? 2.8 : 1.2;
    ctx.stroke();

    if (a.label && scale.value >= 0.5) {
      const mx = (a.origem.x + a.destino.x) / 2;
      const my = (a.origem.y + a.destino.y) / 2;
      const ang = Math.atan2(a.destino.y - a.origem.y, a.destino.x - a.origem.x);
      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate(ang > Math.PI / 2 || ang < -Math.PI / 2 ? ang + Math.PI : ang);
      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = isHov ? '#cbd5e1' : '#475569';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(a.label, 0, -5);
      ctx.restore();
    }
  }

  // ── Partículas ──
  for (const p of particulas.value) {
    const a = arestas.value[p.arestaIdx]; if (!a) continue;
    const px = lerp(a.origem.x, a.destino.x, p.t);
    const py = lerp(a.origem.y, a.destino.y, p.t);
    const col = getLocalStatusColor(a.destino.ideia.status);
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.fillStyle = col + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
    ctx.fill();
  }

  // ── Nós ──
  const drawerIdeiaId = ideaDrawerRef.value?.drawerIdeia?.id;
  for (const no of nosGrafo.value) {
    const r = no.radius;
    const col = getLocalStatusColor(no.ideia.status);
    const isHov = hoveredId.value === no.id;
    const isPainelNode = drawerIdeiaId === no.id;
    const pulse = 0; // Removido pulse generalizado para não ficar muito agitado

    // Aura
    const glowR = (r + pulse + (isHov || isPainelNode ? 16 : 0)) * 2.8;
    const glow = ctx.createRadialGradient(no.x, no.y, r * 0.3, no.x, no.y, glowR);
    glow.addColorStop(0, col + (isHov || isPainelNode ? '44' : '18'));
    glow.addColorStop(1, col + '00');
    ctx.beginPath(); ctx.arc(no.x, no.y, glowR, 0, Math.PI * 2);
    ctx.fillStyle = glow; ctx.fill();

    // Halo seleção
    if (isHov || isPainelNode) {
      ctx.beginPath(); ctx.arc(no.x, no.y, r + (isPainelNode ? 12 : 9), 0, Math.PI * 2);
      ctx.strokeStyle = col + (isPainelNode ? 'dd' : '99');
      ctx.lineWidth = isPainelNode ? 3 : 2; ctx.stroke();
    }

    // Círculo principal
    const grad = ctx.createRadialGradient(no.x - r * 0.3, no.y - r * 0.3, r * 0.1, no.x, no.y, r + pulse);
    grad.addColorStop(0, col + 'ff');
    grad.addColorStop(1, col + '99');
    ctx.beginPath(); ctx.arc(no.x, no.y, r + pulse, 0, Math.PI * 2);
    ctx.fillStyle = grad; ctx.fill();

    // Rótulo
    if (scale.value >= 0.35) {
      const maxW = (r * 2) + 28;
      const nome = no.ideia.nome.length > (r > 34 ? 24 : 14) ? no.ideia.nome.slice(0, r > 34 ? 23 : 13) + '…' : no.ideia.nome;
      ctx.font = `bold ${Math.max(8, Math.min(13, r * 0.5))}px Inter, sans-serif`;
      ctx.fillStyle = '#f8fafc'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.shadowColor = '#00000099'; ctx.shadowBlur = 5;
      wrapText(ctx, nome, no.x, no.y, maxW, 14);
      ctx.shadowBlur = 0;
    }

    // Stars
    if (scale.value >= 0.6) {
      ctx.font = `${Math.max(7, r * 0.3)}px serif`;
      ctx.fillStyle = '#fbbf24cc'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText('★'.repeat(no.ideia.score) + '☆'.repeat(4 - no.ideia.score), no.x, no.y + r + pulse + 7);
    }

    // ── Botão [+] / [-] para expandir/colapsar ──
    if (no.hasChildren && scale.value >= 0.35) {
      const btnR = 7;
      const btnX = no.x;
      const btnY = no.y + r + 24;
      
      const isExpanded = expandedNodes.has(no.id);

      ctx.beginPath();
      ctx.arc(btnX, btnY, btnR, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = col + '99';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isExpanded ? '−' : '+', btnX, btnY);
    }
  }

  ctx.restore();
  animFrame = requestAnimationFrame(drawCanvas);
}

onUnmounted(() => { if (animFrame) cancelAnimationFrame(animFrame); });
</script>

<style scoped>
/* ══════════════════════════════════════════════════════════ PAGE */
.nn-page {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: #0d1117;
  border-radius: 0;
  overflow: hidden;
  z-index: 10;
}

/* Modo Apresentação */
.nn-presentation {
  position: fixed !important;
  inset: 0 !important;
  z-index: 99999 !important;
}

/* ══════════════════════════════════════════════════════════ TOPBAR */
.nn-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #0f172a;
  border-bottom: 1px solid #1e293b;
  flex-shrink: 0;
  gap: 16px;
}

.nn-topbar-left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  flex: 1;
}

.nn-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  flex-shrink: 0;
}
.nn-back-btn svg { width: 14px; height: 14px; }
.nn-back-btn:hover { background: #334155; color: #e2e8f0; border-color: #475569; }

.nn-topbar-divider {
  width: 1px; height: 28px;
  background: #1e293b;
  flex-shrink: 0;
}

.nn-topbar-orb {
  width: 10px; height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 8px currentColor;
}
.nn-topbar-orb { width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 10px currentColor; }

.nn-topbar-info { min-width: 0; }
.nn-topbar-title {
  display: block;
  font-size: 14px; font-weight: 700; color: #f1f5f9;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.nn-topbar-sub {
  display: block;
  font-size: 11px; color: #475569; margin-top: 1px;
}

.nn-topbar-right { display: flex; gap: 6px; align-items: center; flex-shrink: 0; }

.nn-nav-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 12px; border-radius: 8px;
  font-size: 11px; font-weight: 600;
  cursor: pointer; transition: all 0.15s;
  white-space: nowrap; flex-shrink: 0;
}
.nn-nav-btn svg { width: 14px; height: 14px; }
.nn-nav-neural {
  background: rgba(139, 92, 246, 0.12); border: 1px solid rgba(139, 92, 246, 0.3); color: #a78bfa;
}
.nn-nav-neural:hover {
  background: rgba(139, 92, 246, 0.25); border-color: rgba(139, 92, 246, 0.55); color: #c4b5fd;
}
.nn-nav-flowchart {
  background: rgba(6, 182, 212, 0.12); border: 1px solid rgba(6, 182, 212, 0.3); color: #67e8f9;
}
.nn-nav-flowchart:hover {
  background: rgba(6, 182, 212, 0.25); border-color: rgba(6, 182, 212, 0.55); color: #a5f3fc;
}

.nn-ctrl-btn {
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 34px;
  background: #1e293b; border: 1px solid #334155;
  border-radius: 8px; color: #94a3b8; cursor: pointer; transition: all 0.15s;
}
.nn-ctrl-btn svg { width: 16px; height: 16px; }
.nn-ctrl-btn:hover { background: #334155; color: #e2e8f0; border-color: #475569; }

.nn-zoom-badge {
  font-size: 11px; font-weight: 700; color: #64748b;
  background: #1e293b; border: 1px solid #334155;
  border-radius: 6px; padding: 4px 10px;
  min-width: 48px; text-align: center;
}

/* ══════════════════════════════════════════════════════════ CANVAS */
.nn-canvas-wrap {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.nn-canvas {
  display: block;
  width: 100%; height: 100%;
  cursor: grab;
}

/* ══════════════════════════════════════════════════════════ LOADING */
.nn-loading {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 16px; color: #475569; font-size: 13px;
}
.nn-loading-ring {
  width: 40px; height: 40px;
  border: 3px solid #1e293b;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ══════════════════════════════════════════════════════════ TOOLTIP */
.nn-tooltip {
  position: absolute;
  background: rgba(15, 23, 42, 0.96);
  border: 1px solid #334155;
  border-radius: 12px; padding: 12px 16px;
  pointer-events: none; z-index: 50;
  min-width: 200px; max-width: 260px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  animation: tooltipIn 0.15s ease-out;
}
@keyframes tooltipIn {
  from { opacity: 0; transform: scale(0.95) translateY(4px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
.nn-tooltip-nome { font-size: 13px; font-weight: 700; color: #f1f5f9; margin-bottom: 6px; line-height: 1.3; }
.nn-tooltip-meta { display: flex; align-items: center; gap: 6px; margin-bottom: 5px; flex-wrap: wrap; }
.nn-tooltip-tipo {
  font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;
  background: #1e293b; color: #94a3b8; border: 1px solid #334155;
  text-transform: uppercase; letter-spacing: 0.04em;
}
.nn-tooltip-status {
  font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; color: #fff;
}
.nn-tooltip-status[data-status="bruta"]        { background: #475569; }
.nn-tooltip-status[data-status="em_teste"]     { background: #d97706; }
.nn-tooltip-status[data-status="validada"]     { background: #059669; }
.nn-tooltip-status[data-status="nao_validada"] { background: #dc2626; }
.nn-tooltip-status[data-status="escalada"]     { background: #7c3aed; }
.nn-tooltip-stars { font-size: 12px; margin-bottom: 5px; }
.nn-star-on  { color: #fbbf24; }
.nn-star-off { color: #334155; }
.nn-tooltip-rel { font-size: 10px; color: #94a3b8; font-style: italic; margin-bottom: 4px; }
.nn-tooltip-hint { font-size: 10px; color: #60a5fa; font-weight: 600; }

/* ══════════════════════════════════════════════════════════ LEGENDA */
.nn-legend {
  position: absolute; bottom: 20px; left: 20px;
  background: rgba(15, 23, 42, 0.88);
  border: 1px solid #1e293b; border-radius: 10px;
  padding: 10px 14px; pointer-events: none;
  backdrop-filter: blur(8px);
}
.nn-legend-title {
  font-size: 9px; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase; color: #475569; margin-bottom: 7px;
}
.nn-legend-item {
  display: flex; align-items: center; gap: 7px;
  font-size: 11px; color: #94a3b8; margin-bottom: 4px;
}
.nn-legend-item:last-child { margin-bottom: 0; }
.nn-legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

/* ══════════════════════════════════════════════════════════ PAINEL DE DETALHES */
.nn-panel {
  position: absolute; top: 16px; right: 16px;
  width: 280px;
  max-height: calc(100vh - 32px);
  display: flex; flex-direction: column;
  background: rgba(15, 23, 42, 0.96);
  border: 1px solid #334155; border-radius: 14px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  overflow: hidden;
}
.panel-enter-active, .panel-leave-active { transition: all 0.2s cubic-bezier(0.34, 1.4, 0.64, 1); }
.panel-enter-from { opacity: 0; transform: translateX(20px) scale(0.95); }
.panel-leave-to  { opacity: 0; transform: translateX(20px) scale(0.95); }

.nn-panel-header {
  flex-shrink: 0;
  display: flex; align-items: flex-start; gap: 10px;
  padding: 14px 14px 10px;
  border-bottom: 1px solid #1e293b;
}
.nn-panel-orb {
  width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; margin-top: 4px;
  box-shadow: 0 0 8px currentColor;
}
.nn-panel-orb[data-status="bruta"]        { background: #64748b; color: #64748b; }
.nn-panel-orb[data-status="em_teste"]     { background: #f59e0b; color: #f59e0b; }
.nn-panel-orb[data-status="validada"]     { background: #10b981; color: #10b981; }
.nn-panel-orb[data-status="nao_validada"] { background: #ef4444; color: #ef4444; }
.nn-panel-orb[data-status="escalada"]     { background: #8b5cf6; color: #8b5cf6; }
.nn-panel-titulo {
  flex: 1; font-size: 13px; font-weight: 700; color: #f1f5f9;
  line-height: 1.35;
}
.nn-panel-close {
  width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
  background: transparent; border: none; color: #475569; cursor: pointer;
  border-radius: 6px; transition: all 0.15s; flex-shrink: 0;
}
.nn-panel-close svg { width: 14px; height: 14px; }
.nn-panel-close:hover { background: #1e293b; color: #94a3b8; }

.nn-panel-body { 
  padding: 12px 14px; 
  display: flex; flex-direction: column; gap: 10px;
  overflow-y: auto;
}

.nn-panel-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.nn-panel-badge {
  font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 4px;
  background: #1e293b; color: #94a3b8; border: 1px solid #334155;
  text-transform: uppercase; letter-spacing: 0.04em;
}
.nn-panel-status {
  font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; color: #fff;
}
.nn-panel-status[data-status="bruta"]        { background: #475569; }
.nn-panel-status[data-status="em_teste"]     { background: #d97706; }
.nn-panel-status[data-status="validada"]     { background: #059669; }
.nn-panel-status[data-status="nao_validada"] { background: #dc2626; }
.nn-panel-status[data-status="escalada"]     { background: #7c3aed; }

.nn-panel-stars { display: flex; align-items: center; gap: 4px; font-size: 13px; }
.nn-panel-score-label { font-size: 10px; color: #64748b; margin-left: 4px; }

.nn-panel-desc {
  font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0;
  display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3;
  -webkit-box-orient: vertical; overflow: hidden;
}

.nn-panel-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.nn-panel-tag {
  font-size: 10px; padding: 2px 7px; border-radius: 4px;
  background: #1e293b; color: #64748b; border: 1px solid #1e293b;
}

.nn-panel-footer {
  flex-shrink: 0;
  padding: 10px 14px;
  border-top: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.nn-panel-btn-ghost {
  width: 100%; padding: 8px; border-radius: 8px;
  background: transparent; border: 1px solid #334155;
  color: #94a3b8; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.15s; text-align: center;
}
.nn-panel-btn-ghost:hover { background: #1e293b; color: #e2e8f0; border-color: #475569; }

.nn-panel-btn-neural {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  width: 100%; padding: 8px; border-radius: 8px;
  background: rgba(139, 92, 246, 0.12); border: 1px solid rgba(139, 92, 246, 0.3);
  color: #a78bfa; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.15s;
}
.nn-panel-btn-neural svg { width: 14px; height: 14px; }
.nn-panel-btn-neural:hover { 
  background: rgba(139, 92, 246, 0.22); 
  border-color: rgba(139, 92, 246, 0.55); 
  color: #c4b5fd; 
  box-shadow: 0 0 12px rgba(139, 92, 246, 0.2); 
}

/* ══════════════════════════════════════════════════════════ HINT */
.nn-hint {
  position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
  background: rgba(15, 23, 42, 0.9); border: 1px solid #334155;
  border-radius: 20px; padding: 8px 18px;
  font-size: 11px; color: #64748b;
  display: flex; align-items: center; gap: 10px;
  backdrop-filter: blur(8px); pointer-events: auto; cursor: pointer;
  animation: hintIn 0.4s 1.5s ease-out both;
}
@keyframes hintIn {
  from { opacity: 0; transform: translateX(-50%) translateY(12px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}
.nn-hint button {
  background: none; border: none; color: #475569; cursor: pointer;
  font-size: 11px; padding: 0; line-height: 1;
}
.nn-hint button:hover { color: #94a3b8; }
</style>
