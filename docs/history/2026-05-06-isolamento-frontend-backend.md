## Registro de Ações (Heartbeat)

- tipo: modificação | deleção
- arquivo afetado: src/backend/index.js, src/backend/public/index.html, src/frontend/index.html, docs/knowledge/MAPA_DO_PROJETO.md
- motivo: Desacoplamento do frontend do processo de backend para permitir deploy independente.

# Tarefa Atual: Isolamento do Frontend e Purificação da API

## Objetivo
- Mover o `index.html` para a pasta correta (`src/frontend`).
- Remover a dependência de arquivos estáticos do servidor Express.
- Garantir que o Backend seja 100% API.

## Tipo de tarefa
- Reorganização Estrutural

## Guia selecionado
- `/docs/guides/reorganizacao_estrutural.md`

## Plano de execução
1. **Mover Arquivo:** Mover `src/backend/public/index.html` para `src/frontend/index.html`.
2. **Limpeza de Pasta:** Remover a pasta `src/backend/public` (Agora obsoleta).
3. **Refatoração de Código:** Remover `app.use(express.static...)` do `src/backend/index.js`.
4. **Atualização de Documentação:** Refletir a nova arquitetura no `MAPA_DO_PROJETO.md`.
5. **Verificação Local:** Confirmar se a API `/api/health` continua respondendo.

## Tentativas
### Tentativa 1
- estratégia: Execução sequencial dos passos de movimentação e refatoração.
- resultado: ✅ Sucesso. Frontend isolado em `src/frontend` e Backend limpo.

## Status
- ✅ CONCLUÍDO
