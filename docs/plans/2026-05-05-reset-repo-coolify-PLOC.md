# Roadmap: Reset de Repositório e Reconfiguração Coolify - PLOC 🚀

> **Data:** 2026-05-05
> **Objetivo:** Criar um novo repositório limpo no GitHub e garantir que o Coolify aponte para ele.
> **Status Geral:** 🟢 Em Progresso (Tarefa 1 Concluída)

---

## 📜 Histórico de Execução (Follow-up)

### 📂 Tarefa 1: Criar Novo Repositório no GitHub
- ❌ **Tentativa 1 (20:20):** Falha na criação via `curl.exe` direta. 
    - *Erro:* `Problems parsing JSON`. O terminal do Windows corrompeu as aspas do comando.
- ✅ **Tentativa 2 (20:22):** Sucesso! Repositório criado usando um arquivo JSON temporário como payload.
    - *Resultado:* Repositório `ploc-core` disponível em `https://github.com/Smitti7971/ploc-core`.
- ❌ **Tarefa 2 - Tentativa 4 (20:30):** Falha na identidade. Ao resetar o `.git`, perdi a configuração de e-mail/nome. Vou reaplicar e fazer o push final.

---

## 🗺️ Roadmap de Tarefas

### [✅] Tarefa 1: Criar Novo Repositório no GitHub
- **Status:** Concluído 🏁
- **Ações:** Criação via API REST do GitHub.

### [⏳] Tarefa 2: Vincular Código Local e Fazer Push
- **Status:** Aguardando Permissão 🚦
- **Passo 1:** Inicializar Git localmente e limpar históricos antigos.
- **Passo 2:** Adicionar remote `origin` com autenticação via Token.
- **Passo 3:** Fazer o Push da estrutura `src/backend`.

### [ ] Tarefa 3: Reconfigurar Backend no Coolify
- **Status:** Pendente 📋
- **Passo 1:** Localizar o recurso no Coolify via API.
- **Passo 2:** Atualizar a URL do repositório para o novo `ploc-core`.

### [ ] Tarefa 4: Verificação Final
- **Status:** Pendente 📋
- **Passo 1:** Monitorar logs de build e status "Healthy".
