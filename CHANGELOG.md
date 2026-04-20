# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.0.4] - 2026-04-20

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
