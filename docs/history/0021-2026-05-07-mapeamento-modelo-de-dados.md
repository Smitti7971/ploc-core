## Registro de Ações (Heartbeat)

- tipo: criação
- arquivo afetado: docs/execution/current-task.md
- motivo: Mapeamento do modelo de dados (Task 0021).

# Tarefa Atual: 0021-Mapeamento do Modelo de Dados 📊

## Objetivo
- Documentar a estrutura do banco de dados (PostgreSQL) e as relações entre as entidades para facilitar a expansão do SaaS.

## Tipo de tarefa
- Documentação / Conhecimento

## Guia selecionado
- `/docs/guides/guide-stantart.md` (Para formatação)

## Plano de execução
1. **Análise do Schema**: Extrair campos e tipos das tabelas `User`, `Routine` e `Task`.
2. **Mapeamento de Relações**: Documentar as chaves estrangeiras e a hierarquia (ex: Uma Task pertence a um User).
3. **Criação do Documento**: Escrever `docs/knowledge/MODELO_DE_DADOS.md`.

## Tentativas
### Tentativa 1
- estratégia: Usar os dados do `schema.prisma` para criar uma documentação técnica e visual (Markdown Tables).
- resultado esperado: Tabela clara com descrição de cada campo.
- status: ⏳

## Status
- 🔄 EM EXECUÇÃO
