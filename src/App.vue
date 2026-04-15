<template>
  <!-- Custom Titlebar -->
  <div class="titlebar">
    <div class="titlebar-drag-region flex items-center pl-3 space-x-2">
      <div class="w-5 h-5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded flex items-center justify-center shadow-sm">
        <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path></svg>
      </div>
      <span class="text-xs font-semibold text-slate-700 dark:text-slate-300">RKS Digital PRO</span>
    </div>
    <div class="window-controls">
      <button @click="minimize" class="control-btn minimize" title="Minimizar">
        <svg viewBox="0 0 10 1" fill="currentColor"><rect width="10" height="1"></rect></svg>
      </button>
      <button @click="maximize" class="control-btn maximize" title="Maximizar">
        <svg viewBox="0 0 10 10" fill="currentColor"><path d="M0,0v10h10V0H0z M9,9H1V1h8V9z"></path></svg>
      </button>
      <button @click="closeApp" class="control-btn close" title="Fechar">
        <svg viewBox="0 0 10 10" fill="currentColor"><polygon points="10,1 9,0 5,4 1,0 0,1 4,5 0,9 1,10 5,6 9,10 10,9 6,5"></polygon></svg>
      </button>
    </div>
  </div>

  <!-- Main Router View -->
  <main id="app-router">
    <router-view></router-view>
  </main>
</template>

<script setup lang="ts">
const minimize = () => {
  if (window.electronAPI) window.electronAPI.windowMinimize();
};

const maximize = () => {
  if (window.electronAPI) window.electronAPI.windowMaximize();
};

const closeApp = () => {
  if (window.electronAPI) window.electronAPI.windowClose();
};
</script>

<style>
/* Any global resets not handled by Tailwind */
#app {
  width: 100%;
  height: 100vh;
}
</style>
