## Registro de Ações (Heartbeat)

- tipo: criação | infraestrutura
- arquivo afetado: docs/execution/current-task.md
- motivo: Sincronização da infraestrutura e instalação do utilitário jq.

## Configuração Identificada (Inversão)
- **Frontend App** (`a6n3eh22owgp057dd09t023a`): Aponta para `/src/backend` (ERRADO).
- **Backend App** (`leaocf7ke5lgluo0bg2dco0w`): Aponta para `/src/backend` (OK).

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
- resultado: 🔄 Aguardando retorno do deploy manual do usuário.

## Status
- 🔄 EM EXECUÇÃO
