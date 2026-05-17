# 🛠️ Log de Ações Técnicas - PLOC

Este arquivo registra todas as modificações, criações e refatorações realizadas (Fase 3 e Evolução).

---

## 🗓️ 16 de Maio, 2026

### 🟢 Criação: `config/design-tokens.json`
- **Motivo**: Centralizar o DNA visual do projeto (Cores e Arredondamentos).
- **Impacto**: Servirá de base para o Tailwind v4 e CSS Global.

### 🟢 Atualização: `config/design-tokens.json`
- **Motivo**: Adição de Breakpoints de Layout (Mobile, Tablet, Desktop).
- **Impacto**: Garante que a responsividade seja consistente em todo o sistema.

### 🔴 Remoção: `apps/web/app/` (várias)
- **Pastas**: `health/`, `kanban/`, `calendar/`, `dev-insights/`, `profile/`.
- **Motivo**: Eram placeholders sem funcionalidade real. Limpeza de árvore de arquivos para futura implementação modular.

### 🔴 Remoção: `apps/web/modules/dev-insights/`
- **Motivo**: Módulo vazio sem funcionalidades ou componentes.

### 🧹 Limpeza: `apps/web/components/layout/DockMenu.tsx`
- **Ação**: Removidos itens de navegação para `calendar`, `kanban` e `health`.
- **Motivo**: As rotas foram deletadas e os ícones causavam erro 404.

### 🔴 Remoção: `apps/web/public/` (Entulho)
- **Arquivos**: `next.svg`, `vercel.svg`, `window.svg`, `globe.svg`, `file.svg`, `dark-matter.png`.
- **Pastas**: `css/`.
- **Motivo**: Arquivos padrão de instalação sem uso e pastas órfãs.

### 📑 Documentação: `REFACTOR_TARGETS.md`
- **Ação**: Criado guia estratégico para a Fase 4 (Limpeza Profunda).
- **Conteúdo**: Plano de modularização para Home, Dashboard, Settings e Layout.

### 🟢 Instalação: Dependências UI (`apps/web`)
- **Pacotes**: `clsx`, `tailwind-merge`.
- **Motivo**: Suporte para o utilitário `cn` e gerenciamento de classes dinâmicas.

### 🟢 Criação: `apps/web/lib/utils.ts`
- **Motivo**: Implementação da função `cn` para evitar conflitos de CSS e limpar estilos inline.

### 🟢 Criação: `ACTION_LOG.md`
- **Motivo**: Rastreabilidade de mudanças para atualização do Knowledge System.

### 🧹 Refatoração e Alinhamento: `LandingClient.tsx` (Ciclo 4)
- **Ação**: Limpeza de estilos inline absolutos da orquestração do layout da tela, preparando-a para fluxos de flexbox responsivos no `HeroStage`.

### 🟢 Criação: `apps/web/modules/landing/components/BubblePhrases.tsx` (Ciclo 5)
- **Motivo**: Modularização total do sistema de frases motivacionais da landing.
- **Impacto**: Encapsula o ciclo de vida do cronômetro de 60 segundos e cria um efeito dinâmico ultra-premium de conceitos em bolhas translúcidas subindo por toda a tela com Framer Motion, desacoplando essa lógica da orquestração principal e do mascote.

### 🔴 Remoção: `apps/web/components/features/AuthModal.tsx` (Arquivo Zumbi)
- **Motivo**: Identificado como arquivo redundante obsoleto (já centralizado em `modules/auth/components/AuthModal.tsx`). Sua permanência causava erros de compilação.
- **Impacto**: Restaura a ordem e reduz a poluição de diretórios.

### 🔧 Correção de Tipos TS: `services/api.ts` e `app/settings/page.tsx`
- **Ação**: Resolvidos conflitos de tipos `string | null` vs `string | undefined` em chamadas de API passando fallbacks nativos (`|| undefined`).
- **Impacto**: Atingida compilação impecável com **Exit Code 0** (sucesso absoluto) no compilador de TypeScript.
