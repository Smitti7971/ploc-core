# 📒 Log de Limpeza Profunda - PLOC 🍮✨

Este arquivo documenta cada decisão tomada durante a Auditoria de Elite do projeto.

---

## 🗓️ 16 de Maio, 2026

### 📁 Pasta: `apps/web/.next`
- **Utilidade**: Cache e Build gerado pelo Next.js.
- **Em uso?**: Sim (Gerado automaticamente).
- **Atualizado?**: Sim (Se auto-atualiza).
- **Decisão**: **MANTER**. Ignorar na Fase 2.

### 📁 Pasta: `apps/web/app`
- **Utilidade**: Coração do roteamento e estrutura das páginas.
- **Em uso?**: Sim (Espinha dorsal do frontend).
- **Atualizado?**: Parcialmente (Estrutura OK, conteúdo precisa de limpeza).
- **Decisão**: **MANTER**. Seguir para limpeza profunda dos arquivos internos.

### 📁 Pasta: `archives/frontend_legacy`
- **Utilidade**: Versão antiga (SPA/PWA) pré-Next.js.
- **Em uso?**: Não.
- **Atualizado?**: Não (Arquitetura obsoleta).
- **Decisão**: **DELETADA** em 16/05/2026. 🗑️

### 📁 Pasta: `docs/`
- **Utilidade**: Documentação, arquitetura e planos de execução.
- **Em uso?**: Sim (Guia o desenvolvimento).
- **Atualizado?**: Sim (Contém o plano atual).
- **Decisão**: **MANTER**. 📑

### 📁 Pasta: `node_modules/`
- **Utilidade**: Dependências externas e bibliotecas.
- **Em uso?**: Sim (Vital para o funcionamento).
- **Atualizado?**: Gerenciado automaticamente pelo NPM.
- **Decisão**: **MANTER**. (Ignorar na Fase 2).

### 📁 Pasta: `scratch/`
- **Utilidade**: Scripts temporários e utilitários de imagem (Redimensionamento).
- **Em uso?**: Não (Uso manual apenas).
- **Atualizado?**: N/A (Scripts de apoio).
- **Decisão**: **AGUARDANDO DECISÃO**. 🛠️

### 📁 Pasta: `config/`
- **Utilidade**: Centralizar configurações compartilhadas (Cores, Constantes).
- **Em uso?**: Não (Atualmente apenas conceitual).
- **Atualizado?**: Sim (Aguardando implementação dos tokens).
- **Decisão**: **MANTER**. 🧠

### 🔴 Remoção: `apps/web/app/` (várias)
- **Pastas**: `health/`, `kanban/`, `calendar/`, `dev-insights/`, `profile/`.
- **Motivo**: Eram placeholders sem funcionalidade real. Limpeza de árvore de arquivos para futura implementação modular.
- **Decisão**: **DELETADAS** em 16/05/2026. 🗑️

### 🔴 Remoção: `apps/web/public/` (Entulho)
- **Arquivos**: `next.svg`, `vercel.svg`, `window.svg`, `globe.svg`, `file.svg`, `dark-matter.png`.
- **Pastas**: `css/`.
- **Motivo**: Arquivos padrão de instalação sem uso e pastas órfãs.

### 📁 Pasta: `apps/web/public/`
- **Utilidade**: Assets estáticos (Imagens, Ícones).
- **Em uso?**: Parcialmente (Imagens de rotinas em uso).
- **Atualizado?**: Sim.
- **Decisão**: **LIMPEZA PARCIAL CONCLUÍDA** em 16/05/2026. 🧹

### 📁 Módulo: `apps/web/modules/dev-insights/`
- **Utilidade**: Estrutura de pastas vazia.
- **Em uso?**: Não.
- **Atualizado?**: Não.
- **Decisão**: **DELETADO** em 16/05/2026. 🗑️

### 📁 Pasta: `apps/web/services/` e `store/`
- **Utilidade**: Infraestrutura técnica (API Client e Estado Global).
- **Em uso?**: Sim (Vital).
- **Atualizado?**: Parcialmente (Carregam lógica de compatibilidade com o legado).
- **Decisão**: **MANTER**. (Marcar para limpeza de compatibilidade na Fase 3). 🛠️

### 📁 Pasta: `apps/web/lib/`
- **Utilidade**: Configurações de ambiente e utilitários globais.
- **Em uso?**: Sim (Essencial para segurança e roteamento de API).
- **Atualizado?**: Sim.
- **Ação**: Criado `utils.ts` com a função `cn` em 16/05/2026. ✨
- **Decisão**: **MANTER**. ⚙️

### 📁 Pasta: `apps/web/types/`
- **Utilidade**: Tipagem global (Contratos de dados).
- **Em uso?**: Sim (Fundamental para a segurança do código).
- **Atualizado?**: Sim.
- **Decisão**: **MANTER**. 📑

### 📁 Pasta: `apps/web/components/`
- **Utilidade**: Componentes compartilhados e UI Global.
- **Em uso?**: Sim.
- **Estado**: **DÍVIDA TÉCNICA ALTA (CRÍTICO)**.
- **Problema**: O `AuthModal` existe em 3 versões (Inline, Módulo, Órfão).
- **Decisão**: **REFATORAÇÃO URGENTE**. Unificar no módulo de Auth. ⚠️🚨

### 📁 Pasta: `apps/web/components/layout/`
- **Utilidade**: Componentes de estrutura fixa (Header, Dock, Shell).
- **Em uso?**: Sim (Vital).
- **Estado**: **GORDUROSO E FANTASMA**.
- **Problema**: 
  - Estilos inline excessivos.
  - O `DockMenu` aponta para rotas deletadas (`calendar`, `kanban`, `health`).
  - Cores fixas ignorando o `design-tokens.json`.
- **Decisão**: **MANTER**. (Prioridade alta para limpeza de rotas e CSS na Fase 3). 🛠️👻

### 📄 Arquivo: `apps/web/app/layout.tsx` e `globals.css`
- **Utilidade**: Raiz do projeto e estilos globais básicos.
- **Em uso?**: Sim (DNA do projeto).
- **Estado**: **SAUDÁVEL**.
- **Ponto de Atenção**: O `AppShell` precisa ser movido para o `layout.tsx` para garantir consistência global.
- **Decisão**: **MANTER**. ✅

---

## 🗓️ 16 de Maio, 2026 - Auditoria Backend

### 📄 Arquivo: `apps/backend/prisma/schema.prisma`
- **Utilidade**: Definição do Banco de Dados (PostgreSQL).
- **Em uso?**: Sim (Vital).
- **Estado**: **BOM (Lógica)** / **INCONSISTENTE (IDs)**.
- **Observação**: 
  - Gamificação (Stats, XP, Coins) muito bem modelada.
  - Mistura de IDs UUID (User) e Autoincrement (Task/Routine).
- **Decisão**: **MANTER**. (Padronizar IDs para UUID no futuro). 💎

### 📁 Pasta: `apps/backend/ai/`
- **Utilidade**: Motores de Inteligência Artificial do Mascote.
- **Em uso?**: Sim (Diferencial do projeto).
- **Estado**: **MUITO COMPLEXO**.
- **Observação**: Arquitetura de agentes completa (Memória, Orquestrador). Risco de latência na UI se o processamento for síncrono.
- **Decisão**: **MANTER**. 🧠🚀

### 📁 Pasta: `apps/backend/infrastructure/` e `config/`
- **Utilidade**: Conexões externas e chaves de segurança.
- **Em uso?**: Sim (Config), Não (Infrastructure).
- **Estado**: **OVER-ENGINEERED**.
- **Decisão**: **LIMPAR INFRASTRUCTURE**. (Pasta vazia sem uso). 🗑️

### 📄 Scripts Raiz: `check_tables.sql`, `setup_minio.js`, `verify_prisma.js`
- **Utilidade**: Ferramentas de apoio e manutenção.
- **Estado**: **DESORGANIZADO**.
- **Decisão**: **MOVER PARA /scripts**. 🚚

---

## 🏁 Fim da Fase 1: Mapeamento de Terreno Concluído.
**Pronto para a Fase 2: Execução e Refatoração de Elite.** 🚀🍮
