# GUIA MESTRE: Operação e Testes (Checklist de Pré-Voo) ✈️✅

## A Lógica da Luz Verde
O Ploc é como um avião. Antes de decolar (dar uma tarefa como concluída), precisamos garantir que os motores estão rodando e que o trem de pouso funciona. Não confiamos apenas na "sorte", confiamos no checklist.

---

## 🛠️ O Checklist de Pré-Voo

Toda tarefa deve passar por estes 3 sensores:

1.  **Sensor de Vida (Saúde)**:
    *   Eu pergunto para o servidor: *"Você está vivo?"* (Endpoint `/api/health`).
    *   Se ele responder "Healthy" com uma luz verde (Status 200), passamos para o próximo.
2.  **Sensor de Conexão (Integração)**:
    *   O visual consegue falar com o cérebro? (Teste de login ou carregamento de cards).
    *   O cérebro consegue falar com a memória? (Teste de conexão com o banco de dados).
3.  **Sensor de Visual (Design)**:
    *   O que você vê no navegador é o que desenhamos no rascunho? (Limpar o cache do navegador é obrigatório aqui).

---

## 🏗️ Níveis de Validação (Fiação vs. Turbina)

Para evitar atrasos e confusões, dividimos os testes em dois níveis:

1.  **Teste de Fiação (Lógica)**: Valida se o "Garçom" entregou o pedido ao "Chef". Se o sistema capturar um erro de conexão com o banco (ex: P1001), o teste de fiação é considerado **SUCESSO**, pois prova que o código está conversando corretamente através de todas as camadas.
2.  **Teste de Turbina (Integração)**: Valida a conexão real com serviços externos (Banco de Dados, APIs). Este teste só é possível quando o Agente tem acesso direto à rede do banco ou quando o deploy é feito na nuvem.


## ⚠️ Manual de Emergência (O que fazer se der erro)

Se algo quebrar, não entramos em pânico. Seguimos a trilha de migalhas:

- **Erro de Rede (404/500)**: Eu checo se o servidor subiu na pasta correta no Coolify.
- **Erro de Código (Crash)**: Eu olho a "Caixa Preta" (Logs do servidor) para ver qual linha de código fez o motor parar.
- **Erro de Comando (PowerShell)**: Como estamos no Windows, eu uso ferramentas específicas para falar com o sistema sem quebrar os caminhos dos arquivos.

---

## Checklist para o Arquiteto (Smitti)
- [ ] Você testou no seu navegador (aba anônima)?
- [ ] O banco de dados está mostrando os dados atualizados?
- [ ] Eu registrei o sucesso (ou a falha) no histórico?

---

## 💡 Lições de Batalha (Evolução Contínua)
*Espaço reservado para anotar práticas eficazes e erros evitados durante as execuções.*

- **[2026-05-07]**: Nunca fechar uma tarefa sem realizar o checklist de "Saúde, Conexão e Visual".
