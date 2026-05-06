# Padrão de Estrutura de Projeto - PLOC 🏗️

Este documento é a lei de organização do repositório. NENHUM arquivo deve ser criado fora deste padrão.

## 📂 Hierarquia Principal

### `/src` (Código Fonte)
- **`/src/backend`**: Lógica do servidor Express, APIs, Banco de Dados.
    - `/src/backend/api`: Endpoints e rotas.
    - `/src/backend/models`: Esquemas de dados.
    - `/src/backend/services`: Lógica de integração (OpenAI, Google, etc).
- **`/src/frontend`**: Aplicação de interface (HTML/JS/Framework).

### `/docs` (Documentação e Gestão)
- **`/docs/execution`**: Apenas para o arquivo `current-task.md` em execução.
- **`/docs/history`**: Registro de tarefas concluídas e roadmaps passados.
- **`/docs/guides`**: Manuais de operação (Backend, Frontend, Deploy, etc).
- **`/docs/architecture`**: Desenhos de banco de dados e diagramas de sistema.
- **`/docs/deleteds`**: Arquivo de "cemitério" para aprendizado. Todo arquivo removido deve ser movido para cá com o prefixo da data.

## 📏 Regras de Nomenclatura
- Pastas: `kebab-case` (ex: `user-services`).
- Arquivos JS: `camelCase` (ex: `authController.js`).
- Documentação: `UPPER_CASE` para arquivos mestres, `kebab-case` para o resto.
