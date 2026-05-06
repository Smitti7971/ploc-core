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
1. **Seed de Dados**: Inserir 5 usuários de teste no banco via script.
2. **Backend API**: Criar a rota `GET /api/users` no `index.js`.
3. **Frontend UI**: Criar uma página de teste com tabela estilizada e campo de busca.
4. **Deploy e Validação**: Conferir se os dados aparecem corretamente no domínio público.

## Tentativas
### Tentativa 1
- estratégia: Inserção de dados e criação da rota de API.
- resultado: ⏳ Aguardando execução.

## Status
- [ ] Inserção de dados de teste (Seed)
- [ ] Rota `GET /api/users` no Backend
- [ ] Interface de Tabela com Pesquisa no Frontend
- [ ] Validação no ambiente de produção
