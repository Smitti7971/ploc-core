# MAPA DO PROJETO (PLOC) 🗺️

## Estado Atual da Infraestrutura (Coolify)

### 1. Serviço de Frontend (APP)
- **App Name**: `assistente-ploc-frontend` (UUID: `a6n3eh22owgp057dd09t023a`)
- **Domínio**: `https://ploc.midializando.cloud/`
- **Base Directory**: `/src/frontend`
- **Build Pack**: `static` (Nginx)

### 2. Serviço de Backend (API)
- **App Name**: `ploc-backend-v3` (UUID: `leaocf7ke5lgluo0bg2dco0w`)
- **Domínio**: `https://backend.midializando.cloud/`
- **Base Directory**: `/src/backend`
- **Build Pack**: `nixpacks` (Node.js)

### 3. Serviço de Banco de Dados (PostgreSQL)
- **Service Name**: `postgresql`
- **Domínio Interno**: `postgresql:5432`
- **ORM**: Prisma v6.4.1 (Downgrade aplicado para compatibilidade com Node 22.11)
- **Status**: Integrado ao Backend via DATABASE_URL
- **Nota**: Manter Prisma v6 enquanto o ambiente Nixpacks não suportar Node >= 22.12.

## Repositório
- **Source**: `GitHub (Smitti7971/ploc-core.git)`
- **Branch**: `main`

## Regras de Governança (MANDATÓRIO) 🛡️
1. **O MAPA_DO_PROJETO.md deve ser atualizado IMEDIATAMENTE após qualquer mudança na infraestrutura (Coolify, Domínios, Banco de Dados).**
2. Nenhuma tarefa é encerrada sem a sincronização deste mapa.
3. Este mapa é a única fonte da verdade para o estado atual da rede.
