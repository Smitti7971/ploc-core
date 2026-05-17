# 📜 Protocolo de Refatoração PLOC - "Móveis Modulares" 🍮

Este documento é a **Única Fonte de Verdade**. O Agente deve seguir estas regras rigorosamente em cada execução, utilizando o `current-task.md` como trilho.

---

## 1. 🎨 Estilização e Design (Fundação)
- **Tailwind-First**: Proibido estilos inline. Usar Tailwind CSS v4.
- **Design Tokens**: Referenciar variáveis `:root` do `globals.css` (ex: `bg-[var(--ploc-background)]`).
- **Responsividade**: Mobile-First é a prioridade.

## 2. 🧱 Arquitetura de Componentes (Móveis)
- **Estrutura**: `constants/`, `hooks/`, `components/`.
- **Encapsulamento**: Agrupar lógica e gatilhos no mesmo módulo, APENAS SE NECESSÁRIO (Não crie pastas e arquivos desnecessários).
- **Auditoria de Redundância**: Verificar se a finalidade já é atendida. Evitar "Wrapper Hell".
- **Identificação de Objetos (Divs)**: Divs posicionadas são **Objetos**. Devem ser analisadas para extração ou absorção.

## 3. 🗺️ Mapa de Inventário (Sourcing)
- 🧠 **`authStore.ts`**: Estado global (User, Modal, Cookies).
- 🖼️ **`AuthModal.tsx`**: Interface de Login/Cadastro.
- 💊 **`AuthCapsule.tsx`**: Ponto de entrada. **Responsabilidade**: Gerenciar estados de "Entrar" e "Perfil".
- 👤 **`UserHeader.tsx`**: Sub-móvel de exibição de dados do usuário.
- 🖋️ **`phrases.ts`**: Repositório de textos motivacionais.

## 4. 🔄 Ciclo de Vida da Tarefa (Workflow)
Toda interação deve seguir estas 4 fases via `execution/current-task.md`:

### Fase 1: Auditoria e Planejamento
- Identificar finalidade do bloco e utilidade das Divs.
- Cruzar com o **Mapa de Inventário** para checar redundâncias.
- **Bifurcação**: Se desaprovado pelo usuário, encerrar e arquivar.

### Fase 2: Proposta e Validação
- Apresentar o plano detalhado antes de qualquer código.
- Aguardar o "OK" ou "Faça" explícito.

### Fase 3: Execução Técnica
- Alteração cirúrgica: Mudar apenas o necessário.
- Limpeza de imports e respeito ao Tailwind v4.

### Fase 4: Finalização e Arquivamento (Heartbeat)
- Validar saúde do sistema (Login/Logout).
*   **Redocumentação**: Cada novo bloco enviado pelo usuário reseta o `current-task.md`.
*   **Arquivamento**: Mover tarefa concluída para `execution/archive/task-000X.md`.

## 5. 📂 Padrões de Código
- **Imports**: Usar alias `@/`.
- **Clean Code**: Remover comentários óbvios; manter comentários de arquitetura.

---
*"Precisão na execução, limpeza na evolução."* 🚀
