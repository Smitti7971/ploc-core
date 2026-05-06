# Wiki do Projeto PLOC 📚

Bem-vindo à documentação oficial do Ploc. Este documento serve como o catálogo mestre para navegação e entendimento do projeto.

---

## 🚀 1. Onboarding

### 1.1 Guia de Nível Principal (Senior/Architect)
O Ploc é um SaaS projetado para escalabilidade. Atualmente, utiliza uma estrutura de **Monolito Pragmático** onde o Backend (Express) serve o Frontend estático.
- **Core Insight:** O isolamento de pastas é o desafio atual do deploy (Coolify). O servidor Express reside em `src/backend` e serve a pasta `public`.
- **Decisão Estratégica:** O Frontend será movido para uma aplicação separada assim que a lógica de API estiver estabilizada.

### 1.2 Caminho Zero-to-Hero
Se você é novo no projeto, siga esta ordem:
1.  **Ambiente:** Configure o `.env` baseado no `.env.example`.
2.  **Estrutura:** Entenda que `src/backend/index.js` é o coração do sistema atual.
3.  **Deploy:** Fluxo do Coolify apontando para o repositório `ploc-core`.

---

## 🛠️ 2. Getting Started

### 2.1 Configuração Local
Para rodar o projeto localmente:
1.  Instale as dependências: `cd src/backend && npm install`.
2.  Inicie o servidor: `node index.js`.
3.  Acesse: `http://localhost:3000`.

### 2.2 Health Check
O endpoint de verificação de saúde está em `/api/health`.

---

## 📂 3. Estrutura de Arquivos
- `src/backend`: Lógica de servidor, modelos e serviços.
- `src/frontend`: (Em transição) Código da interface do usuário.
- `docs/plans`: Roadmaps e logs de execução.
- `docs/knowledge`: Documentação de estado e KIs.
