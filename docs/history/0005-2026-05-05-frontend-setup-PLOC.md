# Roadmap & Log: Inicialização do Frontend de Teste - PLOC 🚀

> **Data:** 2026-05-05
> **Objetivo:** Criar uma página HTML simples com o texto "PLOC" centralizado para testar o subdomínio do Frontend.
> **Status Geral:** ✅ CONCLUÍDO (Prova de Vida Confirmada)

---

## 📜 Histórico de Execução (Knowledge Log)

### 📂 TAREFA 1: Criar Estrutura e Página Index
    - ✅ **Tentativa 1 (21:17):** SUCESSO! `src/frontend/index.html` criado com centralização CSS.

### 📂 TAREFA 2: Enviar para o GitHub
    - ❌ **Tentativa 1 (21:17):** Falha na execução do comando. O PowerShell não aceita `&&`.
    - ✅ **Tentativa 2 (21:18):** SUCESSO! Código enviado para o repositório `ploc-core`.

### 📂 TAREFA 3: Deploy no Coolify (Realizado pelo Usuário)
    - ✅ **Tentativa 1:** Backend online, mas ainda não serve o Frontend (Isolamento de pasta).

### 📂 TAREFA 4: Prova de Vida (Backend Servindo Frontend)
    - ⚠️ **Tentativa 1 (21:27):** SUCESSO TÉCNICO! Backend modificado e enviado ao GitHub para servir a pasta `../frontend`.
    - ❌ **Tentativa 2 (21:30):** Falha. Erro `Cannot GET /`. Motivo: O contêiner está isolado na pasta `/src/backend` e não enxerga a pasta `frontend`.
    - ⚠️ **Tentativa 3 (21:32):** SUCESSO TÉCNICO! Pasta `public` criada dentro de `backend` e servidor reconfigurado para servir localmente.
    - ✅ **Tentativa 4 (21:33):** SUCESSO TOTAL! Deploy confirmado e "PLOC" visualizado na raiz da URL.
