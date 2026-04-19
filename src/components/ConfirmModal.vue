<template>
  <Teleport to="body">
    <Transition name="bv-modal-fade">
      <div v-if="show" class="bv-modal-overlay" @click.self="cancel">
        <div class="bv-modal-container">
          <div class="bv-modal-header">
            <div class="bv-modal-icon">{{ icon || '⚠️' }}</div>
            <h3 class="bv-modal-title">{{ title }}</h3>
          </div>
          
          <div class="bv-modal-content">
            <p>{{ message }}</p>
          </div>

          <div class="bv-modal-actions">
            <button class="bv-btn-cancel" @click="cancel">Não, cancelar</button>
            <button 
              class="bv-btn-confirm" 
              :class="{ 'is-danger': type === 'danger' }" 
              @click="confirm"
            >
              Sim, confirmar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  title: string;
  message: string;
  type?: 'primary' | 'danger';
  icon?: string;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

function confirm() {
  emit('confirm');
}

function cancel() {
  emit('cancel');
}
</script>

<style scoped>
.bv-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000; /* Acima do drawer */
}

.bv-modal-container {
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid #e2e8f0;
}

.bv-modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bv-modal-icon {
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bv-modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.bv-modal-content p {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.bv-modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.bv-modal-actions button {
  flex: 1;
  padding: 10px 16px;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.bv-btn-cancel {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.bv-btn-cancel:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.bv-btn-confirm {
  background: #3b82f6;
  border: none;
  color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
}

.bv-btn-confirm:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.bv-btn-confirm.is-danger {
  background: #ef4444;
  box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.3);
}

/* Animações */
.bv-modal-fade-enter-active,
.bv-modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.bv-modal-fade-enter-from,
.bv-modal-fade-leave-to {
  opacity: 0;
}

.bv-modal-fade-enter-active .bv-modal-container {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.bv-modal-fade-enter-from .bv-modal-container {
  transform: scale(0.95) translateY(10px);
}
</style>
