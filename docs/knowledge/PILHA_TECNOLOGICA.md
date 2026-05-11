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

## 🎨 Frontend (apps/frontend)
- **Distribuição**: `PWA (Progressive Web App)` ✅ (confirmado: manifest.json e sw.js)
- **Política de Cache**: `Cache-Control: expires max` (Nginx) ✅ (validado no Dockerfile do frontend)
- **Automação**: Cache-Busting via Query String (`?v=N.N.N`) ✅

- **Estrutura**: `SPA (Single Page Application)` baseada em HTML5 ✅ (confirmado: roteamento via JS detectado)
- **Estilos**: `Vanilla CSS` (Moderno / Design System v1) ✅ (confirmado: apps/frontend/css/app.css)
- **Lógica**: `Vanilla JavaScript` (ES6+ / Feature-Based) ✅ (confirmado: diretório apps/frontend/features)
- **Estratégia de Ativos**: `Stateless Media` (Mídia servida via MinIO / S3) ✅
- **Automação de Design**: `Jimp ^1.6.1` (Gerador de Ícones/Favicons - Local Only) ✅

## ☁️ Infraestrutura (Coolify)

- **Backend**: Dockerfile (Node 22-slim) ✅ (confirmado no Dockerfile do backend)
- **Frontend**: Dockerfile (Nginx:stable-alpine) ✅ (confirmado no Dockerfile do frontend)
- **Banco**: PostgreSQL 16+ ✅ (confirmado no docker-compose.yml)

---
*Nota: Sempre execute `npm install` na pasta correspondente ao clonar o projeto.*
