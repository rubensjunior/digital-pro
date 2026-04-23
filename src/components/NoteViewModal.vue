<template>
  <Teleport to="body">
    <Transition name="dp-modal-fade">
      <div v-if="note" class="dp-modal-overlay" @click.self="close">
        <div class="dp-modal-container note-reader-width">
          <!-- Header -->
          <div class="dp-modal-header">
            <div class="note-header-meta">
              <div class="note-color-dot" :style="{ backgroundColor: note.cor || '#3b82f6' }"></div>
              <div>
                <h3 class="dp-modal-title">{{ note.titulo || 'Nota sem título' }}</h3>
                <span class="note-date-text">{{ formatDate(note.created_at) }}</span>
              </div>
            </div>
            <button class="close-modal-btn" @click="close">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Content -->
          <div class="dp-modal-body note-body-scroll">
            <div class="note-content-rendered" v-html="note.conteudo"></div>
          </div>

          <!-- Footer -->
          <div class="dp-modal-footer">
            <button class="dp-btn dp-btn-ghost" @click="close">Fechar Leitura</button>
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
.note-reader-width {
  width: 800px;
  max-width: 95vw;
  height: 85vh;
}

.note-header-meta { display: flex; align-items: center; gap: 16px; }
.note-color-dot {
  width: 10px; height: 10px; border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(0,0,0,0.05);
}
.dark .note-color-dot { box-shadow: 0 0 0 4px rgba(255,255,255,0.05); }

.note-date-text { font-size: 12px; color: var(--dp-modal-text-secondary); font-weight: 500; }

.close-modal-btn {
  background: transparent; border: none; color: var(--dp-modal-text-secondary);
  cursor: pointer; padding: 8px; border-radius: 8px; transition: all 0.2s;
}
.close-modal-btn:hover { background: rgba(0,0,0,0.05); color: #f1416c; }
.dark .close-modal-btn:hover { background: rgba(255,255,255,0.05); }

.note-body-scroll {
  padding: 40px 60px;
  background: var(--dp-modal-bg);
  line-height: 1.6;
}

.note-content-rendered {
  color: var(--dp-modal-text-primary);
  font-size: 16px;
}

.note-content-rendered :deep(p) { margin-bottom: 1.5em; }
.note-content-rendered :deep(h1), 
.note-content-rendered :deep(h2), 
.note-content-rendered :deep(h3) { 
  color: var(--dp-modal-text-primary); 
  margin: 1.5em 0 0.5em;
  font-weight: 700;
}

.note-content-rendered :deep(ul), 
.note-content-rendered :deep(ol) { 
  margin-bottom: 1.5em; 
  padding-left: 1.5em; 
}

.note-content-rendered :deep(blockquote) {
  border-left: 4px solid #3b82f6;
  padding-left: 1.5em;
  font-style: italic;
  color: var(--dp-modal-text-secondary);
  margin: 1.5em 0;
}

@media (max-width: 768px) {
  .note-body-scroll {
    padding: 24px;
  }
}
</style>
