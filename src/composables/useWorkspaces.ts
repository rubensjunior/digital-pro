import { ref, watch } from 'vue';

export interface Workspace {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  created_at: string;
}

// ─── Estado Global ────────────────────────────────────────────────────────────
const workspaces = ref<Workspace[]>([]);
const currentWorkspaceId = ref<string | null>(localStorage.getItem('bv_current_workspace_id') || null);
const loading = ref(false);

// ─── Sincronização LocalStorage ───────────────────────────────────────────────
watch(currentWorkspaceId, (newId) => {
  if (newId) {
    localStorage.setItem('bv_current_workspace_id', newId);
  } else {
    localStorage.removeItem('bv_current_workspace_id');
  }
});

// ─── Composable ───────────────────────────────────────────────────────────────
export function useWorkspaces() {
  async function fetchWorkspaces() {
    loading.value = true;
    try {
      const data = await window.electronAPI.workspaces.getAll();
      workspaces.value = data;
      
      // Auto-selection: se não tiver nenhum selecionado, escolhe o primeiro
      if (data.length > 0 && !currentWorkspaceId.value) {
        currentWorkspaceId.value = data[0].id;
      }
    } catch (e) {
      console.error('[useWorkspaces] Erro ao buscar workspaces:', e);
    } finally {
      loading.value = false;
    }
  }

  async function createWorkspace(name: string, color?: string, icon?: string) {
    try {
      const novo = await window.electronAPI.workspaces.create({ name, color, icon });
      if (novo) {
        workspaces.value.push(novo);
        currentWorkspaceId.value = novo.id; // Auto switch
      }
      return novo;
    } catch (e) {
      console.error('[useWorkspaces] Erro ao criar workspace:', e);
      return null;
    }
  }

  function setWorkspace(id: string) {
    if (workspaces.value.some(w => w.id === id)) {
      currentWorkspaceId.value = id;
    }
  }

  async function updateWorkspace(id: string, name: string, color?: string, icon?: string) {
    try {
      const resp = await window.electronAPI.workspaces.update({ id, name, color, icon });
      if (resp) {
        const idx = workspaces.value.findIndex(w => w.id === id);
        if (idx !== -1) workspaces.value[idx] = resp;
      }
      return resp;
    } catch (e) {
      console.error('[useWorkspaces] Erro ao editar workspace:', e);
      return null;
    }
  }

  async function deleteWorkspace(id: string) {
    try {
      const resp = await window.electronAPI.workspaces.delete(id);
      if (resp) {
        workspaces.value = workspaces.value.filter(w => w.id !== id);
        if (currentWorkspaceId.value === id) {
          currentWorkspaceId.value = workspaces.value.length > 0 ? workspaces.value[0].id : null;
        }
      }
      return resp;
    } catch (e) {
      console.error('[useWorkspaces] Erro ao deletar workspace:', e);
      return false;
    }
  }

  return {
    workspaces,
    currentWorkspaceId,
    loading,
    fetchWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    setWorkspace,
  };
}
