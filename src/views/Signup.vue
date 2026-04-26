<template>
  <div class="app-container flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
    <!-- Left Side: Sign up Form -->
    <div class="w-full lg:w-1/2 relative z-10 h-[calc(100vh-32px)] mt-[32px] overflow-y-auto block custom-scrollbar pb-8">
      
      <!-- Theme Toggle Button -->
      <!-- Movido para o topo direito (right-8) conforme solicitado -->
      <button @click="toggleTheme" class="fixed top-[48px] right-8 lg:right-12 p-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-sm z-50 backdrop-blur-sm" title="Alternar Tema">
        <!-- Sun Icon -->
        <svg v-if="isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 3.22a1 1 0 011.415 0l.708.708a1 1 0 01-1.414 1.414l-.708-.708a1 1 0 010-1.414zM16 10a1 1 0 011 1h1a1 1 0 110-2h-1a1 1 0 01-1 1zm-3.22 4.22a1 1 0 010 1.415l-.708.708a1 1 0 01-1.414-1.414l.708-.708a1 1 0 011.414 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-3.22a1 1 0 01-1.415 0l-.708-.708a1 1 0 011.414-1.414l.708.708a1 1 0 010 1.414zM4 10a1 1 0 01-1 1H2a1 1 0 110-2h1a1 1 0 011 1zm3.22-4.22a1 1 0 010-1.415l.708-.708a1 1 0 011.414 1.414l-.708.708a1 1 0 01-1.414 0z"></path><path d="M10 15a5 5 0 100-10 5 5 0 000 10z"></path></svg>
        <!-- Moon Icon -->
        <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
      </button>

      <!-- Centering Wrapper: Garante o Scroll Sem Cortar o Topo -->
      <div class="min-h-full flex flex-col justify-center px-8 sm:px-12 py-16 pt-[80px] lg:pt-16">
        <!-- Login Card Wrapper -->
        <div class="w-full max-w-lg mx-auto animate-fade-in-up">
        
        <div class="text-center mb-8">
          <!-- Logo Icon shape -->
          <div class="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 transform transition hover:scale-105" style="width: 64px; height: 64px;">
            <svg width="32" height="32" class="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path></svg>
          </div>
          <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 tracking-tight">Criar Conta</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">Jornada PRO rumo ao sucesso.</p>
        </div>

        <!-- Subscription Plan Card -->
        <div v-if="!couponApplied" class="bg-slate-900 rounded-2xl p-5 mb-4 flex w-full relative overflow-hidden group shadow-xl transition-all duration-500">
          <div class="absolute -right-10 -top-10 w-32 h-32 bg-blue-600/30 rounded-full blur-2xl group-hover:bg-blue-500/40 transition-all duration-500"></div>
          <div class="absolute -left-10 -bottom-10 w-32 h-32 bg-indigo-600/30 rounded-full blur-2xl group-hover:bg-indigo-500/40 transition-all duration-500"></div>
          <div class="relative z-10 flex w-full items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <h3 class="text-white font-bold text-base tracking-wide">PLANO PRO</h3>
                  <span class="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/30 uppercase tracking-widest">Premium</span>
                </div>
                <p class="text-slate-400 text-xs mt-0.5 font-medium">Acesso total sem restrições</p>
              </div>
            </div>
            <div class="text-right">
              <div class="flex items-baseline space-x-1 justify-end">
                <span class="text-white font-black text-2xl">R$25</span>
                <span class="text-slate-400 text-sm font-medium">/mês</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Free Beta Banner (aparece quando cupom aplicado) -->
        <div v-if="couponApplied" class="rounded-2xl p-5 mb-4 flex w-full relative overflow-hidden shadow-xl bg-gradient-to-br from-emerald-900 to-teal-900 border border-emerald-500/30 animate-fade-in-up">
          <div class="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/30 rounded-full blur-2xl"></div>
          <div class="absolute -left-10 -bottom-10 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl"></div>
          <div class="relative z-10 flex w-full items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <h3 class="text-white font-bold text-base tracking-wide">ACESSO BETA</h3>
                  <span class="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-widest">Free</span>
                </div>
                <p class="text-emerald-300/80 text-xs mt-0.5 font-medium">Cupom <span class="font-bold text-emerald-300">{{ couponCode }}</span> aplicado com sucesso!</p>
              </div>
            </div>
            <div class="text-right">
              <div class="flex items-baseline space-x-1 justify-end">
                <span class="text-white font-black text-2xl">R$0</span>
                <span class="text-emerald-400 text-sm font-medium">/mês</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Campo de Cupom -->
        <div class="mb-6">
          <div class="flex gap-2">
            <div class="relative flex-1">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <svg class="w-4 h-4" :class="couponApplied ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
              </div>
              <input
                v-model="couponCode"
                type="text"
                id="coupon-code"
                :disabled="couponApplied"
                :class="[
                  'text-sm rounded-xl block w-full pl-10 p-3.5 transition-all outline-none shadow-sm border',
                  couponApplied
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400 dark:border-emerald-600 text-emerald-700 dark:text-emerald-300 cursor-not-allowed'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-300 dark:hover:border-slate-600 placeholder-slate-400 dark:placeholder-slate-500'
                ]"
                placeholder="Tem um cupom? Ex: digital-free"
                @keyup.enter="applyCoupon"
              />
            </div>
            <button
              v-if="!couponApplied"
              type="button"
              @click="applyCoupon"
              :disabled="!couponCode.trim() || isCouponLoading"
              class="px-4 py-3.5 rounded-xl text-sm font-semibold transition-all border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 flex-shrink-0 shadow-sm"
            >
              <svg v-if="isCouponLoading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              <span v-else>Aplicar</span>
            </button>
            <button
              v-if="couponApplied"
              type="button"
              @click="removeCoupon"
              class="px-4 py-3.5 rounded-xl text-sm font-semibold transition-all border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 flex items-center gap-1.5 flex-shrink-0 shadow-sm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              Remover
            </button>
          </div>
          <p v-if="couponError" class="mt-1.5 ml-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
            <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
            {{ couponError }}
          </p>
        </div>


        <form @submit.prevent="handleNextOrSubmit">
          
          <!-- STEP 1: CONTA -->
          <div v-if="currentStep === 1" class="space-y-4 animate-fade-in-up">
            <!-- Nome Completo -->
            <div>
              <label for="signup-name" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Nome Completo</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-slate-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <input v-model="formData.name" type="text" id="signup-name" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-11 p-3.5 transition-all outline-none placeholder-slate-400 dark:placeholder-slate-500 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm" placeholder="João da Silva" required>
              </div>
            </div>
            
            <!-- E-mail -->
            <div>
              <label for="signup-email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">E-mail</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-slate-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <input v-model="formData.email" type="email" id="signup-email" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-11 p-3.5 transition-all outline-none placeholder-slate-400 dark:placeholder-slate-500 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm" placeholder="seu@email.com" required>
              </div>
            </div>
            
            <!-- Senha -->
            <div>
              <label for="signup-password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Senha</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-slate-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <input v-model="formData.password" type="password" id="signup-password" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-11 p-3.5 transition-all outline-none placeholder-slate-400 dark:placeholder-slate-500 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm" placeholder="••••••••" required>
              </div>
            </div>
          </div>

          <!-- STEP 2: DADOS PESSOAIS -->
          <div v-if="currentStep === 2" class="space-y-4 animate-fade-in-up">
            <!-- CPF ou CNPJ -->
            <div>
              <label for="signup-document" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">CPF ou CNPJ</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-slate-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
                </div>
                <input v-model="formData.document" @input="formatDocument" type="text" id="signup-document" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-11 p-3.5 transition-all outline-none placeholder-slate-400 dark:placeholder-slate-500 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm" placeholder="000.000.000-00" maxlength="18" required>
              </div>
            </div>
            
            <!-- Celular -->
            <div>
              <label for="signup-phone" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Celular</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-slate-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <input v-model="formData.phone" @input="formatPhone" type="tel" id="signup-phone" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-11 p-3.5 transition-all outline-none placeholder-slate-400 dark:placeholder-slate-500 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm" placeholder="(11) 99999-9999" maxlength="15" required>
              </div>
            </div>
          </div>

          <!-- STEP 3: ENDEREÇO -->
          <div v-if="currentStep === 3" class="space-y-4 animate-fade-in-up">
            <!-- CEP e Número -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="signup-cep" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">CEP</label>
                <input v-model="formData.cep" @input="formatCep" type="text" id="signup-cep" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 transition-all outline-none placeholder-slate-400 dark:placeholder-slate-500 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm" placeholder="00000-000" maxlength="9" required>
              </div>
              <div>
                <label for="signup-number" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Número</label>
                <input v-model="formData.number" type="text" id="signup-number" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 transition-all outline-none placeholder-slate-400 dark:placeholder-slate-500 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm" placeholder="Ex: 123" required>
              </div>
            </div>

            <!-- Endereço -->
            <div>
              <label for="signup-address" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Endereço (Logradouro)</label>
              <input v-model="formData.address" type="text" id="signup-address" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 transition-all outline-none placeholder-slate-400 dark:placeholder-slate-500 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm" placeholder="Rua, Avenida, etc." required>
            </div>

            <!-- Bairro e Complemento -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="signup-neighborhood" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Bairro</label>
                <input v-model="formData.neighborhood" type="text" id="signup-neighborhood" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 transition-all outline-none placeholder-slate-400 dark:placeholder-slate-500 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm" placeholder="Centro" required>
              </div>
              <div>
                <label for="signup-complement" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Complemento</label>
                <input v-model="formData.complement" type="text" id="signup-complement" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 transition-all outline-none placeholder-slate-400 dark:placeholder-slate-500 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm" placeholder="Apto, Sala (Opcional)">
              </div>
            </div>

            <!-- Cidade e Estado -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="signup-city" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Cidade</label>
                <input v-model="formData.city" type="text" id="signup-city" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 transition-all outline-none placeholder-slate-400 dark:placeholder-slate-500 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm" placeholder="Sua Cidade" required>
              </div>
              <div>
                <label for="signup-state" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Estado (UF)</label>
                <div class="relative">
                  <select v-model="formData.state" id="signup-state" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 transition-all outline-none hover:border-slate-300 dark:hover:border-slate-600 shadow-sm appearance-none cursor-pointer" required>
                    <option value="" disabled selected>Selecione</option>
                    <option value="AC">Acre (AC)</option>
                    <option value="AL">Alagoas (AL)</option>
                    <option value="AP">Amapá (AP)</option>
                    <option value="AM">Amazonas (AM)</option>
                    <option value="BA">Bahia (BA)</option>
                    <option value="CE">Ceará (CE)</option>
                    <option value="DF">Distrito Federal (DF)</option>
                    <option value="ES">Espírito Santo (ES)</option>
                    <option value="GO">Goiás (GO)</option>
                    <option value="MA">Maranhão (MA)</option>
                    <option value="MT">Mato Grosso (MT)</option>
                    <option value="MS">Mato Grosso do Sul (MS)</option>
                    <option value="MG">Minas Gerais (MG)</option>
                    <option value="PA">Pará (PA)</option>
                    <option value="PB">Paraíba (PB)</option>
                    <option value="PR">Paraná (PR)</option>
                    <option value="PE">Pernambuco (PE)</option>
                    <option value="PI">Piauí (PI)</option>
                    <option value="RJ">Rio de Janeiro (RJ)</option>
                    <option value="RN">Rio Grande do Norte (RN)</option>
                    <option value="RS">Rio Grande do Sul (RS)</option>
                    <option value="RO">Rondônia (RO)</option>
                    <option value="RR">Roraima (RR)</option>
                    <option value="SC">Santa Catarina (SC)</option>
                    <option value="SP">São Paulo (SP)</option>
                    <option value="SE">Sergipe (SE)</option>
                    <option value="TO">Tocantins (TO)</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 dark:text-slate-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- NAVIGATION BUTTONS -->
          <div class="flex items-center space-x-4 mt-10">
            <button v-if="currentStep > 1" type="button" @click="prevStep" class="text-slate-600 dark:text-slate-400 font-medium text-sm px-6 py-3.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0 focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-800 focus:outline-none">
              Voltar
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              :class="[
                'flex-1 text-white font-medium rounded-xl text-sm px-5 py-3.5 text-center shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none focus:ring-4 focus:outline-none',
                couponApplied
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-600/30 hover:shadow-emerald-600/50 focus:ring-emerald-300 dark:focus:ring-teal-800'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-600/30 hover:shadow-blue-600/50 focus:ring-blue-300 dark:focus:ring-indigo-800'
              ]"
              :key="currentStep === 3 ? 'submit' : 'next'"
            >
              <span v-if="isLoading && currentStep === 3" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processando...
              </span>
              <span v-else>
                <template v-if="currentStep === 3">
                  {{ couponApplied ? '🎉 Criar Conta Gratuita' : 'Assinar e Criar Conta' }}
                </template>
                <template v-else>Próximo Passo</template>
              </span>
            </button>
          </div>
          <p v-if="currentStep === 3" class="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
            <template v-if="couponApplied">Ao criar sua conta beta, você concorda com nossos <a href="#" class="text-emerald-600 dark:text-emerald-400 hover:underline">Termos de Serviço</a>.</template>
            <template v-else>Ao assinar, você concorda com nossos <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline">Termos de Serviço</a>.</template>
          </p>
        </form>

        <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mt-6 text-center">
          Já possui uma conta? <router-link to="/login" class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-semibold">Fazer Login</router-link>
        </p>

        <!-- Support Banner -->
        <div class="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
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
      </div> <!-- End Login Card -->
      </div> <!-- End Centering Wrapper -->
    </div> <!-- End Left Side -->

    <!-- Right Side: Promotional / Image Area with Movement -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 lg:rounded-bl-[3rem] 2xl:rounded-bl-[4rem] shadow-2xl mt-[32px] lg:h-[calc(100vh-32px)] lg:sticky lg:top-[32px]">
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 animate-gradient-x opacity-90"></div>
      <div class="absolute inset-0 overflow-hidden pointer-events-none mix-blend-screen opacity-50">
        <div class="absolute top-[0%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-500/30 rounded-full filter blur-[100px] animate-blob"></div>
        <div class="absolute top-[20%] right-[-10%] w-[35rem] h-[35rem] bg-blue-500/30 rounded-full filter blur-[80px] animate-blob animation-delay-2000"></div>
        <div class="absolute bottom-[-10%] left-[20%] w-[45rem] h-[45rem] bg-cyan-400/20 rounded-full filter blur-[120px] animate-blob animation-delay-4000"></div>
      </div>
      <div class="relative z-20 w-full h-full p-12 lg:p-16 flex flex-col justify-end animate-fade-in-up">
        <div class="max-w-xl">
          <span class="inline-block py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-blue-300 text-xs font-semibold tracking-wider uppercase mb-5 backdrop-blur-md">
            Acesso PRO Liberado
          </span>
          <h2 class="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Torne-se <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">PRO</span> hoje <br>
            e não olhe para trás
          </h2>
          <p class="text-slate-300 text-lg lg:text-xl font-light mb-8 max-w-md">
            Apenas R$25 mensais por acesso total. Invista no crescimento do seu negócio de forma inteligente e sem limites.
          </p>
          <div class="flex items-center space-x-4">
            <div class="flex -space-x-3">
              <img class="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" src="/src/images/user1.jpg" alt="User 1">
              <img class="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" src="/src/images/user2.jpg" alt="User 2">
              <img class="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" src="/src/images/user3.jpg" alt="User 3">
              <div class="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 text-white text-xs flex items-center justify-center font-medium shadow-sm">+10k</div>
            </div>
            <div class="text-slate-400 text-sm font-medium">
              Empreendedores no plano PRO
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
import { supabase } from '../lib/supabase';
import { useConfirm } from '../composables/useConfirm';

// Helpers
const openExternal = (url: string) => {
  try {
    // Electron environment
    const { shell } = (window as any).require?.('electron') ?? {};
    if (shell?.openExternal) { shell.openExternal(url); return; }
  } catch (_) { /* not Electron */ }
  window.open(url, '_blank', 'noopener,noreferrer');
};

const router = useRouter();
const { isDark, toggleTheme } = useTheme();
const { alert: bvAlert } = useConfirm();

const currentStep = ref(1);
const isLoading = ref(false);

// Cupom
const couponCode = ref('');
const couponApplied = ref(false);
const couponError = ref('');
const isCouponLoading = ref(false);

const VALID_COUPON_CODES = ['digital-free']; // validação client-side leve (a real é server-side)

const applyCoupon = () => {
  couponError.value = '';
  const code = couponCode.value.trim().toLowerCase();
  if (!code) return;
  isCouponLoading.value = true;
  setTimeout(() => {
    if (VALID_COUPON_CODES.includes(code)) {
      couponApplied.value = true;
      couponCode.value = code;
    } else {
      couponError.value = 'Cupom inválido. Verifique o código e tente novamente.';
    }
    isCouponLoading.value = false;
  }, 600);
};

const removeCoupon = () => {
  couponApplied.value = false;
  couponCode.value = '';
  couponError.value = '';
};

const formData = ref({
  name: '',
  email: '',
  password: '',
  document: '',
  phone: '',
  cep: '',
  number: '',
  address: '',
  neighborhood: '',
  complement: '',
  city: '',
  state: ''
});

const formatDocument = (e: Event) => {
  const target = e.target as HTMLInputElement;
  let value = target.value.replace(/\D/g, '');
  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    value = value.slice(0, 14);
    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
  }
  formData.value.document = value;
  target.value = value;
};

const formatPhone = (e: Event) => {
  const target = e.target as HTMLInputElement;
  let value = target.value.replace(/\D/g, '');
  value = value.slice(0, 11);
  if (value.length > 10) {
    value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (value.length > 6) {
    value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else if (value.length > 2) {
    value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
  }
  formData.value.phone = value;
  target.value = value;
};

const formatCep = (e: Event) => {
  const target = e.target as HTMLInputElement;
  let value = target.value.replace(/\D/g, '');
  value = value.slice(0, 8);
  if (value.length > 5) {
    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
  }
  formData.value.cep = value;
  target.value = value;
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const handleNextOrSubmit = async () => {
  if (currentStep.value < 3) {
    currentStep.value++;
    return;
  }

  isLoading.value = true;
  try {
    // ── Step 1: Create user in Supabase Auth ──────────────────────────────
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.value.email,
      password: formData.value.password,
    });
    if (authError) throw authError;
    if (!authData.user) throw new Error('Não foi possível criar o usuário. Tente novamente.');

    // ── Step 2: Call Edge Function (creates Asaas customer + subscription) ─
    const { data: asaasData, error: fnError } = await supabase.functions.invoke('signup-asaas', {
      body: {
        user_id:      authData.user.id,
        name:         formData.value.name,
        email:        formData.value.email,
        document:     formData.value.document,
        phone:        formData.value.phone,
        cep:          formData.value.cep,
        address:      formData.value.address,
        neighborhood: formData.value.neighborhood,
        city:         formData.value.city,
        state:        formData.value.state,
        number:       formData.value.number,
        complement:   formData.value.complement,
        coupon_code:  couponApplied.value ? couponCode.value : undefined,
      },
    });

    if (fnError) throw new Error(fnError.message);
    if (asaasData?.error) throw new Error(asaasData.error);

    // ── Step 3: Redirecionar conforme tipo de acesso ───────────────────────
    if (asaasData?.free_access) {
      // Beta tester com cupom free → acesso imediato
      router.push('/onboarding');
    } else {
      // Fluxo normal → aguardar pagamento
      if (asaasData?.invoice_url) {
        openExternal(asaasData.invoice_url);
      }
      router.push('/pending-payment');
    }
  } catch (err: any) {
    console.error('[Signup] Erro na criação de conta:', err);
    bvAlert({ 
      title: 'Erro na Criação', 
      message: err.message || 'Verifique seus dados e tente novamente.',
      type: 'danger'
    });
  } finally {
    isLoading.value = false;
  }
};
</script>