<template>
  <div class="manual-grid-layout">
    <div class="manual-grid-content">
      <!-- Coluna Principal: FLUXO DE TRABALHO -->
      <section class="manual-card-box workflow-card">
        <div class="section-header">
          <h2 class="section-title">Fluxo de Trabalho Estratégico</h2>
          <p class="section-desc">Siga o roteiro para transformar ideias em inteligência estratégica.</p>
        </div>

        <div class="workflow-grid-details">
          <div v-for="(step, index) in workflowSteps" :key="index" class="detailed-step-item" :style="{ '--step-color': step.color }">
            <div class="step-header">
              <div class="step-icon-circle" :style="{ backgroundColor: step.color + '15', color: step.color }">
                <div class="icon-inner" v-html="step.icon"></div>
              </div>
              <h3 class="step-name">{{ step.title }}</h3>
            </div>
            <div class="step-body">
              <p class="step-description">{{ step.description }}</p>
              <ul class="step-features">
                <li v-for="feature in step.features" :key="feature">{{ feature }}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Coluna Lateral -->
      <aside class="sidebar-column">
        <!-- Glossário com Carrossel -->
        <div class="manual-card-box glossary-card">
          <div class="section-header glossary-header">
            <h2 class="section-title">Glossário</h2>
            <div class="carousel-nav">
              <button @click="prevGlossary" class="nav-btn" :disabled="currentGlossaryIndex === 0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M15 19l-7-7 7-7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <button @click="nextGlossary" class="nav-btn" :disabled="currentGlossaryIndex >= glossaryItems.length - 2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 5l7 7-7 7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
          </div>

          <div class="glossary-carousel-viewport">
            <div class="glossary-items-wrapper">
              <div v-for="item in visibleGlossaryItems" :key="item.title" class="glossary-expanded-item" :style="{ '--color': item.color }">
                <div class="item-top">
                  <div class="mini-icon-box" v-html="item.icon"></div>
                  <strong>{{ item.title }}</strong>
                </div>
                <p class="item-desc-long">{{ item.description }}</p>
              </div>
            </div>
          </div>
          <div class="carousel-dots">
            <span v-for="i in Math.ceil(glossaryItems.length / 2)" :key="i" class="dot" :class="{ active: Math.floor(currentGlossaryIndex / 2) === i - 1 }"></span>
          </div>
        </div>

        <!-- Segurança (Destaque Máximo) -->
        <div class="manual-card-box security-highlight-card">
          <div class="section-header">
            <h2 class="section-title">Segurança de Dados</h2>
          </div>
          <div class="security-detailed-content">
            <div class="security-hero-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="security-info-group">
              <div class="sec-detail-item">
                <strong>Privacidade Radical (Offline-First)</strong>
                <p>Diferente de outras ferramentas, seus dados <strong>nunca</strong> saem do seu computador. O Brain Vault é um banco de dados local criptografado.</p>
              </div>
              <div class="sec-detail-item warning-item">
                <div class="warning-badge">IMPORTANTE</div>
                <strong>Cuidado com seu Patrimônio</strong>
                <p>Como o armazenamento é local, se o seu computador falhar, seus dados podem ser perdidos. Faça <strong>backups regulares</strong> exportando sua base.</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const currentGlossaryIndex = ref(0);

const workflowSteps = [
  {
    title: '1. Prepare seu Espaço',
    description: 'Tudo começa com a organização. O Workspace é a "casa" do seu projeto, onde você define sobre o que vai falar e quem quer atingir.',
    color: '#3b82f6',
    icon: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`,
    features: ['Escolha o tema do projeto', 'Defina seu público (Avatar)', 'Crie as regras de organização', 'Isole dados por projeto']
  },
  {
    title: '2. Colha suas Ideias',
    description: 'Não deixe nenhum insight escapar. A Captura é o ato de registrar termos e conceitos importantes conforme eles surgem.',
    color: '#10b981',
    icon: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>`,
    features: ['Dê um nome para a ideia', 'Classifique o que ela é', 'Marque a maturidade (Status)', 'Adicione notas rápidas']
  },
  {
    title: '3. Crie Profundidade',
    description: 'Uma ideia grande sempre tem partes menores. Use a Ramificação para detalhar e criar "filhos" para suas ideias principais.',
    color: '#8b5cf6',
    icon: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/></svg>`,
    features: ['Divida temas complexos', 'Crie sub-categorias lógicas', 'Organize em árvores', 'Evolução de conceitos']
  },
  {
    title: '4. Ligue os Pontos',
    description: 'A mágica acontece aqui. Conecte ideias de lugares diferentes para criar uma rede de conhecimento inteligente.',
    color: '#f59e0b',
    icon: `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"/></svg>`,
    features: ['Pontes inter-ecossistemas', 'Descubra relações ocultas', 'Enxergue o quadro completo', 'Gere insights inovadores']
  }
];

const glossaryItems = [
  { 
    title: 'Brain Vault', 
    color: '#6366f1', 
    description: 'O Coração do Digital PRO. Imagine um cofre digital onde cada fragmento da sua inteligência é guardado com segurança máxima. É onde toda a sua base reside.', 
    icon: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>` 
  },
  { 
    title: 'Tipos', 
    color: '#3b82f6', 
    description: 'A Identidade da Informação. Classifique se o registro é uma Persona, um Produto ou uma Estratégia. Isso ajuda a organizar seu pensamento de forma lógica.', 
    icon: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M7 7h10M7 12h10m-10 5h10"/></svg>` 
  },
  { 
    title: 'Status', 
    color: '#10b981', 
    description: 'O Ciclo de Vida da Ideia. Saiba se o conceito é apenas um rascunho rápido ou algo pronto para execução. Ajuda a priorizar o que realmente importa.', 
    icon: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>` 
  },
  { 
    title: 'Ecossistema', 
    color: '#8b5cf6', 
    description: 'O Jardim do Conhecimento. Uma ideia central e todas as suas ramificações. Agrupe assuntos relacionados para aprofundar temas sem perder o foco.', 
    icon: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>` 
  },
  { 
    title: 'Conexões', 
    color: '#f59e0b', 
    description: 'Pontes de Inteligência. Ligue ideias de ecossistemas diferentes. Isso cria uma teia orgânica, simulando como o cérebro humano realmente funciona.', 
    icon: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13.828 10.172a4 4 0 00-5.656 0"/></svg>` 
  },
  { 
    title: 'Rede Neural', 
    color: '#06b6d4', 
    description: 'O Mapa da Mente. Uma visão dinâmica onde as ideias flutuam e se conectam. Perfeito para descobrir padrões invisíveis em listas comuns.', 
    icon: `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4a8 8 0 100 16 8 8 0 000-16z"/></svg>` 
  }
];

const visibleGlossaryItems = computed(() => {
  return glossaryItems.slice(currentGlossaryIndex.value, currentGlossaryIndex.value + 2);
});

function nextGlossary() {
  if (currentGlossaryIndex.value < glossaryItems.length - 2) {
    currentGlossaryIndex.value += 2;
  }
}

function prevGlossary() {
  if (currentGlossaryIndex.value > 0) {
    currentGlossaryIndex.value -= 2;
  }
}
</script>

<style scoped>
.manual-grid-layout {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 10px 0 40px;
}

.manual-grid-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  align-items: flex-start;
}

.manual-card-box {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 4px 20px -12px rgba(0,0,0,0.05);
}

.section-header { margin-bottom: 24px; }
.section-title { font-size: 19px; font-weight: 800; color: var(--text-primary); margin: 0 0 6px; }
.section-desc { font-size: 13px; color: var(--text-secondary); }

/* Workflow */
.workflow-grid-details {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

.detailed-step-item {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border-radius: 20px;
  background: rgba(var(--step-color-rgb, 148, 163, 184), 0.02);
  border: 1px solid var(--border);
  transition: all 0.3s ease;
}

.detailed-step-item:hover {
  border-color: var(--step-color);
  background: var(--surface);
  transform: translateY(-4px);
}

.step-header { display: flex; align-items: center; gap: 12px; }
.step-icon-circle { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.step-name { font-size: 15px; font-weight: 700; color: var(--text-primary); margin: 0; }
.step-description { font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin: 0; }
.step-features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
.step-features li { font-size: 11.5px; color: var(--text-primary); position: relative; padding-left: 14px; }
.step-features li::before { content: ''; position: absolute; left: 0; top: 6px; width: 5px; height: 5px; border-radius: 50%; background: var(--step-color); opacity: 0.6; }

/* Glossary Carousel */
.glossary-header { display: flex; justify-content: space-between; align-items: center; }
.carousel-nav { display: flex; gap: 8px; }
.nav-btn {
  width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border);
  background: var(--surface); color: var(--text-primary); cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all 0.2s;
}
.nav-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
.nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.nav-btn svg { width: 16px; height: 16px; }

.glossary-carousel-viewport { overflow: hidden; min-height: 220px; }
.glossary-items-wrapper { display: flex; flex-direction: column; gap: 16px; }

.glossary-expanded-item {
  padding: 20px;
  background: rgba(148, 163, 184, 0.03);
  border: 1px solid var(--border);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-top { display: flex; align-items: center; gap: 12px; }
.mini-icon-box { width: 32px; height: 32px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--color); }
.item-top strong { font-size: 14px; color: var(--text-primary); }
.item-desc-long { font-size: 12.5px; color: var(--text-secondary); line-height: 1.5; margin: 0; }

.carousel-dots { display: flex; justify-content: center; gap: 6px; margin-top: 16px; }
.dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border); transition: all 0.3s; }
.dot.active { width: 18px; background: var(--accent); border-radius: 10px; }

/* Security Highlight */
.security-highlight-card {
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
  border: none;
  color: white;
}

.security-highlight-card .section-title { color: white; }

.security-hero-icon {
  width: 56px; height: 56px; background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 16px; color: #10b981;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 24px;
}

.security-hero-icon svg { width: 32px; height: 32px; }

.security-info-group { display: flex; flex-direction: column; gap: 24px; }

.sec-detail-item strong { display: block; font-size: 14px; color: #fff; margin-bottom: 6px; }
.sec-detail-item p { font-size: 12.5px; color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0; }

.warning-item {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  padding: 16px;
  border-radius: 12px;
}

.warning-badge {
  display: inline-block;
  padding: 2px 8px;
  background: #f59e0b;
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  border-radius: 4px;
  margin-bottom: 8px;
}

@media (max-width: 1100px) {
  .manual-grid-content { grid-template-columns: 1fr; }
}
</style>
