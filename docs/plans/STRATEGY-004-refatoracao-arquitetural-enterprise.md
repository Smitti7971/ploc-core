# ESTRATÉGIA: Refatoração Arquitetural Enterprise AI (PLOC) 🏗️🤖

Este documento detalha o plano de transformação do Ploc em um Modular Monolith preparado para IA e Agentes Autônomos.

## 🎯 Objetivo
Migrar da arquitetura MVC/CRUD tradicional para uma arquitetura orientada a serviços, ferramentas e eventos, garantindo desacoplamento total entre a IA e a persistência de dados.

---

## 📅 Fases da Migração

### Fase 1: Reestruturação do Workspace (The Monorepo Foundation)
- [ ] Criar estrutura de diretórios `apps/` e `packages/`.
- [ ] Mover `src/frontend` para `apps/frontend`.
- [ ] Mover `src/backend` para `apps/backend`.
- [ ] Inicializar `packages/shared`, `packages/database`, `packages/ai-core`.
- [ ] Atualizar referências de caminhos e scripts de build.

### Fase 2: Desacoplamento do Núcleo (Services & Repositories)
- [ ] **Módulo de Tasks**: 
    - Criar `TaskRepository` (Persistência Pura).
    - Criar `TaskService` (Regras de Negócio: validação, datas, orquestração).
    - Refatorar `taskController` (Apenas entrada/saída HTTP).
- [ ] **Módulo de Auth/User**: Seguir o mesmo padrão de isolamento.

### Fase 3: A Camada de Inteligência (AI Layer & Tools)
- [ ] Implementar `AIOrchestrator` em `apps/backend/ai/orchestrator`.
- [ ] Criar o sistema de **Tools** em `apps/backend/ai/tools`:
    - `create-task.tool.js` (Interface entre IA e `TaskService`).
- [ ] Centralizar prompts em `apps/backend/ai/prompts`.
- [ ] Criar adaptadores de provedores (OpenAI/Gemini) em `apps/backend/ai/providers`.

### Fase 4: Shared Layer & Contratos (Schemas)
- [ ] Mover validações Zod/Joi para `packages/schemas`.
- [ ] Definir DTOs compartilhados em `packages/shared/dto`.
- [ ] Unificar constantes em `packages/shared/constants`.

### Fase 5: Eventos e Background Jobs (Reatividade)
- [ ] Criar infraestrutura básica de eventos (EventBus simples).
- [ ] Preparar pastas para `jobs/` e `queues/` (foco inicial em Lembretes/Reminders).

### Fase 6: Frontend Modular (Feature-Based)
- [ ] Reorganizar `apps/frontend/js/components` para `apps/frontend/features/`.
- [ ] Implementar camada de estado explícita (State Layer).

---

## 🛡️ Regras de Ouro da Refatoração
1. **IA é cega para o Banco**: A IA nunca toca no Prisma. Ela pede para uma Tool, que chama um Service, que usa o Repository.
2. **Controller é burro**: Se houver um `if` de regra de negócio no Controller, a refatoração falhou.
3. **Persistência é isolada**: Se decidirmos trocar o Prisma por outro ORM, apenas o Repository deve sofrer.

---

## 🚦 Próximos Passos (Imediato)
1. Criar a estrutura de pastas base.
2. Migrar o Módulo de Tasks (Ponto crítico e mais movimentado).

**Aguardando OK do mestre para iniciar a Fase 1.** 🫡✅
