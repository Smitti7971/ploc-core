# MAPA DO PROJETO (PLOC) 🗺️

## Estado Atual da Infraestrutura (Coolify)

### 1. Serviço de Frontend (APP)
- **App Name**: `assistente-ploc-frontend` (UUID: `a6n3eh22owgp057dd09t023a`)
- **Domínio**: `https://ploc.midializando.cloud/`
- **Base Directory**: `/` (Raiz do projeto)
- **Build Pack**: `Dockerfile` (Nginx:stable-alpine personalizado)
- **Arquitetura**: SPA (Single Page Application) servida via Nginx
- **PWA Version**: v14 (Blindagem de Cache & Caminhos Absolutos)

### 2. Serviço de Backend (API)
- **App Name**: `ploc-backend-v3` (UUID: `leaocf7ke5lgluo0bg2dco0w`)
- **Domínio**: `https://backend.midializando.cloud/`
- **Base Directory**: `/src/backend`
- **Build Pack**: `Dockerfile` (Node:22-slim personalizado) ✅

### 3. Serviço de Banco de Dados (PostgreSQL)
- **Service Name**: `rmybu33898amwear4xe4qsbc`
- **Domínio Interno**: `rmybu33898amwear4xe4qsbc:5432`
- **ORM**: Prisma v6.19.3
- **POSTGRES_HOST**: `rmybu33898amwear4xe4qsbc`
- **POSTGRES_DB**: `postgres`
- **DATABASE_URL**: `postgresql://postgres:********************************@rmybu33898amwear4xe4qsbc:5432/postgres?schema=public`
- **Nota**: Manter Prisma v6 para estabilidade operacional.

### ⚙️ Motor de Rotinas (Backend)
- **Status**: Backend Pronto (API Validada)
- **Funcionalidades**: Listagem, Criação, Check/Uncheck, Deleção.
- **Categorias**: Saúde, Finanças, Trabalho, Hábito, Leitura, Meditação, Estudo, Música.

### 🎨 Arquitetura Frontend (Enterprise)
- **Design System**: Baseado em REM (Root EM) para escalabilidade total.
- **Separation of Concerns**: Lógica extraída para componentes JS e Estilos para `css/`.
- **Arquitetura SPA**: Roteamento dinâmico via `js/main.js` (Zero Page Reload).
- **Service Worker**: Cache persistente v12 (Otimizado para SPA).


### 📊 Estado de Saúde (Operacional - 2026-05-08) 🟢
- **Frontend**: ✅ ATIVO (Nginx servindo SPA v12).
- **Backend**: ✅ ATIVO (Servidor Node.js respondendo na porta 3000).
- **Banco de Dados**: ✅ CONECTADO (Prisma v6 operando com PostgreSQL).
- **Segurança**: ✅ VALIDADA (Correção do JWT_SECRET em produção).

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


## Repositório
- **Source**: `GitHub (Smitti7971/ploc-core.git)`
- **Branch**: `main`

## Regras de Governança (MANDATÓRIO) 🛡️
1. **O MAPA_DO_PROJETO.md deve ser atualizado IMEDIATAMENTE após qualquer mudança na infraestrutura (Coolify, Domínios, Banco de Dados).**
2. Nenhuma tarefa é encerrada sem a sincronização deste mapa.
3. Este mapa é a única fonte da verdade para o estado atual da rede.
