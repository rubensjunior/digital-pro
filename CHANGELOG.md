# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

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
