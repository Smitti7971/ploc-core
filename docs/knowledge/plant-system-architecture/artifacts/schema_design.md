# 🏛️ Arquitetura do Diário de Plantas Pro

Este documento define a estrutura técnica e as regras de negócio para o subsistema de botânica do PLOC.

## 1. Princípios de Dados
- **Precisão Temporal**: Uso obrigatório de `TIMESTAMPTZ` para todos os eventos cronológicos.
- **Identificação**: Uso de `UUID` (V4) para todas as chaves primárias.
- **Flexibilidade**: Uso de `JSONB` para metadados de IA e tags, permitindo evolução sem mudanças de schema.
- **Integridade**: `ON DELETE CASCADE` em todas as relações para evitar registros órfãos.

## 2. Diagrama de Entidades
- **Plant**: Entidade raiz (User -> Plant).
- **PlantPhase**: Histórico de ciclos (Germinação -> Veg -> Flora -> Colheita).
- **PlantLog**: O "Diário". Registro real do que foi feito (Rega, Poda, Foto).
- **PlantEvent**: A "Agenda". Eventos planejados (Lembretes, Alertas).
- **PlantMedia**: Repositório de evidências visuais vinculado aos Logs.

## 3. Definição do Schema (Prisma Pattern)

### Plant
- `id`: UUID @id
- `userId`: String (FK)
- `name`: String
- `species`: String?
- `germinated_at`: TIMESTAMPTZ?
- `harvested_at`: TIMESTAMPTZ?
- `createdAt`: DateTime @default(now())

### PlantPhase
- `id`: UUID @id
- `plant_id`: UUID (FK)
- `phase_name`: String
- `started_at`: TIMESTAMPTZ
- `ended_at`: TIMESTAMPTZ?

### PlantLog
- `id`: UUID @id
- `plant_id`: UUID (FK)
- `title`: String
- `mood`: String ("healthy", "stressed", etc.)
- `tags`: JSONB (ex: ["rega", "poda"])
- `logged_at`: TIMESTAMPTZ (Referência para Calendário)
- `notes`: String?

### PlantMedia
- `id`: UUID @id
- `plant_id`: UUID (FK)
- `log_id`: UUID (FK)
- `media_url`: String
- `media_type`: String ("image", "video", "timelapse", "ai-generated")
- `file_size`: Int
- `metadata`: JSONB (Dados de câmera, análise de IA, resolução)

### PlantEvent (Calendário/Agenda)
- `id`: UUID @id
- `plant_id`: UUID (FK)
- `event_type`: String ("watering", "fertilization", "harvest", etc.)
- `title`: String
- `description`: String?
- `starts_at`: TIMESTAMPTZ
- `ends_at`: TIMESTAMPTZ?
- `status`: String ("pending", "completed", "skipped")
- `metadata`: JSONB

## 4. Índices Estratégicos (Performance)
1. `idx_logs_logged_at`: Para renderização rápida da timeline.
2. `idx_events_starts_at`: Para visualização em agenda/calendário.
3. `idx_media_plant_log`: Para carregamento de galerias por registro.

## 5. Preparação para IA
Os campos `metadata` em `PlantMedia` e `PlantLog` estão preparados para armazenar:
- Score de saúde foliar.
- Detecção automática de pragas.
- Predição de data de colheita baseada em imagens.
