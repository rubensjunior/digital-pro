import { ref, watch } from 'vue';
import type { Ideia, CreateIdeiaPayload, UpdateIdeiaPayload, IdeiaRaw } from '../types/ideia';
import { parseIdeia } from '../types/ideia';
import { useWorkspaces } from './useWorkspaces';
// ─── Estado global reativo (singleton por instância do app) ──────────────────
const ideias = ref<Ideia[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const { currentWorkspaceId } = useWorkspaces();

// ── Buscar todas as ideias ──────────────────────────────────────────────────
async function fetchIdeias() {
  if (!currentWorkspaceId.value) return; // Não carrega sem workspace ativo
  
  loading.value = true;
  error.value = null;
  try {
    const raw: IdeiaRaw[] = await window.electronAPI.ideias.getAll(currentWorkspaceId.value);
    ideias.value = raw.map(parseIdeia);
  } catch (e) {
    error.value = 'Erro ao carregar ideias.';
    console.error('[useIdeias] fetchIdeias:', e);
  } finally {
    loading.value = false;
  }
}

// Recarrega ideias sempre que o Workspace ativo for alterado
watch(currentWorkspaceId, (newId) => {
  if (newId) {
    fetchIdeias();
  } else {
    ideias.value = [];
  }
}, { immediate: true });

export function useIdeias() {


  // ── Criar ideia ─────────────────────────────────────────────────────────────
  async function createIdeia(payload: CreateIdeiaPayload): Promise<Ideia | null> {
    try {
      const finalPayload = { ...payload, workspace_id: currentWorkspaceId.value };
      const raw: IdeiaRaw = await window.electronAPI.ideias.create(finalPayload as unknown as Record<string, unknown>);
      const nova = parseIdeia(raw);
      ideias.value.unshift(nova);
      return nova;
    } catch (e) {
      error.value = 'Erro ao criar ideia.';
      console.error('[useIdeias] createIdeia:', e);
      return null;
    }
  }

  // ── Atualizar ideia ─────────────────────────────────────────────────────────
  async function updateIdeia(payload: UpdateIdeiaPayload): Promise<Ideia | null> {
    try {
      const raw: IdeiaRaw = await window.electronAPI.ideias.update(payload as unknown as Record<string, unknown>);
      const atualizada = parseIdeia(raw);
      const idx = ideias.value.findIndex(i => i.id === atualizada.id);
      if (idx !== -1) ideias.value[idx] = atualizada;
      return atualizada;
    } catch (e) {
      error.value = 'Erro ao atualizar ideia.';
      console.error('[useIdeias] updateIdeia:', e);
      return null;
    }
  }

  // ── Deletar ideia ───────────────────────────────────────────────────────────
  async function deleteIdeia(id: string): Promise<boolean> {
    try {
      await window.electronAPI.ideias.delete(id);
      ideias.value = ideias.value.filter(i => i.id !== id);
      return true;
    } catch (e) {
      error.value = 'Erro ao deletar ideia.';
      console.error('[useIdeias] deleteIdeia:', e);
      return false;
    }
  }

  // ── Atualizar só o status (drag & drop Kanban) ──────────────────────────────
  async function updateStatus(id: string, status: Ideia['status']): Promise<boolean> {
    try {
      await window.electronAPI.ideias.updateStatus(id, status);
      const ideia = ideias.value.find(i => i.id === id);
      if (ideia) ideia.status = status;
      return true;
    } catch (e) {
      error.value = 'Erro ao atualizar status.';
      console.error('[useIdeias] updateStatus:', e);
      return false;
    }
  }

  // ── Histórico ───────────────────────────────────────────────────────────────
  async function getHistorico(id: string) {
    try {
      return await window.electronAPI.ideias.getHistorico(id);
    } catch (e) {
      console.error('[useIdeias] getHistorico:', e);
      return [];
    }
  }

  // ── Acesso, Favorito e Arquivo ──────────────────────────────────────────────
  async function updateAcesso(id: string) {
    try {
      await window.electronAPI.ideias.updateAcesso(id);
      const ideia = ideias.value.find(i => i.id === id);
      if (ideia) ideia.last_accessed_at = new Date().toISOString();
    } catch (e) {
      console.error('[useIdeias] updateAcesso:', e);
    }
  }

  async function toggleFavorita(id: string, is_favorita: boolean) {
    try {
      await window.electronAPI.ideias.toggleFavorita(id, is_favorita ? 1 : 0);
      const ideia = ideias.value.find(i => i.id === id);
      if (ideia) ideia.is_favorita = is_favorita;
      return true;
    } catch (e) {
      console.error('[useIdeias] toggleFavorita:', e);
      return false;
    }
  }

  async function toggleArquivada(id: string, is_arquivada: boolean) {
    try {
      await window.electronAPI.ideias.toggleArquivada(id, is_arquivada ? 1 : 0);
      const ideia = ideias.value.find(i => i.id === id);
      if (ideia) ideia.is_arquivada = is_arquivada;
      return true;
    } catch (e) {
      console.error('[useIdeias] toggleArquivada:', e);
      return false;
    }
  }

  async function duplicarIdeia(ideia: Ideia) {
    const payload = JSON.parse(JSON.stringify(ideia));
    delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;
    delete payload.last_accessed_at;
    
    payload.nome = `${payload.nome} (Cópia)`;
    return await createIdeia(payload as CreateIdeiaPayload);
  }

  return {
    ideias,
    loading,
    error,
    fetchIdeias,
    createIdeia,
    updateIdeia,
    deleteIdeia,
    updateStatus,
    getHistorico,
    updateAcesso,
    toggleFavorita,
    toggleArquivada,
    duplicarIdeia,
  };
}
