<template>
  <div class="app-container flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
    <!-- Theme Toggle Button -->
    <button @click="toggleTheme" class="fixed top-[48px] right-8 lg:right-12 p-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-sm z-50 backdrop-blur-sm" title="Alternar Tema">
      <!-- Sun Icon -->
      <svg v-if="isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 3.22a1 1 0 011.415 0l.708.708a1 1 0 01-1.414 1.414l-.708-.708a1 1 0 010-1.414zM16 10a1 1 0 011 1h1a1 1 0 110-2h-1a1 1 0 01-1 1zm-3.22 4.22a1 1 0 010 1.415l-.708.708a1 1 0 01-1.414-1.414l.708-.708a1 1 0 011.414 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-3.22a1 1 0 01-1.415 0l-.708-.708a1 1 0 011.414-1.414l.708.708a1 1 0 010 1.414zM4 10a1 1 0 01-1 1H2a1 1 0 110-2h1a1 1 0 011 1zm3.22-4.22a1 1 0 010-1.415l.708-.708a1 1 0 011.414 1.414l-.708.708a1 1 0 01-1.414 0z"></path><path d="M10 15a5 5 0 100-10 5 5 0 000 10z"></path></svg>
      <!-- Moon Icon -->
      <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
    </button>

    <div class="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
      <div class="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 animate-fade-in-up text-center relative overflow-hidden group">
        
        <!-- Background accents -->
        <div class="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/10 dark:bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
        <div class="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
        
        <div class="relative z-10 flex flex-col items-center">
          <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-50 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-xl shadow-blue-500/20 mb-8 transform transition hover:scale-105 duration-300">
            <svg class="h-10 w-10 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Falta pouco para ser <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">PRO</span>
          </h2>
          
          <p class="text-base text-slate-600 dark:text-slate-400 font-medium mb-6 leading-relaxed">
            Sua conta foi criada com sucesso! Enviamos a cobrança do seu plano para o seu e-mail através da plataforma segura Asaas.
          </p>

          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-5 mb-8 w-full text-left">
            <div class="flex items-start">
              <div class="flex-shrink-0 mt-0.5">
                <svg class="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-semibold text-blue-800 dark:text-blue-300">Liberação do Acesso</h3>
                <p class="mt-1 text-sm text-blue-700 dark:text-blue-200/80">
                  Sua conta será liberada automaticamente logo que o sistema constatar a confirmação do pagamento.
                </p>
              </div>
            </div>
          </div>

          <div class="w-full flex flex-col space-y-3">
            <!-- Botão de verificação ativa de pagamento -->
            <button
              @click="verificarPagamento"
              :disabled="isVerifying"
              class="w-full text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-indigo-800 font-semibold rounded-xl text-sm px-5 py-4 text-center shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span v-if="isVerifying" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verificando pagamento...
              </span>
              <span v-else>✓ Já paguei — Verificar Agora</span>
            </button>

            <!-- Mensagem de erro/sucesso -->
            <div v-if="statusMsg" :class="['text-sm font-medium text-center px-4 py-2.5 rounded-xl', statusMsgType === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/50']">
              {{ statusMsg }}
            </div>

            <router-link to="/login" class="w-full text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium rounded-xl text-sm px-5 py-3 text-center transition-all duration-200 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600">
              Voltar para o Login
            </router-link>
          </div>

          <!-- Support Banner -->
          <div class="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 w-full">
            <div class="flex items-center justify-center gap-2.5 text-xs text-slate-400 dark:text-slate-500">
              <svg class="w-3.5 h-3.5 flex-shrink-0 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Precisa de ajuda? Fale com o suporte:</span>
              <a href="mailto:suporte@rkstechsolution.com.br" class="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors font-medium hover:underline">
                suporte@rkstechsolution.com.br
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTheme } from '../composables/useTheme';
import { supabase } from '../lib/supabase.js';

const { isDark, toggleTheme } = useTheme();
const router = useRouter();

const isVerifying = ref(false);
const statusMsg = ref('');
const statusMsgType = ref<'success' | 'error'>('error');

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const verificarPagamento = async () => {
  isVerifying.value = true;
  statusMsg.value = '';

  try {
    // 1. Obtém sessão atual
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      statusMsg.value = 'Sessão expirada. Faça o login novamente.';
      statusMsgType.value = 'error';
      return;
    }

    // 2. Chama a Edge Function sync-asaas para sincronizar status com o Asaas
    const response = await fetch(`${SUPABASE_URL}/functions/v1/sync-asaas`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erro ao verificar pagamento.');
    }

    // 3. Se status retornou como 'ativo', libera o acesso
    if (result.status === 'ativo') {
      statusMsg.value = '✅ Pagamento confirmado! Acessando...';
      statusMsgType.value = 'success';

      // Inicializa o banco SQLite local antes de redirecionar
      await window.electronAPI.user.initDb(session.user.id);

      // Verifica se já tem workspace criado
      const workspaces = await window.electronAPI.workspaces.getAll();
      setTimeout(() => {
        if (!workspaces || workspaces.length === 0) {
          router.push('/onboarding');
        } else {
          router.push('/dashboard');
        }
      }, 1200);
    } else {
      // Status ainda pendente no Asaas
      const asaasStatus = result.asaasStatus || 'pendente';
      statusMsg.value = `Pagamento ainda não confirmado no Asaas (status: ${asaasStatus}). Aguarde alguns instantes e tente novamente.`;
      statusMsgType.value = 'error';
    }
  } catch (err: any) {
    console.error('[PendingPayment] Erro ao verificar:', err);
    statusMsg.value = err.message || 'Erro ao verificar pagamento. Tente novamente.';
    statusMsgType.value = 'error';
  } finally {
    isVerifying.value = false;
  }
};
</script>
