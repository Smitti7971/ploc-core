# 🚀 Ploc Backend - Enterprise SPA Architecture

Este é o motor do **Ploc**, construído com Node.js, Express e Prisma. Segue uma arquitetura modular focada em escalabilidade, segurança e alta performance.

## 🛠️ Pilha Tecnológica
- **Runtime:** Node.js v20+ (LTS)
- **Framework:** Express.js
- **ORM:** Prisma
- **Banco de Dados:** PostgreSQL
- **Segurança:** JWT, Bcryptjs, Helmet, Express-Rate-Limit

## 📁 Estrutura de Pastas
- `/src/backend/config`: Configurações centrais (Banco, Auth).
- `/src/backend/controllers`: Lógica de requisição e resposta.
- `/src/backend/middleware`: Proteção de rotas e verificações.
- `/src/backend/prisma`: Schema e Migrações do banco.
- `/src/backend/routes`: Definição de endpoints da API.

## 🚦 Como Rodar Localmente
1. Certifique-se de ter o **PostgreSQL** instalado e rodando.
2. Clone o repositório e acesse a pasta `src/backend`.
3. Crie um arquivo `.env` baseado nas variáveis necessárias:
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/ploc"
   JWT_SECRET="sua_chave_secreta"
   PORT=3000
   ```
4. Instale as dependências: `npm install`
5. Rode as migrações: `npx prisma migrate dev`
6. Inicie o servidor: `npm start` (ou `node index.js`)

## 🛡️ Segurança e Boas Práticas
- **Graceful Shutdown:** O servidor encerra conexões com o banco de forma limpa.
- **Data Sanitization:** Todos os inputs são limpos (trim/lowercase) antes de serem salvos.
- **Error Handling:** Gestor de erros global para evitar vazamento de stacktraces em produção.
- **Performance:** Índices aplicados nos campos de busca frequente do PostgreSQL.

---
*Desenvolvido por Smitti & AntiGravity AI.*
