# Plano de Implementação: Configuração do Banco de Dados PostgreSQL (SaaS Ploc)

> **Para o Agente:** SUB-SKILL OBRIGATÓRIA: Use superpowers:executing-plans para implementar este plano tarefa por tarefa.

**Objetivo:** Configurar a instância do PostgreSQL no Coolify e preparar o esquema de banco de dados para suportar ChatSpeech e Agenda.

**Arquitetura:** Banco de dados relacional (PostgreSQL) com tabelas otimizadas para logs de voz transcritos e eventos de calendário. Revisado pela skill @senior-architect.

**Stack Tecnológica:** PostgreSQL, Coolify, Prisma (recomendado para ORM), npm.

---

### Tarefa 1: Modelagem do Esquema do Banco de Dados
- Criar: `docs/architecture/schema.md` ✅ (Concluído em 06/05)
- Criar: `prisma/schema.prisma` (Pendente - decidindo ORM)

    - ✅ **Passo 1: Definir as tabelas base com @senior-architect**
      > SUCESSO! Tabelas `users`, `chat_logs` e `calendar_events` definidas.
    - ✅ **Passo 2: Revisão de Performance**
      > Índices planejados para `user_id` e buscas temporais.
    - ✅ **Passo 3: Commit** (Pendente execução de git commit)

### Tarefa 2: Configuração da Instância no Coolify
**Arquivos:**
- Modificar: `.env`

    - **Passo 1: Criar recurso de Banco de Dados no Coolify**
      > Acessar o painel do Coolify, criar um novo PostgreSQL e anotar as credenciais.

    - **Passo 2: Configurar variáveis de ambiente locais**
      > Atualizar o arquivo `.env` com a `DATABASE_URL` fornecida pelo Coolify para acesso externo.

    - **Passo 3: Testar Conexão**
      > Rodar um script simples para validar que o projeto local consegue "falar" com o banco na nuvem.

### Tarefa 3: Inicialização do ORM e Migrações
**Arquivos:**
- Criar: `src/lib/db.ts`

    - **Passo 1: Instalar dependências do banco**
      > Executar `npm install prisma @prisma/client` (ou ORM de preferência).

    - **Passo 2: Executar a primeira migração**
      > Subir o esquema definido para o banco de dados no Coolify.

    - **Passo 3: Commit**
      ```bash
      git add .
      git commit -m "chore: setup database orm and initial migration"
      ```
