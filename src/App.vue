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

  <!-- Global Top Progress Bar -->
  <div class="global-loader-bar" :class="{ 'is-loading': isRouting }"></div>

  <!-- Main Router View -->
  <main id="app-router">
    <router-view v-slot="{ Component }">
      <transition name="page-fade" mode="out-in">
        <component :is="Component" class="router-view-fill" />
      </transition>
    </router-view>
  </main>

  <!-- Global Loading Overlay -->
  <transition name="fade">
    <div v-if="isRouting" class="global-loading-overlay">
      <div class="spinner"></div>
    </div>
  </transition>

  <ConfirmModal 
    :show="show"
    :title="options.title"
    :message="options.message"
    :type="options.type"
    :icon="options.icon"
    :confirm-text="options.confirmText"
    :cancel-text="options.cancelText"
    :is-alert="options.isAlert"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { useConfirm } from './composables/useConfirm';
import ConfirmModal from './components/ConfirmModal.vue';
import { isRouting } from './router/index';

const { show, options, handleConfirm, handleCancel } = useConfirm();

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

/* --- Global Loading & Transitions --- */

/* Top Progress Bar */
.global-loader-bar {
  position: fixed;
  top: 32px; /* Altura do titlebar */
  left: 0;
  height: 3px;
  background: #3b82f6;
  width: 0%;
  z-index: 9999;
  transition: width 0.3s ease, opacity 0.3s ease;
  opacity: 0;
}

.global-loader-bar.is-loading {
  width: 100%;
  opacity: 1;
  transition: width 2s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.1s ease;
}

/* Spinner Overlay */
.global-loading-overlay {
  position: fixed;
  top: 32px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 32px);
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(59, 130, 246, 0.2);
  border-left-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Page Transitions */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
