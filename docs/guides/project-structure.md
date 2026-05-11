# Padrão de Estrutura de Projeto - PLOC 🏗️

Este documento é a lei de organização do repositório. NENHUM arquivo deve ser criado fora deste padrão.

## 📂 Hierarquia Principal

### `/apps` (Aplicações)
- **`/apps/backend`**: Lógica do servidor Express, APIs, Camada de Agentes.
- **`/apps/frontend`**: Interface SPA (HTML/JS).

### `/packages` (Módulos Compartilhados)
- **`/packages/shared`**: DTOs, Constantes e Utils comuns.
- **`/packages/schemas`**: Validações de dados (Zod/Contratos).
- **`/packages/database`**: Configurações de Banco de Dados e Prisma.
- **`/packages/ai-core`**: Orquestração e lógica base de IA.

### `/docs` (Documentação e Gestão)
- **`/docs/execution`**: Apenas para o arquivo `current-task.md` em execução.
- **`/docs/history`**: Registro de tarefas concluídas e roadmaps passados.
- **`/docs/guides`**: Manuais de operação (Backend, Frontend, Deploy, etc).
- **`/docs/architecture`**: Desenhos de banco de dados e diagramas de sistema.


## 📏 Regras de Nomenclatura
- Pastas: `kebab-case` (ex: `user-services`).
- Arquivos JS: `camelCase` (ex: `authController.js`).
- Documentação: `UPPER_CASE` para arquivos mestres, `kebab-case` para o resto.
