# Refatoração do Frontend Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Separar HTML, CSS e JavaScript do frontend em arquivos distintos para melhorar a manutenibilidade e performance.

**Architecture:** Mover estilos para `assets/css` e scripts para `assets/js`. O HTML servirá apenas como estrutura (casca), importando os recursos externos.

**Tech Stack:** Vanilla HTML, CSS, JavaScript.

---

### Task 1: Criação da Estrutura de Assets e Extração de CSS

**Files:**
- Create: `src/frontend/assets/css/global.css`
- Create: `src/frontend/assets/css/dashboard.css`
- Modify: `src/frontend/dashboard.html`

**Step 1: Criar diretórios de assets**
Run: `mkdir -p src/frontend/assets/css src/frontend/assets/js`

**Step 2: Extrair CSS Global**
Identificar variáveis `:root` e estilos base em `dashboard.html` e mover para `global.css`.

**Step 3: Extrair CSS do Dashboard**
Mover o restante dos estilos de `dashboard.html` para `dashboard.css`.

**Step 4: Commit**
```bash
git add src/frontend/assets/css/
git commit -m "style: separa css do dashboard em arquivos externos"
```

---

### Task 2: Extração de Lógica JavaScript

**Files:**
- Create: `src/frontend/assets/js/dashboard-logic.js`
- Create: `src/frontend/assets/js/auth-utils.js`
- Modify: `src/frontend/dashboard.html`

**Step 1: Criar utilitários de autenticação**
Mover lógica de `localStorage.getItem('token')` e `logout()` para `auth-utils.js`.

**Step 2: Mover lógica do Kanban**
Mover todas as funções assíncronas e listeners de scroll/drag para `dashboard-logic.js`.

**Step 3: Commit**
```bash
git add src/frontend/assets/js/
git commit -m "feat: separa lógica javascript do dashboard"
```

---

### Task 3: Limpeza do HTML e Vinculação de Arquivos

**Files:**
- Modify: `src/frontend/dashboard.html`
- Modify: `src/frontend/index.html`

**Step 1: Limpar dashboard.html**
Remover blocos `<style>` e `<script>` e adicionar:
```html
<link rel="stylesheet" href="assets/css/global.css">
<link rel="stylesheet" href="assets/css/dashboard.css">
...
<script src="assets/js/auth-utils.js"></script>
<script src="assets/js/dashboard-logic.js"></script>
```

**Step 2: Commit**
```bash
git add src/frontend/*.html
git commit -m "refactor: limpa html e vincula assets externos"
```

---

### Task 4: Deploy e Validação Final

**Files:**
- Modify: `docs/execution/current-task.md`

**Step 1: Validar localmente**
Verificar se o Dashboard carrega as tarefas corretamente.

**Step 2: Git Push**
Run: `git push`

**Step 3: Deploy Coolify**
Run: `curl.exe -X POST "http://72.61.63.84:8000/api/v1/deploy?uuid=a6n3eh22owgp057dd09t023a&force=true" -H "Authorization: Bearer [TOKEN]"`

**Step 4: Marcar como concluído**
Mover plano para history.
