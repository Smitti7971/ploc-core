# DRAFT-002: Migração Total para Dockerfile (Backend) 🐳🚀

## Contexto
O usuário solicitou a migração total do sistema de build. Como o Frontend já utiliza Dockerfile, o foco agora é migrar o **Backend (API)** para uma configuração manual e controlada via `Dockerfile`. Isso garante determinismo no build e elimina dependências ocultas do sistema anterior.

## Objetivos
1.  **Independência**: Substituir o Build Pack anterior pelo `Dockerfile` no serviço de backend.
2.  **Determinismo**: Fixar a versão do Node.js (v22) e garantir que o Prisma ORM seja configurado corretamente durante o build.
3.  **Padronização**: Seguir o padrão de infraestrutura controlada adotado no frontend.

## Lógica e Engrenagens
### 1. Criação do Dockerfile (Backend)
Será criado o arquivo `src/backend/Dockerfile` com a seguinte estrutura:
- **Base**: `node:22-slim` (leve e estável).
- **Dependências de Sistema**: Instalar `openssl` (necessário para o Prisma).
- **Build**:
    - `npm install`
    - `npx prisma generate`
- **Execução**:
    - `npx prisma migrate deploy` (Garante que o banco esteja sincronizado no startup).
    - `node index.js`

### 2. Configuração no Coolify
Após o commit, o usuário (ou o agente via instrução) deverá:
- Mudar o `Build Pack` anterior para `Dockerfile`.
- Ajustar o `Docker File Location` para `/src/backend/Dockerfile` (se o base directory for `/`) ou apenas `Dockerfile` (se o base directory for `/src/backend`).
*Nota: O MAPA_DO_PROJETO indica que o Base Directory é `/src/backend`, então o Dockerfile deve estar na raiz desta pasta.*

## Riscos e Mitigação
- **Risco**: Falha na conexão com o banco durante o `prisma migrate deploy` se as variáveis de ambiente não estiverem disponíveis no momento certo.
- **Mitigação**: O Coolify injeta as variáveis durante o runtime. O comando de migrate será parte do `CMD` ou do script de entrada para garantir que ocorra com o container já em pé e com acesso à rede interna.

## Aprovação Requerida
Aguardando o "OK" consciente do USER sobre a estratégia de migração do Backend para Dockerfile.
