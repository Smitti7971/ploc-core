# Backend Enterprise Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrar o backend do Ploc para uma arquitetura modular de 4 camadas (Routes, Controllers, Services, Middleware) para garantir escalabilidade e manutenibilidade.

**Architecture:** 
1. **Config**: Centralização de segurança e banco.
2. **Routes**: Apenas definições de endpoints.
3. **Controllers**: Orquestração e validação de entrada.
4. **Services**: Lógica de banco (Prisma).

**Tech Stack:** Node.js, Express, Prisma.

---

### Task 1: Centralização de Configurações (A Fundação)

**Files:**
- Create: `config/security.js`
- Create: `config/database.js`
- Modify: `src/backend/index.js`
- Modify: `src/backend/prismaClient.js`

**Step 1: Criar configuração de segurança**
Mover as configurações de `cors`, `helmet` e `rate-limit` de `index.js` para `config/security.js`.

**Step 2: Configurar Instância do Prisma**
Garantir que o `prismaClient.js` exporte uma única instância para ser usada pelos Services.

**Step 3: Vincular no index.js**
Substituir as configurações inline no `index.js` por `require('../../config/security')`.

**Step 4: Commit**
```bash
git add config/ src/backend/index.js
git commit -m "refactor: centraliza configurações de segurança e banco"
```

---

### Task 2: Migração de Autenticação (Routes -> Controllers -> Services)

**Files:**
- Create: `src/backend/controllers/authController.js`
- Create: `src/backend/services/authService.js`
- Modify: `src/backend/routes/authRoutes.js`

**Step 1: Criar authService.js**
Criar funções `findUserByEmail` e `createUser` que usam o Prisma.

**Step 2: Criar authController.js**
Criar funções `login` e `register` que chamam o `authService` e lidam com JWT e Bcrypt.

**Step 3: Limpar authRoutes.js**
Remover a lógica de negócio e apenas apontar para as funções do Controller.

**Step 4: Commit**
```bash
git add src/backend/
git commit -m "refactor: implementa camadas de controller e service para autenticação"
```

---

### Task 3: Migração de Tarefas (Kanban)

**Files:**
- Create: `src/backend/controllers/taskController.js`
- Create: `src/backend/services/taskService.js`
- Modify: `src/backend/routes/taskRoutes.js`

**Step 1: Criar taskService.js**
Mover consultas ao banco (getTasks, createTask, updateTask) para este arquivo.

**Step 2: Criar taskController.js**
Lidar com as requisições HTTP e chamar o service.

**Step 3: Commit**
```bash
git add src/backend/
git commit -m "refactor: modulariza lógica de tarefas (kanban)"
```

---

### Task 4: Validação Final e Limpeza

**Files:**
- Modify: `src/backend/index.js`

**Step 1: Teste de fumaça**
Testar `/api/health` e realizar um login real via Postman/Browser.

**Step 2: Git Push**
Run: `git push`

**Step 3: Deploy**
Run deploy via Coolify API.
