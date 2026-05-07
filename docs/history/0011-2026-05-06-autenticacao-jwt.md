## Registro de Ações (Heartbeat)

- tipo: integração | frontend | backend
- arquivo afetado: docs/execution/current-task.md
- motivo: Criar fluxo completo de dados do Banco para o Front-end para validação visual.

# Tarefa Atual: Teste de Fluxo de Dados (Full-Stack)

## Objetivo
- Alimentar o banco com dados de teste (Seed).
- Criar endpoint no Backend para listar usuários.
- Criar interface no Frontend com tabela e pesquisa para exibir esses dados.

## Tipo de tarefa
- Full-Stack / Integração

## Guia selecionado
- `/docs/guides/backend.md`
- `/docs/guides/frontend.md`

## Plano de execução
1. **Refatoração**: Separar `index.js` em `routes/` e `controllers/`.
2. **Segurança**: Criar middleware de autenticação (base).
3. **Limpeza**: Remover endpoints de teste e seed.
4. **Validação**: Garantir que o Backend continua respondendo após a reorganização.

## Tentativas
### Tentativa 1
- estratégia: Inserção de dados e criação da rota de API.
- resultado: ⏳ Aguardando execução.

## Status
- [x] Inserção de dados de teste (Seed)
- [x] Rota `GET /api/users` no Backend
- [x] Interface de Tabela com Pesquisa no Frontend
- [ ] Reorganização de Pastas (Refatoração)
- [ ] Implementação de Middleware de Autenticação (JWT)
- [ ] Limpeza de Endpoints de Teste
