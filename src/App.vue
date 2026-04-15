<template>
  <!-- Custom Titlebar -->
  <div class="titlebar">
    <div class="titlebar-drag-region">
      <!-- Região transparente apenas para arrastar a janela -->
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
    <router-view class="router-view-fill"></router-view>
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
  display: flex;
  flex-direction: column;
}

#app-router {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
