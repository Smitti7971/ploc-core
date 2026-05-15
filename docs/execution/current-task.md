# Task: Refatoração de Elite e Evolução do Módulo Blackboard 🌌🧠

## 1. Entender (Intenção) 🧠
- **O quê**: Transformar o Blackboard de uma página simples em um **Ecossistema Sistêmico Vivo**.
- **Por quê**: Alinhar o núcleo do produto com a Visão de evolução pessoal, criando uma infraestrutura modular capaz de suportar bolhas dinâmicas, motores de física/animação e coleta comportamental profunda.
- **Metáfora**: "De um quadro estático para um oceano mental pulsante". Estamos construindo o sistema nervoso do PLOC.

## 2. Preparar (Logística) 🎒
- **Arquivos-Alvo**:
  - `apps/web/modules/blackboard/` (Estrutura completa)
  - `apps/web/modules/blackboard/engine/` (Motores lógicos)
  - `apps/web/modules/blackboard/events/` (Sistema de eventos)
  - `apps/web/modules/blackboard/components/BlackboardPage.tsx` (Desmembramento)
- **Risco**: Alta complexidade de refatoração pode quebrar o estado das notas atuais.
- **Proteção**: Backup do `BlackboardPage.tsx` atual e migração gradual da lógica para os motores (Engines).

## 3. O Que Executar (Ação) 🛠️
- [x] Criar estrutura de pastas modular (components, engine, bubbles, ploc, events, etc.).
- [x] Criar o **Event System** desacoplado para comunicação entre engines.
- [x] Implementar o **Monitor de Atributos**: 5 bolhas flutuantes no header (Mente, Corpo, Alma, Felicidade, Liberdade).
- [x] Criar o sistema de **Feedback Visual de Atributos**: Verde (+) e Vermelho (-).
- [x] Implementar o **PlocEngine** avançado (Estados: Calmo, Feliz, Tonto).
- [x] Criar o **Oceano Tutorial**: Tour visual mostrando o nascimento da bolha e as Zonas.
- [x] Implementar o **BubbleEngine** com lógica de "Zonas de Explosão" (Proximidade/Tempo).
- [x] Integrar a **Rotina Antitabagismo** como uma `RoutineBubble` persistente.
- [x] Refatorar `BlackboardPage.tsx` para usar o sistema de "Movimento da Alma" do Ploc.

### Logs de Heartbeat
- `Tentativa 1 - ✅ [Sucesso]`: Estrutura de pastas e EventBus prontos.
- `Tentativa 2 - ✅ [Sucesso]`: PlocEngine e BubbleEngine integrados. Ploc reage a hábitos (cigarro) e bolhas explodem no tempo certo.
- `Tentativa 3 - ✅ [Sucesso]`: Navegação imersiva e Física Temporal (Distância = Tempo) implementadas.
- `Tentativa 4 - ✅ [Sucesso]`: RoutineEngine (Antitabagismo), Tutorial imersivo e Movimento da Alma integrados. O sistema agora é um ecossistema vivo.

## 4. Resultado Esperado (Visão) 👁️
- O Blackboard deve continuar visualmente minimalista, mas com um código robusto e desacoplado.
- Bolhas flutuantes substituindo gradualmente os post-its estáticos.
- Ploc reagindo a eventos do sistema via `EventBus`.

## 5. Validar & Testar (Prova de Vida) ✅
- [x] Garantir que o `PlocAvatar` ainda renderiza corretamente no centro. ✅
- [x] Testar o disparo de um evento via `EventSystem` e ver a reação do Ploc. ✅
- [x] Verificar persistência das bolhas (Localidade vs DB). ✅

### Logs de Heartbeat (Continuação)
- `Tentativa 5 - ✅ [Sucesso]`: Estabilização de navegação (Navegação 60fps), precisão matemática de foco e implementação total do Motor de Atributos/RPG com geração dinâmica de testes.
