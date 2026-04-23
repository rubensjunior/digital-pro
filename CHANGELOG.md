# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.2.3] - 2026-04-23

### Corrigido
- **Linting no IdeaManager**: Resolvidos erros de TypeScript relacionados a propriedades de estado e silenciados avisos de compatibilidade do `line-clamp` no Tailwind v4.
- **Configuração do Tailwind**: Ajustadas diretivas `@custom-variant` e `@theme` no `index.css` para conformidade com a versão mais recente do framework.

## [1.2.2] - 2026-04-23

### Adicionado
- **Sistema de Design Unificado**: Refatoração completa do `IdeaDetailDrawer.vue` para alinhar com o padrão `.dp-modal`.
- **Ações de Navegação**: Adicionados atalhos diretos para Kanban, Fluxograma e Rede Neural dentro do Drawer de ideias.
- **Melhorias de UI**: Botão "Nova Derivada" movido para linha principal e labels de histórico de dados tornados amigáveis ao usuário.

### Corrigido
- **Conflito de Z-Index**: Resolvido problema de sobreposição entre o Drawer lateral e os modais de edição.
- **Tags de Estilo**: Corrigidas tags malformadas e duplicadas no `WorkspaceSettingsModal` e `ConfirmModal`.

## [1.2.1] - 2026-04-23

### Alterado
- **Estratégia de Empacotamento**: Mudança de `asarUnpack` para `extraResources` para garantir que binários nativos do `better-sqlite3` sejam carregados de forma robusta em todos os ambientes.

## [1.2.0] - 2026-04-22

### Corrigido
- **Débito Técnico**: Limpeza de erros de linting no `src/main.ts`, incluindo a tipagem correta para o módulo `BetterSqlite3` e remoção de declarações `require` fora de padrão.

## [1.1.9] - 2026-04-22

### Alterado
- **Estabilização de Release**: Consolidação das correções de infraestrutura para o lançamento da série v1.1.x.

## [1.1.8] - 2026-04-22

### Corrigido
- **Carregamento de Módulos Nativos**: Implementada estratégia de carregamento multi-path para `better-sqlite3`, garantindo que o app encontre o banco de dados mesmo em caminhos de instalação não padronizados.

## [1.1.7] - 2026-04-22

### Corrigido
- **`better-sqlite3` não encontrado em produção** (`Cannot find module 'better-sqlite3'`): O módulo nativo não estava sendo desempacotado corretamente do ASAR. O `AutoUnpackNativesPlugin` não era suficiente sozinho. Corrigido com a diretiva `asar.unpack` + `asar.unpackDir` no `packagerConfig` do `forge.config.ts`, forçando o `better-sqlite3`, `bindings` e `node-gyp-build` a ficarem **fora** do ASAR e acessíveis ao processo Node principal.
- **DevTools aberto em produção**: O `mainWindow.webContents.openDevTools()` estava sendo chamado incondicionalmente, causando o aviso `Insecure Content-Security-Policy`. Agora restrito a `app.isPackaged === false`.
- **Variáveis de ambiente Supabase não garantidas no bundle**: Adicionado `loadEnv` + `define` no `vite.renderer.config.ts` para injetar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` diretamente no bundle de produção.

---

## [1.0.7] - 2026-04-22

### Corrigido
- **Loop Crítico no Onboarding**: Corrigido bug onde o onboarding era exibido em loop toda vez que o app era aberto, mesmo após o usuário já ter criado um workspace e preenchido seu perfil.
  - **Causa raiz**: O banco de dados SQLite local (`brainvault_{userId}.db`) nunca estava sendo inicializado antes da verificação de workspaces no fluxo de login. A função `workspaces.getAll()` retornava `[]` pois `db` era `undefined`, forçando o redirecionamento para o onboarding a cada abertura.
  - **Correção 1 (Login Manual)**: Adicionada chamada a `initDb(userId)` imediatamente após a validação do login e verificação do status da conta, antes de chamar `configurarNavegacaoAoSucesso()`.
  - **Correção 2 (Sessão Persistida)**: Adicionada lógica de `onMounted` no `Login.vue` para detectar sessões Supabase já ativas (tokens válidos em localStorage após reabertura do app). Quando detectada, o banco é inicializado e o usuário é redirecionado automaticamente para o dashboard sem precisar digitar credenciais novamente.

---

## [1.0.5] - 2026-04-22


### Resumo Geral
Esta versão consolida todas as funcionalidades principais do RKS Digital PRO, representando um marco estável e completo do produto. Abaixo um resumo do que está funcionando:

### Funcionalidades Disponíveis
- **Autenticação**: Login e registro de usuários via Supabase, com proteção de rotas e redirecionamento automático conforme status da conta.
- **Onboarding**: Fluxo de boas-vindas em dois passos — configuração de perfil pessoal e escolha de template de workspace.
- **Perfil de Usuário**: Apelido, profissão e foto de avatar com sincronização entre SQLite local e Supabase remoto.
- **Workspaces**: Criação, edição e exclusão de múltiplos workspaces; suporte a templates temáticos (Marketing, Software, SaaS, etc).
- **Ideias (Nodes)**: Cadastro completo de ideias com título, descrição, tipo, status, relacionamentos e tags.
- **Taxonomia Dinâmica**: Tipos, Status e Relacionamentos totalmente personalizáveis por workspace, com cores e ícones configuráveis.
- **Seletor de Cores Moderno**: Interface premium de seleção de cores com espectro visual, gradiente, controles HSL/HEX/RGB e posicionamento inteligente.
- **Aleatorização de Cores**: Botão "Shuffle" para geração matemática de cores HEX com alta variação e qualidade visual.
- **Visualizações**: Rede Neural, Fluxograma e Lista — todas consumindo taxonomia dinâmica do workspace ativo.
- **Encerramento de Conta**: Exclusão permanente da conta com limpeza de todos os dados locais e remotos.
- **Atualizações Automáticas**: Integração com `update-electron-app` para atualização silenciosa via GitHub Releases.
- **Banco de Dados Local**: SQLite via `better-sqlite3`, com proteções de inicialização e módulos nativos desempacotados corretamente no asar.



### Adicionado
- **Aleatorização de Cores**: Introduzido botão "Shuffle" nas configurações de taxonomia (Tipos, Status, Relacionamentos) para geração matemática de cores HEX, permitindo milhões de combinações.
- **Cores Iniciais Inteligentes**: Novos itens agora recebem uma cor premium aleatória por padrão ao serem criados.

### Corrigido
- **Contraste de Botões no Drawer**: Corrigida a visualização do botão de "Conectar Ideia" na aba de conexões, restaurando o contraste e o gradiente azul premium.
- **Variáveis CSS**: Corrigida a falta da variável `--accent-end` que causava falhas na renderização de botões primários no Drawer.

## [1.0.3] - 2026-04-20

### Corrigido
- **Sincronização de Cores**: Corrigido o problema onde as orbes e conexões na Rede Neural e Fluxograma não atualizavam após a mudança para taxonomia dinâmica por Workspace.
- **Visualização Dinâmica**: Refatoradas todas as visões de visualização para consumir o composable `useTaxonomy`, garantindo que cores de status e labels reflitam a configuração atual do Workspace.

## [1.0.2] - 2026-04-20

### Adicionado
- **Personalização de Perfil**: Implementado sistema de perfil com apelido, profissão e foto de avatar.
- **Sincronização de Perfil**: Integração automática entre o banco de dados SQLite local e o Supabase remoto para persistência do perfil.
- **Exclusão de Conta**: Funcionalidade para excluir permanentemente a conta no Supabase e limpar todos os dados locais.

### Alterado
- **Dashboard Personalizado**: O cabeçalho do Dashboard agora exibe o avatar e o apelido escolhidos pelo usuário.
- **Fluxo de Onboarding**: Adicionado passo inicial para configuração de perfil pessoal antes da escolha de templates.
- **Estabilidade do Banco de Dados**: Adicionadas proteções no processo principal (Electron) para evitar falhas se a interface tentar acessar o banco antes da inicialização completa.

### Corrigido
- **Erros de Tipagem no Dashboard**: Corrigido acesso incorreto a propriedades de Refs no `DashboardLayout.vue`.
- **Interação de Avatar**: Corrigida a abertura do diálogo de seleção de arquivo para foto de perfil.


## [1.0.1] - 2026-04-20

### Adicionado
- **Modelos de Workspace nas Configurações**: Agora é possível criar novos workspaces a partir de modelos (Marketing, Software, SaaS, etc) diretamente através do Modal de Configurações do Workspace.
- **Centralização de Templates**: Implementada biblioteca centralizada em `@/lib/templates.ts` para garantir consistência entre o Onboarding e as Configurações.
- **Suporte ao Composable useWorkspaces**: Adicionada função `setupTemplateWorkspace` para facilitar a criação de workspaces baseados em modelos por qualquer componente.

### Alterado
- **Renomeação de Workspace Padrão**: O nome padrão do workspace criado em branco foi alterado de "Meu Cofre de Ideias" para **"Workspace"** para uma abordagem mais profissional e limpa.
- **UI do Modal de Configurações**: Adicionada uma grade de seleção de modelos (templates) na aba de gerenciamento de workspaces.
- **Onboarding Flow**: Refatorado para consumir os modelos a partir da nova biblioteca compartilhada.

---
*Log gerado automaticamente pelo assistente de IA antigravity.*
