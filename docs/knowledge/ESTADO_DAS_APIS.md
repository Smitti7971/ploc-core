# ESTADO DAS APIS E SERVIÇOS 🛰️

> Este documento monitora a saúde das integrações do PLOC.

## Status das Conexões (Última Verificação: 2026-05-07)

| Serviço | Variável Base | Status | Observação |
| :--- | :--- | :--- | :--- |
| **Banco de Dados** | `DATABASE_URL` | 🟢 ATIVO | Conexão via Prisma validada. |
| **Coolify API** | `COOLIFY_TOKEN` | 🟢 ATIVO | Deploys via curl funcionando. |
| **Frontend App** | `COOLIFY_FRONTEND_UUID` | 🟢 SINCRONIZADO | Aponta para assistente-ploc-frontend. |
| **Backend App** | `COOLIFY_BACKEND_UUID` | 🟢 SINCRONIZADO | Aponta para ploc-backend-v3. |
| **GitHub Repo** | `GITHUB_TOKEN` | 🟢 ATIVO | Push e Pull operacionais. |

## Endpoints de Validação

- **API Health**: `https://backend.midializando.cloud/api/health`
- **DB Status**: `https://backend.midializando.cloud/api/db-status`
- **Coolify API**: `http://72.61.63.84:8000/api/v1/health`

---
*Nota: Se algum serviço apresentar 🔴 (Inativo), consulte o Guia de Credenciais.*
