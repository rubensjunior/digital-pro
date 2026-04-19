<template>
  <Teleport to="body">
    <Transition name="bv-modal-fade">
      <div v-if="note" class="bv-reader-overlay" @click.self="close">
        <div class="bv-reader-container">
          <!-- Header -->
          <div class="bv-reader-header">
            <div class="bv-reader-meta">
              <div class="bv-nota-icon" :style="{ backgroundColor: note.cor || '#e2e8f0' }"></div>
              <div>
                <h3 class="bv-reader-title">{{ note.titulo || 'Nota sem título' }}</h3>
                <span class="bv-reader-date">{{ formatDate(note.created_at) }}</span>
              </div>
            </div>
            <button class="bv-reader-close" @click="close">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Content -->
          <div class="bv-reader-body custom-scrollbar">
            <div class="bv-rich-text" v-html="note.conteudo"></div>
          </div>

          <!-- Footer -->
          <div class="bv-reader-footer">
            <button class="bv-btn-reader-close" @click="close">Fechar Leitura</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { IdeiaNote } from '../types/ideia';

defineProps<{
  note: IdeiaNote | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

function close() {
  emit('close');
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>

<style scoped>
.bv-reader-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001; /* Acima de tudo */
  padding: 40px;
}

.bv-reader-container {
  width: 100%;
  max-width: 850px;
  height: 100%;
  max-height: 90vh;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.bv-reader-header {
  padding: 24px 32px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
}

.bv-reader-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.bv-nota-icon {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
}

.bv-reader-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.bv-reader-date {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

.bv-reader-close {
  background: #f1f5f9;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.bv-reader-close:hover {
  background: #e2e8f0;
  color: #0f172a;
  transform: rotate(90deg);
}

.bv-reader-body {
  flex: 1;
  overflow-y: auto;
  padding: 40px 60px;
  background: #ffffff;
}

.bv-reader-footer {
  padding: 16px 32px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
  background: #f8fafc;
}

.bv-btn-reader-close {
  padding: 10px 24px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.bv-btn-reader-close:hover {
  background: #f1f5f9;
  color: #0f172a;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

/* Modal Fade Animation */
.bv-modal-fade-enter-active,
.bv-modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.bv-modal-fade-enter-from,
.bv-modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .bv-reader-body {
    padding: 24px;
  }
}
</style>
