# BLUEPRINT: Receita de Bolo para SaaS (Stack PLOC) 🎂🚀

Este documento serve como guia definitivo para iniciar novos projetos SaaS utilizando a infraestrutura Coolify + Node.js + PostgreSQL + Prisma.

## Fase 1: Fundação de Infraestrutura (Coolify)
1. **Banco de Dados**: Criar PostgreSQL no Coolify.
   - Anotar o `Internal Hostname` (ex: `rmybu33898...`).
   - Desabilitar `Public Access` após a migração inicial por segurança.
2. **Backend**: Criar aplicação Node.js (Nixpacks).
   - Configurar `DATABASE_URL` usando o host interno.
   - Definir `NIXPACKS_NODE_VERSION=22`.
3. **Frontend**: Criar aplicação estática (Nginx).

## Fase 2: Configuração de Backend (O Coração)
1. **Prisma ORM**: Usar versão 6.x para compatibilidade máxima com Node 22.11.
2. **Segurança de Base**:
   - `helmet`: Proteção de cabeçalhos.
   - `cors`: Restrição de domínios.
   - `express-rate-limit`: Proteção contra ataques de negação de serviço.
3. **Scripts de Automação** (`package.json`):
   - `"start": "npx prisma generate && npx prisma migrate deploy && node index.js"`

## Fase 3: Arquitetura de Pastas (Organização Profissional)
Para evitar que o código vire uma bagunça, seguir a estrutura:
- `/src/backend/routes`: Definição de caminhos (URL).
- `/src/backend/controllers`: Lógica de cada funcionalidade.
- `/src/backend/middleware`: Segurança e Autenticação (JWT).
- `/src/backend/services`: Comunicação direta com o Banco.

## Fase 4: Autenticação e Segurança (O Porteiro)
1. Implementar **JWT (JSON Web Token)**.
2. Criar middleware `auth.js` para proteger rotas sensíveis.
3. Criptografar senhas com `bcrypt`.

## Fase 5: Conversão para APP
1. Implementar `manifest.json` e `Service Workers` para transformar o site em um **PWA**.
2. Garantir que todas as chamadas de API usem `https`.
