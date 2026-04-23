<template>
  <Teleport to="body">
    <Transition name="dp-modal-fade">
      <div v-if="show" class="dp-modal-overlay" @click.self="cancel">
        <div class="dp-modal-container confirm-modal-width">
          <div class="dp-modal-header">
            <div class="idea-header-left">
              <div class="idea-icon-box" :class="[type ? `is-${type}` : 'is-primary']">
                {{ icon || defaultIcon }}
              </div>
              <h3 class="dp-modal-title">{{ title }}</h3>
            </div>
            <button class="dp-close-btn" @click="cancel" title="Fechar">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          
          <div class="dp-modal-body">
            <p class="confirm-message">{{ message }}</p>
          </div>

          <div class="dp-modal-footer">
            <button v-if="!isAlert" class="dp-btn dp-btn-ghost" @click="cancel">
              {{ cancelText || 'Não, cancelar' }}
            </button>
            <button 
              class="dp-btn" 
              :class="[type === 'danger' ? 'dp-btn-danger' : 'dp-btn-primary']" 
              @click="confirm"
            >
              {{ confirmText || (isAlert ? 'Entendi' : 'Sim, confirmar') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  show: boolean;
  title: string;
  message: string;
  type?: 'primary' | 'danger' | 'success' | 'info' | 'warning';
  icon?: string;
  confirmText?: string;
  cancelText?: string;
  isAlert?: boolean;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const defaultIcon = computed(() => {
  switch (props.type) {
    case 'danger': return '⚠️';
    case 'success': return '✅';
    case 'warning': return '⚠️';
    case 'info': return 'ℹ️';
    default: return '❓';
  }
});

function confirm() {
  emit('confirm');
}

function cancel() {
  emit('cancel');
}
</script>

<style scoped>
.confirm-modal-width {
  width: 100%;
  max-width: 440px;
}

.idea-header-left { display: flex; align-items: center; gap: 16px; }
.idea-icon-box {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
}

.idea-icon-box.is-primary { background: rgba(59, 130, 246, 0.1); }
.idea-icon-box.is-danger  { background: rgba(239, 68, 68, 0.1); }
.idea-icon-box.is-success { background: rgba(16, 185, 129, 0.1); }
.idea-icon-box.is-warning { background: rgba(245, 158, 11, 0.1); }
.idea-icon-box.is-info    { background: rgba(14, 165, 233, 0.1); }

.confirm-message {
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  color: var(--dp-modal-text-secondary);
}

/* Animações de Transição customizadas se necessário */
.dp-modal-fade-enter-active,
.dp-modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.dp-modal-fade-enter-from,
.dp-modal-fade-leave-to {
  opacity: 0;
}
</style>

