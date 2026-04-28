<template>
  <div class="bv-root">
    <!-- HEADER -->
    <div v-if="toast.visible" :class="['bv-toast', `bv-toast-${toast.type}`]">
      {{ toast.message }}
    </div>

    <div class="bv-header">
      <div class="bv-header-text">
        <h1 class="bv-title">
          <span class="bv-title-icon">👁️</span>
          Kanban do Ecossistema: <span v-if="parentIdea" style="color: var(--accent);">{{ parentIdea.nome }}</span>
        </h1>
        <p class="bv-subtitle">
          Arraste e solte as ideias conectadas (derivadas) nos status correspondentes.
        </p>
      </div>
      <div>
        <button class="bv-btn-ghost" @click="voltar">
          ← Voltar para Base de Ideias
        </button>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="bv-loading">
      <div class="bv-spinner"></div>
      <span>Carregando ecossistema...</span>
    </div>

    <!-- CANBAN -->
    <div v-else class="bv-kanban-container">
      <div class="bv-kanban">
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
            <span class="bv-kanban-col-count">{{ porStatusKanban[col.status]?.length || 0 }}</span>
          </div>

          <div
            v-for="ideia in porStatusKanban[col.status] || []"
            :key="ideia.id"
            class="bv-kanban-card"
            draggable="true"
            @dragstart="onDragStart($event, ideia.id)"
            @dblclick="abrirDrawer(ideia)"
          >
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <div class="bv-kanban-card-tipo" :title="'Tipo de Ideia / Projeto'">{{ ideia.tipo }}</div>
              <span class="bv-fav-star" :class="{ 'is-fav': ideia.is_favorita }" @click.stop="handleToggleFavorita(ideia)">
                {{ ideia.is_favorita ? '⭐' : '☆' }}
              </span>
            </div>
            
            <div class="bv-kanban-card-nome">{{ ideia.nome }}</div>
            <div v-if="ideia.relationship_type" class="bv-eco-rel">{{ ideia.relationship_type }}</div>
            <div v-if="ideia.descricao" class="bv-kanban-card-desc">{{ ideia.descricao }}</div>
            <div class="bv-kanban-card-footer">
              <div class="bv-stars bv-stars-sm">
                <span v-for="n in 4" :key="n" :class="n <= ideia.score ? 'bv-star-on' : 'bv-star-off'">★</span>
              </div>
            </div>
          </div>

          <div v-if="(porStatusKanban[col.status]?.length || 0) === 0" class="bv-kanban-empty">
            Arraste derivadas aqui
          </div>
        </div>
      </div>
    </div>

    <!-- DRAWER -->
    <IdeaDetailDrawer
      ref="ideaDrawerRef"
      :ideias="ideias"
      @edit="abrirEdicao"
      @navigate="(path: string) => router.push(path)"
      @createDerivada="() => {}"
    />
    
    <!-- MODAL -->
    <IdeaFormModal
      ref="ideaFormRef"
      :ideias="ideias"
      @saved="fetchIdeias"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useIdeias } from '../../composables/useIdeias';
import { useRouter, useRoute } from 'vue-router';
import { useTaxonomy } from '../../composables/useTaxonomy';
import IdeaDetailDrawer from '../../components/IdeaDetailDrawer.vue';
import IdeaFormModal from '../../components/IdeaFormModal.vue';
import type { Ideia, IdeiaStatus } from '../../types/ideia';

// ─── Composable ───────────────────────────────────────────────────────────────────
const { 
  ideias, loading, fetchIdeias, 
  updateStatus, toggleFavorita 
} = useIdeias();

const { status: allStatus, getStatusLabel, getStatusColor } = useTaxonomy();

const router = useRouter();
const route  = useRoute();
const parentId = route.params.id as string;

const ideaDrawerRef = ref<InstanceType<typeof IdeaDetailDrawer> | null>(null);
const ideaFormRef = ref<InstanceType<typeof IdeaFormModal> | null>(null);

function voltar() {
  router.push('/dashboard/ideas');
}

function abrirDrawer(ideia: Ideia) {
  ideaDrawerRef.value?.abrirDrawer(ideia);
}

function abrirEdicao(ideia: Ideia) {
  ideaFormRef.value?.abrirEdicao(ideia);
}

onMounted(async () => {
  await fetchIdeias();
});

// ─── Toast ───────────────────────────────────────────────────────────────────
const toast = reactive({ visible: false, message: '', type: 'success' });
let toastTimeout: ReturnType<typeof setTimeout> | null = null;
function showToast(msg: string, type: 'success' | 'error' = 'success') {
  toast.message = msg;
  toast.type = type;
  toast.visible = true;
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toast.visible = false; }, 3000) as any;
}

// ─── Lógica de Dados ─────────────────────────────────────────────────────────
const parentIdea = computed(() => {
  return ideias.value.find(i => i.id === parentId) || null;
});

const derivedIdeas = computed(() => {
  return ideias.value.filter(i => i.parent_id === parentId && !i.is_arquivada);
});

async function handleToggleFavorita(ideia: Ideia) {
  const novoEstado = !ideia.is_favorita;
  await toggleFavorita(ideia.id, novoEstado);
  showToast(novoEstado ? 'Favoritada!' : 'Removida dos favoritos.');
}

// ─── Kanban dinâmico ─────────────────────────────────────────────────────────

const colunasVisiveis = computed(() => {
  // No novo sistema, o Kanban de "Ecossistema" de uma ideia deve mostrar
  // os status definidos para o workspace da ideia pai.
  if (!parentIdea.value) return [];
  
  // Pegamos todos os status disponíveis para este workspace
  return allStatus.value.map(s => ({
    status: s.id,
    label: s.label
  }));
});

const porStatusKanban = computed(() => {
  const res: Record<string, Ideia[]> = {};
  colunasVisiveis.value.forEach(col => {
    res[col.status] = derivedIdeas.value.filter(i => i.status === col.status);
  });
  return res;
});

// ─── Drag & Drop ─────────────────────────────────────────────────────────────
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
  await updateStatus(draggedId.value, novoStatus);
  draggedId.value = null;
}

</script>

<style scoped>
.bv-root {
  display: flex;
  flex-direction: column;
  height: 100%;
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
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 20px;
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

.bv-title-icon { font-size: 20px; }

.bv-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
}

.bv-btn-ghost {
  display: inline-flex; align-items: center; gap: 6px;
  background: transparent; color: var(--text-secondary);
  border: 1px solid var(--border); border-radius: 9px;
  font-size: 13.5px; font-weight: 500; padding: 9px 16px;
  cursor: pointer; transition: all 0.15s; white-space: nowrap; flex-shrink: 0;
}
.bv-btn-ghost:hover { background: var(--border); color: var(--text-primary); }

/* ──────────────────────────────────────────────── Loading & Empty */
.bv-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px;
  color: var(--text-secondary);
}

.bv-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ──────────────────────────────────────────────── Kanban */
.bv-kanban-container {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: transparent;
}

.bv-kanban {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 12px;
  flex: 1;
}

.bv-kanban-col {
  flex: 0 0 280px;
  background: rgba(148, 163, 184, 0.05);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  height: 100%;
}

.bv-kanban-col-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  flex-shrink: 0;
}

.bv-kanban-col-dot { width: 8px; height: 8px; border-radius: 50%; }
.bv-kanban-col-dot { background: #94a3b8; } /* default dot */
.bv-kanban-col-dot[data-status="bruta"],
.bv-kanban-col-dot[data-status="backlog"],
.bv-kanban-col-dot[data-status="rascunho"],
.bv-kanban-col-dot[data-status="pendente"] { background: #94a3b8; }
.bv-kanban-col-dot[data-status="em_teste"] { background: #eab308; }
.bv-kanban-col-dot[data-status="validada"],
.bv-kanban-col-dot[data-status="implementado"],
.bv-kanban-col-dot[data-status="publicado"],
.bv-kanban-col-dot[data-status="aprovado"],
.bv-kanban-col-dot[data-status="assinado_deferido"] { background: #22c55e; }
.bv-kanban-col-dot[data-status="escalada"], 
.bv-kanban-col-dot[data-status="em_desenvolvimento"],
.bv-kanban-col-dot[data-status="em_revisao"],
.bv-kanban-col-dot[data-status="em_analise"] { background: #3b82f6; }
.bv-kanban-col-dot[data-status="nao_validada"],
.bv-kanban-col-dot[data-status="pausado"],
.bv-kanban-col-dot[data-status="cancelado_indeferido"] { background: #ef4444; }


.bv-kanban-col-title { font-size: 13px; font-weight: 700; color: var(--text-primary); flex: 1; text-transform: uppercase; letter-spacing: 0.05em; }
.bv-kanban-col-count { font-size: 11px; font-weight: 600; color: var(--text-secondary); background: var(--bg); padding: 2px 6px; border-radius: 12px; }

.bv-kanban-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px;
  cursor: grab;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
}

.bv-kanban-card:hover { transform: translateY(-2px); border-color: var(--accent); box-shadow: 0 4px 10px rgba(0,0,0,0.06); }
.bv-kanban-card:active { cursor: grabbing; }

.bv-kanban-card-tipo {
  display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 20px;
  font-size: 10px; font-weight: 700; background: rgba(99,102,241,0.12); color: #818cf8;
  letter-spacing: 0.01em; width: fit-content; text-transform: uppercase;
}

.is-fav { color: #f59e0b; cursor: pointer; }
.bv-fav-star { cursor: pointer; transition: transform 0.2s; }
.bv-fav-star:hover { transform: scale(1.2); }

.bv-kanban-card-nome { font-size: 14px; font-weight: 600; margin: 8px 0 4px; color: var(--text-primary); line-height: 1.3; }

.bv-eco-rel { font-size: 10px; color: #8b5cf6; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; line-height: 1; margin-bottom: 4px; }

.bv-kanban-card-desc { font-size: 12.5px; color: var(--text-secondary); display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 8px; line-height: 1.4; }

.bv-kanban-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px dashed var(--border);
  padding-top: 8px;
  margin-top: 4px;
}

.bv-stars { display: flex; gap: 1px; font-size: 12px; }
.bv-star-on  { color: #f59e0b; }
.bv-star-off { color: var(--border); }

.bv-kanban-empty {
  padding: 16px;
  text-align: center;
  font-size: 13px;
  color: var(--text-secondary);
  border: 2px dashed var(--border);
  border-radius: 8px;
  opacity: 0.7;
}

/* Scrollbar para o kanban */
.bv-kanban::-webkit-scrollbar { height: 8px; }
.bv-kanban::-webkit-scrollbar-track { background: transparent; }
.bv-kanban::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.bv-kanban::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
</style>
