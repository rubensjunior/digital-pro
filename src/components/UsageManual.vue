<template>
  <div class="wiki-base-container">
    <div class="wiki-layout-grid">
      <!-- Sidebar / Sumário -->
      <aside class="wiki-sidebar">
        <h3 class="sidebar-title">Sumário</h3>
        <nav class="wiki-nav-menu">
          <button 
            v-for="tab in tabs" 
            :key="tab.id" 
            @click="activeTab = tab.id"
            :class="['wiki-nav-btn', { active: activeTab === tab.id }]"
          >
            <span class="nav-icon" v-html="tab.icon"></span>
            {{ tab.label }}
          </button>
        </nav>
      </aside>

      <!-- Main Content / Viewport -->
      <main class="wiki-content-area">
        
        <!-- Tab 1: Filosofia -->
        <div v-if="activeTab === 'intro'" class="wiki-pane fade-in">
          <h2 class="wiki-h2">1. A Filosofia: O seu "Segundo Cérebro"</h2>
          <p class="wiki-p">
            A maioria das ferramentas de produtividade falha por um motivo simples: elas forçam você a listar tarefas em uma única dimensão plana. O Digital PRO nasceu de uma filosofia diferente. Ele atua como um verdadeiro <strong>Segundo Cérebro</strong> para você e sua equipe.
          </p>
          <p class="wiki-p">
            Nós acreditamos que ecossistemas grandiosos — como lançar uma nova marca ou implantar um grande E-commerce — não podem ser traduzidos em simples "checklists". Eles precisam de um ambiente tridimensional, onde as informações convergem, se correlacionam e evoluem sem poluição visual.
          </p>
          <div class="wiki-alert info-alert">
            <strong>Dica de Ouro:</strong> No Digital PRO, esqueça os nomes "projetos", "tarefas" ou "pastas". Aqui, <b>absolutamente tudo é uma "Ideia"</b>. O E-commerce inteiro é uma Ideia. A fase de contratação é uma Ideia. A tarefa de recortar o fundo de uma foto é uma Ideia. O que muda é apenas o nível de profundidade em que elas se encontram.
          </div>
        </div>

        <!-- Tab 2: Árvores -->
        <div v-if="activeTab === 'hierarchy'" class="wiki-pane fade-in">
          <h2 class="wiki-h2">2. Hierarquia Infinita (Árvores)</h2>
          <p class="wiki-p">
            Em vez de uma tela bagunçada com centenas de cards, você organiza a informação criando um modelo mental de <strong>Pais, Filhos e Netos</strong>. Você começa no macro e vai quebrando o problema até chegar no micro, em camadas infinitas.
          </p>
          <p class="wiki-p">
            Na prática: Você cria a Ideia Pai no painel. Depois, você "entra" nela (com um clique simples) e cria suas Ideias Filhas. Você entra nas filhas, e cria os Netos. É assim que o escopo colossal de um E-commerce se torna extremamente gerenciável.
          </p>
          
          <div class="wiki-example-box">
            <h4 class="example-title">📦 O E-commerce Desdobrado</h4>
            <p class="wiki-p-sm">Veja como a implantação é quebrada estruturalmente. Cada nível para baixo é um "mergulho" (clique) a mais que você dá na interface:</p>
            <ul class="tree-view-list">
              <li><span class="tag tag-root">Projeto Raiz Pai</span> <strong>Implantação Nova Marca: AtletaPro Fitness</strong>
                <ul>
                  <li><span class="tag tag-phase">Fase 1 (Filho)</span> <strong>Infraestrutura e Tecnologia</strong>
                    <ul>
                      <li><span class="tag tag-task">Tarefa (Neto)</span> Setup Inicial da Loja (Shopify)
                        <ul>
                          <li><span class="tag tag-subtask">Subtarefa (Bisneto)</span> Integração de Gateway (Mercado Pago)</li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li><span class="tag tag-phase">Fase 2 (Filho)</span> <strong>Catálogo e Design</strong>
                    <ul>
                      <li><span class="tag tag-task">Tarefa (Neto)</span> Sessão de Fotos (Shooting de Verão)</li>
                      <li><span class="tag tag-task">Tarefa (Neto)</span> Cadastro de 50 SKUs Iniciais</li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <!-- Tab 3: Taxonomia -->
        <div v-if="activeTab === 'types'" class="wiki-pane fade-in">
          <h2 class="wiki-h2">3. Taxonomia e Identidade (Tipos)</h2>
          <p class="wiki-p">
            O cérebro humano processa cores e formas 60.000 vezes mais rápido que textos. Por isso, no Digital PRO nós abolimos a necessidade de você ler card por card para entender do que se trata.
          </p>
          <p class="wiki-p">
            Ao criar uma Ideia, você atribui um <strong>Tipo</strong> a ela. O Tipo encapsula uma cor vibrante e um ícone representativo. Isso transforma o seu painel em um mapa de calor visual onde o "contexto" da tarefa é transmitido de forma instantânea.
          </p>
          <div class="wiki-example-box">
            <h4 class="example-title">🎨 A Identidade do E-commerce</h4>
            <p class="wiki-p-sm">Durante a implantação, você classificará as tarefas da seguinte forma:</p>
            <ul class="wiki-bullet-list">
              <li>A etapa de "Integração de Gateway" e "Setup de Domínio" recebem o tipo <b>⚙️ Tecnologia (Cinza Escuro)</b>. A equipe de TI bate o olho e já sabe que aquilo é de responsabilidade deles.</li>
              <li>A tarefa "Cadastro de SKUs" e "Descrição Técnica" recebem o tipo <b>📦 Catálogo (Verde)</b>.</li>
              <li>As "Campanhas de Lançamento" e "Copywriter" recebem o tipo <b>📺 Marketing (Roxo)</b>.</li>
            </ul>
          </div>
        </div>

        <!-- Tab 4: Kanban -->
        <div v-if="activeTab === 'kanban'" class="wiki-pane fade-in">
          <h2 class="wiki-h2">4. Controle Pelo Kanban (Status)</h2>
          <p class="wiki-p">
            A vida de um projeto não é estática. Ele respira e flui. O Status (apresentado no formato clássico de Kanban) ajuda você e sua equipe a arrastarem fisicamente as Ideias pelo pipeline de execução.
          </p>
          <p class="wiki-p">
            Diferente de sistemas rígidos, você tem a liberdade de ajustar suas colunas de acordo com o ritmo do seu negócio, controlando desde a etapa da idealização até a glória da entrega final.
          </p>
          <div class="wiki-example-box">
            <h4 class="example-title">📈 O Fluxo da Implantação</h4>
            <p class="wiki-p-sm">No nosso template de E-commerce, o ciclo de vida funciona assim:</p>
            <p class="wiki-p-sm">As necessidades nascem na coluna de <strong>Planejamento / Briefing</strong>. Quando você terceiriza algo (como um fotógrafo), a Ideia é movida para <strong>Aguardando Ativos</strong>. Assim que o material chega, o card vai para <strong>Em Configuração / Setup</strong>. Antes da loja ir pro ar, os testes ocorrem na coluna de <strong>Homologação (QA)</strong> e, quando o dinheiro já pode cair na conta, a Ideia repousa eternamente em <strong>Publicado / Integrado</strong>.</p>
          </div>
        </div>

        <!-- Tab 5: Correlações -->
        <div v-if="activeTab === 'correlations'" class="wiki-pane fade-in">
          <h2 class="wiki-h2">5. A Mágica das Correlações</h2>
          <p class="wiki-p">
            O seu negócio real não acontece em caixas isoladas. O time de design sofre quando o time de copywriter atrasa os textos. O Digital PRO resolve a cegueira de dependências corporativas usando <strong>Correlações Lógicas</strong>.
          </p>
          <p class="wiki-p">
            Acessando os detalhes de uma Ideia, você pode interligá-la a outra, informando ao sistema a natureza emocional ou logística dessa união. O sistema alertará automaticamente sobre os impactos de atrasos ou exclusões.
          </p>
          <div class="wiki-example-box border-warning">
            <h4 class="example-title">⚠️ Identificando Gargalos Antes de Explodirem</h4>
            <ul class="wiki-bullet-list">
              <li>A <b>"Sessão de Fotos"</b> recebe a correlação <span class="badge-red">Bloqueia</span> o <b>"Cadastro de 50 SKUs"</b>. É logicamente impossível cadastrar um produto sem a foto do mesmo prontas.</li>
              <li>A <b>"Integração do Gateway"</b> recebe a correlação <span class="badge-purple">Depende de</span> o cálculo de frete estar devidamente testado na plataforma, prevenindo que o cliente compre sem poder receber.</li>
            </ul>
          </div>
        </div>

        <!-- Tab 6: Foco Vertical -->
        <div v-if="activeTab === 'focus'" class="wiki-pane fade-in">
          <h2 class="wiki-h2">6. Foco Vertical (O Poder da Visão Limpa)</h2>
          <p class="wiki-p">
            O grande colapso das ferramentas tradicionais é o ruído. Quando a Implantação do seu E-commerce tiver mais de 200 tarefas mapeadas, olhar para o quadro principal causará ansiedade. É aqui que entra o nosso conceito de <strong>Foco Vertical</strong>.
          </p>
          <p class="wiki-p">
            Você não precisa ver a árvore inteira o tempo todo. Você pode clicar no título de qualquer "Fase" ou "Subfase" e o sistema dará um "zoom in" imediato.
          </p>
          <div class="wiki-alert info-alert">
            <strong>Modo Túnel:</strong> Ao focar na <em>"Fase 2: Catálogo"</em>, todo o ecossistema de TI, Marketing e Infraestrutura desaparecem da sua tela. O painel se reinicia exibindo unica e exclusivamente as tarefas da equipe de design. Reduza a poluição visual, acabe com as distrações e execute a sua próxima ação com extrema clareza mental.
          </div>
        </div>

        <!-- Tab 7: Glossário -->
        <div v-if="activeTab === 'glossary'" class="wiki-pane fade-in">
          <h2 class="wiki-h2">Glossário Rápido da Interface</h2>
          <div class="glossary-grid">
            <div class="glossary-card">
              <div class="gl-card-header text-indigo-500">
                <span v-html="tabs.find(t=>t.id==='glossary')?.icon"></span>
                <strong>Workspace</strong>
              </div>
              <p>Sua "Área de Trabalho". Contêiner onde um ecossistema vive sob as mesmas regras visuais.</p>
            </div>
            <div class="glossary-card">
              <div class="gl-card-header text-emerald-500">
                <span v-html="tabs.find(t=>t.id==='hierarchy')?.icon"></span>
                <strong>Ideia</strong>
              </div>
              <p>A unidade básica. Tudo no sistema é uma Ideia (projetos, tarefas, notas, etc).</p>
            </div>
            <div class="glossary-card">
              <div class="gl-card-header text-blue-500">
                <span v-html="tabs.find(t=>t.id==='types')?.icon"></span>
                <strong>Tipo</strong>
              </div>
              <p>Categoria visual (ícone/cor) que dá identidade a uma Ideia para leitura imediata.</p>
            </div>
            <div class="glossary-card">
              <div class="gl-card-header text-purple-500">
                <span v-html="tabs.find(t=>t.id==='kanban')?.icon"></span>
                <strong>Status (Kanban)</strong>
              </div>
              <p>Mostra em qual etapa do funil a Ideia está aguardando ou operando.</p>
            </div>
            <div class="glossary-card">
              <div class="gl-card-header text-amber-500">
                <span v-html="tabs.find(t=>t.id==='correlations')?.icon"></span>
                <strong>Relacionamentos</strong>
              </div>
              <p>O que conecta duas Ideias. Ajuda a prever quem bloqueia ou acelera quem.</p>
            </div>
          </div>
        </div>

        <!-- Tab 8: Segurança -->
        <div v-if="activeTab === 'security'" class="wiki-pane fade-in">
          <div class="security-banner">
            <div class="sec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></div>
            <h3 class="sec-title">Privacidade Offline-First</h3>
            <p class="sec-p">Diferente de sistemas web comuns, sua Base de Ideias é um banco criptografado local.<br/><strong>Os dados nunca saem do seu computador.</strong></p>
          </div>
          <div class="wiki-alert warning-alert mt-6">
            <strong>⚠️ Atenção a Backups:</strong> Se o seu computador estragar, não temos cópias na nuvem. Nós garantimos a privacidade não monitorando nada. Em contrapartida, você precisa lembrar de acessar as configurações e exportar a sua base frequentemente.
          </div>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('intro');

const tabs = [
  { id: 'intro', label: '1. A Filosofia e Conceitos', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  { id: 'hierarchy', label: '2. Hierarquia (Árvores)', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  { id: 'types', label: '3. Taxonomia (Tipos)', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7h10M7 12h10m-10 5h10" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  { id: 'kanban', label: '4. Controle por Status', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  { id: 'correlations', label: '5. Mágica das Correlações', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  { id: 'focus', label: '6. O Foco Vertical', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  { id: 'glossary', label: 'Glossário da Interface', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  { id: 'security', label: 'Segurança de Dados', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
];
</script>

<style scoped>
.wiki-base-container {
  padding: 10px 0 60px;
  max-width: 1600px;
  margin: 0 auto;
}

/* Grid Layout */
.wiki-layout-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
  align-items: start;
}

/* Sidebar Menu */
.wiki-sidebar {
  position: sticky;
  top: 24px;
  display: flex;
  flex-direction: column;
}

.sidebar-title {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 800;
  color: var(--text-secondary);
  margin: 0 0 16px 12px;
}

.wiki-nav-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.wiki-nav-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-radius: 12px;
  color: var(--text-secondary);
  font-size: 14.5px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.wiki-nav-btn:hover {
  background: rgba(148, 163, 184, 0.05);
  color: var(--text-primary);
}

.wiki-nav-btn.active {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--accent);
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

.nav-icon { display: flex; align-items: center; justify-content: center; }
.nav-icon svg { width: 18px; height: 18px; }
.wiki-nav-btn.active .nav-icon { color: var(--accent); }

/* Main Area */
.wiki-content-area {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 40px 48px;
  min-height: 500px; /* Evita que a tela pule bruscamente */
  box-shadow: 0 4px 20px -12px rgba(0,0,0,0.04);
}

/* Animations & Panes */
.fade-in { animation: fadeIn 0.3s ease forwards; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Text Content Formats */
.wiki-h2 { font-size: 22px; font-weight: 800; color: var(--text-primary); margin: 0 0 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
.wiki-p { font-size: 15.5px; line-height: 1.75; color: var(--text-secondary); margin: 0 0 24px; }
.wiki-p-sm { font-size: 14.5px; color: var(--text-secondary); margin: 0 0 16px; }

/* Alerts */
.wiki-alert { padding: 18px 24px; border-radius: 16px; font-size: 14.5px; line-height: 1.6; }
.info-alert { background: rgba(59, 130, 246, 0.08); border-left: 4px solid #3b82f6; color: var(--text-primary); }
.warning-alert { background: rgba(245, 158, 11, 0.08); border-left: 4px solid #f59e0b; color: var(--text-primary); }
.mt-6 { margin-top: 24px; }

/* Exemplo Box */
.wiki-example-box {
  background: rgba(148, 163, 184, 0.03);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 28px;
  margin-top: 24px;
}
.border-warning { border-left: 4px solid #f59e0b; }
.example-title { font-size: 16px; font-weight: 700; color: var(--text-primary); margin: 0 0 16px; display: flex; align-items: center; gap: 8px; }

/* Bullet list (Taxonomia / Correlação) */
.wiki-bullet-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
.wiki-bullet-list li { font-size: 14.5px; color: var(--text-primary); line-height: 1.6; position: relative; padding-left: 20px; }
.wiki-bullet-list li::before { content: ''; position: absolute; left: 0; top: 8px; width: 6px; height: 6px; border-radius: 50%; background: var(--text-secondary); opacity: 0.5; }

/* Tree List */
.tree-view-list { list-style: none; padding: 0; margin: 0; }
.tree-view-list ul { list-style: none; padding-left: 32px; margin-top: 12px; border-left: 1px solid var(--border); position: relative; }
.tree-view-list li { margin-bottom: 16px; position: relative; font-size: 14.5px; color: var(--text-primary); line-height: 1.6; display: block; }
.tree-view-list li::before { content: ''; position: absolute; left: -32px; top: 12px; width: 24px; height: 1px; background: var(--border); }
.tree-view-list > li::before { display: none; }

.tag { display: inline-block; padding: 2px 8px; color: white; border-radius: 6px; font-size: 11px; font-weight: 700; margin-right: 8px; margin-bottom: 4px; vertical-align: middle; }
.tag-root { background: #8b5cf6; }
.tag-phase { background: #3b82f6; }
.tag-task { background: #10b981; }
.tag-subtask { background: #f59e0b; }

.badge-red { background: rgba(239, 68, 68, 0.15); color: #ef4444; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; }
.badge-purple { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; }

/* Glossário Grid */
.glossary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
.glossary-card {
  background: rgba(148, 163, 184, 0.02);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
}
.gl-card-header { display: flex; align-items: center; gap: 10px; font-size: 15px; margin-bottom: 12px; }
.gl-card-header svg { width: 20px; height: 20px; }
.glossary-card p { font-size: 13.5px; color: var(--text-secondary); line-height: 1.6; margin: 0; }

/* Security Tab */
.security-banner {
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
  border-radius: 20px;
  padding: 40px;
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.sec-icon { width: 64px; height: 64px; background: rgba(255,255,255,0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #10b981; margin-bottom: 24px; }
.sec-icon svg { width: 32px; height: 32px; }
.sec-title { font-size: 22px; font-weight: 800; margin: 0 0 16px; }
.sec-p { font-size: 15px; line-height: 1.6; color: rgba(255,255,255,0.8); margin: 0; }

@media (max-width: 900px) {
  .wiki-layout-grid { grid-template-columns: 1fr; }
  .wiki-sidebar { position: relative; top: 0; }
  .wiki-nav-menu { flex-direction: row; flex-wrap: wrap; }
}
</style>
