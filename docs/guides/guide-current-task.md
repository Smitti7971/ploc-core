## Registro de Ações (Heartbeat)

- tipo: criação | modificação | deleção
- arquivo afetado: AGENTS.md, docs/guides/reorganizacao_estrutural.md, docs/execution/current-task.md
- motivo: Implementação de novo fluxo de trabalho e preparação para reorganização.

# Tarefa Atual: Arrumar a Casa (Separar API e APP)

## Objetivo
- Renomear `src/backend` para `src/api`.
- Renomear `src/frontend` para `src/app`.
- Mover o frontend de dentro do backend para a pasta `app`.
- Garantir que o backend seja puramente uma API (remover `express.static`).

## Tipo de tarefa
- Reorganização Estrutural

## Guia selecionado
- `/docs/guides/reorganizacao_estrutural.md`

## Plano de execução
1. **Preparação:** Validar que o estado atual está commitado (Já realizado anteriormente).
2. **Renomeação:** Usar comandos de sistema para renomear `src/backend` para `src/api`.
3. **Reorganização de Conteúdo:**
    - Criar `src/app`.
    - Mover `src/api/public/index.html` para `src/app/index.html`.
    - Remover pasta `src/api/public`.
4. **Atualização de Código:**
    - Modificar `src/api/index.js` para remover lógica de arquivos estáticos.
    - Atualizar `src/api/package.json` (se necessário).
5. **Teste:** Verificar se o servidor em `src/api` inicia corretamente.

## Tentativas
### Tentativa 1
- estratégia: Executar plano passo a passo via terminal.
- resultado: ⏳ Aguardando início.

## Status
- 🔄 EM EXECUÇÃO
