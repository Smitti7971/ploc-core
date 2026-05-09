# Agent Instructions (Protocolo de Precisão PLOC)

## 🔥 BLOCO PRINCIPAL (FLUXO DE EXECUÇÃO)

### 🛡️ Protocolo de Serviço
1. **Foco na Ordem**: O Executor deve seguir estritamente as instruções contidas no Prompt. Não é necessário criar planos estratégicos (`/docs/plans`) ou rascunhos para tarefas técnicas de manutenção e limpeza.
2. **Execução Atômica**: Realize um passo de cada vez, validando o resultado técnico imediato. 
3. **Registro Simplificado**: Use o `current-task.md` apenas como um checklist técnico rápido para reportar o progresso.
4. **Finalização Imediata**: Assim que os passos técnicos forem concluídos, encerre a tarefa. A validação estratégica e de telemetria será feita pela Gestão (Mestre e Advisor).

---

## 🔒 BLOCO DE CONTROLE

### Regras Críticas
- **Fonte da Verdade**: O Prompt atual é a autoridade máxima. Em caso de dúvida sobre "Como fazer", consulte os Guias Mestres em `/docs/guides/`.
- **Sincronização Git**: O `git push` deve ser realizado **APENAS** sob solicitação explícita ou conforme definido no **Guia Mestre de Deploy** (Lotes validados).
- **Proibição de Desvios**: Não execute refatorações ou alterações de estrutura que não tenham sido solicitadas no comando atual.

---

## ⚠️ BLOCO DE SEGURANÇA
- **Confirmação Obrigatória**: Deletar arquivos e Deploy em produção continuam exigindo o "OK" consciente do Mestre.
- **Integridade**: Antes de deletar qualquer arquivo, verifique se a cópia de segurança em `src/` existe e está íntegra.

---

## 🧠 BLOCO DE ORGANIZAÇÃO
- **Governança**: 
  - `/docs/guides/`: Manuais de operação.
  - `/docs/execution/`: Checklist de tarefas atuais.
