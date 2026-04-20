<template>
  <div class="dashboard-shell" :class="{ dark: isDark }">
    <!-- Main Header Area -->
    <div class="layout-header">
      <!-- Espaçador para compensar a titlebar customizada do Electron (32px) -->
      <div class="titlebar-spacer">
        <span class="top-version">v1.0.0</span>
      </div>

      <!-- Header Row 1: Primary Nav (Dark) -->
      <header class="header-primary">
        <div class="header-content">
          <div class="header-left">
            <div class="brand">
              <div class="brand-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span class="brand-name">Digital PRO</span>
            </div>

            <div class="workspace-area">
              <div class="workspace-select-wrapper" v-if="workspaces.length > 0">
                <div class="workspace-color-dot" :style="{ background: currentWorkspace?.color || '#ef4444' }">
                  {{ currentWorkspace?.name?.charAt(0).toUpperCase() || 'W' }}
                </div>
                <select v-model="currentWorkspaceId" class="workspace-select">
                  <option v-for="w in workspaces" :key="w.id" :value="w.id">{{ w.name }}</option>
                </select>
              </div>

              <div class="workspace-actions">
                <button class="metronic-header-btn gear" @click="handleOpenWorkspaceSettings" title="Configurar Workspace Atual">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </button>
                <button class="metronic-header-btn add" @click="handleCreateWorkspace" title="Novo Workspace">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div class="header-right">
            <!-- Notifications -->
            <button class="icon-btn notification-btn" title="Notificações">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span class="notification-dot"></span>
            </button>

            <!-- Theme toggle -->
            <button @click="toggleTheme" class="icon-btn" title="Alternar tema">
              <svg v-if="isDark" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 3.22a1 1 0 011.415 0l.708.708a1 1 0 01-1.414 1.414l-.708-.708a1 1 0 010-1.414zM16 10a1 1 0 011 1h1a1 1 0 110-2h-1a1 1 0 01-1 1zm-3.22 4.22a1 1 0 010 1.415l-.708.708a1 1 0 01-1.414-1.414l.708-.708a1 1 0 011.414 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-3.22a1 1 0 01-1.415 0l-.708-.708a1 1 0 011.414-1.414l.708.708a1 1 0 010 1.414zM4 10a1 1 0 01-1 1H2a1 1 0 110-2h1a1 1 0 011 1zm3.22-4.22a1 1 0 010-1.415l.708-.708a1 1 0 011.414 1.414l-.708.708a1 1 0 01-1.414 0z" />
                <path d="M10 15a5 5 0 100-10 5 5 0 000 10z" />
              </svg>
              <svg v-else fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </button>

            <!-- User avatar -->
            <div class="user-dropdown">
              <div class="user-avatar">
                {{ userInitial }}
              </div>
              <div class="user-meta">
                <span class="user-name">{{ userName }}</span>
                <div class="user-actions-row">
                  <button @click="handleOpenUserSettings" class="small-action-btn">Conta</button>
                  <span class="action-divider-small"></span>
                  <button @click="handleLogout" class="small-action-btn logout">Sair</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Header Row 2: Secondary Nav (Tabs) -->
      <nav class="header-secondary">
        <div class="nav-content">
          <router-link to="/dashboard" class="nav-tab" active-class="tab-active" exact-active-class="tab-active">
            Home
          </router-link>
          <router-link to="/dashboard/ideas" class="nav-tab" active-class="tab-active">
            Brain Vault
          </router-link>
        </div>
      </nav>

      <!-- Page Header: Breadcrumbs & Title & Actions -->
      <div class="page-subheader">
        <div class="subheader-content">
          <div class="subheader-left">
            <div class="breadcrumb-container">
              <template v-for="(crumb, idx) in breadcrumbs" :key="crumb.path">
                <router-link :to="crumb.path" class="breadcrumb-item">{{ crumb.label }}</router-link>
                <span v-if="idx < breadcrumbs.length - 1" class="breadcrumb-separator">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </span>
              </template>
            </div>
            <h1 class="page-title">{{ pageTitle }}</h1>
          </div>

          <div class="subheader-right">
            <!-- Ações dinâmicas injetadas se estiver no Brain Vault -->
            <template v-if="route.path.includes('/ideas')">
              <div class="subheader-actions">
                <!-- Botões secundários -->

                <button class="action-btn-secondary" @click="handleAction('abrirFluxogramaGeral')" title="Ver como Fluxograma">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM9 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM9 8v4h6V8" /></svg>
                  Fluxograma
                </button>
                <button class="action-btn-secondary" @click="handleAction('abrirRedeNeuralGeral')" title="Ver como Rede Neural">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  Rede Neural
                </button>
                <button class="action-btn-primary" @click="handleAction('abrirModalNovaIdeia')">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                  Nova Ideia
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <main class="page-content" :class="{ 'no-padding': isCanvasLayout }">
      <div v-if="!isCanvasLayout" class="page-container">
        <router-view />
      </div>
      <router-view v-else />
    </main>
    
    <WorkspaceSettingsModal ref="workspaceSettingsModalRef" />
    <UserSettingsModal ref="userSettingsModalRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTheme } from '../composables/useTheme';
import { supabase } from '../lib/supabase';
import { useBus } from '../composables/useBus';
import { useWorkspaces } from '../composables/useWorkspaces';
import WorkspaceSettingsModal from '../components/WorkspaceSettingsModal.vue';
import UserSettingsModal from '../components/UserSettingsModal.vue';

const router = useRouter();
const route = useRoute();
const { isDark, toggleTheme } = useTheme();
const { emit } = useBus();
const { workspaces, currentWorkspaceId, fetchWorkspaces, createWorkspace } = useWorkspaces();
const userName = ref('');
const workspaceSettingsModalRef = ref<InstanceType<typeof WorkspaceSettingsModal> | null>(null);
const userSettingsModalRef = ref<InstanceType<typeof UserSettingsModal> | null>(null);

const currentWorkspace = computed(() => workspaces.value.find(w => w.id === currentWorkspaceId.value));

function handleOpenUserSettings() {
  userSettingsModalRef.value?.abrirModal();
}

function handleOpenWorkspaceSettings() {
  workspaceSettingsModalRef.value?.abrirModal(currentWorkspaceId.value || undefined);
}

async function handleCreateWorkspace() {
  // Abre o modal diretamente na aba de gerenciamento para o usuário criar com o nome que quiser
  workspaceSettingsModalRef.value?.abrirModal();
}

const userInitial = computed(() =>
  userName.value ? userName.value.charAt(0).toUpperCase() : '?'
);

const isCanvasLayout = computed(() => 
  route.path.includes('/network') || route.path.includes('/flowchart')
);

// ─── Breadcrumbs & Titles ──────────────────────────────────
const breadcrumbs = computed(() => {
  const crumbs = [{ label: 'Home', path: '/dashboard' }];
  
  if (route.path.includes('/ideas')) {
    crumbs.push({ label: 'Brain Vault', path: '/dashboard/ideas' });
  }
  
  return crumbs;
});

const pageTitle = computed(() => {
  if (route.path === '/dashboard') return 'Dashboard';
  if (route.path.includes('/ideas')) return 'Brain Vault';
  return 'Dashboard';
});

// ─── Verificação de assinatura ────────────────────────────
const SUBSCRIPTION_CHECK_INTERVAL_MS = 15 * 60 * 1000;
let subscriptionCheckTimer: ReturnType<typeof setInterval> | null = null;

async function checkSubscription(): Promise<void> {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      router.push('/login');
      return;
    }
    if (!navigator.onLine) return;

    const userId = session.user.id;
    const { data: clientData, error: clientError } = await supabase
      .from('clientes')
      .select('status')
      .eq('id', userId)
      .single();

    if (clientError) return;

    if (!clientData || clientData.status === 'inativo') {
      await supabase.auth.signOut();
      router.push('/login');
      return;
    }

    const { data: assinatura, error: scrollError } = await supabase
      .from('assinaturas')
      .select('data_fim, status')
      .eq('cliente_id', userId)
      .order('data_fim', { ascending: false })
      .limit(1)
      .single();

    if (scrollError && scrollError.code !== 'PGRST116') return;

    if (assinatura) {
      const vencida =
        assinatura.status === 'cancelado' ||
        (assinatura.data_fim && new Date(assinatura.data_fim) < new Date());
      if (vencida) router.push('/pending-payment');
    }
  } catch (err) {
    console.error('Erro na verificação de assinatura:', err);
  }
}

// ─── Lifecycle ────────────────────────────────────────────
onMounted(async () => {
  try {
    // 1. Obter a sessão ativa
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
       router.push('/login');
       return;
    }
    const user = session.user;

    // 2. Inicializar o Banco de Dados NATIVO isolado para este usuário
    await window.electronAPI.user.initDb(user.id);

    // 3. Popular Perfil do Supabase
    const emailName = user.email ? user.email.split('@')[0] : 'Usuário';
    userName.value = emailName.split(/[.\s]/)[0];
    if (navigator.onLine) {
       const { data } = await supabase.from('clientes').select('nome').eq('id', user.id).single();
       if (data?.nome) {
         userName.value = data.nome.split(/[.\s]/)[0];
       }
    }

    // 4. Agora podemos acionar as APIs locais seguramente
    await fetchWorkspaces();
    const profile = await window.electronAPI.user.getProfile();

    const hasWorkspace = workspaces.value.length > 0;
    const hasProfile = profile && profile.nickname && profile.nickname.trim() !== '' && profile.nickname.trim() !== 'Usuário';

    if (!hasProfile) {
      router.replace({ path: '/onboarding', query: { step: '0' } });
      return;
    } else if (!hasWorkspace) {
      router.replace({ path: '/onboarding', query: { step: '1' } });
      return;
    }

  } catch (error) {
    console.error('Erro ao inicializar dados do usuário e banco:', error);
    userName.value = 'Usuário';
  }

  subscriptionCheckTimer = setInterval(checkSubscription, SUBSCRIPTION_CHECK_INTERVAL_MS);

  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') router.push('/login');
  });
});

onUnmounted(() => {
  if (subscriptionCheckTimer !== null) {
    clearInterval(subscriptionCheckTimer);
  }
});

const handleLogout = async () => {
  await supabase.auth.signOut();
  router.push('/login');
};

function handleAction(action: string) {
  if (action === 'abrirModalNovaIdeia') {
    emit('abrirModalNovaIdeia');
  } else if (action === 'abrirFluxogramaGeral') {
    router.push('/dashboard/ideas/general-flowchart');
  } else if (action === 'abrirRedeNeuralGeral') {
    router.push('/dashboard/ideas/general-network');
  } else if (action === 'setViewLista') {
    router.push({ query: { ...route.query, v: 'lista' } });
  } else if (action === 'setViewKanban') {
    router.push({ query: { ...route.query, v: 'kanban' } });
  }
}
</script>

<style scoped>
/* ─── Layout Variables ───────────────────────────────────── */
.dashboard-shell {
  --header-primary-h: 64px;
  --header-secondary-h: 52px;
  --subheader-h: 84px;
  --bg: #f5f8fa;
  --surface: #ffffff;
  --border: #e4e6ef;
  --text-primary: #181c32;
  --text-secondary: #a1a5b7;
  --accent: #009ef7;
  
  --header-dark-bg: #151521;
  --header-dark-text: #a1a5b7;
  --header-dark-text-active: #ffffff;
  --header-border-dark: rgba(255,255,255,0.05);

  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg);
  transition: background 0.3s;
  overflow: hidden;
}

/* ─── Dark Mode Overrides ────────────────────────────────── */
.dashboard-shell.dark {
  --bg: #151521;
  --surface: #1e1e2d;
  --border: #2b2b40;
  --text-primary: #ffffff;
  --text-secondary: #92929f;
}

/* ─── Header Structure ───────────────────────────────────── */
.layout-header {
  flex-shrink: 0;
  z-index: 100;
}

.titlebar-spacer {
  height: 32px;
  background: var(--header-dark-bg);
  border-bottom: 1px solid var(--header-border-dark);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 30px;
}

.top-version {
  font-size: 11px;
  color: #565674;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.header-primary {
  height: var(--header-primary-h);
  background: var(--header-dark-bg);
  border-bottom: 1px solid var(--header-border-dark);
  display: flex;
  align-items: center;
}

.header-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
}

.header-left {
  display: flex;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  width: 36px;
  height: 36px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-icon svg { width: 30px; height: 30px; color: #a1a5b7; transform: rotate(-15deg); }

.brand-name {
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;
}

.workspace-area {
  display: flex;
  align-items: center;
  gap: 16px;
  border-left: 1px solid var(--header-border-dark);
  padding-left: 24px;
  margin-left: 24px;
}

.workspace-select-wrapper {
  display: flex;
  align-items: center;
  background: #1e1e2d;
  border-radius: 8px;
  padding: 8px 12px;
  position: relative;
  min-width: 220px;
}

.workspace-color-dot {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  position: absolute;
  left: 10px;
  pointer-events: none;
}

.workspace-select {
  background: transparent;
  border: none;
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  padding-left: 38px;
  padding-right: 36px;
  width: 100%;
  height: 30px;
  
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%23a1a5b7' viewBox='0 0 24 24'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 14px;
}

.workspace-select option {
  background: #151521;
  color: #ffffff;
}

.workspace-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.metronic-header-btn {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.metronic-header-btn.add {
  background: #1e1e2d;
  color: #a1a5b7;
}

.metronic-header-btn.add:hover {
  background: #009ef7;
  color: #ffffff;
}

.metronic-header-btn.gear {
  background: transparent;
  color: #a1a5b7;
}

.metronic-header-btn.gear:hover {
  background: rgba(255,255,255,0.05);
  color: #ffffff;
}

.metronic-header-btn svg {
  width: 22px;
  height: 22px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 16px;
  border-left: 1px solid var(--header-border-dark);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255,255,255,0.08);
  color: #ffffff;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.user-meta { display: flex; flex-direction: column; align-items: flex-end; }
.user-name { font-size: 13px; font-weight: 600; color: #ffffff; line-height: 1.2; }
.user-actions-row { display: flex; align-items: center; gap: 6px; margin-top: 2px; }
.small-action-btn {
  font-size: 11px;
  color: var(--header-dark-text);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}
.small-action-btn:hover { color: #ffffff; }
.small-action-btn.logout:hover { color: #ef4444; }
.action-divider-small { width: 1px; height: 10px; background: rgba(255,255,255,0.1); }

.header-secondary {
  height: var(--header-secondary-h);
  background: var(--header-dark-bg);
  display: flex;
  align-items: center;
}

.nav-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 8px;
  height: 100%;
  padding: 0 30px;
}

.nav-tab {
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 100%;
  font-size: 13.5px;
  font-weight: 500;
  color: #a1a5b7;
  text-decoration: none;
  position: relative;
  transition: all 0.2s;
}

.nav-tab:first-child {
  padding-left: 0;
}

.nav-tab:hover { color: #ffffff; background: transparent; }
.tab-active { color: #ffffff !important; }
.tab-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 16px;
  right: 16px;
  height: 2px;
  background: #009ef7;
  border-radius: 2px 2px 0 0;
}

.nav-tab:first-child.tab-active::after {
  left: 0;
}

/* Page Subheader */
.page-subheader {
  background: var(--bg);
  height: var(--subheader-h);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
}

.subheader-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
}

.subheader-left { display: flex; flex-direction: column; }

.breadcrumb-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.breadcrumb-item { font-size: 12px; color: var(--text-secondary); text-decoration: none; }
.breadcrumb-item:hover { color: var(--accent); }
.breadcrumb-separator { color: var(--border); display: flex; align-items: center; }
.breadcrumb-separator svg { width: 16px; height: 16px; }

.page-title { font-size: 20px; font-weight: 700; color: var(--text-primary); margin: 0; }

.subheader-actions { display: flex; align-items: center; gap: 12px; }

/* Subheader Buttons */
.action-btn-primary {
  display: flex; align-items: center; gap: 8px;
  background: var(--accent); color: #fff;
  border: none; border-radius: 8px; padding: 10px 18px;
  font-size: 13.5px; font-weight: 600; cursor: pointer;
  transition: all 0.2s; box-shadow: 0 4px 12px rgba(59,130,246,0.2);
}
.action-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
.action-btn-primary svg { width: 16px; height: 16px; }

.action-btn-secondary {
  display: flex; align-items: center; gap: 8px;
  background: var(--surface); color: var(--text-primary);
  border: 1px solid var(--border); border-radius: 8px; padding: 10px 18px;
  font-size: 13.5px; font-weight: 600; cursor: pointer;
  transition: all 0.2s;
}
.action-btn-secondary:hover { background: var(--bg); border-color: var(--accent); color: var(--accent); }
.action-btn-secondary svg { width: 16px; height: 16px; }

/* View Toggle Styles */
.view-toggle-group {
  display: flex;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 2px;
}

.toggle-action-btn {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-action-btn:hover {
  background: var(--bg);
  color: var(--accent);
}

.toggle-action-btn.active {
  background: var(--border);
  color: var(--accent);
}

.toggle-action-btn svg { width: 18px; height: 18px; }

.action-divider {
  width: 1px;
  height: 24px;
  background: var(--border);
  margin: 0 4px;
}

/* ─── Page Content Area ──────────────────────────────────── */
.page-content {
  flex: 1;
  overflow-y: auto;
  max-width: 100%;
  width: 100%;
  position: relative;
}

.page-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px;
}

.page-content.no-padding {
  padding: 0;
}

/* ─── Shared Components ──────────────────────────────────── */
.icon-btn {
  width: 36px; height: 36px; border-radius: 8px;
  border: 1px solid var(--header-border-dark);
  background: transparent; color: var(--header-dark-text);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
}
.icon-btn:hover { background: rgba(255,255,255,0.05); color: #fff; }
.icon-btn svg { width: 20px; height: 20px; }

.notification-btn { position: relative; margin-right: 4px; }
.notification-dot {
  position: absolute; top: 6px; right: 8px;
  width: 6px; height: 6px; background: #f1416c; border-radius: 50%;
  box-shadow: 0 0 0 2px var(--header-dark-bg);
}
</style>


