# 🛡️ Protocolo Sentinela: Guia Mestre de Auditoria e Higiene Backend

Este guia define o padrão ouro de qualidade para o Backend do Ploc. Use este checklist sempre que realizar refatorações, adicionar novas funcionalidades ou preparar o sistema para um deploy em grande escala.

---

## 🏗️ FASE 1: Alicerce (Arquitetura e Infra)

- [ ] **Unificação de Instâncias:** Garantir que o Prisma Client seja um Singleton (`src/backend/config/database.js`). Nunca use `new PrismaClient()` fora deste arquivo.
- [ ] **Ordem de Carga (Pre-flight):** O `require('dotenv').config()` deve ser sempre a **Linha 1** do `index.js`.
- [ ] **Validação de Ambiente:** O sistema deve se recusar a iniciar (`process.exit(1)`) se variáveis críticas como `DATABASE_URL` ou `JWT_SECRET` faltarem em produção.
- [ ] **Graceful Shutdown:** O processo deve escutar `SIGINT` e `SIGTERM` para desconectar o banco de dados de forma limpa antes de encerrar.

---

## 🔒 FASE 2: Blindagem e Segurança

- [ ] **Centralização de Segredos:** Segredos (JWT) e expirações devem estar em um arquivo de config (`src/backend/config/auth.js`).
- [ ] **Algoritmos Explícitos:** Sempre defina o algoritmo (ex: `HS256`) tanto no `sign` quanto no `verify` do JWT.
- [ ] **Trust Proxy:** Ative `app.set('trust proxy', 1)` para que o Rate Limiter identifique o IP real do usuário atrás do Traefik/Coolify.
- [ ] **Payload Limit:** Limite o tamanho do JSON recebido (`express.json({ limit: '10kb' })`) para prevenir ataques de negação de serviço (DOS).
- [ ] **Vazamento de Dados:** Auditoria em todos os `res.json()` para garantir que campos sensíveis como `password` ou `token` de recuperação nunca sejam enviados.

---

## 🧹 FASE 3: Higiene e Qualidade de Dados

- [ ] **Sanitização (Trim):** Todo input de texto (E-mail, Nome, Título) deve passar por `.trim()` para remover espaços acidentais.
- [ ] **Normalização:** E-mails devem ser salvos e consultados sempre em `.toLowerCase()`.
- [ ] **Validação de Vazio:** Nunca aceite strings compostas apenas por espaços em campos obrigatórios.
- [ ] **Timestamps Automáticos:** Garantir que campos como `completedAt` sejam preenchidos pela lógica do servidor quando o status mudar.

---

## ⚡ FASE 4: Performance e Integridade de Banco

- [ ] **Cascade Deletes:** Configure `onDelete: Cascade` no `schema.prisma` para evitar tarefas órfãs e erros de integridade ao deletar usuários.
- [ ] **Indexação:** Todo campo usado em cláusulas `where` (como `userId`, `routineId`, `completed`) deve ter um índice (`@@index`) no banco.
- [ ] **Logging de Acesso:** Manter um middleware de log que registre `MÉTODO | ROTA | STATUS | TEMPO` para monitorar a saúde das APIs em tempo real.

---

## 📂 FASE 5: Governança e Projeto

- [ ] **Controle de Versão (.gitignore):** Manter o `.gitignore` atualizado para nunca subir `.env`, `node_modules` ou pastas de IDE.
- [ ] **Previsibilidade (Engines):** Fixar a versão mínima do Node.js no `package.json`.
- [ ] **Documentação:** Manter o `README.md` do backend atualizado com instruções de setup local.

---

## 🚦 Quando executar este guia?
1. **Pós-Refatoração:** Para garantir que nada "quebrou" na lógica global.
2. **Pré-Deploy:** Como última linha de defesa antes de enviar para produção.
3. **Mensalmente:** Como uma auditoria de rotina para evitar o acúmulo de "Dívida Técnica".

*Status Atual: Sistema Validado até o Nível 13 em 07/05/2026.*
