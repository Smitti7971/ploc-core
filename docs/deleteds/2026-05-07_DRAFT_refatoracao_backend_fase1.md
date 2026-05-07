# DRAFT: Reestruturação Enterprise do Backend (Fase 1) 🧠🏗️

## 1. Entender (O Desejo do Arquiteto)
Estamos saindo de um modelo "Food Truck" (onde tudo acontece no mesmo balcão do `index.js`) para um "Restaurante de Luxo". 

- [x] **Intenção**: Criar departamentos especializados para que o código seja fácil de manter e impossível de quebrar por acidente.
- [x] **Desejo**: Organização visual e lógica. Cada arquivo terá apenas UMA responsabilidade.

---

## 2. As Engrenagens (A Lógica)

Imagine o fluxo de uma tarefa sendo criada no Ploc agora:

1.  **O Salão (Routes)**: Criaremos a pasta `src/backend/routes`. Aqui ficam os arquivos que apenas dizem: *"Se o cliente pedir /tarefas, chame o Chef de Tarefas"*.
2.  **A Cozinha (Controllers)**: Criaremos a pasta `src/backend/controllers`. Aqui o Chef recebe o pedido, olha se os dados estão certos (ex: "A tarefa tem nome?") e manda para o ajudante.
3.  **A Despensa (Services)**: Criaremos a pasta `src/backend/services`. Este é o ajudante que conhece o Banco de Dados (Prisma). Ele busca, salva e altera os dados.

**O Fluxo Final será**: 
`Usuário` -> `Route` (Garçom) -> `Controller` (Chef) -> `Service` (Ajudante) -> `Banco de Dados`.

---

## 3. Blindagem (O que pode quebrar?)

Para "pisar em ovos", nossa estratégia de segurança será:

- **O Prisma Central**: Não vamos deixar cada arquivo abrir uma conexão com o banco (isso sobrecarregaria o sistema). Vamos criar um "Gestor de Chaves" centralizado para o Banco.
- **Migração Incremental**: Não vamos deletar o `index.js` antigo de uma vez. Vamos mover uma função por vez (ex: primeiro as Tarefas, depois as Rotinas) e testar se o site continua funcionando após cada movimento.
- **O Porteiro (CORS)**: Vamos garantir que a segurança continue ativa no `index.js` principal, protegendo todas as novas salas.

---

## 4. O Rascunho Final (Estrutura de Pastas)

Assim ficará o seu "Cérebro" (Backend) após a Fase 1:

```text
src/backend/
├── config/         # Onde moram as chaves e o acesso ao Banco (Prisma)
├── routes/         # Onde ficam os Garçons (Caminhos da API)
├── controllers/    # Onde ficam os Chefs (Lógica de Decisão)
├── services/       # Onde ficam os Ajudantes (Lógica de Dados)
└── index.js        # O Host principal (A porta de entrada do Restaurante)
```

---

## 5. Próximos Passos (Ação)
1. Criar a estrutura de pastas.
2. Centralizar a conexão do Prisma em `config/database.js`.
3. Mover a primeira rota (ex: `GET /tasks`) para o novo padrão para validar a engrenagem.
