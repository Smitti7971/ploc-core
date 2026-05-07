# GUIA: Fluxo de Co-Criação e Estratégia (Método Smitti/Antigravity) 🤝🚀

## Quando usar
- Para TODA nova funcionalidade ou refatoração importante.
- Sempre que o USER sentir que está "fazendo sem entender".

## O Objetivo
- Garantir que o USER (Arquiteto) entenda a lógica por trás de cada engrenagem do sistema antes de qualquer linha de código ser escrita.

---

## 🟢 ETAPA 1: Exploração e Intenção (Conversa)
- **Ação**: Conversa livre sobre o que deve acontecer.
- **Saída**: Uma lista de "Desejos do Arquiteto" em linguagem humana.
- **Pergunta Chave**: "O que o usuário vai sentir/ver ao usar isso?"

## 🟡 ETAPA 2: Arquitetura e Rascunho (A Estratégia)
Nesta etapa, criamos o arquivo `docs/plans/DRAFT-YYYY-MM-DD-nome.md` com:

1.  **Onde as coisas moram?**: Quais arquivos e variáveis serão criados ou movidos?
2.  **O que as funções fazem?**: Descrição didática (ex: "A função X é o motor que empurra os dados").
3.  **Encaixe de Layout**: Como o visual conversa com a lógica?
4.  **Blindagem (Segurança)**: Quais são os erros comuns? O que pode quebrar? Como vamos nos proteger?
5.  **O Rascunho Final**: Uma visão geral do "antes e depois".

## 🔴 ETAPA 3: Aprovação e Execução (Ação)
- **Ação**: O Agente apresenta o Rascunho e aguarda o "OK" consciente do USER.
- **Execução**: Somente após aprovação, os passos são movidos para a `current-task.md`.

---

## Regras de Ouro
1. **Nada de "Caixa Preta"**: O Agente nunca deve dizer "deixa comigo" sem explicar o "como".
2. **Didática sobre Velocidade**: Se o USER estiver confuso, pare a execução e explique usando metáforas.
3. **Pisar em Ovos**: No código existente, toda mudança deve ser incremental e testada no final de cada pequeno passo.
