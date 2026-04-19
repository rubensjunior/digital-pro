<template>
  <div class="dashboard-shell" :class="{ dark: isDark }">
    <!-- Main Header Area -->
    <div class="layout-header">
      <!-- Espaçador para compensar a titlebar customizada do Electron (32px) -->
      <div class="titlebar-spacer"></div>

      <!-- Header Row 1: Primary Nav (Dark) -->
      <header class="header-primary">
        <div class="header-content">
          <div class="header-left">
            <div class="brand">
              <div class="brand-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <span class="brand-name">RKS Digital PRO</span>
            </div>
          </div>

          <div class="header-right">
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
                <button @click="handleLogout" class="small-logout-btn">Sair</button>
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
                <!-- Toggle de Visualização (Lista/Kanban) - Apenas na raiz do Brain Vault -->
                <div v-if="route.path === '/dashboard/ideas'" class="view-toggle-group">
                  <button 
                    class="toggle-action-btn" 
                    :class="{ active: (route.query.v || 'lista') === 'lista' }"
                    @click="handleAction('setViewLista')"
                    title="Ver como Lista"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
                  </button>
                  <button 
                    class="toggle-action-btn" 
                    :class="{ active: route.query.v === 'kanban' }"
                    @click="handleAction('setViewKanban')"
                    title="Ver como Kanban"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/></svg>
                  </button>
                </div>

                <div v-if="route.path === '/dashboard/ideas'" class="action-divider"></div>

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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTheme } from '../composables/useTheme';
import { supabase } from '../lib/supabase';
import { useBus } from '../composables/useBus';

const router = useRouter();
const route = useRoute();
const { isDark, toggleTheme } = useTheme();
const { emit } = useBus();
const userName = ref('');

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
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (user) {
      const emailName = user.email ? user.email.split('@')[0] : 'Usuário';
      userName.value = emailName.split(/[.\s]/)[0];
      if (navigator.onLine) {
        const { data } = await supabase.from('clientes').select('nome').eq('id', user.id).single();
        if (data?.nome) {
          userName.value = data.nome.split(/[.\s]/)[0];
        }
      }
    }
  } catch (error) {
    console.error('Erro ao inicializar dados do usuário:', error);
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
  --bg: #f8fafc;
  --surface: #ffffff;
  --border: #e2e8f0;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --accent: #3b82f6;
  
  --header-dark-bg: #1e1e2d;
  --header-dark-text: #a2a3b7;
  --header-dark-text-active: #ffffff;
  --header-border-dark: rgba(255,255,255,0.08);

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
}

.header-primary {
  height: var(--header-primary-h);
  background: var(--header-dark-bg);
  border-bottom: 1px solid var(--header-border-dark);
  display: flex;
  align-items: center;
  padding: 0 30px;
}

.header-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-icon svg { width: 18px; height: 18px; color: #fff; }

.brand-name {
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;
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
.small-logout-btn {
  font-size: 11px;
  color: var(--header-dark-text);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}
.small-logout-btn:hover { color: #ef4444; }

.header-secondary {
  height: var(--header-secondary-h);
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 30px;
}

.nav-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 8px;
  height: 100%;
}

.nav-tab {
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 100%;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  position: relative;
  transition: all 0.2s;
}

.nav-tab:first-child {
  padding-left: 0;
}

.nav-tab:hover { color: var(--accent); background: rgba(59,130,246,0.03); }
.tab-active { color: var(--accent) !important; }
.tab-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 16px;
  right: 16px;
  height: 3px;
  background: var(--accent);
  border-radius: 3px 3px 0 0;
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
  padding: 0 30px;
}

.subheader-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  padding: 0 30px;
  max-width: 100%;
  width: 100%;
  position: relative;
}

.page-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 0;
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
</style>


