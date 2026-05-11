# DRAFT: Teste de Deploy e Validação Operacional 🚀

**Objetivo:** Validar a saúde do ecossistema Ploc após a refatoração enterprise do backend, garantindo que o deploy no Coolify ocorra sem falhas e as APIs estejam operacionais.

## 🛠️ Estratégia de Execução

1. **Sincronização de Código**: Consolidar todas as mudanças locais e realizar o `git push` para a branch `main`.
2. **Disparo de Deploy**: Iniciar o deploy do serviço `ploc-backend-v3` no Coolify.
3. **Monitoramento (Sentinela)**: 
   - Acompanhar os logs de build.
   - Aguardar o status "Finished" e validar o health check.
   - Regra de Telemetria: Aguardar 180s após o deploy para validar estabilidade.
4. **Teste de Fumaça (Live)**:
   - Validar endpoint `/health`.
   - Validar conexão com banco via `/api/db-status`.
   - Validar rota protegida (ex: `/api/tasks`) para garantir que o JWT/Middleware está funcionando.

## 📋 Critérios de Sucesso
- Backend online em `https://backend.midializando.cloud/`.
- Resposta `200 OK` em todos os endpoints de saúde.
- Conexão estável com o PostgreSQL.
- Logs sem erros de inicialização ou Prisma.

## ⚠️ Riscos Identificados
- Erros de `Prisma Client` devido ao ambiente de build do Coolify (Sistema Legado).
- Variáveis de ambiente faltando no Coolify (JWT_SECRET, DATABASE_URL).
- Latência na propagação do deploy.

---
**Próximo Passo:** Se aprovado, moverei este plano para `docs/execution/current-task.md` e iniciarei a execução passo a passo.
