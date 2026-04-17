import { ref, computed } from 'vue';
import type { Ideia, CreateIdeiaPayload, UpdateIdeiaPayload, IdeiaRaw } from '../types/ideia';
import { parseIdeia } from '../types/ideia';

// ─── Estado global reativo (singleton por instância do app) ──────────────────
const ideias = ref<Ideia[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// ─── Composable ───────────────────────────────────────────────────────────────
export function useIdeias() {

  // ── Buscar todas as ideias ──────────────────────────────────────────────────
  async function fetchIdeias() {
    loading.value = true;
    error.value = null;
    try {
      const raw: IdeiaRaw[] = await window.electronAPI.ideias.getAll();
      ideias.value = raw.map(parseIdeia);
    } catch (e) {
      error.value = 'Erro ao carregar ideias.';
      console.error('[useIdeias] fetchIdeias:', e);
    } finally {
      loading.value = false;
    }
  }

  // ── Criar ideia ─────────────────────────────────────────────────────────────
  async function createIdeia(payload: CreateIdeiaPayload): Promise<Ideia | null> {
    try {
      const raw: IdeiaRaw = await window.electronAPI.ideias.create(payload as unknown as Record<string, unknown>);
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

  // ── Getters computados ──────────────────────────────────────────────────────
  const porStatus = computed(() => ({
    bruta:     ideias.value.filter(i => i.status === 'bruta'),
    em_teste:  ideias.value.filter(i => i.status === 'em_teste'),
    validada:  ideias.value.filter(i => i.status === 'validada'),
    nao_validada: ideias.value.filter(i => i.status === 'nao_validada'),
    escalada:  ideias.value.filter(i => i.status === 'escalada'),
  }));

  return {
    ideias,
    loading,
    error,
    porStatus,
    fetchIdeias,
    createIdeia,
    updateIdeia,
    deleteIdeia,
    updateStatus,
  };
}
