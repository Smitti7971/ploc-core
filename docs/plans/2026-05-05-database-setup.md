# Plano de Implementação: Configuração do Banco de Dados PostgreSQL (SaaS Ploc)

> **Para o Agente:** SUB-SKILL OBRIGATÓRIA: Use superpowers:executing-plans para implementar este plano tarefa por tarefa.

**Objetivo:** Configurar a instância do PostgreSQL no Coolify e preparar o esquema de banco de dados para suportar ChatSpeech e Agenda.

**Arquitetura:** Banco de dados relacional (PostgreSQL) com tabelas otimizadas para logs de voz transcritos e eventos de calendário. Revisado pela skill @senior-architect.

**Stack Tecnológica:** PostgreSQL, Coolify, Prisma (recomendado para ORM), npm.

---

### Tarefa 1: Modelagem do Esquema do Banco de Dados
**Arquivos:**
- Criar: `docs/architecture/schema.md`
- Criar: `prisma/schema.prisma` (se utilizarmos Prisma)

    - **Passo 1: Definir as tabelas base com @senior-architect**
      > Projetar as tabelas `User`, `ChatLog` (para ChatSpeech) e `CalendarEvent` (para Agenda) garantindo os relacionamentos corretos.

    - **Passo 2: Revisão de Performance**
      > Validar com o arquiteto se os índices estão otimizados para busca de eventos por data.

    - **Passo 3: Commit**
      ```bash
      git add docs/architecture/schema.md
      git commit -m "docs: define database schema for ChatSpeech and Calendar"
      ```

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
