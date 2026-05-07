# GUIA MESTRE: Planejamento Estratégico (O Mapa de Guerra) 🗺️⚔️

## A Lógica da Vitória
No Ploc, não começamos a codar sem antes desenhar o campo de batalha. O objetivo deste guia é garantir que cada ação tenha uma intenção clara, um plano de risco e um log de execução transparente.

---

## 🟢 As 5 Fases do Plano

### 1. Entender (Intenção) 🧠
- **O quê**: O que estamos fazendo?
- **Por quê**: Qual o benefício real para o SaaS?
- **Referências**: O que os grandes (ex: Trello, Linear, Notion) usam para resolver isso? Podemos usar algo parecido?
- **Metáfora**: Explicação lógica (ex: "Estamos separando o caixa do estoque").

### 2. Preparar (Logística) 🎒
- **Arquivos-Alvo**: Lista de arquivos que serão tocados.
- **Ambiente**: Variáveis do `.env` ou ferramentas necessárias.
- **Risco**: O que pode quebrar durante a execução?
- **Proteção**: Como vamos garantir que o site não saia do ar?

### 3. O Que Executar (Ação) 🛠️
Esta é a lista técnica de passos. **Deve ser atualizada em tempo real (Heartbeat)**.
- **Checklist**: Lista de tarefas com `[ ]`.
- **Logs de Heartbeat**: (Para cada passo):
    - `Tentativa 1 - ✅ [Sucesso]`: [Como foi resolvido]
    - `Tentativa 1 - ⚠️ [Atenção]`: [O deslize ou aviso]
    - `Tentativa 1 - ❌ [Erro]`: [O erro e a solução aplicada]

### 4. Resultado Esperado (Visão) 👁️
- O que o Smitti deve ver quando terminarmos?
- Ex: "O botão deve ficar azul e o card deve salvar no banco".

### 5. Validar & Testar (Prova de Vida) ✅
- **Checklist de Testes**: Passos manuais ou automáticos para provar que a missão foi cumprida.

---

## 🔄 Fluxo de Memória
1.  **DRAFT**: Criado em `docs/plans` para co-criação.
2.  **Current Task**: Criado em `docs/execution` para a batalha.
3.  **History**: O Current Task é movido para cá após a vitória.
4.  **Deleteds**: O DRAFT é movido para cá para limpar a mesa.
