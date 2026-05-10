# DRAFT-006: Primeiro Sopro de Vida (Conexão LLM - OpenAI) 🌬️🧠

## 🎯 Objetivo
Realizar a primeira chamada real a um Modelo de Linguagem de Grande Escala (LLM) a partir do Backend do PLOC, utilizando o motor da OpenAI para dar inteligência ao Agente.

## 🛠️ Stack Escolhida
- **Provedor**: OpenAI (Modelo GPT-4o-mini ou GPT-4o para alta precisão).
- **SDK**: `openai`.
- **Arquitetura**: Implementação do `OpenAIProvider` herdando de `BaseProvider`.

## ⚙️ Engrenagens Técnicas

### 1. Preparação de Ambiente
- Instalação do pacote: `npm install openai` (no diretório backend).
- Adição da chave no `.env`: `OPENAI_API_KEY=sk-...`. ✅ (Recebida do USER)

### 2. Implementação do OpenAIProvider
Criar `apps/backend/ai/providers/OpenAIProvider.js`:
- Conectar ao SDK da OpenAI.
- Implementar `generateResponse(prompt, context)`.
- Implementar `parseTools(response)` para extrair intenções e chamadas de ferramentas.

### 3. Integração com o Orchestrator
Atualizar `apps/backend/ai/orchestrator/AIOrchestrator.js`:
- Instanciar o `OpenAIProvider`.
- Consolidar fluxo: Prompt -> OpenAI -> Ação/Resposta -> Interface.

## 🏁 Critérios de Sucesso
- [ ] O backend consegue enviar uma mensagem para a OpenAI e receber uma resposta coerente.
- [ ] O Orquestrador processa a resposta e mapeia ferramentas se necessário.
- [ ] O usuário recebe a resposta no ChatWidget em tempo real.
