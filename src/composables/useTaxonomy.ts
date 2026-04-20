import { ref, computed, watch } from 'vue';
import { useWorkspaces } from './useWorkspaces';

export interface TaxonomyTipo {
  id: string;
  workspace_id: string;
  label: string;
  grupo: string | null;
  icon: string | null;
  color: string | null;
}

export interface TaxonomyStatus {
  id: string;
  workspace_id: string;
  label: string;
  grupo: string | null;
  meta_status: 'backlog' | 'in_progress' | 'review' | 'done' | 'archived';
  color: string | null;
  order_index: number;
}

export interface TaxonomyRelacionamento {
  id: string;
  workspace_id: string;
  label: string;
  color: string | null;
}

// ─── Estado Global (Cache por Workspace) ──────────────────────────────────────
const tipos = ref<TaxonomyTipo[]>([]);
const status = ref<TaxonomyStatus[]>([]);
const relacionamentos = ref<TaxonomyRelacionamento[]>([]);
const loading = ref(false);

const { currentWorkspaceId } = useWorkspaces();

// Re-fetch taxonomia sempre que o Workspace mudar
watch(currentWorkspaceId, async (newId) => {
  if (newId) {
    await fetchTaxonomies(newId);
  } else {
    tipos.value = [];
    status.value = [];
    relacionamentos.value = [];
  }
}, { immediate: true });

// ─── Lógica Principal ─────────────────────────────────────────────────────────
async function fetchTaxonomies(workspace_id: string) {
  loading.value = true;
  try {
    const [rawTipos, rawStatus, rawRels] = await Promise.all([
      window.electronAPI.taxonomia.tipos.getAll(workspace_id),
      window.electronAPI.taxonomia.status.getAll(workspace_id),
      window.electronAPI.taxonomia.relacionamentos.getAll(workspace_id)
    ]);
    tipos.value = rawTipos;
    status.value = rawStatus;
    relacionamentos.value = rawRels;
  } catch (e) {
    console.error('[useTaxonomy] Erro ao buscar taxonomia:', e);
  } finally {
    loading.value = false;
  }
}

export function useTaxonomy() {
  
  // Helpers Computados
  const tiposAgrupados = computed(() => {
    const grupos = new Map<string, TaxonomyTipo[]>();
    for (const t of tipos.value) {
      const g = t.grupo || 'Geral';
      if (!grupos.has(g)) grupos.set(g, []);
      grupos.get(g)!.push(t);
    }
    return Array.from(grupos.entries()).map(([label, options]) => ({ label, options }));
  });

  const statusAgrupados = computed(() => {
    const grupos = new Map<string, TaxonomyStatus[]>();
    for (const s of status.value) {
      const g = s.grupo || 'Geral';
      if (!grupos.has(g)) grupos.set(g, []);
      grupos.get(g)!.push(s);
    }
    return Array.from(grupos.entries()).map(([label, options]) => ({ label, options }));
  });

  function getStatusLabel(status_id: string): string {
    const s = status.value.find(x => x.id === status_id || x.label === status_id); // fallback para label antigas
    return s ? s.label : status_id;
  }
  
  function getStatusColor(status_id: string): string | undefined {
    const s = status.value.find(x => x.id === status_id || x.label === status_id);
    return s?.color || undefined;
  }

  function getTipoLabel(tipo_id: string): string {
    const t = tipos.value.find(x => x.id === tipo_id || x.label === tipo_id); // fallback
    return t ? t.label : tipo_id;
  }
  
  function getTipoColor(tipo_id: string): string | undefined {
    const t = tipos.value.find(x => x.id === tipo_id || x.label === tipo_id);
    return t?.color || undefined;
  }

  // ─── CRUD Tipos ──────────────────────────────────
  async function createTipo(payload: Record<string, unknown>) {
    const res = await window.electronAPI.taxonomia.tipos.create(payload);
    if (res) tipos.value.push(res);
    return res;
  }
  
  async function updateTipo(payload: Record<string, unknown>) {
    const res = await window.electronAPI.taxonomia.tipos.update(payload);
    if (res) {
      const idx = tipos.value.findIndex(t => t.id === res.id);
      if (idx !== -1) tipos.value[idx] = res;
    }
    return res;
  }

  async function deleteTipo(id: string) {
    const res = await window.electronAPI.taxonomia.tipos.delete(id);
    if (res) {
      tipos.value = tipos.value.filter(t => t.id !== id);
    }
    return res;
  }

  // ─── CRUD Status ──────────────────────────────────
  async function createStatus(payload: Record<string, unknown>) {
    const res = await window.electronAPI.taxonomia.status.create(payload);
    if (res) status.value.push(res);
    return res;
  }
  
  async function updateStatus(payload: Record<string, unknown>) {
    const res = await window.electronAPI.taxonomia.status.update(payload);
    if (res) {
      const idx = status.value.findIndex(s => s.id === res.id);
      if (idx !== -1) status.value[idx] = res;
    }
    return res;
  }

  async function deleteStatus(id: string) {
    const res = await window.electronAPI.taxonomia.status.delete(id);
    if (res) {
      status.value = status.value.filter(s => s.id !== id);
    }
    return res;
  }

  // ─── CRUD Relacionamentos ─────────────────────────
  async function createRelacionamento(payload: Record<string, unknown>) {
    const res = await window.electronAPI.taxonomia.relacionamentos.create(payload);
    if (res) relacionamentos.value.push(res);
    return res;
  }

  async function updateRelacionamento(payload: Record<string, unknown>) {
    const res = await window.electronAPI.taxonomia.relacionamentos.update(payload);
    if (res) {
      const idx = relacionamentos.value.findIndex(r => r.id === res.id);
      if (idx !== -1) relacionamentos.value[idx] = res;
    }
    return res;
  }

  async function deleteRelacionamento(id: string) {
    const res = await window.electronAPI.taxonomia.relacionamentos.delete(id);
    if (res) {
      relacionamentos.value = relacionamentos.value.filter(r => r.id !== id);
    }
    return res;
  }

  return {
    tipos,
    status,
    relacionamentos,
    loading,
    tiposAgrupados,
    statusAgrupados,
    fetchTaxonomies,
    getStatusLabel,
    getStatusColor,
    getTipoLabel,
    getTipoColor,
    createTipo,
    updateTipo,
    deleteTipo,
    createStatus,
    updateStatus,
    deleteStatus,
    createRelacionamento,
    updateRelacionamento,
    deleteRelacionamento,
  };
}
