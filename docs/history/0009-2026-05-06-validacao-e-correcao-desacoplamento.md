## Registro de Ações (Heartbeat)

- tipo: correção | infraestrutura
- arquivo afetado: docs/execution/current-task.md
- motivo: Corrigir falha de carregamento do Frontend (Cannot GET /) e Backend (502 Bad Gateway).

# Tarefa Atual: Validação e Correção do Desacoplamento

## Objetivo
- Fazer o site `ploc.midializando.cloud` carregar o conteúdo de `/src/frontend`.
- Fazer a API `backend.midializando.cloud` responder corretamente a partir de `/src/backend`.

## Tipo de tarefa
- Infraestrutura / Correção

## Guia selecionado
- `/docs/guides/coolify_sync.md`
- `/docs/guides/conferencia_paginas.md`
- `/docs/guides/validacao_operacional.md`
- `/docs/guides/uso_navegador.md`

## Plano de execução
1. **Auditoria Visual**: Smitti confirma se as configurações no painel batem com o `MAPA_DO_PROJETO.md`.
2. **Correção Frontend**: Ajustar o modo de serviço para garantir que o Nginx sirva o `index.html`.
3. **Correção Backend**: Investigar o erro 502 (logs do container).
4. **Verificação Final**: Aplicar protocolo de conferência visual e operacional.

## Tentativas
### Tentativa 1
- estratégia: Iniciar auditoria de configuração manual com o usuário.
- resultado: ✅ Sucesso. Identificada inversão nos nomes e build packs.
### Tentativa 2
- estratégia: Sincronizar Build Packs (Frontend: Static | Backend: Nixpacks).
- resultado: ✅ Sucesso. Ambos os serviços respondendo corretamente.

## Status
- ✅ CONCLUÍDO
