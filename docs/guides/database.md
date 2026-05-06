# GUIA: Banco de Dados (PostgreSQL) 🗄️

## Quando usar
- Para criação de schemas, tabelas e migrações.
- Para integração do Backend com a camada de persistência.
- Para manutenção e auditoria de dados.

## Padrões do Projeto
- **Banco**: PostgreSQL (Gerenciado via Coolify).
- **ORM**: A definir (Sugestão: Prisma ou Drizzle).
- **Ambiente**: As variáveis de conexão devem estar no arquivo `.env` (Backend).

## 🛑 REGRAS DE SEGURANÇA
1. **NUNCA** exponha a URL de conexão (`DATABASE_URL`) em logs ou mensagens de erro.
2. **BACKUP**: Sempre realizar um dump manual ou snapshot no Coolify antes de migrações destrutivas.
3. **QUERY**: Prefira usar o ORM em vez de Raw SQL para evitar SQL Injection.

## Checklist de Conexão
- [ ] O banco está "Running" no Coolify?
- [ ] A rede interna permite que o Backend fale com o banco?
- [ ] A variável `DATABASE_URL` está configurada no Backend?

## Execução padrão (Migrações)
1. Criar o modelo no ORM.
2. Gerar a migração localmente.
3. Testar a migração em ambiente de staging (se disponível).
4. Aplicar em produção via comando CLI.

## Verificação Final ✅
1. Consultar a saúde do banco via endpoint `/api/health` (após integração).
2. Verificar logs do container para erros de conexão (ECONNREFUSED).
