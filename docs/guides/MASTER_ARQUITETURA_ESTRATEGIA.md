# GUIA MESTRE: Arquitetura e Estratégia (O Método Ploc) 🏛️🧠

## A Lógica do Nosso Pacto
Este é o guia mais importante do projeto. Ele define como nós dois (Smitti e Antigravity) trabalhamos juntos. No Ploc, priorizamos o **entendimento do Arquiteto** sobre a velocidade do Agente.

---

## 🟢 O Fluxo de Co-Criação (As 3 Etapas)

Sempre que formos criar algo novo ou mudar a estrutura, seguiremos estas fases:

### 1. Conversa de Intenção (Brainstorming)
Você me conta o seu sonho ou a sua necessidade. Eu traduzo isso em uma lista de intenções lógicas.
*   *Pergunta Chave*: "O que queremos que o usuário sinta?"

### 2. O Rascunho da Estratégia (DRAFT)
Eu crio um documento em `docs/plans/DRAFT-...` que explica:
- **As Engrenagens**: O que cada função vai fazer (metáforas).
- **O Mapa**: Onde os dados moram e para onde vão.
- **A Blindagem**: O que pode dar errado e como vamos nos proteger.

### 3. O "OK" Consciente
Eu te apresento o Rascunho. Você lê e faz perguntas. **Só começamos a codar quando você disser: "Entendi e aprovo"**.

### 🔎 Auditoria de Terreno (Pré-Execução)
Antes de iniciar qualquer comando de criação de pastas ou arquivos, o Agente deve **listar o diretório alvo** para confirmar o que já existe, evitando sobrescrever arquivos ou duplicar "salas" desnecessariamente.

---


## 🏛️ Princípios de Arquitetura (O Blueprint)

Seguimos a filosofia do **Monolito Profissional**:
- **Pastas Separadas**: Cérebro (Backend) não se mistura com a Roupa (Frontend).
- **Escalabilidade**: Tudo é montado para que, se o Ploc tiver 1 milhão de usuários amanhã, a estrutura suporte.
- **Limpeza**: Pastas vazias ou arquivos legados são movidos para `deleteds` para manter a visão limpa.

---

## Checklist para o Arquiteto (Smitti)
- [ ] Eu entendi o porquê de estarmos fazendo essa mudança?
- [ ] O Rascunho de Estratégia está claro e sem "caixas pretas"?
- [ ] Estamos "pisando em ovos" (fazendo mudanças pequenas e seguras)?

---

## 💡 Lições de Batalha (Evolução Contínua)
*Espaço reservado para anotar práticas eficazes e erros evitados durante as execuções.*

- **[2026-05-07]**: O pacto de Co-Criação garante que o projeto evolua com transparência e segurança.
