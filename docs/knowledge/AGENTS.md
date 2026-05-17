# Agent Instructions

## 🧭 Governança de Conhecimento
1. **Fonte da Verdade**: O arquivo `docs/knowledge/MAPA_DO_PROJETO.md` é a autoridade técnica.
2. **Bússola de Produto**: O arquivo `docs/knowledge/VISÃO_DO_PRODUTO.md` é o mapa mestre de "quem o Ploc é" — define a alma, estética e comportamento do sistema.
3. **Histórico e Auditoria**: Arquivos em `archives/history/` e `archives/deleteds/` são registros fósseis. **NUNCA** use-os como referência para novos designs ou lógicas.
4. **Plano de Voo**: Toda tarefa complexa deve começar com um `docs/execution/current-task.md`.
5. **Regras de Nomenclatura**:
   - Pastas: `kebab-case` (ex: `user-services`).
   - Arquivos JS: `camelCase` (ex: `authController.js`).
   - Documentação: `UPPER_CASE` para arquivos mestres, `kebab-case` para o resto.

## 🔥 BLOCO PRINCIPAL

### Fluxo obrigatório de execução
1. **Alinhamento**: Ler todos os arquivos de **Knowledge** (`MAPA_DO_PROJETO.md`, `PILHA_TECNOLOGICA.md`, `FERRAMENTAS.md`, `MODELO_DE_DADOS.md`, `VISÃO_DO_PRODUTO.md`, `ESTADO_DAS_APIS.md`) para entender o contexto total, restrições e modelos.
2. **Auditoria de Terreno**: Antes de qualquer DRAFT, validar fisicamente o filesystem (usar `ls`, `grep`, `run_command`) para garantir que os arquivos citados na documentação existem e estão operantes.
3. **Co-Criação e Estratégia (DRAFT)**: Criar um rascunho em `/docs/plans` detalhando a Lógica.
   - **REGRA DE OURO**: Priorizar o uso de **Next.js 15+**, **Tailwind CSS 4** e **Zustand**. Manter a arquitetura de **Mídia Stateless (MinIO)** para escalabilidade.
4. **Aprovação**: Aguardar o "OK" consciente do USER sobre a lógica proposta.
5. **Plano Operacional (Rigidez)**: Criar o `/docs/execution/current-task.md` seguindo rigorosamente as **5 Fases** detalhadas no [MASTER_PLANEJAMENTO_ESTRATEGICO.md](../guides/MASTER_PLANEJAMENTO_ESTRATEGICO.md).
6. **Execução**: Executar um passo de cada vez, registrando o sucesso/falha no `current-task.md` com emojis.
7. **Validação de Saúde (Telemetria)**:
   - Seguir rigorosamente o protocolo de pós-voo detalhado no [MASTER_DEPLOY_COOLIFY.md](../guides/MASTER_DEPLOY_COOLIFY.md).
8. **Sincronia e Finalização**: 
   - Atualizar todos os arquivos de **Knowledge** afetados pela tarefa (`MAPA_DO_PROJETO.md`, `PILHA_TECNOLOGICA.md`, `FERRAMENTAS.md`, `MODELO_DE_DADOS.md`, `ESTADO_DAS_APIS.md`).
   - Mover `current-task.md` para `/docs/history`.
   - Mover rascunhos para `docs/knowledge/archives/deleteds/`.

---

## 🔒 BLOCO DE CONTROLE

### Regras críticas
- Nenhuma ação sem consultar um guia.
- Nenhuma execução sem plano definido na `current-task.md`.
- Proibido executar múltiplos passos técnicos ao mesmo tempo.
- **Credenciais:** Sempre pesquisar no arquivo `.env` antes de perguntar ao USER.
- **Sincronização Git**: O `git push` deve ser realizado **APENAS** sob solicitação explícita ou conforme definido no **Guia Mestre de Deploy** (Lotes validados).
- **SEGURANÇA DE DEPLOY**: É terminantemente proibido usar o histórico de deploys (listagem) como prova de sucesso. A validação deve ser feita EXCLUSIVAMENTE via consulta direta ao ID do deploy ativo e verificação de saúde do container.

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
