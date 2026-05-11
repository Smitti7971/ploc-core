# MAPA DO PROJETO (PLOC) 🗺️

## Estado Atual da Infraestrutura (Produção)

### 1. Serviço de Frontend (APP)
- **URL Pública**: `https://ploc.midializando.cloud` ✅ (validado via Coolify API)
- **Base Directory**: `/` (Configurado no Coolify) ✅ (validado via Coolify API)
- **Build Pack**: `Dockerfile` (Nginx:stable-alpine personalizado) ✅ (validado no levantamento)
- **Arquitetura**: SPA (Single Page Application) servida via Nginx ✅ (validado no levantamento)
- **Versão**: v0.0.9 ✅ (validado pelo usuário)

### 2. Serviço de Backend (API)
- **URL Pública**: `https://backend.midializando.cloud` ✅ (validado via Coolify API)
- **Base Directory**: `/apps/backend` ✅ (validado no levantamento)
- **Build Pack**: `Dockerfile` (Node:22-slim personalizado) ✅ (validado no levantamento: Dockerfile encontrado)

### 3. Serviço de Banco de Dados (PostgreSQL)
- **Service Name**: `rmybu33898amwear4xe4qsbc` ✅ (validado via Coolify API) 
- **Domínio Interno**: `rmybu33898amwear4xe4qsbc:5432` ✅ (validado via Coolify API)
- **Imagem**: `postgres:18-alpine` ✅ (validado via Coolify API)
- **ORM**: Prisma v6.4.1 ✅ (validado no levantamento: package.json do backend)
- **POSTGRES_HOST**: `rmybu33898amwear4xe4qsbc` ✅ (validado via Coolify API)
- **POSTGRES_DB**: `postgres` ✅ (validado via Coolify API)
- **DATABASE_URL**: `postgresql://postgres:********************************@rmybu33898amwear4xe4qsbc:5432/postgres?schema=public` ✅ (validado via Coolify API) 
- **Nota**: Manter Prisma v6 para estabilidade operacional. ✅ (validado no levantamento: Prisma v6.4.1 instalado)

### 4. Serviço de Armazenamento de Imagens (MinIO / S3 Compatible)
- **Status**: Ativo (Autohospedado via Docker) ✅ (validado via Coolify API) 
- **Endpoint**: `http://72.61.63.84:9000` ✅ (validado via Coolify API)
- **Bucket Principal**: `ploc-assets` ✅ (validado no levantamento: apps/backend/.env e setup_minio.js)
- **Função**: Armazenamento em nuvem de mídia (Fotos de Plantas, Avatares, Recibos) ✅ (validado no levantamento: identificada dependência `@aws-sdk/client-s3`)

### 5. Infraestrutura Local (Desenvolvimento)
- **DB**: PostgreSQL 16 (via Docker Compose) ✅ (validado no levantamento: docker-compose.yml encontrado)
- **Container**: `ploc-db-local` (Obrigatório estar ATIVO para rodar `prisma migrate dev`) ✅ (validado no levantamento: nome do container no compose)
- **Credenciais Locais**: User: `devuser` | Pass: `devpassword` | DB: `ploc_dev` ✅ (validado no levantamento: variáveis no docker-compose.yml)
- **Hostname**: `localhost:5432` ✅ (validado no levantamento: mapeamento de porta no compose)
- **Workflow**: Híbrido (Local Migrations -> Production Deploy) ✅ (validado no levantamento: scripts de migração encontrados)


### ⚙️ Motor de Rotinas (Backend)
- **Status**: Backend Pronto (API Validada) ✅ (validado pelo usuário)
- **Funcionalidades**: Listagem, Criação, Check/Uncheck, Deleção. ✅ (validado no levantamento: estruturas de controllers e rotas encontradas)
- **Categorias**: Saúde, Finanças, Trabalho, Hábito, Leitura, Meditação, Estudo, Música. ✅ (validado no levantamento: campo `category` no schema.prisma)

### 🎨 Arquitetura Frontend (Modular & Feature-Based)
- **Landing Page (SUPREMA)**: Ponto de entrada, casa do Ploc, centro de interação primária e onde será centralizado as funcionalidades do projeto. ✅ (validado no levantamento: arquivo `features/auth/LandingPage.js` encontrado)
- **Dashboard (Carrossel Expansivo)**: Navegação horizontal via scroll-snap com 6 slides operacionais (Finanças, Laboratório, Treino, Saúde, Dieta, Plantas).  ✅ (validado pelo usuário)
- **Design System v1**: Centralizado em `apps/frontend/css/app.css` (Única Fonte da Verdade). ✅ (validado no levantamento: diretório `css/` encontrado)
- **Feature-Based Architecture**: Organização por domínios em `apps/frontend/features/` (auth, calendar, chat, dashboard, routines, settings, tasks). ✅ (validado pelo usuário)
- **Shared Layer**: Componentes e utilitários globais em `apps/assets/components` ✅ (validado pelo usuário) |
- **Core App**: Ponto de entrada e roteamento em `apps/frontend/app/` (main.js, router.js). ✅ (validado no levantamento)
- **Zero Page Reload**: SPA with dynamic routing and on-demand loading. ✅ (validado no levantamento: estrutura SPA detectada)

### 🧠 AI Layer (Cognitive Architecture)
- **Orchestrator**: `apps/backend/ai/orchestrator/AIOrchestrator.js` gerencia intenções e ferramentas. ✅ (validado no levantamento: diretório `ai/` encontrado)
- **Granular Tools**: Sistema de ferramentas independentes em `apps/backend/ai/tools/` (create-task, list-tasks, etc.). ✅ (validado no levantamento)
- **Behaviors**: Gestão de prompts de comportamento em `apps/backend/ai/prompts/behaviors/`. ✅ (validado no levantamento)
- **Event-Driven**: Comunicação assíncrona via `apps/backend/events/EventEmitter.js`. ✅ (validado no levantamento: diretório `events/` encontrado)


### 📊 Estado de Saúde (Operacional - 2026-05-11) 🟢
- **Frontend**: ✅ ATIVO (v0.0.9-FINAL estável no ar, v0.1.3-CLEAN pendente). ✅ (validado via Coolify API: status `running`)
- **Backend**: ✅ ATIVO (CORS validado, Voz/TTS pública integrada). ✅ (validado via Coolify API: status `running`)
- **Banco de Dados**: ✅ CONECTADO (Prisma v6 operando com PostgreSQL). ✅ (validado via Coolify API: status `healthy`)
- **Segurança**: ✅ VALIDADA (JWT funcional, Mixed Content eliminado). ✅ (validado no levantamento: middlewares e dependências de segurança encontrados)

### 🧭 Central de Conhecimento (Knowledge)
- **Tecnologias**: [docs/knowledge/PILHA_TECNOLOGICA.md](PILHA_TECNOLOGICA.md) ✅ (validado no levantamento: diretório `docs/` encontrado)
- **Banco de Dados**: [docs/knowledge/MODELO_DE_DADOS.md](MODELO_DE_DADOS.md) ✅ (validado no levantamento)
- **Saúde das APIs**: [docs/knowledge/ESTADO_DAS_APIS.md](ESTADO_DAS_APIS.md) ✅ (validado no levantamento)
- **Ideias**: [docs/knowledge/IDEIAS_DE_IMPLANTACAO.md](IDEIAS_DE_IMPLANTACAO.md) ✅ (validado no levantamento)

### 📋 Guias Mestres (Os 4 Pilares do Ploc) 🏛️
- **Pilar 1: Backend (Lógica)**: [docs/guides/MASTER_LOGICA_BACKEND.md](../guides/MASTER_LOGICA_BACKEND.md) ✅ (validado no levantamento)
- **Pilar 2: Frontend (Visual)**: [docs/guides/MASTER_DESENVOLVIMENTO_VISUAL.md](../guides/MASTER_DESENVOLVIMENTO_VISUAL.md) ✅ (validado no levantamento)
- **Pilar 3: Dados (Biblioteca)**: [docs/guides/MASTER_GESTAO_DE_DADOS.md](../guides/MASTER_GESTAO_DE_DADOS.md) ✅ (validado no levantamento)
- **Pilar 4: Segurança (Cofre)**: [docs/guides/MASTER_SEGURANCA_CREDENCIAIS.md](../guides/MASTER_SEGURANCA_CREDENCIAIS.md) ✅ (validado no levantamento)

## 🛡️ FONTE DA VERDADE (Credenciais & Infraestrutura)

| Componente | Chave | Valor / Referência | Status de Validação |
| :--- | :--- | :--- | :--- |
| **VPS (SSH)** | IP / Porta | `72.61.63.84:22` | ✅ (validado via Coolify API: IP host)
| **VPS (SSH)** | Usuário / Senha | `root` / `j;KOKT0v??C-OyjZ3bV)` | ✅ (validado pelo usuário) |
| **Coolify** | Login / Senha | `smitti.j@gmail.com` / `Ogpzxf7@` | ✅ (validado pelo usuário) |
| **Coolify** | API Token | `1|Gp7Pedhr4zp6OdxhmV90XTHrUvYRNd5tQ7m0yZy6fec2dfa3` | ✅ (validado pelo usuário) |
| **Backend** | UUID | `leaocf7ke5lgluo0bg2dco0w` | ✅ (validado via Coolify API) |
| **Frontend** | UUID | `a6n3eh22owgp057dd09t023a` | ✅ (validado via Coolify API) |
| **Banco de Dados** | Internal Host | `rmybu33898amwear4xe4qsbc` | ✅ (validado via Coolify API) |
| **Banco de Dados** | External IP | `72.61.63.84:5432` (Acesso direto Coolify/Local) | ✅ (validado via Coolify API) |
| **Database URL** | Prisma URL | `postgresql://postgres:***@72.61.63.84:5432/postgres?schema=public` | ✅ (validado via Coolify API: URL base encontrada nas variáveis) |
| **Armazenamento** | MinIO Endpoint | `http://72.61.63.84:9000` (Bucket: `ploc-assets`) | ✅ (validado via Coolify API) |
| **Armazenamento** | MinIO Keys | Access: `ploc_admin` / Secret: `ploc_secret_password_2026` | ✅ (validado via Coolify API) |
| **Integração** | GitHub Token | `[MASCARADO]` (`git-hub--ploc`) | ✅ (validado no levantamento: apps/backend/.env) |
| **IA Cognitiva** | OpenAI | `sk-proj-***` (Carregada via .env) | ✅ (validado no levantamento: dependência `openai` presente) ✅ (validado via Coolify API: variável mascarada encontrada) |
| **Segurança** | JWT_SECRET | `ploc_segredo_2026` | ✅ (validado via Coolify API: variável mascarada encontrada) |

> [!IMPORTANT]
> Este arquivo é a autoridade máxima. Em caso de divergência com o painel Coolify, os dados aqui contidos devem ser priorizados ou corrigidos imediatamente.

### 🧭 Guias Auxiliares e Estratégia
- **Planejamento Estratégico (Mapa de Guerra)**: [docs/guides/MASTER_PLANEJAMENTO_ESTRATEGICO.md](../guides/MASTER_PLANEJAMENTO_ESTRATEGICO.md) ✅ (validado no levantamento)
- **Arquitetura & Estratégia (Método)**: [docs/guides/MASTER_ARQUITETURA_ESTRATEGIA.md](../guides/MASTER_ARQUITETURA_ESTRATEGIA.md) ✅ (validado no levantamento)
- **Experiência Mobile (PWA)**: [docs/guides/MASTER_EXPERIENCIA_MOBILE_PWA.md](../guides/MASTER_EXPERIENCIA_MOBILE_PWA.md) ✅ (validado no levantamento)
- **Operação & Testes (Checklist)**: [docs/guides/MASTER_OPERACOES_TESTES.md](../guides/MASTER_OPERACOES_TESTES.md) ✅ (validado no levantamento)
- **Histórico de Versões (CHANGELOG)**: [CHANGELOG.md](../../CHANGELOG.md) ✅ (Movido para a raiz)
- **Desenvolvimento Híbrido (ON/OFF)**: [docs/guides/MASTER_DESENVOLVIMENTO_HIBRIDO.md](../guides/MASTER_DESENVOLVIMENTO_HIBRIDO.md) ✅ ✅ (validado no levantamento)


## Repositório
- **Source**: `GitHub (Smitti7971/ploc-core.git)` ✅ (validado no levantamento: extraído do package.json)
- **Branch**: `main` ✅ (validado no levantamento)

## Regras de Governança (MANDATÓRIO) 🛡️
1. **O MAPA_DO_PROJETO.md deve ser atualizado IMEDIATAMENTE após qualquer mudança na infraestrutura (Coolify, Domínios, Banco de Dados).**
2. Nenhuma tarefa é encerrada sem a sincronização deste mapa.
3. Este mapa é a única fonte da verdade para o estado atual da rede.

---

## 🚀 Roadmap e Objetivos Futuros
- [x] **Conversão PWA**: Finalizado e validado ✅
- [x] **Otimização de Cache**: Implementado no Nginx ✅
- [x] **Plant System (Backend)**: Schema e modelos migrados ✅
- [ ] **Plant System (Backend)**: Implementar endpoints (Serviços e Controllers).
- [ ] **Plant System (Frontend)**: Implementar as telas de diário e calendário.
- [ ] **Notificações Push**: Integrar com o Service Worker do PWA.
