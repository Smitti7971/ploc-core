# GUIA MESTRE: Lógica do Backend (O Cérebro) 🧠⚙️

## A Lógica do Garçom e da Cozinha
O Backend do Ploc funciona exatamente como um restaurante profissional:

1.  **O Garçom (API/Routes)**: Quando o usuário clica em um botão no Frontend, o Garçom anota o pedido e leva para a cozinha. Ele não sabe cozinhar, ele apenas sabe levar a mensagem.
2.  **O Chef (Controllers)**: É quem recebe o pedido do Garçom. O Chef decide se o cliente pode pedir aquilo (se está logado) e quais ingredientes (dados) serão usados.
3.  **A Despensa (Services/Database)**: É onde os ingredientes estão. O Chef nunca vai na despensa; ele pede para um **Ajudante (Service)** buscar o ingrediente específico no armário (Banco de Dados).

---

## 🏗️ Como as peças se encaixam?

Para que o cérebro do Ploc seja "Enterprise", ele segue este fluxo:
- **Requisição**: O site pede: "Me dê as tarefas do Smitti".
- **Middleware**: O sistema checa: "O Smitti tem crachá (Token JWT)?"
- **Controller**: O Chef diz: "Sim, ele tem. Ajudante, busque as tarefas dele".
- **Service**: O ajudante abre o banco, pega as tarefas e entrega ao Chef.
- **Resposta**: O Chef monta o prato (JSON) e o Garçom entrega de volta para o site.

---

## ⚠️ O que pode dar errado?

- **Cozinha Lotada (Overload)**: Se muitos pedidos chegarem ao mesmo tempo e a lógica for lenta, o site trava.
- **Pedido Errado (Validation)**: Se o cliente pedir algo que não existe, o Chef deve saber dizer educadamente que "Acabou o estoque".

---

## Checklist para o Arquiteto (Smitti)
- [ ] A lógica de "quem faz o quê" está clara?
- [ ] O cérebro está respondendo rápido (Health Check)?

---

## 💡 Lições de Batalha (Evolução Contínua)
*Espaço reservado para anotar práticas eficazes e erros evitados durante as execuções.*

- **[2026-05-07]**: Centralização de guias concluída. A lógica deve sempre preceder o código.
- **[2026-05-07]**: O uso de um **Prisma Singleton** em `config/database.js` evita sobrecarga de conexões e facilita o debug em arquiteturas de múltiplas camadas.
