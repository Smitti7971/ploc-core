# Roadmap & Log: Reset de Repositório e Reconfiguração Coolify - PLOC 🚀

> **Data:** 2026-05-05
> **Objetivo:** Criar um novo repositório limpo no GitHub e garantir que o Coolify aponte para ele.
> **Status Geral:** ✅ CONCLUÍDO (Ambiente Restaurado e Online)

---

## 📜 Histórico de Execução (Knowledge Log)

### 📂 TAREFA 1: Criar Novo Repositório no GitHub
    - ❌ **Tentativa 1:** Falha via `curl.exe` direta. Erro de parsing JSON.
    - ✅ **Tentativa 2:** SUCESSO! Repositório `ploc-core` criado via API.

### 📂 TAREFA 2: Vincular Código Local e Fazer Push
    - ❌ **Tentativa 1:** Falha no `commit`. Erro: `Author identity unknown`.
    - ❌ **Tentativa 2:** Falha no `push`. Erro: `Secret Scanning` (Token no commit).
    - ❌ **Tentativa 3:** Falha no `push`. Erro: Token persistente no histórico.
    - ❌ **Tentativa 4:** Falha no `push`. Erro: Identidade perdida após reset da pasta `.git`.
    - ✅ **Tentativa 5:** SUCESSO! Git resetado, identidade fixa e Push realizado.

### 📂 TAREFA 3: Reconfigurar Backend no Coolify
    - ❌ **Tentativa 1:** Falha no `PATCH` via API. Erro: `Invalid JSON`.
    - ✅ **Tentativa 2:** SUCESSO! Aplicação `a6n3eh22owgp057dd09t023a` atualizada para o repositório `ploc-core`.

### 📂 TAREFA 4: Disparar Deploy e Monitorar
    - ❌ **Tentativa 1:** Falha via `POST /deploy`. Erro: `Not found`.
    - ❌ **Tentativa 2:** Falha via `GET /deploy`. Erro: `Not found`.
    - ❌ **Tentativa 3:** Falha via Webhook GitHub simulado. Erro: `Not found`.
    - ⚠️ **Tentativa 4:** Sucesso técnico na atualização do `base_directory` para `/src/backend`.
    - ❌ **Tentativa 5:** Deploy manual (Usuário). Erro no Log: `/bin/bash: -c: option requires an argument`.
    - 🔄 **Tentativa 6:** Investigação de Cache. Log indicou que o Coolify ainda lia o repositório antigo.
    - ❌ **Tentativa 7:** Deploy manual (Usuário). Erro persiste (Permissão Git App).
    - ⚠️ **Tentativa 8 (20:58):** Sucesso técnico! Variável `REDEPLOY_TRIGGER` injetada. 
    - ⚠️ **Tentativa 9 (20:59):** Sucesso técnico no Stop/Start. Status: `exited:unhealthy`.
    - ❌ **Tentativa 10 (21:01):** Falha na criação da nova aplicação (Validation).
    - ❌ **Tentativa 11 (21:02):** Falha na criação (Git URL).
    - ⚠️ **Tentativa 12 (21:03):** Sucesso técnico! Nova aplicação `ploc-backend-v3` criada (UUID: `leaocf7ke5lgluo0bg2dco0w`).
    - ❌ **Tentativa 13 (21:06):** Deploy disparado na aplicação errada.
    - ✅ **Tentativa 14 (21:11):** SUCESSO TOTAL! Deploy disparado na `ploc-backend-v3`. Servidor respondendo na porta 3000.

---

## 🏁 Estado Final
O backend do PLOC está oficialmente restaurado no repositório `ploc-core` e rodando em uma nova instância limpa no Coolify. O loop de erro foi quebrado com a estratégia de "Nuke & Create New".
