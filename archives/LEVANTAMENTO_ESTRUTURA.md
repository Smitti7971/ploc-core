# INVENTÁRIO TÉCNICO REAL DO PROJETO

Gerado exclusivamente via leitura direta do filesystem local.

- **Data do levantamento**: 2026-05-11
- **Hora do levantamento**: 16:28 (UTC)
- **Escopo**: Raiz do projeto e diretório `/apps`

---

# Estrutura Geral
O projeto é organizado como um monorepo contendo dois serviços principais no diretório `/apps`, gerenciados por um `package.json` na raiz para orquestração de scripts de desenvolvimento e banco de dados local.

---

# Árvore de Diretórios (Principais)

```text
/ (raiz)
├── apps/
│   ├── backend/
│   │   ├── ai/
│   │   ├── api/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── events/
│   │   ├── infrastructure/
│   │   ├── jobs/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── node_modules/
│   │   ├── prisma/
│   │   │   └── migrations/
│   │   ├── public/
│   │   │   └── audio/
│   │   ├── queues/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── scheduler/
│   │   ├── scripts/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── Dockerfile
│   │   ├── index.js
│   │   ├── package.json
│   │   └── package-lock.json
│   └── frontend/
│       ├── app/
│       ├── css/
│       ├── features/
│       ├── shared/
│       ├── Dockerfile
│       ├── index.html
│       ├── manifest.json
│       └── sw.js
├── docker-compose.yml
├── package.json
└── package-lock.json
```

---

# Serviços Encontrados

### 1. Backend (API Enterprise)
- **Localização**: `/apps/backend`
- **Ponto de Entrada**: `index.js`
- **Componentes Internos**:
    - **IA**: Orquestrador e ferramentas em `ai/`.
    - **ORM**: Prisma em `prisma/`.
    - **Rotas**: Express routes em `routes/`.
    - **Middleware**: Segurança e autenticação em `middleware/`.
    - **Storage**: Integração MinIO e S3.

### 2. Frontend (SPA Client)
- **Localização**: `/apps/frontend`
- **Ponto de Entrada**: `index.html`
- **Componentes Internos**:
    - **Features**: Módulos por funcionalidade em `features/` (auth, calendar, chat, dashboard, routines, settings, tasks).
    - **Shared**: Componentes e utilitários globais em `shared/`.
    - **Service Worker**: `sw.js`.

---

# Dependências

### Raiz (`/package.json`)
- `jimp`: ^1.6.1

### Backend (`/apps/backend/package.json`)
- `@aws-sdk/client-s3`: ^3.1045.0
- `@prisma/client`: ^6.4.1
- `bcryptjs`: ^3.0.3
- `cors`: ^2.8.6
- `dotenv`: ^17.4.2
- `express`: ^4.18.2
- `express-rate-limit`: ^8.5.1
- `helmet`: ^8.1.0
- `jsonwebtoken`: ^9.0.3
- `multer`: ^2.1.1
- `openai`: ^6.37.0
- `sharp`: ^0.34.5
- `prisma` (Dev): ^6.4.1

### Frontend (`/apps/frontend/`)
- Não possui arquivo `package.json`. Dependências são gerenciadas via imports diretos ou scripts globais no `index.html`.

---

# Frameworks
- **Backend**: Express.js
- **Frontend**: Vanila JS / Custom SPA Engine
- **ORM**: Prisma

---

# Configurações

### Banco de Dados
- **Provider**: PostgreSQL
- **Configuração**: `apps/backend/prisma/schema.prisma`
- **Enums Encontrados**: `Priority`, `TaskStatus`
- **Modelos Mapeados**: `User`, `Routine`, `RoutineTemplate`, `Task`, `Plant`, `PlantPhase`, `PlantLog`, `PlantMedia`, `PlantEvent`.

### Servidor Web (Frontend)
- **Server**: Nginx (via Dockerfile)
- **SPA Rewrite**: Configurado no `Dockerfile` para redirecionar todas as rotas para `index.html`.

---

# Scripts

### Raiz
- `dev:front`: `npx serve apps/frontend`
- `dev:back`: `cd apps/backend && npm run dev`
- `db:up`: `docker-compose up -d`
- `db:down`: `docker-compose down`
- `db:reset`: `cd apps/backend && node scripts/reset-db.js`

### Backend
- `start`: `npx prisma generate && npx prisma migrate deploy && node index.js`

---

# Builds

### Dockerfile (Backend)
- **Base**: `node:22-slim`
- **Dependências de Sistema**: `openssl`, `libssl-dev`
- **Build Step**: `npm install`, `npx prisma generate`
- **Entrypoint**: `npm start`

### Dockerfile (Frontend)
- **Base**: `nginx:stable-alpine`
- **Build Step**: Copia todos os arquivos locais para `/usr/share/nginx/html`.
- **Configuração**: Custom `default.conf` injetado via `RUN echo`.

---

# Containers (Local)
- **Serviço**: `ploc-db-local`
- **Imagem**: `postgres:16-alpine`
- **Porta**: `5432:5432`
- **Volume**: `ploc_data_local`

---

# Runtimes
- **Node.js**: >=20.0.0 (definido no backend)
- **Docker**: Engine suportando Compose v3.8+

---

# Observações Técnicas

- **Falta de Package Managers no Frontend**: O diretório `/apps/frontend` é servido como arquivos estáticos puros, sem um sistema de build Node.js (Vite, Webpack, etc.) detectado via arquivos de configuração.
- **Inconsistência de Imagem DB**: O `docker-compose.yml` local usa `postgres:16-alpine`, enquanto o levantamento de infraestrutura anterior indicou `postgres:18-alpine` em produção.
- **Redundância de Dependências de Imagem**: O monorepo possui `jimp` na raiz e `sharp` no backend, ambas para processamento de imagem.
- **Arquivos de Ambiente**: `.env` encontrado tanto na raiz quanto em `apps/backend/`.
- **Prisma Client**: Configurado com `binaryTargets = ["native", "debian-openssl-3.0.x"]` no `schema.prisma`.
