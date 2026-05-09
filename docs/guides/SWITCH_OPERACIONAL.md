# 🎛️ SWITCH OPERACIONAL (PLOC)

Este arquivo contém comandos de substituição direta para troca de ambiente. O EXECUTOR não deve questionar, apenas aplicar as trocas de linha conforme solicitado.

---

## 🟢 [COMANDO] ATIVAR MODO ONLINE (PRODUÇÃO)

**1. Arquivo: `src/frontend/js/config.js`**
- **Localizar**: `API_BASE_URL: 'http://localhost:3000/api'`
- **Substituir por**: `API_BASE_URL: 'https://backend.midializando.cloud/api'`

**2. Arquivo: `src/frontend/index.html` (Script Main)**
- **Localizar**: `src="/js/main.js?v=0.0.3-LOCAL"`
- **Substituir por**: `src="/js/main.js?v=0.0.3"`

**3. Arquivo: `src/frontend/index.html` (Versão App)**
- **Localizar**: `const APP_VERSION = 'v0.0.3-LOCAL';`
- **Substituir por**: `const APP_VERSION = 'v0.0.3';`

**4. Arquivo: `src/frontend/index.html` (Service Worker)**
- **Localizar**: `.register('sw.js?v=0.0.3-LOCAL')`
- **Substituir por**: `.register('sw.js?v=0.0.3')`

**5. Arquivo: `src/frontend/index.html` (Título)**
- **Localizar**: `<title>PLOC - TESTE</title>`
- **Substituir por**: `<title>PLOC - O Seu Sócio</title>`

**6. Arquivo: `src/frontend/sw.js`**
- **Localizar**: `const CACHE_NAME = 'ploc-v0.0.3-LOCAL';`
- **Substituir por**: `const CACHE_NAME = 'ploc-v0.0.3';`

---

## 🏠 [COMANDO] ATIVAR MODO OFFLINE (LOCAL)

**1. Arquivo: `src/frontend/js/config.js`**
- **Localizar**: `API_BASE_URL: 'https://backend.midializando.cloud/api'`
- **Substituir por**: `API_BASE_URL: 'http://localhost:3000/api'`

**2. Arquivo: `src/frontend/index.html` (Script Main)**
- **Localizar**: `src="/js/main.js?v=0.0.3"`
- **Substituir por**: `src="/js/main.js?v=0.0.3-LOCAL"`

**3. Arquivo: `src/frontend/index.html` (Versão App)**
- **Localizar**: `const APP_VERSION = 'v0.0.3';`
- **Substituir por**: `const APP_VERSION = 'v0.0.3-LOCAL';`

**4. Arquivo: `src/frontend/index.html` (Service Worker)**
- **Localizar**: `.register('sw.js?v=0.0.3')`
- **Substituir por**: `.register('sw.js?v=0.0.3-LOCAL')`

**5. Arquivo: `src/frontend/index.html` (Título)**
- **Localizar**: `<title>PLOC - O Seu Sócio</title>`
- **Substituir por**: `<title>PLOC - TESTE</title>`

**6. Arquivo: `src/frontend/sw.js`**
- **Localizar**: `const CACHE_NAME = 'ploc-v0.0.3';`
- **Substituir por**: `const CACHE_NAME = 'ploc-v0.0.3-LOCAL';`

---

> [!CAUTION]
> **ORDEM PARA O EXECUTOR**: 
> 1. Antes da primeira troca, simplifique o `config.js` removendo a detecção automática `isLocal`.
> 2. Ao receber a ordem de troca, aplique TODAS as substituições do bloco solicitado em uma única tarefa.
> 3. **LIMPEZA DE SESSÃO**: Após a troca, instrua o Mestre a limpar o LocalStorage (F12 > Application > Clear Storage) para evitar conflitos de Tokens entre os ambientes.
