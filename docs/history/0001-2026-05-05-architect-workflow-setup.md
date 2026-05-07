# Plano de Implementação: Fluxo do Arquiteto e Estrutura do Projeto

> **Para o Agente:** SUB-SKILL OBRIGATÓRIA: Use superpowers:executing-plans para implementar este plano tarefa por tarefa.

**Objetivo:** Estabelecer um processo permanente de revisão arquitetural usando @senior-architect e inicializar a estrutura de diretórios base do projeto.

**Arquitetura:** Codificar uma regra de "Revisão Primeiro" no AGENTS.md e criar uma hierarquia de pastas escalável (src, tests, docs, config) revisada pela skill de arquiteto.

**Stack Tecnológica:** Antigravity Skills (@writing-plans, @senior-architect), npm.

---

### Tarefa 1: Codificar Regra de Revisão Arquitetural
**Arquivos:**
- Modificar: `AGENTS.md`

    - **Passo 1: Propor a alteração no AGENTS.md**
      > Adicionar uma nova seção `## Governança Arquitetural` com a regra: "Toda criação, modificação ou exclusão de arquivo DEVE ser precedida por uma revisão da skill @senior-architect."

    - **Passo 2: Aplicar a alteração**
      > Modificar o `AGENTS.md` para incluir a nova seção.

    - **Passo 3: Commit**
      ```bash
      git add AGENTS.md
      git commit -m "chore: enforce mandatory @senior-architect reviews"
      ```

### Tarefa 2: Inicializar Estrutura do Projeto
**Arquivos:**
- Criar: `src/`, `tests/`, `docs/`, `config/`

    - **Passo 1: Invocar @senior-architect para validar a estrutura proposta**
      > Pedir à skill de arquiteto para sugerir uma estrutura moderna e escalável para uma aplicação web chamada "Ploc".

    - **Passo 2: Criar os diretórios**
      > Com base na aprovação do arquiteto, criar as pastas principais.

    - **Passo 3: Commit**
      ```bash
      git add .
      git commit -m "chore: initialize project directory structure"
      ```

### Tarefa 3: Verificação do Fluxo de Trabalho
**Arquivos:**
- Criar: `src/index.js` (ou equivalente)

    - **Passo 1: Criar um arquivo de teste seguindo a nova regra**
      > Pedir ao @senior-architect para revisar a criação de um ponto de entrada simples.

    - **Passo 2: Implementar e verificar**
      > Criar o arquivo e confirmar que a revisão foi realizada.

    - **Passo 3: Commit**
      ```bash
      git add src/index.js
      git commit -m "feat: initial project entry point with architect review"
      ```
