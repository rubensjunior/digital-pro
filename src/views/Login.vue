<template>
  <div class="app-container flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

    <!-- Theme Toggle Button (fixed, outside panels to avoid stacking context issues) -->
    <button @click="toggleTheme" class="fixed top-[48px] right-8 lg:right-12 p-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-sm z-50 backdrop-blur-sm" title="Alternar Tema">
        <!-- Sun Icon -->
        <svg v-if="isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 3.22a1 1 0 011.415 0l.708.708a1 1 0 01-1.414 1.414l-.708-.708a1 1 0 010-1.414zM16 10a1 1 0 011 1h1a1 1 0 110-2h-1a1 1 0 01-1 1zm-3.22 4.22a1 1 0 010 1.415l-.708.708a1 1 0 01-1.414-1.414l.708-.708a1 1 0 011.414 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-3.22a1 1 0 01-1.415 0l-.708-.708a1 1 0 011.414-1.414l.708.708a1 1 0 010 1.414zM4 10a1 1 0 01-1 1H2a1 1 0 110-2h1a1 1 0 011 1zm3.22-4.22a1 1 0 010-1.415l.708-.708a1 1 0 011.414 1.414l-.708.708a1 1 0 01-1.414 0z"></path><path d="M10 15a5 5 0 100-10 5 5 0 000 10z"></path></svg>
        <!-- Moon Icon -->
        <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
    </button>

    <!-- Left Side: Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center relative p-8 sm:p-12 z-10">

      <!-- Login Card Wrapper -->
      <div class="w-full max-w-md animate-fade-in-up mt-8 lg:mt-0">
        
        <div class="text-center mb-10">
          <!-- Logo Icon shape -->
          <div class="mx-auto bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 transform transition hover:scale-105" style="width: 64px; height: 64px;">
            <svg width="32" height="32" class="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path></svg>
          </div>
          <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 tracking-tight">RKS Digital PRO</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">Bem-vindo de volta! Faça login para continuar.</p>
        </div>

        <form v-if="forgotStep === 'login'" @submit.prevent="handleLogin">
          <div v-if="successMessage" class="mb-4 p-3 rounded-lg bg-green-100 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400 text-center font-medium animate-fade-in-up">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="mb-4 p-3 rounded-lg bg-red-100 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400 text-center font-medium animate-fade-in-up">
            {{ errorMessage }}
          </div>
          <div class="space-y-5">
            <div>
              <label for="login-email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">E-mail</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-slate-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <input v-model="email" type="email" id="login-email" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-11 p-3.5 transition-all outline-none placeholder-slate-400 dark:placeholder-slate-500 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm" placeholder="seu@email.com" required>
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between mb-1.5 ml-1 mr-1">
                <label for="login-password" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Senha</label>
                <button type="button" @click="forgotStep = 'email'; errorMessage = ''; successMessage = ''" class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium bg-transparent border-none p-0 cursor-pointer">Esqueceu a senha?</button>
              </div>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-slate-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <input v-model="password" type="password" id="login-password" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-11 p-3.5 transition-all outline-none placeholder-slate-400 dark:placeholder-slate-500 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm" placeholder="••••••••" required>
              </div>
            </div>
          </div>

          <div class="flex items-center mt-5 mb-8 ml-1">
            <div class="flex items-center h-5">
              <input id="remember" type="checkbox" value="" class="w-4 h-4 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 dark:ring-offset-slate-900 outline-none text-blue-600 cursor-pointer accent-blue-600">
            </div>
            <label for="remember" class="ml-2 text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none">Lembrar de mim</label>
          </div>

          <button type="submit" :disabled="isLoading" class="w-full text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-indigo-800 font-medium rounded-xl text-sm px-5 py-3.5 text-center shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-300 transform hover:-translate-y-0.5 mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
            <span v-if="isLoading">Acessando...</span>
            <span v-else>Entrar no Painel</span>
          </button>
        </form>

        <!-- Passo 2: Solicitar código OTP -->
        <form v-else-if="forgotStep === 'email'" @submit.prevent="handleSendOtp" class="animate-fade-in-up">
          <div v-if="errorMessage" class="mb-4 p-3 rounded-lg bg-red-100 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400 text-center font-medium">
            {{ errorMessage }}
          </div>
          <div class="text-center mb-7">
            <div class="mx-auto w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-4">
              <svg class="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <h2 class="text-xl font-bold text-slate-800 dark:text-white">Esqueceu sua senha?</h2>
            <p class="text-slate-500 dark:text-slate-400 text-sm mt-1.5">Informe seu e-mail e enviaremos um código de verificação.</p>
          </div>
          <div>
            <label for="reset-email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">E-mail da conta</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-slate-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <input v-model="resetEmail" type="email" id="reset-email" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-11 p-3.5 transition-all outline-none placeholder-slate-400 dark:placeholder-slate-500 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm" placeholder="seu@email.com" required>
            </div>
          </div>
          <button type="submit" :disabled="isLoading" class="w-full text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-indigo-800 font-medium rounded-xl text-sm px-5 py-3.5 text-center shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-300 transform hover:-translate-y-0.5 mt-6 disabled:opacity-70 disabled:cursor-not-allowed">
            <span v-if="isLoading">Enviando...</span>
            <span v-else>Enviar código</span>
          </button>
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mt-6 text-center">
            <button type="button" @click="forgotStep = 'login'; errorMessage = ''" class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-semibold bg-transparent border-none p-0 cursor-pointer">← Voltar ao login</button>
          </p>
        </form>

        <!-- Passo 3: Inserir código OTP + nova senha -->
        <form v-else-if="forgotStep === 'reset'" @submit.prevent="handleResetPassword" class="animate-fade-in-up">
          <div v-if="errorMessage" class="mb-4 p-3 rounded-lg bg-red-100 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400 text-center font-medium">
            {{ errorMessage }}
          </div>
          <div class="text-center mb-5">
            <div class="mx-auto w-14 h-14 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-4">
              <svg class="w-7 h-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <h2 class="text-xl font-bold text-slate-800 dark:text-white">Redefinir senha</h2>
            <p class="text-slate-500 dark:text-slate-400 text-sm mt-1.5">Código enviado para <span class="font-semibold text-slate-700 dark:text-slate-300">{{ resetEmail }}</span></p>
          </div>
          <div class="space-y-4">
            <div>
              <label for="otp-code" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Código de verificação</label>
              <input v-model="otpCode" type="text" id="otp-code" maxlength="8" inputmode="numeric" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-lg rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 transition-all outline-none text-center tracking-[0.4em] font-mono shadow-sm" placeholder="00000000" required>
            </div>
            <div>
              <label for="new-password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Nova senha</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-slate-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <input v-model="newPassword" type="password" id="new-password" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-11 p-3.5 transition-all outline-none placeholder-slate-400 dark:placeholder-slate-500 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm" placeholder="Mínimo 6 caracteres" minlength="6" required>
              </div>
            </div>
            <div>
              <label for="confirm-password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Confirmar nova senha</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-slate-500">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <input v-model="confirmPassword" type="password" id="confirm-password" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-11 p-3.5 transition-all outline-none placeholder-slate-400 dark:placeholder-slate-500 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm" placeholder="Repita a nova senha" required>
              </div>
            </div>
          </div>
          <button type="submit" :disabled="isLoading" class="w-full text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-indigo-800 font-medium rounded-xl text-sm px-5 py-3.5 text-center shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-300 transform hover:-translate-y-0.5 mt-6 disabled:opacity-70 disabled:cursor-not-allowed">
            <span v-if="isLoading">Redefinindo...</span>
            <span v-else>Redefinir senha</span>
          </button>
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mt-6 text-center">
            <button type="button" @click="forgotStep = 'email'; errorMessage = ''" class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-semibold bg-transparent border-none p-0 cursor-pointer">← Reenviar código</button>
          </p>
        </form>

        <p v-if="forgotStep === 'login'" class="text-sm font-medium text-slate-500 dark:text-slate-400 mt-8 text-center">
          Não possui uma conta? <router-link to="/signup" class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-semibold">Criar conta</router-link>
        </p>

        <!-- Support Banner -->
        <div class="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
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

    <!-- Right Side: Promotional / Image Area with Movement -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 rounded-bl-[3rem] 2xl:rounded-bl-[4rem] shadow-2xl mt-[32px]">
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 animate-gradient-x opacity-90"></div>
      <div class="absolute inset-0 overflow-hidden pointer-events-none mix-blend-screen opacity-50">
        <div class="absolute top-[0%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-500/30 rounded-full filter blur-[100px] animate-blob"></div>
        <div class="absolute top-[20%] right-[-10%] w-[35rem] h-[35rem] bg-blue-500/30 rounded-full filter blur-[80px] animate-blob animation-delay-2000"></div>
        <div class="absolute bottom-[-10%] left-[20%] w-[45rem] h-[45rem] bg-cyan-400/20 rounded-full filter blur-[120px] animate-blob animation-delay-4000"></div>
      </div>
      <div class="relative z-20 w-full h-full p-12 lg:p-16 flex flex-col justify-end animate-fade-in-up">
        <div class="max-w-xl">
          <div class="flex flex-row gap-5 mb-10 w-full pointer-events-auto">
            <div class="flex-1 h-36 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] animate-float p-5 flex flex-col justify-between">
              <div class="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div>
                <div class="h-2 w-16 bg-white/20 rounded mb-2"></div>
                <div class="h-2 w-24 bg-white/10 rounded"></div>
              </div>
            </div>
            <div class="flex-1 h-36 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] animate-float animation-delay-2000 p-5 flex flex-col justify-between">
              <div class="flex justify-between items-start">
                <div class="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                </div>
                <div class="flex space-x-1 mt-1">
                  <div class="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                  <div class="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                  <div class="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                </div>
              </div>
              <div>
                  <h3 class="text-white/90 font-medium text-[13px] mb-1.5 leading-none">Métricas</h3>
                  <div class="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div class="bg-gradient-to-r from-blue-400 to-purple-500 w-3/4 h-full"></div>
                  </div>
              </div>
            </div>
          </div>
          <span class="inline-block py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-blue-300 text-xs font-semibold tracking-wider uppercase mb-5 backdrop-blur-md">
            Nova Atualização ✨
          </span>
          <h2 class="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Acelere sua <br>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">transformação digital</span>
          </h2>
          <p class="text-slate-300 text-lg lg:text-xl font-light mb-8 max-w-md">
            A plataforma definitiva para gerenciar seu negócio e projetos com inteligência, agilidade e design de ponta.
          </p>
          <div class="flex items-center space-x-4">
            <div class="flex -space-x-3">
              <img class="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" src="/src/images/user1.jpg" alt="User 1">
              <img class="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" src="/src/images/user2.jpg" alt="User 2">
              <img class="w-10 h-10 rounded-full border-2 border-slate-900 object-cover" src="/src/images/user3.jpg" alt="User 3">
              <div class="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 text-white text-xs flex items-center justify-center font-medium shadow-sm">+10k</div>
            </div>
            <div class="text-slate-400 text-sm font-medium">
              Profissionais já estão a bordo
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTheme } from '../composables/useTheme';
import { supabase } from '../lib/supabase';

const router = useRouter();
const { isDark, toggleTheme } = useTheme();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
const forgotStep = ref<'login' | 'email' | 'reset'>('login');
const resetEmail = ref('');
const otpCode = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const successMessage = ref('');

// ─── Auto-login: detecta sessão Supabase já ativa ───────────────────────────
// Ocorre quando o app é reaberto e o token ainda não expirou.
// Sem isso, o banco SQLite nunca seria inicializado, causando loop no onboarding.
onMounted(async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return; // Nenhuma sessão → mostra tela de login normalmente

    // Verificar status antes de inicializar o banco
    if (navigator.onLine) {
      const { data: clientData } = await supabase
        .from('clientes')
        .select('status')
        .eq('id', session.user.id)
        .single();

      if (clientData && clientData.status !== 'ativo') {
        await supabase.auth.signOut();
        router.push('/pending-payment');
        return;
      }
    }

    // Inicializar banco SQLite e redirecionar
    await window.electronAPI.user.initDb(session.user.id);
    await configurarNavegacaoAoSucesso();
  } catch (e: any) {
    console.warn('[Login] Erro no auto-login:', e);
    // Log para depuração na versão instalada
    if (!import.meta.env.VITE_SUPABASE_URL) {
      console.error('[Login] VITE_SUPABASE_URL está ausente no ambiente!');
    }
  }
});

const handleLogin = async () => {
  try {
    errorMessage.value = '';
    isLoading.value = true;
    
    // 1. Fazer login no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (authError) throw authError;

    if (authData.user) {
      // 2. Verificar o status do cliente diretamente do banco
      const { data: clientData, error: clientError } = await supabase
        .from('clientes')
        .select('status')
        .eq('id', authData.user.id)
        .single();
        
      if (clientError) throw clientError;

      // 3. Bloquear e redirecionar se a conta não estiver ativa
      if (clientData && clientData.status !== 'ativo') {
        await supabase.auth.signOut();
        router.push('/pending-payment');
        return;
      }

      // 4. Inicializar o banco SQLite local com o userId do usuário autenticado
      // CRÍTICO: sem isso, workspaces.getAll() retorna [] porque `db` está indefinido
      await window.electronAPI.user.initDb(authData.user.id);

      // Login bem-sucedido e conta ativa
      configurarNavegacaoAoSucesso();
    }
  } catch (err: any) {
    console.error('Erro detalhado no login:', err);
    // Tenta pegar a mensagem de erro específica do Supabase ou da rede
    const errorMessageStr = err.error_description || err.message || (err.error ? err.error : 'Erro desconhecido');
    
    if (errorMessageStr.includes('Invalid login credentials')) {
      errorMessage.value = 'E-mail ou senha incorretos.';
    } else if (errorMessageStr.includes('Failed to fetch')) {
      errorMessage.value = 'Erro de conexão. Verifique sua internet ou as configurações do servidor.';
    } else {
      errorMessage.value = `Erro: ${errorMessageStr}`;
    }
  } finally {
    isLoading.value = false;
  }
};

const configurarNavegacaoAoSucesso = async () => {
  try {
    // Verifica se o usuário já possui workspaces configurados
    const workspaces = await window.electronAPI.workspaces.getAll();
    if (!workspaces || workspaces.length === 0) {
      // Novo usuário sem workspace → vai para onboarding
      router.push('/onboarding');
    } else {
      // Usuário existente com workspace → vai para o dashboard
      router.push('/dashboard');
    }
  } catch (e) {
    console.error('[Login] Erro ao verificar workspaces, redirecionando para onboarding:', e);
    router.push('/onboarding');
  }
};

const handleSendOtp = async () => {
  try {
    errorMessage.value = '';
    isLoading.value = true;

    const { error } = await supabase.auth.signInWithOtp({
      email: resetEmail.value,
      options: {
        shouldCreateUser: false,
      },
    });

    if (error) throw error;

    forgotStep.value = 'reset';
  } catch (err: any) {
    console.error('Erro ao enviar código OTP:', err);
    errorMessage.value = 'Não foi possível enviar o código. Verifique o e-mail informado.';
  } finally {
    isLoading.value = false;
  }
};

const handleResetPassword = async () => {
  try {
    errorMessage.value = '';

    if (newPassword.value !== confirmPassword.value) {
      errorMessage.value = 'As senhas não coincidem.';
      return;
    }

    if (newPassword.value.length < 6) {
      errorMessage.value = 'A nova senha deve ter no mínimo 6 caracteres.';
      return;
    }

    isLoading.value = true;

    // 1. Verifica o OTP e abre sessão temporária
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: resetEmail.value,
      token: otpCode.value,
      type: 'email',
    });

    if (verifyError) throw verifyError;

    // 2. Atualiza a senha com a sessão ativa
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword.value,
    });

    if (updateError) throw updateError;

    // 3. Encerra a sessão temporária
    await supabase.auth.signOut();

    // 4. Reseta os campos e volta ao login com mensagem de sucesso
    forgotStep.value = 'login';
    resetEmail.value = '';
    otpCode.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    errorMessage.value = '';
    successMessage.value = 'Senha redefinida com sucesso! Faça login com a nova senha.';
  } catch (err: any) {
    console.error('Erro ao redefinir senha:', err);
    const msg = err.message?.toLowerCase() ?? '';
    if (msg.includes('token') || msg.includes('otp') || msg.includes('expired') || msg.includes('invalid')) {
      errorMessage.value = 'Código inválido ou expirado. Clique em "Reenviar código".';
    } else {
      errorMessage.value = 'Erro ao redefinir senha. Tente novamente.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
