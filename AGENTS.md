# Agent Instructions

## 🔥 BLOCO PRINCIPAL

### Fluxo obrigatório de execução
1. **Alinhamento**: Ler `MAPA_DO_PROJETO.md` e `BLUEPRINT_SAAS.md` para entender o contexto macro.
2. **Co-Criação e Estratégia (DRAFT)**: Antes de qualquer código, criar um rascunho em `/docs/plans` detalhando a **Lógica** e as **Engrenagens**.
3. **Aprovação**: Aguardar o "OK" consciente do USER sobre a lógica proposta.
4. **Plano Operacional (Rigidez)**: Criar o `/docs/execution/current-task.md` seguindo as **5 Fases do MASTER_PLANEJAMENTO_ESTRATEGICO.md**:
   - (1. Entender, 2. Preparar, 3. Executar, 4. Resultado, 5. Validar).
5. **Execução**: Executar um passo de cada vez, registrando o sucesso/falha no `current-task.md`.
   - **OBRIGATÓRIO**: Atualizar o `current-task.md` IMEDIATAMENTE após cada passo, usando o formato de emojis (✅, ⚠️, ❌) e descrevendo a tentativa, importante, não delete as tentativas, apenas adicione novas.
6. **Validação**: Realizar testes operacionais (logs, fumaça, funcionalidade).
7. **Sincronia e Evolução**: 
   - Atualizar o `MAPA_DO_PROJETO.md` se necessário.
   - **IMPORTANTE**: Se uma nova prática eficaz ou um erro comum foi descoberto, atualizar o **Guia Mestre** correspondente na seção "Lições de Batalha".
8. **Finalização e Melhoria**: 
   - **Auditoria de Deslizes**: Analisar a execução em busca de "engasgos" (falta de informação, erros de ferramenta, atrasos).
   - **Conserto Imediato**: Se um deslize foi causado por falta de clareza, atualizar o Guia Mestre correspondente na hora.
   - Mover o `current-task.md` para o histórico indexado (`/docs/history`).
   - Mover o rascunho de estratégia (`/docs/plans/DRAFT-xxx.md`) para `/docs/deleteds`.

---

## 🔒 BLOCO DE CONTROLE

### Regras críticas
- Nenhuma ação sem consultar um guia.
- Nenhuma execução sem plano definido na `current-task.md`.
- Proibido executar múltiplos passos técnicos ao mesmo tempo.
- **Credenciais:** Sempre pesquisar no arquivo `.env` antes de perguntar ao USER.
- **Sincronização Git:** É OBRIGATÓRIO realizar `git push` após qualquer alteração de código.

---

## ⚠️ BLOCO DE SEGURANÇA

### Ações que exigem confirmação
- Deletar arquivos.
- Alterar estrutura do projeto (Refatoração).
- Deploy em produção.

---

## 🧠 BLOCO DE ORGANIZAÇÃO

### Gestão de Memória e História
- **Indexação de Histórico**: Ao finalizar, o arquivo deve ser movido para:
  `/docs/history/NNNN-YYYY-MM-DD-nome-da-tarefa.md`
  *(Onde NNNN é o próximo número sequencial baseado na pasta history)*.
- **Fonte da Verdade**: O arquivo `/docs/knowledge/MAPA_DO_PROJETO.md` deve refletir o estado exato da infraestrutura e arquivos atuais.
- **Deletados**: Proibido excluir permanentemente. Mover para `/docs/deleteds/`.

### Governança de Documentação
- **`/docs/standards`**: O "Como deve ser" (Blueprint).
- **`/docs/knowledge`**: O "Como está agora" (Mapa).
- **`/docs/execution`**: O "O que estou fazendo" (Current Task).
