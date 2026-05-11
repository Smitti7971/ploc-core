# DRAFT: Estratégia do Sistema de Diário de Plantas Pro 🌿🔬

**Data**: 2026-05-11
**Status**: Aguardando Aprovação do USER
**Objetivo**: Estruturar um sistema de monitoramento botânico de alta precisão, integrado a calendário e preparado para análise de IA.

---

## ⚙️ 1. As Engrenagens (Lógica do Banco)

### 1.1 Precisão de Milissegundos (Timeline)
- Abandonaremos o tipo `DATE` para todos os marcos críticos.
- **Regra**: Uso universal de `TIMESTAMPTZ` (Timestamp with Time Zone). Isso garante que o calendário exiba os eventos na hora exata, independente do fuso horário de quem está logado.
- **Identidade**: Todos os registros usarão `UUID` para garantir unicidade e segurança em escala.

### 1.2 O Motor do Calendário (Logs vs. Events)
O sistema operará em duas camadas temporais:
1.  **Passado (Logs)**: O que *realmente* aconteceu. Cada Log é um registro imutável no tempo, com fotos e observações.
2.  **Futuro (Events)**: O que *deve* acontecer. Agendamentos de rega, fertilização e trocas de fase.

### 1.3 Inteligência Visual (Media & Meta)
- A tabela `plant_media` não será apenas um repositório de arquivos.
- **Campo `metadata` (JSONB)**: Guardará o "DNA" da foto (Câmera, Resolução) e o "Diagnóstico da IA" (Nível de estresse, saúde da folha). Isso permite buscas avançadas do tipo: *"Me mostre todas as fotos onde a IA detectou stress hídrico"*.

---

## 🛠️ 2. Lógica de Relacionamento (Cascata)

- **Hierarquia**: User -> Plant -> (Phase/Log/Event).
- **Integridade**: `ON DELETE CASCADE`. Se a Planta for deletada, todo o histórico (fases, logs, fotos e eventos) é removido automaticamente, mantendo o banco limpo.

---

## 📡 3. Preparação para Escala (Performance)

- **Índices Temporais**: Criaremos índices B-Tree nos campos `logged_at` e `starts_at`. 
- **Por que?**: Para que a query do calendário seja instantânea, mesmo com milhares de registros, buscando apenas o intervalo do mês visualizado.

---

## 🤖 4. Visão de Futuro (AI Roadmap)

- O sistema está sendo desenhado para que uma IA possa "ler" a timeline e gerar relatórios: *"Sua planta cresceu 15% mais rápido na fase vegetativa em comparação com o ciclo anterior"*.

---

### ❓ Perguntas para Validação do USER:
1. A lógica de diferenciar **LOG** (Histórico) de **EVENT** (Agenda) atende à sua necessidade de organização?
2. O uso de JSONB para as tags e metadados de IA te agrada pela flexibilidade de não precisar mudar o banco no futuro?
3. Podemos prosseguir para a criação do plano operacional (`current-task.md`) baseado neste rascunho?

🫡🦾✨
