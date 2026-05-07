## Registro de Ações (Heartbeat)

- tipo: criação | infraestrutura
- arquivo afetado: docs/execution/current-task.md
- motivo: Sincronização da infraestrutura e instalação do utilitário jq.

## Configuração Identificada (Inversão Real - Fix)
- **Backend App** (`a6n3eh22owgp057dd09t023a`): Aponta para `/src/backend` (URL: http://backend.midializando.cloud/).
- **Frontend App** (`leaocf7ke5lgluo0bg2dco0w`): Aponta para `/src/frontend` (URL: https://ploc.midializando.cloud/).

# Tarefa Atual: Sincronização Coolify e Instalação de Ferramentas

## Objetivo
- Instalar o `jq` para manipulação de JSON via CLI.
- Configurar o serviço de API e Frontend no Coolify via API.
- Corrigir a inversão de domínios.

## Tipo de tarefa
- Infraestrutura / Deploy

## Guia selecionado
- `/docs/guides/coolify_sync.md`
- `/docs/guides/ferramentas_desenvolvimento.md`
- `/docs/guides/powershell_usage.md`
- `/docs/guides/conferencia_paginas.md`
- `/docs/guides/validacao_operacional.md`
- `/docs/guides/uso_navegador.md`

## Plano de execução
1. **Ferramental:** Instalar o `jq` via `winget`.
2. **Acesso:** Listar aplicações via API do Coolify.
3. **Ajuste Backend (API):** Atualizar Base Directory e FQDN via API.
4. **Ajuste Frontend (APP):** Atualizar Base Directory e FQDN via API.
5. **Teste de Fogo:** Validar endpoints e carregamento do app.

## Tentativas
### Tentativa 1
- estratégia: Instalar jq para melhorar a precisão dos comandos de API.
- resultado: ✅ Sucesso.
### Tentativa 2
- estratégia: Corrigir Base Directory via API (Nativo PowerShell).
- resultado: ✅ Sucesso (Frontend agora aponta para /src/frontend).
### Tentativa 3
- estratégia: Deploy e Validação de Inversão.
- resultado: ⚠️ Falha inicial (Arquivos não estavam no GitHub).
### Tentativa 4
- estratégia: Sincronizar Git (Push) e disparar Deploy via API (Nativo PowerShell).
- resultado: ✅ Sucesso. Deploys enfileirados para Backend (`leaoc...`) e Frontend (`a6n3...`).

## Status
- 🔄 EM EXECUÇÃO (Aguardando conclusão do deploy no servidor)
