# Arquitetura de Dados - PLOC 🗄️

Este documento define o esquema inicial do banco de dados PostgreSQL para suportar as funcionalidades de ChatSpeech e Agenda do Ploc.

## 📊 Tabelas Propostas

### 1. `users`
Armazena as informações básicas de conta e preferências.
- `id`: UUID (PK)
- `email`: String (Unique)
- `name`: String
- `created_at`: Timestamp
- `updated_at`: Timestamp

### 2. `chat_logs` (ChatSpeech)
Logs de conversas e transcrições de áudio.
- `id`: UUID (PK)
- `user_id`: UUID (FK -> users.id)
- `audio_url`: String (URL do áudio no storage)
- `transcription`: Text
- `ai_response`: Text
- `status`: Enum (processing, completed, error)
- `created_at`: Timestamp

### 3. `calendar_events` (Agenda)
Eventos extraídos ou criados manualmente.
- `id`: UUID (PK)
- `user_id`: UUID (FK -> users.id)
- `title`: String
- `description`: Text
- `start_time`: Timestamp
- `end_time`: Timestamp
- `location`: String
- `is_all_day`: Boolean
- `created_at`: Timestamp

## 🛡️ Considerações de Performance
- Índices serão criados em `user_id` para todas as tabelas.
- Um índice composto em `(user_id, start_time)` será adicionado a `calendar_events` para otimizar a visualização mensal.
