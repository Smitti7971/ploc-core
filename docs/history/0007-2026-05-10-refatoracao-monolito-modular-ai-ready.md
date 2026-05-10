# Tarefa: Refatoração Arquitetural - Fase 1 (Estrutura Base) 🏗️

## 1. Entender 🧠
- Objetivo: Migrar para estrutura `apps/` e `packages/`.
- Prioridade: Não quebrar o build nem as rotas existentes.
- Risco: Caminhos de importação (require/import) quebrados.

## 2. Preparar 🛠️
- [✅] Criar pastas: `apps/frontend`, `apps/backend`.
- [✅] Criar pastas: `packages/shared`, `packages/database`, `packages/ai-core`.
- [✅] Mapear todos os caminhos relativos no `package.json`.

- [✅] **Passo 1**: Criar nova hierarquia de diretórios.
- [✅] **Passo 2**: Mover `src/frontend` e `src/backend`.
- [✅] **Passo 3**: Ajustar `Dockerfile` e configurações de deploy para os novos caminhos.
- [✅] **Passo 4**: Validar integridade com Health Check.
- [✅] **Passo 5**: Refatorar Módulo de Tasks (Service + Repository).
- [✅] **Passo 6**: Refatorar Módulos de Auth e User.
- [✅] **Passo 7**: Implementar AI Layer (Orchestrator + Tools).
- [✅] **Passo 8**: Integrar Chat no Frontend (UI Agente).

## 4. Resultado 🏁
- Estado alvo: ✅ Workspace organizado e pronto para escala de Agentes de IA.
