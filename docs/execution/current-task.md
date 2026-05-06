## Registro de Ações (Heartbeat)

- tipo: infraestrutura | banco de dados
- arquivo afetado: docs/execution/current-task.md
- motivo: Configuração e integração do PostgreSQL com o Backend Node.js.

# Tarefa Atual: Configuração e Integração do Banco de Dados

## Objetivo
- Sincronizar as credenciais do PostgreSQL com o Backend.
- Estabelecer a primeira conexão bem-sucedida.
- Definir o ORM (Prisma/Drizzle) que será utilizado.

## Tipo de tarefa
- Banco de Dados / Integração

## Guia selecionado
- `/docs/guides/database.md`
- `/docs/guides/gestao_segredos.md`
- `/docs/guides/coolify_sync.md`
- `/docs/guides/deploy.md`

## Plano de execução
1. **Credenciais**: Obter os dados de acesso ao PostgreSQL no painel do Coolify.
2. **Backend Config**: Adicionar as variáveis no `.env` do Backend via Coolify.
3. **ORM Setup**: Instalar e configurar o ORM no diretório `/src/backend`.
4. **Teste de Vida**: Criar um endpoint `/api/db-status` para validar a conexão real.

## Tentativas
### Tentativa 1
- estratégia: Levantamento de credenciais do banco.
- resultado: ⏳ Aguardando auditoria.

## Status
- 🔄 EM EXECUÇÃO
