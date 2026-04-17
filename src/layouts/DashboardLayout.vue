<template>
  <div class="dashboard-shell" :class="{ dark: isDark }">

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- Logo -->
      <div class="sidebar-brand">
        <div class="brand-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
        </div>
        <span class="brand-name">RKS Digital PRO</span>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <div class="nav-section-label">Menu Principal</div>

        <router-link to="/dashboard" class="nav-item" active-class="nav-item-active" exact-active-class="nav-item-active">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="nav-label">Dashboard</span>
        </router-link>

        <router-link to="/dashboard/ideas" class="nav-item" active-class="nav-item-active">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span class="nav-label-group">
            <span class="nav-label">Brain Vault</span>
            <span class="nav-label-desc">Gerenciador de ideias</span>
          </span>
        </router-link>
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <button @click="handleLogout" class="logout-btn">
          <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span class="nav-label">Sair</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="main-area">
      <!-- Espaçador para compensar a titlebar customizada do Electron (32px) -->
      <div class="titlebar-spacer"></div>
      <!-- Topbar -->
      <header class="topbar">
        <button @click="sidebarCollapsed = !sidebarCollapsed" class="toggle-btn" title="Recolher menu">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div class="topbar-right">
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
          <div class="user-chip">
            <div class="user-avatar">
              {{ userInitial }}
            </div>
            <div class="user-info">
              <span class="user-name">{{ userName }}</span>
              <span class="user-role">Cliente</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="page-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTheme } from '../composables/useTheme';
import { supabase } from '../lib/supabase';

const router = useRouter();
const { isDark, toggleTheme } = useTheme();
const sidebarCollapsed = ref(false);
const userName = ref('');

const userInitial = computed(() =>
  userName.value ? userName.value.charAt(0).toUpperCase() : '?'
);

// ─── Verificação de assinatura ────────────────────────────
// Intervalo: verifica a cada 15 minutos se a assinatura ainda está válida
const SUBSCRIPTION_CHECK_INTERVAL_MS = 15 * 60 * 1000; // 15 min
let subscriptionCheckTimer: ReturnType<typeof setInterval> | null = null;

async function checkSubscription(): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    router.push('/login');
    return;
  }

  const userId = session.user.id;

  // Verifica status do cliente
  const { data: clientData } = await supabase
    .from('clientes')
    .select('status')
    .eq('id', userId)
    .single();

  if (!clientData || clientData.status === 'inativo') {
    await supabase.auth.signOut();
    router.push('/login');
    return;
  }

  // Verifica validade da assinatura
  const { data: assinatura } = await supabase
    .from('assinaturas')
    .select('data_fim, status')
    .eq('cliente_id', userId)
    .order('data_fim', { ascending: false })
    .limit(1)
    .single();

  if (assinatura) {
    const vencida =
      assinatura.status === 'cancelado' ||
      (assinatura.data_fim && new Date(assinatura.data_fim) < new Date());

    if (vencida) {
      router.push('/pending-payment');
    }
  }
}

// ─── Lifecycle ────────────────────────────────────────────
onMounted(async () => {
  // Carrega nome do usuário
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data } = await supabase
      .from('clientes')
      .select('nome')
      .eq('id', user.id)
      .single();
    userName.value = data?.nome ?? user.email ?? '';
  }

  // Inicia verificação periódica de assinatura
  subscriptionCheckTimer = setInterval(checkSubscription, SUBSCRIPTION_CHECK_INTERVAL_MS);

  // Ouve mudanças de sessão (ex: token revogado pelo admin)
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    }
  });
});

onUnmounted(() => {
  // Limpa o timer ao sair da tela para evitar memory leak
  if (subscriptionCheckTimer !== null) {
    clearInterval(subscriptionCheckTimer);
    subscriptionCheckTimer = null;
  }
});

const handleLogout = async () => {
  await supabase.auth.signOut();
  router.push('/login');
};
</script>

<style scoped>
/* ─── Variables ─────────────────────────────────────────── */
.dashboard-shell {
  --sidebar-w: 240px;
  --sidebar-collapsed-w: 0px;
  --topbar-h: 60px;
  --bg: #f1f5f9;
  --surface: #ffffff;
  --border: #e2e8f0;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --accent: #3b82f6;
  --accent-end: #6366f1;
  --sidebar-bg: #0f172a;
  --sidebar-text: #94a3b8;
  --sidebar-text-active: #ffffff;
  --sidebar-item-hover: rgba(255,255,255,0.06);
  --sidebar-item-active: rgba(59,130,246,0.18);

  display: flex;
  height: 100vh;
  background: var(--bg);
  transition: background 0.3s;
  overflow: hidden;
}

/* ─── Dark mode overrides ───────────────────────────────── */
.dashboard-shell.dark {
  --bg: #020617;
  --surface: #0f172a;
  --border: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
}

/* ─── Sidebar ───────────────────────────────────────────── */
.sidebar {
  width: var(--sidebar-w);
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
  transition: width 0.3s cubic-bezier(.4,0,.2,1);
  border-right: 1px solid rgba(255,255,255,0.04);
}

.sidebar-collapsed {
  width: var(--sidebar-collapsed-w);
}

/* Brand */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 20px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  white-space: nowrap;
}

.brand-icon {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(59,130,246,0.35);
}

.brand-icon svg {
  width: 18px;
  height: 18px;
  color: #fff;
}

.brand-name {
  font-size: 13px;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: -0.01em;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 16px 10px;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-section-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #475569;
  padding: 0 10px;
  margin-bottom: 8px;
  white-space: nowrap;
}

.nav-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 10px;
  border-radius: 10px;
  color: var(--sidebar-text);
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
  margin-bottom: 2px;
}

.nav-item:hover {
  background: var(--sidebar-item-hover);
  color: #e2e8f0;
}

.nav-item-active {
  background: var(--sidebar-item-active) !important;
  color: var(--sidebar-text-active) !important;
}

.nav-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-top: 1px;
}

.nav-label-group {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.nav-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-label-desc {
  font-size: 10.5px;
  font-weight: 400;
  color: #475569;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.nav-item-active .nav-label-desc {
  color: rgba(255,255,255,0.55);
}

.nav-item:hover .nav-label-desc {
  color: #94a3b8;
}

/* Footer */
.sidebar-footer {
  padding: 12px 10px;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px;
  border-radius: 10px;
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: background 0.15s;
  white-space: nowrap;
}

.logout-btn:hover {
  background: rgba(239,68,68,0.12);
}

/* ─── Main Area ─────────────────────────────────────────── */
.titlebar-spacer {
  height: 32px;
  flex-shrink: 0;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

/* ─── Topbar ────────────────────────────────────────────── */
.topbar {
  height: var(--topbar-h);
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
  transition: background 0.3s, border-color 0.3s;
}

.toggle-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.toggle-btn:hover {
  background: var(--border);
  color: var(--text-primary);
}

.toggle-btn svg {
  width: 20px;
  height: 20px;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}

.icon-btn:hover {
  background: var(--border);
  color: var(--text-primary);
}

.icon-btn svg {
  width: 18px;
  height: 18px;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 12px 5px 5px;
  border-radius: 40px;
  border: 1px solid var(--border);
  background: var(--bg);
  transition: all 0.15s;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 10px;
  color: var(--text-secondary);
  font-weight: 500;
}

/* ─── Page Content ──────────────────────────────────────── */
.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
}
</style>
