# 📋 DRAFT-007: Padronização e Fortalecimento do Módulo de Tarefas

## 1. Visão Macro
O objetivo é consolidar o "básico bem feito": um sistema de tarefas robusto, com campos claros e uma interface de gerenciamento (CRUD) que funcione perfeitamente. Sem IA por enquanto, apenas uma ferramenta de organização eficiente e confiável.

## 2. Estrutura de Dados (O Essencial)

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `priority` | Enum | BAIXA, MEDIA, ALTA |
| `status` | Enum | PENDENTE, EM_ANDAMENTO, CONCLUIDO, CANCELADO |
| `tags` | String | Palavras-chave separadas por vírgula (ex: "urgente, casa") |
| `description` | String | Detalhamento da tarefa (Notas) |

## 3. Melhorias na Interface (Frontend)

### 📄 Modal de Tarefas (Refatoração)
O modal deixará de ser apenas um "input rápido" e passará a ter:
- **Header**: Título dinâmico (Nova Tarefa / Editar Tarefa).
- **Corpo**:
    - Nome da Tarefa (Obrigatório).
    - Descrição (Textarea).
    - Seletor de Prioridade (Botões de ação rápida ou dropdown estilizado).
    - Seletor de Categoria/Tags.
- **Footer**: Botões claros de Salvar, Cancelar e Excluir.

### 📅 Visualização
- **Cards**: Exibir visualmente a prioridade (ex: uma pequena barra colorida na lateral: Vermelho=Alta, Amarelo=Média, Azul=Baixa).

## 4. Plano de Execução Técnica

1. **Fase 1: Backend (Prisma)**: Adicionar `priority`, `status` e `tags` ao modelo `Task`.
2. **Fase 2: API**: Ajustar as rotas de POST e PUT para processar esses novos campos.
3. **Fase 3: Frontend (Visual)**: Atualizar o modal de tarefas na `CalendarPage.js` para incluir os novos campos com design premium.

---
**Podemos seguir com esta abordagem "Pé no Chão"?**
