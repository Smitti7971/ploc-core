# DRAFT-008: Módulo de Rotinas Inteligentes (Ploc Ecosystem)

## 🎯 Objetivo
Transformar o Ploc de um gestor de tarefas em um orquestrador de sistemas de vida, permitindo que o usuário crie rotinas personalizadas ou adote modelos validados que se integram automaticamente à agenda.

---

## 🧠 1. Lógica e Engrenagens (O Coração)

### 🏗️ Modelagem de Dados (Prisma)
Para suportar rotinas, precisamos de um modelo que defina a "receita" da tarefa, não apenas a tarefa em si.

#### Modelo `Routine`
- `id`: Int (PK)
- `userId`: Int (FK)
- `name`: String (ex: "Treino de Força")
- `category`: String (TREINO, ESTUDO, TRABALHO, etc)
- `description`: String?
- `config`: JSON (O segredo: armazena dias da semana, horários, duração, recorrência)
- `isActive`: Boolean (Default: true)
- `createdAt`: DateTime

#### Modelo `RoutineTemplate` (Global/Padrão)
- Rotinas pré-moldadas que o sistema oferece (Study, Health, etc).

### ⚙️ Mecanismo de Projeção
A rotina NÃO é uma tarefa. Ela é uma **fábrica de tarefas**.
- **Regra**: Toda vez que o usuário "Ativa" ou "Adota" uma rotina, o sistema deve olhar para os parâmetros (ex: Seg, Qua, Sex às 08h) e criar `Task` no banco para os próximos X dias/semanas.

### 🎭 Mudança Dinâmica de Persona (Contextual Persona Shift)
A grande sacada intelectual (O "Cofre" do Sócio): Quando o usuário engata em uma Rotina específica, o Ploc sofre uma **Injeção de Personalidade Contextual**.
- **Meditação/Foco**: O Ploc adota a postura Zen. Respostas mais curtas, frases focadas em respiração, clareza mental e silêncio.
- **Treino/Academia**: O Ploc ativa o `[MODE: COACH]`. Usa frases de impacto físico, cobra suor, fala sobre ROI metabólico e dor como progresso.
- **Engenharia**: O `AIOrchestrator` vai consultar a "Rotina Ativa" do momento no banco de dados e anexar um bloco de `[MODE OVERRIDE]` no final do Super Prompt base, hackeando a própria diretriz de tom momentaneamente.

---

## 🎨 2. Interface e Experiência (O Visual)

### 📱 Página de Rotinas (SPA)
- **Grid de Banners**: Banners largos com estética premium (Gradients, Glassmorphism).
- **Categorias**: 
  - `TREINO`: "Corpo de Elite"
  - `ESTUDO`: "Mente Imparável"
  - `TRABALHO`: "Foco Profundo"
  - `SAÚDE`: "Ritmo Vital"
- **Interação**: Click no banner -> Abre Modal de Decisão.

### 🔀 O Modal de Decisão
1. **Opção A: Criar do Zero**:
   - Step 1: Nome e Tipo.
   - Step 2: Frequência (Checkboxes de dias da semana).
   - Step 3: Janela de Horário e Duração.
   - Step 4: Dias Proibidos (Exceções).
2. **Opção B: Adotar Modelo**:
   - Listagem de 3-4 modelos (ex: "Treino ABC Iniciante").
   - Seleção apenas dos dias disponíveis do usuário.

---

## 🛠️ 3. Plano de Execução (Fases)

### Fase 1: Infraestrutura (Backend)
- [ ] Atualizar `schema.prisma` com os novos modelos.
- [ ] Criar `RoutineService.js` com a lógica de "Projeção de Tarefas".
- [ ] Criar rotas API: `GET /routines`, `POST /routines`, `POST /routines/adopt`.

### Fase 2: Visual (Frontend)
- [ ] Criar `RoutinesPage.js`.
- [ ] Implementar Grid de Banners Premium.
- [ ] Desenvolver Modal de Fluxo Duplo (Zero vs Modelo).

### Fase 3: Integração e Automação
- [ ] Lógica para que, ao deletar uma rotina, as tarefas futuras associadas também sejam removidas (Opcional/Configurável).
- [ ] Feedback do Ploc Avatar: "Mestre, sua nova rotina de Treino já está na agenda!"

---

## ⚖️ Critérios de Sucesso
- O usuário consegue criar uma rotina em menos de 30 segundos.
- As tarefas geradas aparecem corretamente no `CalendarPage.js`.
- A estética da página de banners deve ser a mais bonita do app até agora.

---
**Aguardando OK Consciente do Mestre para prosseguir para o Plano Operacional.** 🫡🧠✨🦾🚀
