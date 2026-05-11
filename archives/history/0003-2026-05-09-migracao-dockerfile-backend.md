# CURRENT TASK: Migração do Backend para Dockerfile e Centralização de Verdade 🐳🛡️

## 1. Entender (Intenção) 🧠
- **O quê**: Migrar o Backend (API) para o padrão Dockerfile manual. Simultaneamente, consolidar todas as credenciais no `MAPA_DO_PROJETO.md` como Fonte da Verdade.
- **Por quê**: Atender à solicitação do usuário de eliminar o sistema de build anterior e garantir que a infraestrutura seja documentada de forma imutável e centralizada.
- **Metáfora**: "Estamos trocando o motor genérico da balsa por um motor customizado de alta performance, e registrando o manual de manutenção no cofre central."

## 2. Preparar (Logística) 🎒
- **Arquivos-Alvo**:
    - `src/backend/Dockerfile` (A ser criado)
    - `docs/knowledge/MAPA_DO_PROJETO.md` (A ser atualizado)
- **Credenciais**: Extraídas do `.env` raiz (VPS_IP, UUIDs, DATABASE_URL, JWT_SECRET).
- **Risco**: Erro de build no Dockerfile devido a dependências do Prisma.
- **Proteção**: Backup das configurações atuais no `.env`.

## 3. O Que Executar (Ação) 🛠️
- [x] Passo 1: Criação do `src/backend/Dockerfile` ✅
- [x] Passo 2: Atualização do `MAPA_DO_PROJETO.md` com a Seção "Fonte da Verdade" ✅
- [x] Passo 3: Sincronização Git (Commit & Push) ✅
- [x] Passo 4: Notificação para Mudança no Coolify (Manual pelo USER) ✅
- [x] Passo 5: Validação de Saúde (180s após Deploy) ✅

## 4. Resultado Esperado (Visão) 👁️
- Backend rodando via Dockerfile em `https://backend.midializando.cloud/`.
- `MAPA_DO_PROJETO.md` contendo todas as credenciais de produção atualizadas.

## 5. Validar & Testar (Prova de Vida) ✅
- [ ] Verificar endpoint `/health`.
- [ ] Verificar endpoint `/api/db-status`.
- [ ] Confirmar se o Mapa reflete os dados do `.env`.
