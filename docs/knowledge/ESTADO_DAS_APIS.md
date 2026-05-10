# ESTADO DAS APIS E SERVIÇOS 🛰️

> Este documento monitora a saúde das integrações do PLOC.

## Status das Conexões (Última Verificação: 2026-05-10) 🟢

| Serviço | Variável Base | Status | Observação |
| :--- | :--- | :--- | :--- |
| **Banco de Dados** | `DATABASE_URL` | 🟢 ATIVO | Conexão via Prisma em Produção. |
| **Frontend App** | `COOLIFY_FRONTEND_UUID` | 🟢 SINCRONIZADO | assistente-ploc-frontend. |
| **Backend App** | `COOLIFY_BACKEND_UUID` | 🟢 SINCRONIZADO | ploc-backend-v3. |
| **Voz (TTS)** | `/api/ai/tts` | 🟢 PÚBLICO | Liberado para boas-vindas. |
| **Inteligência (AI)** | `/api/ai/chat` | 🟢 PRIVADO | Exige JWT. |
| **GitHub Repo** | `GITHUB_TOKEN` | 🟢 ATIVO | Operações Git OK. |
| **Coolify API** | `COOLIFY_TOKEN` | 🟢 ATIVO | Deploys OK. |

## Endpoints de Validação

- **API Health**: `https://backend.midializando.cloud/api/health`
- **Voz Check**: `https://backend.midializando.cloud/api/ai/tts?text=Teste`
- **DB Status**: `https://backend.midializando.cloud/api/db-status`
- **Coolify API**: `http://72.61.63.84:8000/api/v1/health`

---
*Nota: Se algum serviço apresentar 🔴 (Inativo), consulte o Guia de Credenciais.*
