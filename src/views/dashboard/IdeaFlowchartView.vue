<template>
  <div class="nn-page">

    <!-- ═══════════════════════════════════════════════ TOPBAR DA PÁGINA -->
    <div class="nn-topbar">
      <div class="nn-topbar-left">
        <button class="nn-back-btn" @click="voltar">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Voltar ao Brain Vault
        </button>
        <button class="nn-back-btn" @click="subirNivel" title="Subir Nível">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
          </svg>
          Subir Nível
        </button>
        <div class="nn-topbar-divider"></div>
        <button class="nn-back-btn" style="padding: 8px;" @click="reorganizar" title="Reorganizar Vista">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:16px; height:16px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>
        <button class="nn-back-btn" style="padding: 8px;" @click="toggleCollapseAll" :title="allCollapsed ? 'Expandir Tudo' : 'Colapsar Tudo'">
          <svg v-if="allCollapsed" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:16px; height:16px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
          </svg>
          <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width:16px; height:16px;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9V5m0 4H5m4 0L4 4m11 5V5m0 4h4m-4 0l5-5M9 15v4m0-4H5m4 0l-5 5m11-5v4m0-4h4m-4 0l5 5"/>
          </svg>
        </button>
        <div class="nn-topbar-divider"></div>
        <span class="nn-topbar-orb" :data-status="rootIdeia?.status"></span>
        <div class="nn-topbar-info">
          <span class="nn-topbar-title">{{ rootIdeia?.nome ?? 'Ecossistema' }}</span>
          <span class="nn-topbar-sub">
            {{ nosGrafo.length }} nó{{ nosGrafo.length !== 1 ? 's' : '' }}
            · {{ arestas.length }} conex{{ arestas.length !== 1 ? 'ões' : 'ão' }}
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
        📊 Scroll para zoom · Clique para detalhes · Clique [+]/[-] para expandir/colapsar
        <button @click.stop="hintDismissed = true">✕</button>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useIdeias } from '../../composables/useIdeias';
import { useBus } from '../../composables/useBus';
import type { Ideia, IdeiaStatus } from '../../types/ideia';
import IdeaDetailDrawer from '../../components/IdeaDetailDrawer.vue';
import IdeaFormModal from '../../components/IdeaFormModal.vue';

// ─── Router & Dados ───────────────────────────────────────────────────────────
const route  = useRoute();
const router = useRouter();
const { ideias, loading, fetchIdeias } = useIdeias();
const { on, off } = useBus();

const rootId = computed(() => route.params.rootId as string);
const rootIdeia = computed(() => ideias.value.find(i => i.id === rootId.value) ?? null);

const hasValidParent = computed(() => {
  const pid = rootIdeia.value?.parent_id;
  if (!pid || pid === 'null' || pid === 'undefined') return false;
  const pai = ideias.value.find(i => i.id === pid && !i.is_arquivada);
  return !!pai;
});

// ─── Estado de Colapso ────────────────────────────────────────────────────────
const collapsedNodes = reactive(new Set<string>());
const allCollapsed = computed(() => collapsedNodes.size > 0);

function reorganizar() {
  construirGrafo(rootId.value);
}

function toggleCollapseAll() {
  if (allCollapsed.value) {
    collapsedNodes.clear();
  } else {
    ideias.value.forEach(i => {
      if (i.id !== rootId.value) collapsedNodes.add(i.id);
    });
  }
  construirGrafo(rootId.value);
}

async function handleIdeiaSaved() {
  await fetchIdeias();
  construirGrafo(rootId.value);
}

onMounted(async () => {
  await fetchIdeias();
  await nextTick();
  if (canvasEl.value && canvasWrap.value) {
    const { width, height } = canvasWrap.value.getBoundingClientRect();
    canvasEl.value.width  = Math.floor(width);
    canvasEl.value.height = Math.floor(height);
  }
  construirGrafo(rootId.value);
  
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

watch(rootId, async (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    collapsedNodes.clear();
    hoveredId.value = null;
    camX.value = 0; camY.value = 0; scale.value = 1;
    construirGrafo(newVal);
  }
});

function voltar() { router.push('/dashboard/ideas'); }
function subirNivel() {
  if (hasValidParent.value) {
    abrirFluxogramaDaIdeia({ id: rootIdeia.value!.parent_id } as Ideia);
  } else {
    irParaFluxogramaGeral();
  }
}
function abrirFluxogramaDaIdeia(ideia: Ideia) {
  router.push(`/dashboard/ideas/flowchart/${ideia.id}`);
}
function voltarEAbrirDrawer(ideia: Ideia) {
  router.push({ path: '/dashboard/ideas', query: { openDrawer: ideia.id } });
}
function abrirRedeNeuralDaIdeia(ideia: Ideia) {
  router.push(`/dashboard/ideas/network/${ideia.id}`);
}
function irParaFluxogramaGeral() {
  router.push('/dashboard/ideas/general-flowchart');
}
function irParaRedeNeuralGeral() {
  router.push('/dashboard/ideas/general-network');
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const SCORE_LABELS = ['Baixo', 'Médio', 'Alto', 'Muito Alto'];
const STATUS_LIST = [
  { key: 'bruta',        label: 'Bruta',       color: '#64748b' },
  { key: 'em_teste',     label: 'Em Teste',     color: '#f59e0b' },
  { key: 'validada',     label: 'Validada',     color: '#10b981' },
  { key: 'nao_validada', label: 'Não Validada', color: '#ef4444' },
  { key: 'escalada',     label: 'Escalada',     color: '#8b5cf6' },
];
const STATUS_COLORS: Record<string, string> = {
  bruta: '#64748b', em_teste: '#f59e0b', validada: '#10b981',
  nao_validada: '#ef4444', escalada: '#8b5cf6',
};
const STATUS_LABEL_MAP: Record<IdeiaStatus, string> = {
  bruta: 'Bruta', em_teste: 'Em Teste', validada: 'Validada',
  nao_validada: 'Não Validada', escalada: 'Escalada',
};

const NODE_W = 180;
const NODE_H = 60;
const NODE_R = 10;
const LAYER_DIST = 120;
const NODE_PAD_X = 40;

function statusLabel(s: IdeiaStatus) { return STATUS_LABEL_MAP[s] ?? s; }
function allTags(i: Ideia) {
  return [...i.tags_avatar, ...i.tags_nicho, ...i.tags_dor, ...i.tags_desejo, ...i.tags_mecanismo];
}

// ─── Grafo ────────────────────────────────────────────────────────────────────
interface GrafoNo {
  id: string; ideia: Ideia;
  x: number; y: number;
  w: number; h: number;
  depth: number; parentId: string | null;
  isCentral: boolean; relType: string | null;
  hasChildren: boolean;
}
interface Aresta { origem: GrafoNo; destino: GrafoNo; label: string; }
interface Particula { arestaIdx: number; t: number; speed: number; alpha: number; }

const nosGrafo   = ref<GrafoNo[]>([]);
const arestas    = ref<Aresta[]>([]);
const particulas = ref<Particula[]>([]);
const hintDismissed = ref(false);

function construirGrafo(rId: string) {
  const todos = ideias.value;
  const visitados = new Set<string>();
  const nos: GrafoNo[] = [];

  function getSize(id: string, visited = new Set<string>()): number {
    if (visited.has(id)) return NODE_W;
    visited.add(id);
    if (collapsedNodes.has(id)) return NODE_W;
    const filhos = todos.filter(i => i.parent_id === id && !i.is_arquivada);
    if (!filhos.length) return NODE_W;
    return filhos.reduce((s, f) => s + getSize(f.id, visited), 0) + (filhos.length - 1) * NODE_PAD_X;
  }

  function posicionar(id: string, depth: number, parentId: string | null, relType: string | null, minX: number, maxX: number) {
    if (visitados.has(id)) return;
    visitados.add(id);
    const ideia = todos.find(i => i.id === id);
    if (!ideia) return;

    const allFilhos = todos.filter(i => i.parent_id === id && !i.is_arquivada);
    const hasChildren = allFilhos.length > 0;

    nos.push({
      id, ideia,
      x: (minX + maxX) / 2,
      y: depth * (NODE_H + LAYER_DIST),
      w: NODE_W, h: NODE_H,
      depth, parentId,
      isCentral: id === rId,
      relType,
      hasChildren,
    });

    if (!hasChildren || collapsedNodes.has(id)) return;

    const totalReq = allFilhos.reduce((s, f) => s + getSize(f.id, new Set()), 0) + (allFilhos.length - 1) * NODE_PAD_X;
    let currX = (minX + maxX) / 2 - totalReq / 2;

    for (const f of allFilhos) {
      const w = getSize(f.id, new Set());
      posicionar(f.id, depth + 1, id, f.relationship_type || null, currX, currX + w);
      currX += w + NODE_PAD_X;
    }
  }

  const wRoot = getSize(rId, new Set());
  posicionar(rId, 0, null, null, -wRoot / 2, wRoot / 2);

  const maxY = nos.reduce((max, n) => Math.max(max, n.y), 0);
  const offsetY = -maxY / 2;
  nos.forEach(n => n.y += offsetY);

  const as: Aresta[] = [];
  for (const no of nos) {
    if (no.parentId) {
      const pai = nos.find(n => n.id === no.parentId);
      if (pai) as.push({ origem: pai, destino: no, label: no.relType || '' });
    }
  }

  const ps: Particula[] = [];
  for (let i = 0; i < as.length; i++) {
    for (let j = 0; j < Math.max(1, Math.floor(Math.random() * 2) + 1); j++) {
      ps.push({ arestaIdx: i, t: Math.random(), speed: 0.003 + Math.random() * 0.004, alpha: 0.7 + Math.random() * 0.3 });
    }
  }

  nosGrafo.value = nos;
  arestas.value = as;
  particulas.value = ps;
}

function toggleCollapse(id: string) {
  if (collapsedNodes.has(id)) collapsedNodes.delete(id);
  else collapsedNodes.add(id);
  construirGrafo(rootId.value);
}

// ─── Física (só partículas) ──────────────────────────────────────────────────
function simularFisica() {
  for (const p of particulas.value) {
    p.t += p.speed;
    if (p.t > 1) p.t = 0;
  }
}

// ─── Câmera ───────────────────────────────────────────────────────────────────
const camX  = ref(0);
const camY  = ref(0);
const scale = ref(1);

const W2S = (wx: number, wy: number, cW: number, cH: number) => ({
  x: wx * scale.value + camX.value + cW / 2,
  y: wy * scale.value + camY.value + cH / 2,
});
const S2W = (sx: number, sy: number, cW: number, cH: number) => ({
  x: (sx - cW / 2 - camX.value) / scale.value,
  y: (sy - cH / 2 - camY.value) / scale.value,
});

function zoom(d: number) { scale.value = Math.min(3, Math.max(0.15, scale.value + d)); }
function resetZoom() { camX.value = 0; camY.value = 0; scale.value = 1; }

// ─── Interação ────────────────────────────────────────────────────────────────
const canvasEl   = ref<HTMLCanvasElement | null>(null);
const canvasWrap = ref<HTMLElement | null>(null);
const hoveredId  = ref<string | null>(null);
const draggedNo  = ref<GrafoNo | null>(null);
const isPanning  = ref(false);
const panStart   = ref({ x: 0, y: 0 });
const ideaDrawerRef = ref<InstanceType<typeof IdeaDetailDrawer> | null>(null);
const ideaFormRef = ref<InstanceType<typeof IdeaFormModal> | null>(null);

function getNoAtPos(sx: number, sy: number, cW: number, cH: number): GrafoNo | null {
  for (const no of nosGrafo.value) {
    const s = W2S(no.x, no.y, cW, cH);
    const hw = (no.w / 2) * scale.value;
    const hh = (no.h / 2) * scale.value;
    if (sx >= s.x - hw && sx <= s.x + hw && sy >= s.y - hh && sy <= s.y + hh) return no;
  }
  return null;
}

function getToggleBtnAtPos(sx: number, sy: number, cW: number, cH: number): GrafoNo | null {
  for (const no of nosGrafo.value) {
    if (!no.hasChildren) continue;
    const s = W2S(no.x, no.y, cW, cH);
    const btnX = s.x;
    const btnY = s.y + (no.h / 2) * scale.value + 10 * scale.value;
    const btnR = 10 * scale.value;
    const dx = sx - btnX, dy = sy - btnY;
    if (Math.sqrt(dx * dx + dy * dy) <= btnR) return no;
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
    c.style.cursor = 'pointer';
  } else {
    hoveredId.value = null;
    c.style.cursor = isPanning.value ? 'grabbing' : 'grab';
  }
}

function onMouseDown(e: MouseEvent) {
  const c = canvasEl.value; if (!c) return;
  const r = c.getBoundingClientRect();
  const sx = e.clientX - r.left, sy = e.clientY - r.top;
  const no = getNoAtPos(sx, sy, c.width, c.height);
  if (no) { draggedNo.value = no; c.style.cursor = 'grabbing'; }
  else { isPanning.value = true; panStart.value = { x: e.clientX, y: e.clientY }; c.style.cursor = 'grabbing'; }
}

function onMouseUp() {
  draggedNo.value = null; isPanning.value = false;
  if (canvasEl.value) canvasEl.value.style.cursor = hoveredId.value ? 'pointer' : 'grab';
}

function onMouseLeave() {
  hoveredId.value = null;
  draggedNo.value = null; isPanning.value = false;
}

function onWheel(e: WheelEvent) {
  const c = canvasEl.value; if (!c) return;
  const mx = e.clientX - c.getBoundingClientRect().left;
  const my = e.clientY - c.getBoundingClientRect().top;
  const delta = e.deltaY < 0 ? 0.12 : -0.12;
  const oldScale = scale.value;
  scale.value = Math.min(3, Math.max(0.15, scale.value + delta));
  const dScale = scale.value / oldScale;
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
      console.warn('[IdeaFlowchart] Drawer ref não disponível no duplo clique');
    }
  }
}

function handleContextMenu(e: MouseEvent) {
  const c = canvasEl.value; if (!c) return;
  const r = c.getBoundingClientRect();
  const no = getNoAtPos(e.clientX - r.left, e.clientY - r.top, c.width, c.height);

  // Control + Botão Direito: Somente para subir de nível
  if (e.ctrlKey) {
    subirNivel();
    return;
  }

  // Botão Direito Simples: Entrar na ideia (se houver uma sob o mouse)
  if (no) {
    abrirFluxogramaDaIdeia(no.ideia);
  }
  // No fundo, o botão direito simples não faz mais nada para evitar navegação acidental
}

// ─── Renderização ─────────────────────────────────────────────────────────────
let animFrame: number | null = null;
let tick = 0;

function wrapTextLines(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(' '), lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
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

  // Grid
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
    const alpha = isHov || isPainel ? 'cc' : '55';
    const c1 = STATUS_COLORS[a.origem.ideia.status] || '#4b5563';
    const c2 = STATUS_COLORS[a.destino.ideia.status] || '#4b5563';

    const fromY = a.origem.y + a.origem.h / 2;
    const toY = a.destino.y - a.destino.h / 2;

    const lg = ctx.createLinearGradient(a.origem.x, fromY, a.destino.x, toY);
    lg.addColorStop(0, c1 + alpha);
    lg.addColorStop(1, c2 + alpha);
    ctx.beginPath();
    ctx.moveTo(a.origem.x, fromY);
    const midY = (fromY + toY) / 2;
    ctx.bezierCurveTo(a.origem.x, midY, a.destino.x, midY, a.destino.x, toY);
    ctx.strokeStyle = lg;
    ctx.lineWidth = isHov || isPainel ? 2.5 : 1.5;
    ctx.stroke();

    if (a.label && scale.value >= 0.5) {
      const mx = (a.origem.x + a.destino.x) / 2;
      const my = (fromY + toY) / 2;
      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = isHov ? '#cbd5e1' : '#475569';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(a.label, mx, my - 4);
    }
  }

  // ── Partículas ──
  for (const p of particulas.value) {
    const a = arestas.value[p.arestaIdx]; if (!a) continue;
    const fromY = a.origem.y + a.origem.h / 2;
    const toY = a.destino.y - a.destino.h / 2;
    const midY = (fromY + toY) / 2;
    const p0 = { x: a.origem.x, y: fromY };
    const p1 = { x: a.origem.x, y: midY };
    const p2 = { x: a.destino.x, y: midY };
    const p3 = { x: a.destino.x, y: toY };
    const t = p.t, invT = 1 - t;
    const px = Math.pow(invT, 3) * p0.x + 3 * Math.pow(invT, 2) * t * p1.x + 3 * invT * t * t * p2.x + t * t * t * p3.x;
    const py = Math.pow(invT, 3) * p0.y + 3 * Math.pow(invT, 2) * t * p1.y + 3 * invT * t * t * p2.y + t * t * t * p3.y;
    const col = STATUS_COLORS[a.destino.ideia.status] || '#3b82f6';
    ctx.beginPath();
    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = col + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
    ctx.fill();
  }

  // ── Nós (Retângulos) ──
  const drawerIdeiaId = ideaDrawerRef.value?.drawerIdeia?.id;
  for (const no of nosGrafo.value) {
    const col = STATUS_COLORS[no.ideia.status] || '#3b82f6';
    const isHov = hoveredId.value === no.id;
    const isPainelNode = drawerIdeiaId === no.id;
    const rx = no.x - no.w / 2, ry = no.y - no.h / 2;

    // Sombra / Glow
    ctx.save();
    ctx.shadowColor = col + (isHov || isPainelNode ? '88' : '33');
    ctx.shadowBlur = isHov || isPainelNode ? 20 : 8;
    ctx.shadowOffsetY = 4;

    // Fundo do retângulo
    roundRect(ctx, rx, ry, no.w, no.h, NODE_R);
    const grad = ctx.createLinearGradient(rx, ry, rx, ry + no.h);
    grad.addColorStop(0, no.isCentral ? '#1e3a5f' : '#1e293b');
    grad.addColorStop(1, no.isCentral ? '#0c1f3a' : '#0f172a');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();

    // Borda com cor do status
    roundRect(ctx, rx, ry, no.w, no.h, NODE_R);
    ctx.strokeStyle = col + (isHov || isPainelNode ? 'cc' : '66');
    ctx.lineWidth = no.isCentral ? 3 : (isHov || isPainelNode ? 2.5 : 1.5);
    ctx.stroke();

    // Barra lateral de cor
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(rx + NODE_R, ry);
    ctx.lineTo(rx + 4, ry);
    ctx.quadraticCurveTo(rx, ry, rx, ry + NODE_R);
    ctx.lineTo(rx, ry + no.h - NODE_R);
    ctx.quadraticCurveTo(rx, ry + no.h, rx + NODE_R, ry + no.h);
    ctx.lineTo(rx + 4, ry + no.h);
    ctx.lineTo(rx + 4, ry);
    ctx.closePath();
    ctx.fillStyle = col;
    ctx.fill();
    ctx.restore();

    // Texto (nome)
    if (scale.value >= 0.25) {
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillStyle = '#f1f5f9';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      const textX = rx + 12;
      const textMaxW = no.w - 20;
      const lines = wrapTextLines(ctx, no.ideia.nome, textMaxW);
      const maxLines = 2;
      const displayLines = lines.slice(0, maxLines);
      if (lines.length > maxLines) {
        displayLines[maxLines - 1] = displayLines[maxLines - 1].slice(0, -1) + '…';
      }
      const lh = 14;
      const textStartY = ry + 10;
      displayLines.forEach((l, i) => {
        ctx.fillText(l, textX, textStartY + i * lh);
      });

      // Estrelas dentro do balão
      const starsY = textStartY + displayLines.length * lh + 2;
      if (starsY + 12 < ry + no.h) {
        ctx.font = '10px serif';
        ctx.fillStyle = '#fbbf24cc';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('★'.repeat(no.ideia.score) + '☆'.repeat(4 - no.ideia.score), textX, starsY);
      }
    }

    // ── Botão [+] / [-] ──
    if (no.hasChildren) {
      const btnX = no.x;
      const btnY = no.y + no.h / 2 + 10;
      const btnR = 9;
      const isCollapsed = collapsedNodes.has(no.id);

      ctx.beginPath();
      ctx.arc(btnX, btnY, btnR, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = col + '99';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isCollapsed ? '+' : '−', btnX, btnY);
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
.nn-topbar-orb[data-status="bruta"]        { background: #64748b; color: #64748b; }
.nn-topbar-orb[data-status="em_teste"]     { background: #f59e0b; color: #f59e0b; }
.nn-topbar-orb[data-status="validada"]     { background: #10b981; color: #10b981; }
.nn-topbar-orb[data-status="nao_validada"] { background: #ef4444; color: #ef4444; }
.nn-topbar-orb[data-status="escalada"]     { background: #8b5cf6; color: #8b5cf6; }

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

.nn-panel-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 10px; }

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

.nn-star-on  { color: #fbbf24; }
.nn-star-off { color: #334155; }
</style>
