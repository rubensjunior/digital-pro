<template>
  <div class="dashboard-view">
    <div class="page-header">
      <div>
        <h1 class="page-title">Bem-vindo ao Painel 👋</h1>
        <p class="page-subtitle">Sua área exclusiva está sendo preparada. Em breve, novas funcionalidades estarão disponíveis aqui.</p>
      </div>
    </div>

    <!-- Placeholder Cards -->
    <div class="cards-grid">
      <div class="stat-card" v-for="card in placeholderCards" :key="card.label">
        <div class="stat-icon" :style="{ background: card.bg }">
          <component :is="'span'" v-html="card.icon" />
        </div>
        <div class="stat-info">
          <span class="stat-label">{{ card.label }}</span>
          <span class="stat-value">{{ card.value }}</span>
        </div>
      </div>
    </div>

    <!-- Coming soon banner -->
    <div class="coming-soon">
      <div class="coming-soon-glow"></div>
      <div class="coming-soon-inner">
        <div class="cs-badge">Em breve</div>
        <h2 class="cs-title">Área do cliente em construção</h2>
        <p class="cs-text">
          Estamos trabalhando para trazer a melhor experiência de gerenciamento para você.
          Esta área estará disponível em breve com todas as funcionalidades.
        </p>
        <div class="cs-features">
          <div class="cs-feature" v-for="f in features" :key="f">
            <svg class="cs-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ f }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const placeholderCards = [
  {
    label: 'Assinatura',
    value: 'Ativa',
    bg: 'linear-gradient(135deg,#22c55e22,#16a34a22)',
    icon: '<svg width="20" height="20" fill="none" stroke="#22c55e" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
  },
  {
    label: 'Plano',
    value: 'Digital PRO',
    bg: 'linear-gradient(135deg,#3b82f622,#6366f122)',
    icon: '<svg width="20" height="20" fill="none" stroke="#6366f1" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>',
  },
  {
    label: 'Suporte',
    value: 'Disponível',
    bg: 'linear-gradient(135deg,#f59e0b22,#d9770622)',
    icon: '<svg width="20" height="20" fill="none" stroke="#f59e0b" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
  },
];

const features = [
  'Gerenciamento da sua assinatura',
  'Histórico de pagamentos e faturas',
  'Configurações da conta',
  'Suporte direto com a equipe',
];
</script>

<style scoped>
.dashboard-view {
  /* Alinhado via .page-container no layout */
}

/* Header */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary, #0f172a);
  margin: 0 0 4px;
}

.page-subtitle {
  font-size: 14px;
  color: var(--text-secondary, #64748b);
  margin: 0;
}

/* Stat cards */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}

.stat-card {
  background: var(--surface, #fff);
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: box-shadow 0.2s, transform 0.2s;
}

.stat-card:hover {
  box-shadow: 0 8px 24px -4px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary, #64748b);
  font-weight: 500;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary, #0f172a);
}

/* Coming soon */
.coming-soon {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  padding: 2px;
}

.coming-soon-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(99,102,241,0.4), rgba(59,130,246,0.3), transparent 60%);
  border-radius: 20px;
  pointer-events: none;
}

.coming-soon-inner {
  background: linear-gradient(135deg, #0f172a, #1e293b);
  border-radius: 18px;
  padding: 40px 40px;
  position: relative;
  z-index: 1;
}

.cs-badge {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 999px;
  background: rgba(99,102,241,0.2);
  border: 1px solid rgba(99,102,241,0.35);
  color: #a5b4fc;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.cs-title {
  font-size: 22px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 10px;
}

.cs-text {
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.65;
  max-width: 520px;
  margin: 0 0 24px;
}

.cs-features {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cs-feature {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  color: #cbd5e1;
  font-weight: 500;
}

.cs-check {
  width: 16px;
  height: 16px;
  color: #34d399;
  flex-shrink: 0;
}
</style>
