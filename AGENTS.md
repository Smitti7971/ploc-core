# Agent Instructions

## 🔥 BLOCO PRINCIPAL

### Fluxo obrigatório de execução
1. Identificar tipo da tarefa
2. Selecionar guia correspondente em `/docs/guides`
3. Ler o guia completo
4. Criar/atualizar `/docs/execution/current-task.md`
5. Definir plano de execução
6. Executar passo a passo
7. Registrar tentativas e ações

### Uso obrigatório de Guias
**ANTES de qualquer ação:**
1. Identificar o tipo da tarefa
2. Selecionar o guia correspondente
3. Ler o guia completamente
4. Seguir o checklist antes de executar qualquer passo

**Antes de executar:**
1. Criar ou atualizar `current-task.md`

**Durante execução:**
1. Registrar tentativas

**Após cada passo:**
1. Atualizar status

**Se nenhum guia existir:**
1. Criar um novo guia ANTES de executar
2. Seguir o padrão em `/docs/guides/padra_guias.md`

---

## 🔒 BLOCO DE CONTROLE

### Regras críticas
- Nenhuma ação sem consultar um guia
- Nenhuma execução sem plano definido
- Proibido executar múltiplos passos ao mesmo tempo
- Sempre registrar tentativas
- **Credenciais:** Sempre pesquisar no arquivo `.env` por Tokens, APIs e Senhas antes de perguntar ao USER.
- **Sincronização Git:** É OBRIGATÓRIO realizar `git push` após qualquer alteração de código antes de solicitar deploy ou validar ambiente remoto.

---

## ⚠️ BLOCO DE SEGURANÇA

### Ações que exigem confirmação
- Deletar arquivos
- Alterar estrutura do projeto
- **Deploy** (Antigravity pode disparar, mas deve solicitar aprovação do USER antes)

---

## 🧠 BLOCO DE ORGANIZAÇÃO

### Estrutura do projeto
**Seguir obrigatoriamente:**
`/docs/standards/project-structure.md`

### Gestão de Memória e Aprendizado
- **Histórico:** Ao finalizar uma tarefa, o `current-task.md` DEVE ser movido para `/docs/history/YYYY-MM-DD-nome-da-tarefa.md`.
- **Deletados:** PROIBIDO excluir arquivos permanentemente. Todo arquivo descartado deve ser movido para `/docs/deleteds/YYYY-MM-DD_nome-original.ext`.
- **Governança de Documentação:**
    - **`/docs/standards` (A LEI):** Contém como o projeto *deve* ser (Blueprint/Regras).
    - **`/docs/knowledge` (A REALIDADE):** Contém como o projeto *está* agora (Mapa do Projeto/Estado Atual).
- **Estado do Projeto:** O arquivo `/docs/knowledge/MAPA_DO_PROJETO.md` é a única fonte da verdade para o estado atual da infraestrutura.
