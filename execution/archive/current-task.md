# 🚀 Tarefa Atual: Desacoplamento Total de Autenticação & Elasticidade Extrema (Ciclo 9)

## 📍 Blocos Alvos de Otimização, Desacoplamento & Gelatina
1. **Remoção de Props de Gatilhos de Login** no PlocAvatar.
2. **Remoção de Código Morto** (inputValue, isLoading, isInputOpen, handleChatSubmit, useAuthStore, chatService).
3. **Simplificação de Dependências na Landing Page** (MascotCenter e LandingClient livres de referências extras).
4. **Gelatinose Extrema (Dynamic Wobbling Jelly)**:
   - Keyframes bi-axiais com deformação orgânica suave e arredondada.
   - Máquina de estados determinística (`isHovered`, `isTapped`, `isDragging`) que força a escala a retornar a 100% de redondeza no drag end (`onDragEnd`).
   - Achatamento de 20% no clique e arrasto estável sem distorção residual.

---
#### ATENÇÃO! NÃO ALTERE OU APAGUE NADA DAS LINHAS 14 À 46, DESSE DOCUMENTO DE FORMA ALGUMA exceto para sinalizar as etapas concluidas, e não faça tarefas que não estejam no checklist.
#### NÃO PULE ETAPAS.

## 📋 Checklist de Execução Rigorosa

### Fase 1: Auditoria e Planejamento
- [x] **1.1 Identificação de Pontos de Acoplamento**: Mapear onde `handleClick` e `handleOutside` dependiam do estado e visibilidade do modal de login.
- [x] **1.2 Confirmação de Código Morto**: Identificar estados de chat (`inputValue`, `isLoading`, `isInputOpen`) e imports obsoletos.
- [x] **1.3 Planejamento da Física Gelatinosa**: Desenhar keyframes e parâmetros elásticos de mola para o Ploc.
- [x] **1.4 Se aprovado, prossiga para a Fase 3.**

### Fase 3: Execução Técnica
- [x] **3.1 Alteração no PlocAvatar.tsx**:
    - Simplificar props de `PlocAvatarProps` removendo `externalOpen` e `onOpenChange`.
    - Remover imports de `useAuthStore` e `chatService`.
    - Excluir variáveis de estado do chat (`isInputOpen`, `inputValue`, `isLoading`).
    - Desconectar `handleClick` e `handleOutside` de chamadas a `setEffectiveOpen` e modais externos.
- [x] **3.2 Alteração no MascotCenter.tsx**: 
- [x] Status
- [x] Removed App Settings page, keeping only `/settings/profile`
- [x] Lab 2.0 shortcuts/calculator focus
- [x] Voice Recognition `not-allowed` error
- [x] Enforce `TrackerOverlay` for all registrations
- [x] Fix accessibility: add id/name to form inputs and remove duplicate IDs in NotificationsModal redundantes do `useAuthStore`, invocando o `<MascotCenter />` de forma totalmente pura e declarativa.

### Fase 4: Finalização (Heartbeat)
- [x] **4.1 Verificação de Saúde**: Executar `npx tsc --noEmit` para assegurar integridade absoluta do compilador (100% de Sucesso).
- [x] **4.2 Atualização de Log**: Registrar no `UI_REFACTOR_LOG.md`.
- [x] **4.3 Preparação da Próxima Tarefa**: Concluído! Passando para a Fase 5.

### Fase 5: Modularização e Encapsulamento Total do Ploc (Alta Arquitetura)
- [x] **5.1 Criação de `types.ts`**: Exportar tipagem centralizada do Ploc.
- [x] **5.2 Criação de `usePlocState.ts`**: Desenvolver o Hook de controle de estado, sono, cliques e irritação.
- [x] **5.3 Criação de `usePlocSpeech.ts`**: Desenvolver o Hook de controle de falas e síntese de voz nativa.
- [x] **5.4 Criação de `PlocBubbles.tsx`**: Modularizar as bolhas 3D flutuantes internas.
- [x] **5.5 Criação de `PlocFace.tsx`**: Encapsular a anatomia e animação facial (olhos, pálpebras, sobrancelhas e brilhos).
- [x] **5.6 Criação de `PlocLimbs.tsx`**: Encapsular a física e renderização dos membros stick flexíveis.
- [x] **5.7 Refatoração de `PlocAvatar.tsx`**: Encolher o componente principal para atuar apenas como shell integradora (orquestrador).
- [x] **5.8 Testes de Integridade**: Executar compilação com `npx tsc --noEmit` garantindo integridade e conformidade a 100%.

---

## O QUE JÁ EXISTE NO LAYOUT.
- **AVATAR PLOC**: Coração visual da Landing e das áreas logadas (AppShell).
- **MASCUTE CENTER**: Posição e física de arrasto livre perfeitas (MascotCenter.tsx).
- **BUBBLE PHRASES**: Bolhas 3D e letreiro sob o Ploc.
- **VIGNETTE**: Moldura de cinema com zIndex estruturado (Vignette.tsx).

## ARQUIVOS JÁ PROCESSADOS
- `Atmosphere.tsx`
- `HeroStage.tsx`
- `phrases.tsx`
- `AuthCapsule.tsx`
- `BubblePhrases.tsx`
- `MascotCenter.tsx`
- `Vignette.tsx`
- `PlocAvatar.tsx`
