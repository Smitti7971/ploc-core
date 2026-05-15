# ESTADO DAS APIS E SERVIÇOS 🛰️

> Este documento monitora a saúde das integrações do PLOC.

## Status das Conexões (Última Verificação: 2026-05-11) 🟢

| Serviço | Variável Base | Status | Observação |
| :--- | :--- | :--- | :--- |
| **Banco de Dados** | `DATABASE_URL` | 🟢 ATIVO | Conexão via Prisma (PostgreSQL 16/18). |
| **Frontend App** | `COOLIFY_FRONTEND_UUID` | 🟢 SINCRONIZADO | a6n3eh22owgp057dd09t023a |
| **Backend App** | `COOLIFY_BACKEND_UUID` | 🟢 SINCRONIZADO | leaocf7ke5lgluo0bg2dco0w |
| **Storage (MinIO)** | `STORAGE_ENDPOINT` | 🟢 ATIVO | Bucket: ploc-assets (WebP Engine). |
| **Voz (TTS)** | `/api/ai/tts` | 🟢 PÚBLICO | Liberado para boas-vindas. |
| **Inteligência (AI)** | `/api/ai/chat` | 🟢 PRIVADO | Exige JWT. |
| **GitHub Repo** | `GITHUB_TOKEN` | 🟢 ATIVO | Operações Git OK. |
| **Coolify API** | `COOLIFY_TOKEN` | 🟢 ATIVO | Deploys OK. |

## Endpoints de Validação

- **API Health**: `https://backend.midializando.cloud/api/health` ✅ (index.js:L95)
- **Voz Check**: `https://backend.midializando.cloud/api/ai/tts?text=Teste` ✅ (aiRoutes.js)
- **DB Status**: `https://backend.midializando.cloud/api/db-status` ✅ (index.js:L104)
- **Botanical DB**: `Plant, Phase, Log, Event, Media` ✅ (Validado via `verify_prisma.js`)
- **Coolify API**: `http://72.61.63.84:8000/api/v1/health` ✅ (Coolify Nativo)
- **Modo Híbrido**: Frontend configurado para usar Cloud por padrão em `localhost`. ✅
- **RPG System**: Atributos calculados em tempo real via `AttributeEngine` (Client-side). ⚠️ (Pendente: Persistência em DB)

---
*Nota: Se algum serviço apresentar 🔴 (Inativo), consulte o Guia de Credenciais.*
*Para testar com Backend Local, adicione `?local=true` na URL do navegador.*
