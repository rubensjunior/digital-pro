<template>
  <div class="onboarding-view">
    <div class="onboarding-container">
      <div class="onboarding-header">
        <div class="header-badge">Primeiro Acesso</div>
        <h1 class="header-title">Bem-vindo ao Digital PRO</h1>
        <p class="header-subtitle">
          Para começar, escolha um modelo de fluxo que faça sentido para o seu negócio. 
          Isso irá configurar automaticamente seus tipos de ideias, status e alguns exemplos.
        </p>
      </div>

      <div class="templates-grid">
        <div 
          v-for="t in templates" 
          :key="t.id" 
          class="template-card" 
          :class="{ active: selectedTemplate === t.id }"
          @click="selectedTemplate = t.id"
        >
          <div class="card-icon" :style="{ background: t.color + '20', color: t.color }">
            <span v-html="t.icon"></span>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ t.name }}</h3>
            <p class="card-description">{{ t.description }}</p>
            <div class="card-tags">
              <span v-for="tag in t.tags" :key="tag" class="card-tag">{{ tag }}</span>
            </div>
          </div>
          <div class="card-check">
            <svg v-if="selectedTemplate === t.id" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <!-- Start from scratch as a wide card at the bottom -->
        <div 
          class="template-card scratch" 
          :class="{ active: selectedTemplate === 'scratch' }"
          @click="selectedTemplate = 'scratch'"
        >
          <div class="card-icon scratch-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div class="card-content">
            <h3 class="card-title">Começar do Zero</h3>
            <p class="card-description">Um workspace totalmente limpo para você configurar como preferir.</p>
          </div>
          <div class="card-check">
             <svg v-if="selectedTemplate === 'scratch'" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div class="onboarding-footer">
        <button 
          class="btn-primary" 
          :disabled="!selectedTemplate || loading"
          @click="handleSetup"
        >
          <span v-if="!loading">Confirmar e Iniciar</span>
          <span v-else class="loader"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useWorkspaces } from '../composables/useWorkspaces';

const router = useRouter();
const { fetchWorkspaces, createWorkspace } = useWorkspaces();
const selectedTemplate = ref('');
const loading = ref(false);

const templates = [
  {
    id: 'marketing',
    name: 'Marketing & Infoprodutos',
    description: 'Focado em funis de vendas, copy, VSL e escala de produtos digitais.',
    color: '#f59e0b',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>',
    tags: ['📣 Lançamento', '🔥 Copy', '📈 Funil']
  },
  {
    id: 'software',
    name: 'Software & SaaS',
    description: 'Ideal para desenvolvedores e produtores de software controlarem features e bugs.',
    color: '#6366f1',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>',
    tags: ['💻 Dev', '🐞 Bugfix', '🎨 UI/UX']
  },
  {
    id: 'business',
    name: 'Negócios & Gestão',
    description: 'Gerencie metas, processos internos e planejamento estratégico de empresas.',
    color: '#10b981',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>',
    tags: ['🎯 OKR', '⚙️ Workflow', '📅 Gestão']
  },
  {
    id: 'education',
    name: 'Estudos & Pesquisa',
    description: 'Organize seus estudos, resumos de livros e pesquisas acadêmicas.',
    color: '#ec4899',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
    tags: ['📚 Resumo', '🔬 Teoria', '🔍 Pesquisa']
  }
];

async function handleSetup() {
  if (!selectedTemplate.value) return;
  loading.value = true;
  try {
    if (selectedTemplate.value === 'scratch') {
      await createWorkspace('Meu Cofre de Ideias', '#3b82f6');
    } else {
      await window.electronAPI.workspaces.setupTemplate(selectedTemplate.value);
    }
    await fetchWorkspaces();
    router.replace('/dashboard/ideas');
  } catch (e) {
    console.error('Erro ao configurar workspace:', e);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.onboarding-view {
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  justify-content: center;
  overflow-y: auto;
  padding: 40px 20px;
}

.onboarding-container {
  width: 100%;
  max-width: 1200px;
  margin: auto;
  padding: 40px 20px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.onboarding-header {
  text-align: center;
  margin-bottom: 48px;
}

.header-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #e0f2fe;
  color: #0369a1;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.header-title {
  font-size: 36px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 12px;
  letter-spacing: -0.02em;
}

.header-subtitle {
  font-size: 16px;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.template-card {
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  position: relative;
}

.template-card:hover {
  border-color: #cbd5e1;
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -10px rgba(0,0,0,0.1);
}

.template-card.active {
  border-color: #3b82f6;
  background: #f0f7ff;
  box-shadow: 0 8px 20px -6px rgba(59,130,246,0.15);
}

.template-card.scratch {
  grid-column: span 4;
  flex-direction: row;
  align-items: center;
  padding: 20px 24px;
  gap: 20px;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.card-icon :deep(svg) {
  width: 24px;
  height: 24px;
}

.scratch .card-icon {
  margin-bottom: 0;
}

.scratch-icon {
  background: #f1f5f9;
  color: #64748b;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px;
}

.card-description {
  font-size: 13.5px;
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 16px;
}

.scratch .card-description {
  margin: 0;
}

.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.card-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  background: rgba(0,0,0,0.05);
  color: #64748b;
  border-radius: 6px;
}

.card-check {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 20px;
  height: 20px;
  color: #3b82f6;
}

.scratch .card-check {
  top: auto;
}

.onboarding-footer {
  display: flex;
  justify-content: center;
}

.btn-primary {
  background: #0f172a;
  color: #ffffff;
  border: none;
  padding: 14px 48px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-primary:hover:not(:disabled) {
  background: #1e293b;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -4px rgba(15,23,42,0.25);
}

.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.loader {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 1024px) {
  .templates-grid { grid-template-columns: repeat(2, 1fr); }
  .template-card.scratch { grid-column: span 2; }
}

@media (max-width: 640px) {
  .templates-grid { grid-template-columns: 1fr; }
  .template-card.scratch { grid-column: span 1; flex-direction: column; align-items: flex-start; }
  .scratch .card-icon { margin-bottom: 16px; }
}
</style>
