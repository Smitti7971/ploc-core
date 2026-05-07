## Registro de Ações (Heartbeat)

- tipo: criação
- arquivo afetado: docs/execution/current-task.md
- motivo: Blindagem de credenciais e mapeamento de segurança (Task 0020).

# Tarefa Atual: 0020-Auditoria e Blindagem de Credenciais 🔐

## Objetivo
- Centralizar o conhecimento sobre variáveis de ambiente e segredos para evitar erros de autorização e garantir que nenhuma senha esteja "hardcoded" no código.

## Tipo de tarefa
- Segurança / Governança

## Guia selecionado
- `/docs/guides/guide-stantart.md` (Para criação do novo guia de credenciais)

## Plano de execução
1. **Auditoria de .env**: Mapear todas as chaves existentes no `.env` e sua finalidade.
2. **Varredura de Código**: Buscar por strings que pareçam segredos ou tokens inseridos diretamente nos arquivos `.html`, `.js` ou `.ts`.
3. **Criação do Guia**: Criar `docs/guides/gestao_de_credenciais.md` com as instruções de uso.
4. **Estado das APIs**: Criar `docs/knowledge/ESTADO_DAS_APIS.md` para monitorar quais serviços estão configurados corretamente.

## Tentativas
### Tentativa 1
- estratégia: Ler o `.env` e identificar as dependências de cada variável.
- resultado esperado: Lista clara de quais segredos o projeto exige.
- status: ⏳

## Status
- 🔄 EM EXECUÇÃO
