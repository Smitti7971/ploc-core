# CHANGELOG - PLOC 🍮✨

Este arquivo registra a evolução técnica e visual do Ploc, servindo como a memória oficial de versões do projeto.

## [0.1.0-ALPHA] - 2026-05-11
### Adicionado
- **Sistema Botânico**: Implementado sistema de CRUD, Fases de Crescimento, Logs e Agenda de Eventos.
- **Infraestrutura**: Configuração de ambiente híbrido (Local vs Cloud) automatizada.
- **Banco de Dados**: Migração para PostgreSQL 16 nativo e isolamento de ambiente de desenvolvimento.
- **Backend Core**: Criação de `PlantService`, `PlantController` e `PlantRepository`.
- **API Endpoints**: Rotas `/api/plants` para CRUD, Gestão de Fases, Diário e **Agenda (Eventos)**.
- **Schema DB**: Ativação das tabelas `Plant`, `PlantPhase`, `PlantLog`, `PlantMedia` e `PlantEvent`.

---

## [0.0.9] - 2026-05-10
### Adicionado
- **Arquitetura Modular (SUPREMA)**: Divisão clara entre `/apps/frontend` e `/apps/backend`.
- **Landing Page Prioritária**: Re-alinhamento do projeto para focar na experiência inicial do usuário.
- **Governança de Dados**: Criação da pasta `/archives` para isolar históricos e arquivos obsoletos.
- **Blindagem do .gitignore**: Configuração recursiva e liberação das migrações do Prisma para o Git.

### Corrigido
- **Conflito de Referências**: Remoção de metáforas e arquivos fantasmas que causavam retrabalho.
- **Sincronia de Banco**: Correção do bloqueio de migrações que causava erros em produção.

---

## [0.0.8] - 2026-05-10
### Adicionado
- **Expansão de Modelo de Tarefas**: Preparação do backend para campos de Prioridade e Status.
- **Motor de Rotinas**: Implementação da lógica de backend para gestão de hábitos.

---

## [0.0.7] - 2026-05-10
### Adicionado
- **Refatoração SPA**: Migração do sistema monolítico para um sistema de componentes carregados sob demanda.
- **Nginx Hardening**: Configuração de segurança e limpeza de cache no Dockerfile do frontend.

---

## [0.0.1 a 0.0.6]
- Estabilização inicial, criação do Mascot (Ploc) e integração básica com a API do Gemini.
