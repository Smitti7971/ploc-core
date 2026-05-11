# Current Task: Implementação dos Endpoints da API Botânica 📡🌿

## 1. Entender (Intenção) 🧠
- **O quê**: Criar a camada de serviço e rotas para gerenciar o ciclo de vida das plantas.
- **Por quê**: Permitir que o frontend (e a IA) interaja com os dados estruturados no banco.
- **Padrão**: Seguir o fluxo `Route -> Controller -> Service`.

## 2. Preparar (Logística) 🎒
- **Arquivos-Alvo**:
    - `apps/backend/routes/plantRoutes.js`
    - `apps/backend/controllers/plantController.js`
    - `apps/backend/services/PlantService.js`
- **Dependências**: Prisma Client (já gerado).
- **Risco**: Erros de autorização (garantir que um usuário não veja plantas de outro).

## 3. O Que Executar (Ação) 🛠️

### Fase 0: Auditoria e Infraestrutura (Fundação)
- [x] **Passo 0.1**: Auditoria de Terreno (Validar filesystem e arquivos de Knowledge). ✅
- [x] **Passo 0.2**: Sincronização do Schema Prisma (Modelos Plant, Phase, Log, Event, Media). ✅
- [x] **Passo 0.3**: Migração e Geração do Prisma Client (v6). ✅
- [x] **Passo 0.4**: Validação de Conectividade com PostgreSQL (Script Node.js). ✅

### Fase 1: Fundação (CRUD de Plantas)
- [x] **Passo 1**: Criar `apps/backend/services/PlantService.js` (e `PlantRepository.js`) com métodos `getAll`, `getById`, `create`, `update`, `delete`.
- [x] **Passo 2**: Criar `apps/backend/controllers/plantController.js` para gerenciar as requisições HTTP.
- [x] **Passo 3**: Criar `apps/backend/routes/plantRoutes.js` e registrar no `index.js`. ✅

### Fase 2: Ciclo de Vida e Diário
- [x] **Passo 4**: Adicionar lógica de Fases (`startPhase`) no Service. ✅
- [x] **Passo 5**: Adicionar lógica de Logs (`addLog`) com suporte a tags JSONB. ✅
- [x] **Passo 6**: Implementar rotas para Logs e Fases. ✅

### Fase 3: Agenda e Calendário
- [x] **Passo 7**: Implementar rotas de Eventos (`PlantEvent`). ✅
- [x] **Passo 8**: Criar endpoint global de eventos para o Dashboard principal. ✅
- [x] **Passo 9**: Estabilizar Conectividade (Corrigir `ERR_CONNECTION_REFUSED` no localhost). ✅

### Logs de Heartbeat (Em tempo real):
- Passo 0.1 - ✅ [Sucesso]: `MAPA_DO_PROJETO.md` e `schema_design.md` validados. Terreno limpo.
- Passo 0.2 - ✅ [Sucesso]: Modelos migrados e validados fisicamente no `schema.prisma`.
- Passo 0.3 - ✅ [Sucesso]: Migração `init_plant_system` aplicada e Client gerado.
- Passo 0.4 - ✅ [Sucesso]: Conexão estável via `verify_prisma.js` (0 registros, tabelas OK).
- Passo 1 - ✅ [Sucesso]: `PlantService.js` e `PlantRepository.js` criados com lógica CRUD e suporte a fases/logs.
- Passo 2 - ✅ [Sucesso]: `plantController.js` implementado com endpoints protegidos e tratamento de erros.
- Passo 3 - ✅ [Sucesso]: `plantRoutes.js` registrado e exposto em `/api/plants`. Fundação completa.
- Passo 4, 5, 6 - ✅ [Sucesso]: Lógica de Fases e Logs integrada ao Service e exposta via API.
- Passo 7, 8 - ✅ [Sucesso]: Endpoints de Agenda (`PlantEvent`) finalizados. Backend Botânico 100% pronto.
- Passo 9 - ✅ [Sucesso]: Conectividade Local vs Cloud estabilizada e automática.
- Passo Extra - ✅ [Sucesso]: Banco de Dados PostgreSQL instalado nativamente no Windows e sincronizado via Prisma. Ambiente de desenvolvimento 100% isolado e seguro.

## 4. Resultado Esperado (Visão) 👁️
- Endpoints funcionais e protegidos por JWT que permitem criar, listar, atualizar e monitorar o histórico de qualquer planta no sistema.

## 5. Validar & Testar (Prova de Vida) ✅
- [ ] Testar `POST /api/plants` via Thunder Client/Postman.
- [ ] Validar que `DELETE /api/plants/:id` limpa as tabelas relacionadas via CASCADE.
