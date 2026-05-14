# PILHA TECNOLÓGICA (Tech Stack) 🛠️

> Este documento registra as ferramentas e versões oficiais utilizadas no desenvolvimento do PLOC.

## 💻 Ambiente de Desenvolvimento (Local)

| Ferramenta | Versão | Função | Status |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v25.9.0` | Runtime JavaScript | ⚠️ (Versão do Host) |
| **NPM** | `11.12.1` | Gerenciador de Pacotes | ⚠️ (Versão do Host) |
| **Git** | `2.54.0.windows.1` | Controle de Versão | ⚠️ (Versão do Host) |
| **Prisma CLI** | `7.8.0` | Interface de Banco de Dados | ⚠️ (Versão do Host) |

## 🧠 Backend (apps/backend)

### Core
- **Framework**: `express ^4.18.2` ✅ (validado: apps/backend/package.json)
- **ORM**: `prisma ^6.4.1` ✅ (validado: apps/backend/package.json)
- **Client**: `@prisma/client ^6.4.1` ✅ (validado: apps/backend/package.json)

### Segurança
- **Autenticação**: `jsonwebtoken ^9.0.3` ✅ (validado: apps/backend/package.json)
- **Criptografia**: `bcryptjs ^3.0.3` ✅ (validado: apps/backend/package.json)
- **Headers**: `helmet ^8.1.0` ✅ (validado: apps/backend/package.json)
- **Controle de Acesso**: `cors ^2.8.6` ✅ (validado: apps/backend/package.json)
- **Rate Limit**: `express-rate-limit ^8.5.1` ✅ (validado: apps/backend/package.json)

### Utilidades & Imagem
- **Configuração**: `dotenv ^17.4.2` ✅ (validado: apps/backend/package.json)
- **Processamento de Imagem**: `sharp ^0.34.5` ✅ (validado: apps/backend/services/StorageService.js)
- **Engine de Mídia**: Otimização em tempo real (WebP/Resize) via Sharp.

## 🎨 Frontend (apps/web)
- **Framework**: `Next.js 16.2.x` ✅ (validado: apps/web/package.json)
- **Biblioteca de UI**: `React 19` ✅ (validado: apps/web/package.json)
- **Ícones**: `Lucide-React ^1.14.0` ✅ (Padronizado em todo o App)
- **Estilização**: `Tailwind CSS 4` ✅ (confirmado: tailwind.config.ts / package.json)
- **Estado Global**: `Zustand ^5.0.x` ✅ (confirmado: apps/web/store/)
- **Animações**: `Framer Motion ^12.x` ✅ (confirmado: apps/web/components/)
- **Comunicação**: `Axios ^1.7.x` ✅ (confirmado: apps/web/services/)
- **Linguagem**: `TypeScript 5.x` ✅

### Estratégia Frontend
- **Arquitetura**: Next.js App Router (Server Components + Client Components) ✅
- **Distribuição**: `PWA (Progressive Web App)` (Em migração para Next.js) ⚠️
- **Mídia Stateless**: Integração total com MinIO / S3 via Backend ✅
- **Deployment**: Vercel ou Docker (Next.js Standalone Mode) ✅

## ☁️ Infraestrutura (Coolify)

- **Backend**: Dockerfile (Node 22-slim) ✅ (confirmado no Dockerfile do backend)
- **Frontend**: Dockerfile (Nginx:stable-alpine) ✅ (confirmado no Dockerfile do frontend)
- **Banco**: PostgreSQL 16+ ✅ (confirmado no docker-compose.yml)

---
*Nota: Sempre execute `npm install` na pasta correspondente ao clonar o projeto.*
