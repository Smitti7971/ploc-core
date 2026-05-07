# PILHA TECNOLÓGICA (Tech Stack) 🛠️

> Este documento registra as ferramentas e versões oficiais utilizadas no desenvolvimento do PLOC.

## 💻 Ambiente de Desenvolvimento (Local)

| Ferramenta | Versão | Função |
| :--- | :--- | :--- |
| **Node.js** | `v25.9.0` | Runtime JavaScript |
| **NPM** | `11.12.1` | Gerenciador de Pacotes |
| **Git** | `2.54.0.windows.1` | Controle de Versão |
| **Prisma CLI** | `7.8.0` | Interface de Banco de Dados |

## 🧠 Backend (src/backend)

### Core
- **Framework**: `express ^4.18.2`
- **ORM**: `prisma ^6.4.1`
- **Client**: `@prisma/client ^6.4.1`

### Segurança
- **Autenticação**: `jsonwebtoken ^9.0.3`
- **Criptografia**: `bcryptjs ^3.0.3`
- **Headers**: `helmet ^8.1.0`
- **Controle de Acesso**: `cors ^2.8.6`
- **Rate Limit**: `express-rate-limit ^8.5.1`

### Utilidades
- **Configuração**: `dotenv ^17.4.2`

## 🎨 Frontend (src/frontend)

- **Estrutura**: HTML5
- **Estilos**: Vanilla CSS (CSS Moderno)
- **Lógica**: Vanilla JavaScript (ES6+)
- **Imagens**: Jimp `^1.6.1` (Processamento de Ativos)

## ☁️ Infraestrutura (Coolify)

- **Backend**: Nixpacks (Node 22)
- **Frontend**: Static App (Nginx)
- **Banco**: PostgreSQL 16+

---
*Nota: Sempre execute `npm install` na pasta correspondente ao clonar o projeto.*
