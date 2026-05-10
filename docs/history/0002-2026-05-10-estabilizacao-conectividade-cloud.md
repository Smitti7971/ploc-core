# 📸 SNAPSHOT OPERACIONAL: Estabilização de Conectividade Cloud (v0.0.9-FINAL)
**Data:** 2026-05-10 | **Status:** PROD-READY | **Versão:** v0.0.9-FINAL

---

## 🏗️ 1. Infraestrutura Atual
| Recurso | Status | URL / UUID |
| :--- | :--- | :--- |
| **Frontend SPA** | ✅ ONLINE | `https://ploc.midializando.cloud` |
| **Backend API** | ✅ ONLINE | `https://backend.midializando.cloud` |
| **Deployment** | ✅ DOCKER | Coolify (Build via Dockerfile) |
| **Auth Mode** | ✅ JWT | LocalStorage (`ploc_token`) |

---

## ⚡ 2. Snapshot de Alterações Críticas

### 🧪 A. Camada de Conectividade (shared/api/client.js)
- **Mudança**: Hardcoding da URL de produção.
- **Antes**: Dependia do `config.js` que falhava em detectar o ambiente devido ao cache.
- **Agora**: `baseURL: 'https://backend.midializando.cloud/api'` fixo para garantir zero latência de decisão de rede.

### 🛡️ B. Extermínio de Cache (index.html + Dockerfile)
- **Nginx (Dockerfile)**: Injeção de headers `Cache-Control: no-store, max-age=0`. Isso impede que o Nginx sirva versões velhas por 30 dias (o erro original).
- **Purge Script (index.html)**: Adicionado motor de limpeza que desregistra Service Workers "zumbis" e limpa o cache do navegador forçadamente se a versão for inferior a `v0.0.9`.

### 🔊 C. Inteligência Vocal (aiRoutes.js + PlocAvatar.js)
- **Acesso Público**: A rota `/api/ai/tts` foi movida para fora do bloqueio de autenticação global. 
- **Raciocínio**: O Ploc precisa falar as boas-vindas para o usuário *antes* do login. Bloquear isso causava erro de "No supported sources" no áudio.
- **Fix de IP**: Removido o endereço `127.0.0.1` que estava oculto no gerador de URL do Avatar.

### 🧩 D. Integridade de Módulos (Cascata de Versão)
- **Imports Versionados**: Todos os arquivos (`LandingPage`, `Dashboard`, `Router`, `Avatar`) agora importam uns aos outros usando `?v=0.0.9`.
- **Resultado**: O navegador é obrigado a baixar a cadeia inteira de arquivos novos, sem "viciar" em pedaços do build anterior.

---

## 🚩 3. Lições de Batalha (Prevenção de Regressão)
1.  **Nunca confiar no Cache-Control padrão**: Em SPAs, o Nginx deve ser configurado explicitamente para não cachear o `index.html` e arquivos de lógica.
2.  **Service Workers são perigosos**: Durante o desenvolvimento e deploys rápidos, eles podem travar o usuário em uma versão "fantasma". O kill-switch atual previne isso.
3.  **Voz é Porta de Entrada**: Serviços de TTS que rodam na Landing Page devem ser públicos para evitar quebra de UX em erros de 401.

---
**Snapshot gerado por AntiGravity.** 🫡🦾🚀
