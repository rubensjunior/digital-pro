<template>
  <div class="swot-matrix-container">
    <div class="swot-header">
      <h2>Matriz SWOT</h2>
      <button class="dp-btn dp-btn-primary" @click="save">Salvar Alterações</button>
    </div>

    <div class="swot-grid">
      <!-- Strengths (Forças) -->
      <div class="swot-quadrant forces">
        <div class="swot-quadrant-header">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          <h3>S - Forças (Strengths)</h3>
        </div>
        <div class="swot-quadrant-body">
          <textarea v-model="localData.strengths" placeholder="Quais são suas principais vantagens internas? O que você faz melhor que a concorrência?"></textarea>
        </div>
      </div>

      <!-- Weaknesses (Fraquezas) -->
      <div class="swot-quadrant weaknesses">
        <div class="swot-quadrant-header">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <h3>W - Fraquezas (Weaknesses)</h3>
        </div>
        <div class="swot-quadrant-body">
          <textarea v-model="localData.weaknesses" placeholder="Quais são as desvantagens internas? Onde há falta de recursos ou habilidades?"></textarea>
        </div>
      </div>

      <!-- Opportunities (Oportunidades) -->
      <div class="swot-quadrant opportunities">
        <div class="swot-quadrant-header">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
          <h3>O - Oportunidades (Opportunities)</h3>
        </div>
        <div class="swot-quadrant-body">
          <textarea v-model="localData.opportunities" placeholder="Quais tendências do mercado podem ser aproveitadas? Existem novos nichos?"></textarea>
        </div>
      </div>

      <!-- Threats (Ameaças) -->
      <div class="swot-quadrant threats">
        <div class="swot-quadrant-header">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          <h3>T - Ameaças (Threats)</h3>
        </div>
        <div class="swot-quadrant-body">
          <textarea v-model="localData.threats" placeholder="O que seus concorrentes estão fazendo? Quais mudanças podem impactar negativamente o negócio?"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const props = defineProps<{
  initialData: string;
}>();

const emit = defineEmits<{
  (e: 'save', data: string): void;
}>();

const localData = ref({
  strengths: '',
  weaknesses: '',
  opportunities: '',
  threats: ''
});

onMounted(() => {
  if (props.initialData && props.initialData !== '{}') {
    try {
      const parsed = JSON.parse(props.initialData);
      localData.value = { ...localData.value, ...parsed };
    } catch (e) {
      console.error('Erro ao fazer parse dos dados da SWOT', e);
    }
  }
});

function save() {
  emit('save', JSON.stringify(localData.value));
}
</script>

<style scoped>
.swot-matrix-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}

.swot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.swot-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.swot-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1rem;
  flex: 1;
  min-height: 500px;
}

.swot-quadrant {
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--surface-color);
}

.swot-quadrant-header {
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.swot-quadrant-header h3 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
}

.swot-quadrant-body {
  flex: 1;
  display: flex;
  padding: 0.5rem;
}

.swot-quadrant-body textarea {
  flex: 1;
  width: 100%;
  resize: none;
  border: none;
  background: transparent;
  padding: 0.5rem;
  font-family: inherit;
  font-size: 0.9rem;
  color: var(--text-color);
  outline: none;
  line-height: 1.5;
}

.swot-quadrant-body textarea::placeholder {
  color: var(--text-muted);
  opacity: 0.7;
}

/* Quadrant Styles */
.forces .swot-quadrant-header { background-color: rgba(16, 185, 129, 0.1); color: #059669; border-bottom-color: rgba(16, 185, 129, 0.2); }
.weaknesses .swot-quadrant-header { background-color: rgba(245, 158, 11, 0.1); color: #d97706; border-bottom-color: rgba(245, 158, 11, 0.2); }
.opportunities .swot-quadrant-header { background-color: rgba(59, 130, 246, 0.1); color: #2563eb; border-bottom-color: rgba(59, 130, 246, 0.2); }
.threats .swot-quadrant-header { background-color: rgba(239, 68, 68, 0.1); color: #dc2626; border-bottom-color: rgba(239, 68, 68, 0.2); }
</style>
