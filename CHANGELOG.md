# CHANGELOG - PLOC 🍮✨

Este arquivo registra a evolução técnica e visual do Ploc, servindo como a memória oficial de versões do projeto.

## [0.3.0] - 2026-05-15
### ✨ Oceano Mental & Física de Navegação
- **Motor de Bolhas (BubbleEngine)**: Implementação de física linear e contínua para tarefas, com convergência automática para o centro (Ploc) baseada na urgência (1h = 1000px).
- **Sonar Temporal**: Sistema de radar visual com anéis concêntricos (0.5h, 1h, 3h, 6h) e ondas de pulso para orientação espacial e feedback de proximidade de prazos.
- **Arquitetura de Zoom Adaptativo**: Novo sistema de zoom 'Smooth-to-Pointer' com wrapper de escala dinâmico, permitindo navegar entre visões estratégicas (Semana) e operacionais (Hora) sem perda de foco.
- **Estabilização de Infraestrutura**: Migração definitiva do backend para a porta 5000 e resolução de conflitos de conectividade 404/ERR_CONNECTION_REFUSED.
- **Performance de Canvas**: Otimização radical do Blackboard removendo o overhead do Framer Motion em elementos de larga escala, garantindo 60 FPS constantes.
- **Radar de Centralização**: Implementação de botão de recuperação de foco (Target) com cálculo matemático determinístico para reposicionamento instantâneo no Ploc.

## [0.2.0] - 2026-05-14
### ✨ Perfil e Consolidação Next.js
- **Upload de Avatar**: Implementação do sistema de upload de fotos de perfil com processamento via Sharp (WebP) e armazenamento persistente.
- **Página de Configurações**: Criação do portal de ajustes de usuário (`/settings`) com interface Glassmorphism e feedback otimista.
- **Migração de Ícones**: Substituição de fontes legadas por `lucide-react`, garantindo 100% de visibilidade e consistência visual no Dashboard e Menu.
- **Persistência de Sessão**: Correção crítica no `authStore` (Zustand) para manter a sessão autenticada resiliente a recarregamentos de página.
- **Proteção de Dados**: Implementação de tratamento de erros e fallbacks no `UserHeader` para evitar falhas durante a reidratação de dados.

## [0.1.4] - 2026-05-13
### ✨ Modernização e UX (Interface Panorâmica)
- **Mural Panorâmico**: Implementação de canvas lateral de 250vw na LandingPage para organização espacial de notas.
- **DockMenu Flutuante**: Remoção do painel de vidro (island) para efeito de ícones flutuantes com brilho neon estático.
- **Laboratório (Dashboard)**: Redesenho completo do slide 1 para layout Bento Grid com indicadores de métricas vitais.
- **Gatilho de Notas**: Substituição do botão textual por ícone circular flutuante (position: fixed) para interface mais limpa.
- **Estabilidade UI**: Correção de conflitos de z-index e eventos entre o PlocAvatar e o DockMenu.

## [0.1.3] - 2026-05-12
### Corrigido
- **Deployment Fail (Coolify)**: Adicionado `Dockerfile` à raiz para resolver erro de build no Coolify, que não encontrava o arquivo no diretório padrão.
- **Connection Refused**: Resolução de erros de conexão no localhost:3000 através da padronização dos scripts de inicialização.
- **Scripts de Dev**: Adicionado script `dev` ao backend e script unificado na raiz para evitar conflitos de porta entre `npx serve` e o backend.

### Adicionado
- **Governança de Scripts**: Implementação do script unificado `npm run dev` que inicia o backend (o qual já serve o frontend).

---

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
