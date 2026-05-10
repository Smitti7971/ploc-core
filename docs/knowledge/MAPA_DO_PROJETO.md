# MAPA DO PROJETO (PLOC) 🗺️

## Estado Atual da Infraestrutura (Coolify)

### 1. Serviço de Frontend (APP)
- **Base Directory**: `/apps/frontend`
- **Build Pack**: `Dockerfile` (Nginx:stable-alpine personalizado)
- **Arquitetura**: SPA (Single Page Application) servida via Nginx
- **Versão**: v0.0.9-FINAL (Blindagem 2.0, No-Cache Policy, Auto-Purge) ✅

### 2. Serviço de Backend (API)
- **Base Directory**: `/apps/backend`
- **Build Pack**: `Dockerfile` (Node:22-slim personalizado) ✅

### 3. Serviço de Banco de Dados (PostgreSQL)
- **Service Name**: `rmybu33898amwear4xe4qsbc`
- **Domínio Interno**: `rmybu33898amwear4xe4qsbc:5432`
- **ORM**: Prisma v6.19.3
- **POSTGRES_HOST**: `rmybu33898amwear4xe4qsbc`
- **POSTGRES_DB**: `postgres`
- **DATABASE_URL**: `postgresql://postgres:********************************@rmybu33898amwear4xe4qsbc:5432/postgres?schema=public`
- **Nota**: Manter Prisma v6 para estabilidade operacional.

### 4. Infraestrutura Local (Desenvolvimento)
- **DB**: PostgreSQL 16 (Docker Compose)
- **Hostname**: `localhost:5432`
- **Workflow**: Híbrido (Local Migrations -> Production Deploy) ✅


### ⚙️ Motor de Rotinas (Backend)
- **Status**: Backend Pronto (API Validada)
- **Funcionalidades**: Listagem, Criação, Check/Uncheck, Deleção.
- **Categorias**: Saúde, Finanças, Trabalho, Hábito, Leitura, Meditação, Estudo, Música.

### 🎨 Arquitetura Frontend (Modular & Feature-Based)
- **Design System v1**: Centralizado em `apps/frontend/css/app.css` (Única Fonte da Verdade). ✅
- **Feature-Based Architecture**: Organização por domínios em `apps/frontend/features/` (auth, chat, dashboard, reminders, settings, tasks). ✅
- **Shared Layer**: Componentes e utilitários globais em `apps/frontend/shared/` (api, components, config). ✅
- **Core App**: Ponto de entrada e roteamento em `apps/frontend/app/` (main.js, router.js). ✅
- **Zero Page Reload**: SPA com roteamento dinâmico e carregamento sob demanda. ✅

### 🧠 AI Layer (Cognitive Architecture)
- **Orchestrator**: `apps/backend/ai/orchestrator/AIOrchestrator.js` gerencia intenções e ferramentas. ✅
- **Granular Tools**: Sistema de ferramentas independentes em `apps/backend/ai/tools/` (create-task, list-tasks, etc.). ✅
- **Behaviors**: Gestão de prompts de comportamento em `apps/backend/ai/prompts/behaviors/`. ✅
- **Event-Driven**: Comunicação assíncrona via `apps/backend/events/EventEmitter.js`. ✅


### 📊 Estado de Saúde (Operacional - 2026-05-10) 🟢
- **Frontend**: ✅ ATIVO (v0.0.9-FINAL estável, cache neutralizado).
- **Backend**: ✅ ATIVO (CORS validado, Voz/TTS pública integrada).
- **Banco de Dados**: ✅ CONECTADO (Prisma v6 operando com PostgreSQL).
- **Segurança**: ✅ VALIDADA (JWT funcional, Mixed Content eliminado).

### 🧭 Central de Conhecimento (Knowledge)
- **Tecnologias**: [docs/knowledge/PILHA_TECNOLOGICA.md](PILHA_TECNOLOGICA.md)
- **Banco de Dados**: [docs/knowledge/MODELO_DE_DADOS.md](MODELO_DE_DADOS.md)
- **Saúde das APIs**: [docs/knowledge/ESTADO_DAS_APIS.md](ESTADO_DAS_APIS.md)
- **Ideias**: [docs/knowledge/IDEIAS_DE_IMPLANTACAO.md](IDEIAS_DE_IMPLANTACAO.md)

### 📋 Guias Mestres (Os 4 Pilares do Ploc) 🏛️
- **Pilar 1: Backend (Lógica)**: [docs/guides/MASTER_LOGICA_BACKEND.md](../guides/MASTER_LOGICA_BACKEND.md)
- **Pilar 2: Frontend (Visual)**: [docs/guides/MASTER_DESENVOLVIMENTO_VISUAL.md](../guides/MASTER_DESENVOLVIMENTO_VISUAL.md)
- **Pilar 3: Dados (Biblioteca)**: [docs/guides/MASTER_GESTAO_DE_DADOS.md](../guides/MASTER_GESTAO_DE_DADOS.md)
- **Pilar 4: Segurança (Cofre)**: [docs/guides/MASTER_SEGURANCA_CREDENCIAIS.md](../guides/MASTER_SEGURANCA_CREDENCIAIS.md)

## 🛡️ FONTE DA VERDADE (Credenciais & Infraestrutura)

| Componente | Chave | Valor / Referência |
| :--- | :--- | :--- |
| **VPS** | IP | `72.61.63.84` |
| **Coolify** | Dashboard | `smitti.j@gmail.com` |
| **Backend** | UUID | `leaocf7ke5lgluo0bg2dco0w` |
| **Frontend** | UUID | `a6n3eh22owgp057dd09t023a` |
| **Banco de Dados** | Internal Host | `rmybu33898amwear4xe4qsbc` |
| **Database URL** | Prisma URL | `postgresql://postgres:***@rmybu33898...:5432/postgres?schema=public` |
| **Segurança** | JWT_SECRET | `ploc_super_secret_key_2026_safe` |

> [!IMPORTANT]
> Este arquivo é a autoridade máxima. Em caso de divergência com o painel Coolify, os dados aqui contidos devem ser priorizados ou corrigidos imediatamente.

### 🧭 Guias Auxiliares e Estratégia
- **Planejamento Estratégico (Mapa de Guerra)**: [docs/guides/MASTER_PLANEJAMENTO_ESTRATEGICO.md](../guides/MASTER_PLANEJAMENTO_ESTRATEGICO.md)
- **Arquitetura & Estratégia (Método)**: [docs/guides/MASTER_ARQUITETURA_ESTRATEGIA.md](../guides/MASTER_ARQUITETURA_ESTRATEGIA.md)
- **Experiência Mobile (PWA)**: [docs/guides/MASTER_EXPERIENCIA_MOBILE_PWA.md](../guides/MASTER_EXPERIENCIA_MOBILE_PWA.md)
- **Operação & Testes (Checklist)**: [docs/guides/MASTER_OPERACOES_TESTES.md](../guides/MASTER_OPERACOES_TESTES.md)
- **Desenvolvimento Híbrido (ON/OFF)**: [docs/guides/MASTER_DESENVOLVIMENTO_HIBRIDO.md](../guides/MASTER_DESENVOLVIMENTO_HIBRIDO.md) ✅


## Repositório
- **Source**: `GitHub (Smitti7971/ploc-core.git)`
- **Branch**: `main`

## Regras de Governança (MANDATÓRIO) 🛡️
1. **O MAPA_DO_PROJETO.md deve ser atualizado IMEDIATAMENTE após qualquer mudança na infraestrutura (Coolify, Domínios, Banco de Dados).**
2. Nenhuma tarefa é encerrada sem a sincronização deste mapa.
3. Este mapa é a única fonte da verdade para o estado atual da rede.
