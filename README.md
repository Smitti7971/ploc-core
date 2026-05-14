# PLOC - Inteligência de Produtividade 🚀

O PLOC é um ecossistema de produtividade pessoal que combina inteligência cognitiva, gestão de hábitos e um mascote interativo.

## 🏗️ Arquitetura do Projeto

O projeto é um monorepo organizado da seguinte forma:

- **`apps/web`**: Frontend moderno construído com **Next.js 15**, **React 19**, **Tailwind CSS 4** e **Zustand**.
- **`apps/backend`**: API REST robusta em **Node.js/Express**, utilizando **Prisma ORM** e PostgreSQL.
- **`docs/`**: Central de conhecimento, guias de arquitetura e governança.
- **`archives/`**: Registros históricos e código legado (incluindo o frontend Vanilla JS original).

## 🚀 Como Rodar

### Pré-requisitos
- Node.js (v22+)
- Docker (para o banco de dados local)

### Desenvolvimento
1. Inicie o banco de dados:
   ```bash
   npm run db:up
   ```
2. Inicie o ambiente de desenvolvimento (Frontend + Backend):
   ```bash
   npm run dev
   ```

## 🧭 Documentação e Governança

Para desenvolvedores e agentes de IA, os documentos de referência são:
- [MAPA_DO_PROJETO.md](docs/knowledge/MAPA_DO_PROJETO.md): Fonte da verdade sobre a infraestrutura.
- [AGENTS.md](docs/knowledge/AGENTS.md): Regras de ouro e fluxos de execução.
- [PILHA_TECNOLOGICA.md](docs/knowledge/PILHA_TECNOLOGICA.md): Versões e ferramentas oficiais.

---
*Ploc: Organizando sua vida, um bit de cada vez.*
