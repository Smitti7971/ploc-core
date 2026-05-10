# STRATEGY-005: Evolução Arquitetural Final (AI-Native SaaS) 🚀🧠

## 🎯 Objetivo
Transformar o Ploc em um SaaS moderno, orientado a agentes e eventos, consolidando a Camada de IA e reorganizando o Frontend por Domínios (Features).

---

## 📂 1. Nova Árvore Alvo (Estrutura Obrigatória)

```text
ploc/
├── apps/
│   ├── frontend/
│   │   ├── app/                # Configurações globais (Router, App Shell)
│   │   ├── features/           # Domínios de negócio (Chat, Tasks, etc)
│   │   ├── shared/             # Componentes UI genéricos, Hooks, Utils
│   │   ├── entities/           # Tipos e modelos de dados do frontend
│   │   ├── state/              # Camada de Estado Global (Session, Chat, UI)
│   │   └── styles/             # Design System (app.css)
│   │
│   └── backend/
│       ├── ai/                 # 🧠 Camada Cognitiva
│       │   ├── orchestrator/   # Controle de fluxo e seleção de agentes
│       │   ├── agents/         # Agentes especializados
│       │   ├── tools/          # Habilidades executáveis (Tools)
│       │   ├── prompts/        # Repositório central de Prompts
│       │   ├── memory/         # Memória (Short-term, Long-term)
│       │   ├── context/        # Engenharia de Contexto
│       │   └── parsers/        # Processadores de saída de LLM
│       │
│       ├── controllers/        # Maestros (Entrada/Saída)
│       ├── services/           # Chefes (Regras de Negócio)
│       ├── repositories/       # Fornecedores (Persistência)
│       ├── routes/             # Portas
│       ├── middleware/         # Segurança e Filtros
│       ├── infrastructure/     # Configurações de baixo nível
│       │
│       ├── events/             # 📡 Arquitetura de Eventos
│       ├── jobs/               # Processamento asíncrono
│       ├── queues/             # Filas de execução
│       └── scheduler/          # Agendador de tarefas (Cron/Reminders)
```

---

## 🛠️ 2. Plano de Migração Incremental (As 4 Ondas)

### Onda 1: Consolidação do Core e Backend 🏗️
- [ ] Criar nova estrutura de pastas no backend.
- [ ] Mover lógica de IA para as novas subpastas (`agents`, `prompts`, `memory`, `context`).
- [ ] Estabelecer a infraestrutura de eventos (`events`, `jobs`).
- [ ] Isolar prompts hardcoded em arquivos dedicados em `ai/prompts/`.

### Onda 2: Sistema de Ferramentas (Tool System) 🛠️
- [ ] Padronizar o `TaskTool` para o novo formato.
- [ ] Garantir o fluxo: `Agent -> Tool -> Service -> Repository -> DB`.
- [ ] Criar validação de schemas para as ferramentas.

### Onda 3: Reorganização Frontend (Feature-Based) 🎨
- [ ] Mover componentes de `js/components/` para `features/`.
- [ ] Isolar o estado global em `state/`.
- [ ] Criar a pasta `entities/` para centralizar as definições de dados.

### Onda 4: Sincronia e Documentação Final 📜
- [ ] Atualizar `MAPA_DO_PROJETO.md`.
- [ ] Realizar auditoria de anti-patterns.
- [ ] Validar saúde do sistema (Telemetria).

---

## 🛡️ 3. Regras de Boundaries (Fronteiras)

- **IA não toca no Banco**: IA fala com `Tools`, Tools falam com `Services`.
- **Controller não calcula**: Controller chama `Service`.
- **Service não persiste**: Service chama `Repository`.
- **Frontend não guarda lógica pesada**: Frontend consome `API` e gerencia `UI State`.

---

## 📈 4. Melhorias Futuras Recomendadas
1. **Streaming Responses**: Implementar respostas da IA em tempo real.
2. **Vector Database**: Preparar `memory/long-term` para busca semântica (RAG).
3. **Event Bus**: Implementar um barramento de eventos para automações complexas.

---

**Aprovação**: [ ] Mestre (Aguardando OK)
