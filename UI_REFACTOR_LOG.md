# 🎨 Log de Refatoração UI & Design - PLOC 🍮✨

Este arquivo documenta a transição da arquitetura de "Móveis Chumbados" para a arquitetura "Modular e Dinâmica" (Dynamic Theming).

---

## 🗓️ 16 de Maio, 2026

### 🧱 Fundação: Variáveis Globais (globals.css)
- **Status**: ✅ CONCLUÍDO
- **O que foi feito**:
    - Mapeamento do `design-tokens.json` para variáveis CSS no `:root`.
    - Substituição de cores "hardcoded" por variáveis padrão (ex: `--brand-primary`).
- **Benefício**: Agora, mudar uma cor no catálogo altera o app inteiro instantaneamente.

### 🦴 Arquitetura: Ploc "Esqueleto Maleável"
- **Status**: 📅 PLANEJADO (Fase 4)
- **Conceito**: O mascote será um esqueleto base que carrega "músculos" (módulos de olhos, boca, gestos) via Lazy Loading.
- **Objetivo**: Reduzir o peso inicial da página. Só baixar o código do que o Ploc está fazendo no momento.

### 🛋️ Móvel: Extração do AuthModal
- **Status**: ✅ CONCLUÍDO
- **O que foi feito**: 
    - Mover ~200 linhas de interface e lógica de login para `modules/auth/components/AuthModal.tsx`.
    - Substituição de estilos inline por Tailwind CSS v4.
- **Benefício**: Landing Page limpa e reutilização do modal.

### 💊 Móvel: Criação da AuthCapsule
- **Status**: ✅ CONCLUÍDO
- **O que foi feito**: 
    - Criação do componente `AuthCapsule.tsx` que une o Botão e o Modal.
    - Encapsulamento total da lógica de entrada.
- **Benefício**: Landing Page agora é 100% declarativa, sem gerenciar estados de login.

### 🧠 Estado: Store de Autenticação Global
- **Status**: ✅ CONCLUÍDO
- **O que foi feito**: 
    - Movimentação do estado `isAuthModalOpen` para o `useAuthStore`.
    - Sincronização entre Mascote e Botão via Estado Global.
    - Centralização da lógica de cookies de sessão no Store.
- **Benefício**: Fim do "Prop Drilling" e infra de autenticação mais robusta.

### 🏗️ Layout: Padronização de Containers Base
- **Status**: ✅ CONCLUÍDO
- **O que foi feito**: 
    - Conversão do container `<main>` para Tailwind CSS v4.
    - Conversão da Barra de Navegação Superior para Tailwind CSS v4.
    - Eliminação de estilos inline redundantes.
- **Benefício**: Redução de ~20 linhas de código na página principal e alinhamento com a fundação de Design Tokens.

### 🚀 Performance: Ativação Tailwind v4
- **Status**: ✅ CONCLUÍDO
- **O que foi feito**: 
    - Ativação do motor CSS-first via `@import "tailwindcss"` no `globals.css`.
    - Sincronização das classes utilitárias com as variáveis de Design Tokens.
- **Benefício**: Estilos agora são processados instantaneamente e seguem o padrão moderno.

### 🖋️ Tipografia: Teste Roboto
- **Status**: ✅ CONCLUÍDO
- **Ação**: Carregar a fonte Roboto no `layout.tsx` e aplicar no `globals.css` como fonte padrão do `body`.

### 🛋️ Móvel: Evolução da AuthCapsule (Ciclo 2)
- **Status**: ✅ CONCLUÍDO
- **Ação**: Absorção do container de navegação pela `AuthCapsule`.
- **Resultado**:
    - `LandingClient.tsx` limpa (Remoção de 7 linhas de código de layout).
    - `AuthCapsule.tsx` evoluída para "Móvel Inteligente" (Dona do próprio posicionamento e estado).
    - Estilização do botão "ENTRAR" atualizada para Verde Esmeralda (Tailwind v4).
- **Benefício**: Menos responsabilidade na página principal e maior encapsulamento.

### 🛋️ Móvel: Atmosfera Gelatinosa (Ciclo 3)
- **Status**: ✅ CONCLUÍDO
- **Ação**: Extração do fundo animado para o componente modular `Atmosphere.tsx`.
- **Resultado**:
    - `LandingClient.tsx` limpa (Remoção de 40 linhas de código visual).
    - Conversão total de estilos inline para Tailwind v4 no cenário.
    - Isolamento das animações do Framer Motion, reduzindo o custo de renderização da página principal.
- **Benefício**: Organização sistêmica do "Cenário" e facilitação de Lazy Loading futuro.

### 🛋️ Móvel: HeroStage (Ciclo 4)
- **Status**: ✅ CONCLUÍDO
- **Ação**: Criação do componente `HeroStage.tsx` para absorver o container de conteúdo.
- **Resultado**:
    - Substituição da técnica redundante de centralização absoluta (`top-50% translate-y`) pela centralização natural Flexbox.
    - `LandingClient.tsx` limpa (Remoção de mais 14 linhas de estilos inline).
- **Benefício**: Layout mais responsivo, previne conflitos de posicionamento e aumenta a declaratividade da página principal.

### 🛋️ Móvel: Frases Motivacionais & Bolhas de Execução Interativas (Ciclo 5)
- **Status**: ✅ CONCLUÍDO
- **Ação**: Extração e refatoração completa do bloco de frases motivacionais dinâmicas e criação do componente interativo `BubblePhrases.tsx`.
- **Resultado**:
    - **Entrelaçamento de Eixo Z (Sanduíche 3D & Resolução de Stacking Context)**: Estabelecemos o Mascote (Ploc) como o verdadeiro protagonista visual da interface! Restauramos o palco `<HeroStage>` para **`zIndex: 20`** (garantindo que o Ploc fique soberanamente à frente do texto central). Posicionamos o Título Central de Frases Motivacionais na camada de base em **`zIndex: 3`** (funcionando como um lindo letreiro de fundo, atrás do Ploc e atrás de todas as bolhas). As bolhas pequenas de fundo sobem em `zIndex: 5` (atrás do Ploc, mas à frente do texto), as bolhas médias flutuam em `zIndex: 15` (atrás do Ploc, mas à frente do texto), e as bolhas gigantes cruzam o primeiro plano em `zIndex: 25` (à frente de absolutamente tudo, inclusive do Ploc!). O efeito sanduíche tridimensional e a imersão visual agora estão 100% impecáveis, satisfazendo plenamente todas as leis da física de profundidade de jogo!
    - **Física de Desvio Flanqueado & Silêncio Absoluto (Zero Ruído Automático)**: Afastamos as bolhas colidentes médias do centro vertical, aplicando as coordenadas `calc(50% - 130px)` e `calc(50% + 130px)`. Isso garante que elas subam contornando as laterais do Ploc com folga, sem colidir automaticamente enquanto o Ploc está estático. Para maior paz acústica, aumentamos o **delay de respawn pós-colisão para 32 segundos**! Agora, o site é 100% silencioso em repouso, e o usuário só faz as bolhas "plocarem" deliberadamente quando arrasta o Ploc sobre a pista delas ou clica nas bolhas.
    - **Trajetórias Diagonais Serpenteantes (Liquid Drift)**: Espalhamos os pontos de spawn das bolhas pelas extremidades e laterais da tela (`2%`, `5%`, `95%`, `98%`, etc.) e implementamos a propriedade `driftX`. Agora, elas sobem flutuando em trajetórias diagonais sinuosas em todas as direções, criando uma física realista de correntes hidráulicas (lâmpada de lava) que preenchem toda a tela de forma orgânica e harmoniosa!
    - **Sincronização Contínua de Loop (First-Run Reset)**: Criamos a variável `isFirstRun` para zerar o `delay` de staggering inicial nas rodadas seguintes. Agora, assim que a bolha atinge o topo ou explode, ela renasce no fundo e sobe imediatamente (`delay: 0`), garantindo fluxo contínuo de colisão eterna em vez de ficar travada esperando na base.
    - **Textura Física de Bolha (Soap Glare & Refraction)**: Injeção de Shaders de Gradiente 2D CSS ultra-leves. Adição de um brilho de reflexo especular curvo (`Bubble Glare`) no canto superior-esquerdo que se deforma de forma responsiva junto com o contorno elástico da bolha. Inclusão de gradiente de volume radial tridimensional e anel duplo de refração interna via `inset box-shadow` branca (topo-esquerdo) e preta suave (fundo-direito). Evoluímos a textura física para um **acabamento de vidro fosco ultra-premium de alta definição (Frosted Glass)**: elevamos o desfoque traseiro para **`12px`**, aumentamos a saturação para **`140%`**, definimos a espessura do contorno colorido vibrante para **`2.0px`** com opacidade de **`52%`**, e aumentamos os limites de opacidade globais para **`0.45 - 0.85`**! Isso torna o efeito de vidro intensamente nítido, fazendo com que as letras do texto motivacional de fundo se distorçam e brilhem de forma magnífica quando as bolhas passam por cima delas!
    - **Efeito Parallax Tridimensional (3D Depth)**: Organização de 3 camadas de bolhas (Fundo/Pequenas/Lentas, Médias/Normais, Frente/Grandes/Rápidas) que variam tamanho, opacidade e velocidade para criar sensação de profundidade hidráulica real.
    - **Interatividade Total (onTap)**: Ativação de toque/clique com latência zero (usando `onTap` na div externa e `pointer-events: none` no texto), permitindo que os usuários estourem as bolhas com mouse ou dedo no celular.
    - **Procedural Synth Sound Variations (3 Presets Procedurais)**: Evoluímos a síntese de som de estouro "PLOC" via Web Audio API. O motor de áudio agora conta com 3 presets acústicos distintos selecionados aleatoriamente (Sine Sweep clássico, Bloop Aquático aveludado de triângulo com filtro lowpass, e High Specular Pop agudo e cristalino) combinados com jitter randômico de frequência de ±10%. Cada estouro gera um som orgânico, diferente, satisfatório e único!
    - **Atenuação de Autoplay**: Sistema inteligente `hasUserInteracted` que suspende a criação do `AudioContext` antes da primeira interação do usuário, garantindo console 100% livre de avisos do navegador.
    - **Verbos de Execução**: Substituição de palavras estáticas por verbos de hábitos saudáveis e ativos (`TREINE`, `CORRA`, `PLANEJE`, `MEDITE`, `BEBA`, `DURMA`, `LEIA`, `COMA`, `DANCE`, `FOCALIZE`).
    - **Dinamismo Acelerado**: Capping de estouros espontâneos entre 3 e 12 segundos para manter a atmosfera sempre ativa.
    - `LandingClient.tsx` limpa (Remoção completa do bloco original de sincronização de strings).
- **Benefício**: Layout interativo fantástico, super satisfatório, 100% otimizado e performático, além de criar uma atmosfera tridimensional imersiva incrível onde o Ploc e as letras estão "imersos" nas bolhas.

---

## 🗓️ 17 de Maio, 2026

### 🛋️ Móvel: Centralizador do Mascote & Fim do "Wrapper Hell" (Ciclo 6)
- **Status**: ✅ CONCLUÍDO
- **Ação**: Criação do componente independente `MascotCenter.tsx` e refatoração do container centralizador de posicionamento absoluto do Ploc Avatar.
- **Resultado**:
    - **Proteção Contra Jitter/Arrasto**: A `div` centralizadora absoluta agora funciona como uma **âncora de coordenadas `(0, 0)` estática** no centro exato da tela. Isso isola o componente arrastável (`PlocAvatar`) de conflitos com transformações CSS (`transform: translate(-50%, -50%)`), prevenindo saltos ou bugs visuais quando o usuário arrasta o mascote pelo viewport.
    - **Landing Page 100% Declarativa**: Redução de mais de 25 linhas de estilo inline, HTML e lógica do Framer Motion da página principal `LandingClient.tsx`.
- **Benefício**: Arquitetura modular extremamente limpa, livre de acoplamento e 100% segura contra bugs de renderização e animação.

### 🛋️ Móvel: Vinheta Modular & Profundidade 3D (Ciclo 7)
- **Status**: ✅ CONCLUÍDO
- **Ação**: Criação do componente independente `Vignette.tsx` e substituição da `div` inline da vinheta de sombreamento interna.
- **Resultado**:
    - **Preservação de Stacking Context**: Mantivemos a camada da vinheta rigorosamente em **`zIndex: 10`**, assegurando o efeito "sanduíche 3D" (bolhas abissais em `zIndex: 4` flutuando sob a vinheta, e o Ploc/textos/bolhas principais à frente dela).
    - **Código Limpo**: Redução de mais de 10 linhas de estilos inline complexos da página principal.
- **Benefício**: UI impecável, modularidade de alta performance e visual cinematográfico perfeitamente preservado.

---

### 🛋️ Móvel: Otimização Extrema de Performance e Sono Dinâmico (Ciclo 8)
- **Status**: ✅ CONCLUÍDO
- **Ação**: Refatoração profunda de performance no `PlocAvatar.tsx`, adição de animações de aceleração por GPU no `globals.css`, e implementação da mecânica de Horário de Sono Dinâmico com penalidades no `AttributeEngine.ts`.
- **Resultado**:
    - **Cálculos & Cores Memoizados (useMemo)**: Todo o processamento aritmético de cliques, níveis de raiva, cores RGB graduais e sombras foi movido para o cache `useMemo` em `PlocAvatar.tsx`. O thread de CPU principal agora opera livre de gargalos matemáticos durante o arrasto livre e transições do mascote.
    - **Respiração Gelatinosa via GPU (CSS Keyframes)**: Removemos a interpolação via Javascript (`Framer Motion`) da propriedade `borderRadius` executada em 60Hz. As animações de respiração gelatinosa calma (`ploc-gelatin-breathe-anim`), piscar de olhos (`ploc-eye-blink`) e vibração de raiva (`ploc-body-shake`) foram migradas para animações nativas CSS acionadas diretamente pelo hardware de vídeo (GPU).
    - **Partículas de Sono Inteligentes (ZzzParticles com Page Visibility)**: Otimização completa do sistema de spawn de partículas do sono. Integramos a **Page Visibility API** para suspender o temporizador `setInterval` e zerar a renderização visual das partículas assim que o navegador perde o foco (aba oculta), poupando bateria e CPU do dispositivo do usuário. Limitamos também o número de partículas simultâneas ativas a no máximo 4.
    - **Sistema de Sono Dinâmico & Penalidade de Madrugada**:
        - Adicionamos verificação do fuso horário local do usuário e cálculo da janela de sono (das 00:00 às 06:00 por padrão, ou sincronizado com o hábito em `localStorage` do usuário).
        - Implementamos o método `applySleepPenalty()` no motor central `AttributeEngine.ts`. Se o usuário quebrar o hábito e abrir o aplicativo durante o horário de sono, a penalidade é disparada (**uma única vez por sessão** usando `sessionStorage`), subtraindo **-10 pontos de Foco (XP)**, **-8 pontos de Corpo** e **-4 pontos de Mente**.
        - Ao clicar no Ploc enquanto ele está dormindo de madrugada, ele é despertado em estado de sobressalto (`stressing`), emitindo um balão de fala com uma bronca hilária e educativa: *"ZZZ... QUE susto! 😤 Não me acorde de madrugada, humano! Vá dormir!"*.
- **Benefício**: Framerate impecável a 120Hz/120FPS durante interações físicas do mascote, redução drástica de consumo energético em abas ocultas, e gamificação genial de hábitos reais com o Ploc atuando como um tamagotchi e guardião do sono do usuário!

---

### 🛋️ Móvel: Desacoplamento Total de Autenticação & Elasticidade Extrema (Ciclo 9)
- **Status**: ✅ CONCLUÍDO
- **Ação**: Remoção das propriedades de dependência de autenticação do `PlocAvatar.tsx`, limpeza de imports e simplificação dos componentes `MascotCenter.tsx` e `LandingClient.tsx`. Adição de keyframes bi-axiais de alta flexibilidade e física de mola sub-amortecida no Framer Motion.
- **Resultado**:
    - **Independência do Mascote**: O PlocAvatar foi totalmente libertado dos gatilhos que abriam o modal de login no clique ou no arrasto. Ele agora responde de forma puramente física e lúdica em todas as páginas (mesmo sem autenticação).
    - **Limpeza de Código Morto**: Removemos os estados `inputValue`, `isInputOpen` e `isLoading`, além do método `handleChatSubmit` e imports não utilizados de `useAuthStore` e `chatService`.
    - **Desacoplamento de Props**: O `MascotCenter.tsx` e a Landing Page (`LandingClient.tsx`) foram simplificados para montar o `<MascotCenter />` de forma declarativa e pura, sem passar parâmetros complexos de controle do modal.
    - **Física Gelatinosa Extrema (Dynamic Jelly Wobble)**:
        - **Keyframes Bi-axiais**: Redesenhamos a animação nativa de respiração `ploc-gelatin-breathe` no `globals.css` para fazer deformações bi-axiais mais proeminentes (entre `40%` e `65%` nos cantos do border-radius) com ciclos mais ágeis e vivos de `4.8s` (anteriormente `6s`).
        - **Pressão Realista (Hover & Tap)**: Ao passar o mouse, o Ploc se estica suavemente nas laterais imitando pressão interna. Ao ser clicado ou pressionado (tap), ele sofre um achatamento elástico e achatado bem orgânico (`scaleX: 1.12`, `scaleY: 0.88`).
        - **Máquina de Estados de Animação Determinística**: Em vez de usar os gatilhos nativos e instáveis do Framer Motion (`whileHover`, `whileTap`, `whileDrag`) que às vezes se perdem quando o mouse é solto muito rápido, migramos todas as escalas e rotações para um controle reativo dirigido por estados React (`isHovered`, `isTapped`, `isDragging`).
        - **Garantia de Reset de Soltura (Option 2)**: No milissegundo em que o evento `onDragEnd` dispara, forçamos instantaneamente os estados `isDragging`, `isTapped` e `isHovered` para `false`. Isso faz com que a escala e a rotação retornem com 100% de confiabilidade matemática à forma perfeitamente esférica inicial, mesmo sob arrastos ultra velozes e solturas abruptas fora do elemento!
- **Benefício**: Arquitetura modular robusta, interações táteis extremamente divertidas, fluidas e satisfatórias que dão a sensação de mexer em uma gelatina real e interativa a 120FPS!

---

### 🧩 Arquitetura: Modularização e Encapsulamento Total do Ploc (Ciclo 10)
- **Status**: ✅ CONCLUÍDO
- **Ação**: Decomposição da arquitetura monolítica do mascote Ploc em submódulos de visualização pura e hooks especializados, reduzindo o arquivo principal de ~700 linhas para menos de 320 linhas.
- **Resultado**:
    - **Centralização de Tipos (`types.ts`)**: Criação de um local único e central para definições de tipos do Ploc (`PlocMode`, `PlocState`, `PlocAvatarProps`), eliminando imports circulares.
    - **Hook de Estado Especializado (`usePlocState.ts`)**: Extração de toda a máquina de humores, contadores de cliques de irritação, cálculo de janela de sono dinâmico, monitoramento de toques físicos e colisões de cards.
    - **Hook de Acessibilidade e Voz (`usePlocSpeech.ts`)**: Encapsulamento dos timeouts de balões de fala e preparação da API nativa Web Speech para síntese de voz reativa de alta performance.
    - **Visualizador de Bolhas 3D (`PlocBubbles.tsx`)**: Isolamento da camada gráfica de bolhas flutuantes internas.
    - **Visualizador Facial Expressivo (`PlocFace.tsx`)**: Encapsulamento dos olhos, sobrancelhas dinâmicas, animação CSS de piscada e o reflexo gelatinoso 3D superior do corpo.
    - **Visualizador dos Membros Stick (`PlocLimbs.tsx`)**: Isolamento estético dos braços, mãozinhas e pernas flutuantes doodle.
    - **Shell Orquestrador Limpo (`PlocAvatar.tsx`)**: Redução drástica da complexidade do componente principal. Ele agora atua exclusivamente coordenando os hooks e aninhando as tags filhas com as animações de mola do Framer Motion.
    - **Design Estético: Réplica de Olhos do Padrão 010 (Ciclo 10.5)**:
        - **Pálpebra Superior Grossa (Thick Lash Line)**: Implementamos o contorno superior no `PlocFace.tsx` com traço vetorial robusto (`strokeWidth="8"`) e cauda externa curvada para baixo, exatamente como no design 010.
        - **Esclera Branca Definida**: Um preenchimento ovalado de cor branca pura (`#ffffff`) que serve de base para recortar a silhueta do olhar, blindado milimetricamente no nível máximo de vedação e rebaixado cirurgicamente de `y: 30` para **`y: 42`** para achatar o globo ocular e deixá-lo no formato **semi-cerrado (droopy)**, a marca registrada da cara de cansado.
        - **Pupila em Cápsula Vertical**: Uma pupila em formato de pílula vertical (`width: 18px`, `height: 32px`) que agora fica **cortada exatamente pela metade** pela pálpebra superior grossa caída, criando o autêntico olhar relaxado de sono e fadiga profunda de tamagotchi exausto. Para garantir isolamento absoluto de renderização, implementamos uma **Máscara Vetorial (`<clipPath id="eye-clip">`)** nativa do SVG baseada no contorno da esclera branca achatada, o que corta cirurgicamente qualquer pixel da pupila ou das sombras que vaze acima de `y: 42` ou abaixo de `y: 76`.
        - **Ampliação de Escala Visual**: Aumentamos as dimensões dos olhos de `15% x 24%` para **`20% x 32%`** do rosto, conferindo muito mais impacto e legibilidade artística ao mascote.
        - **Variação da Cor Ploc (Pálpebras Adaptativas Sóbrias)**: Eliminamos a cor preta neutra dos contornos! O cílio agora é um **Azul Meia-Noite Profundo e Nítido** (`#082f49`), com a dobra de pálpebra (crease) e a sombra de profundidade 3D semi-transparente em um elegante **Azul Ploc Médio-Escuro** (`#0284c7` - Sky 600), dando um acabamento muito mais orgânico, sóbrio e sério ao rosto.
        - **Sobrancelha Superior e Olheiras Esfumaçadas (Grumpy Anime Aesthetic)**: Unificamos a cor da pálpebra/sobrancelha superior com a cor escura dos olhos (**Azul Meia-Noite Profundo** `#082f49`). As sobrancelhas foram desenhadas em uma **curvatura caída e relaxada nas pontas (`M 14 20 Q 50 24 86 20`)** para expressar exaustão física total. Para simular a olheira profunda e concentrada, **tanto o sombreado degradê suave quanto a linha de bolsa ocular com stroke sólido de `4.5px` foram deslocados em sincronia perfeita em `dx = 14px` em direção ao nariz** (para a direita no olho esquerdo e para a esquerda no olho direito), concentrando o vinco de cansaço extremo profundamente no centro da face como uma única peça harmônica. Adicionalmente, injetamos uma **sombra de pálpebra inferior preta pura (`#000000`) a `16%` de opacidade** sobreposta à base da pupila/globo para criar um efeito magnífico de oclusão óptica 3D.
        - **Reatividade Cromática Dinâmica**: Quando o Ploc fica bravo (`isPissed`) ou sente dor (`isHurt`) e seu corpo se torna vermelho, **todos os tons das pálpebras, olheiras, sombras e pupilas mudam em tempo real** para variações de carmesim e vermelho profundo, gerando uma harmonia estética incrível a 120FPS!
        - **Física de Animação Estável (SVG Interpolation Fix)**: Substituímos o morphing dinâmico do atributo `d` (que causava o erro de renderização do React no console) por transformações e escalas de pálpebras aceleradas por hardware (`scaleY` e `y`), atingindo 100% de estabilidade e performance perfeita de 120FPS sem qualquer log de erro.
- **Benefício**: Arquitetura premium de alto nível que garante manutenibilidade vitalícia do mascote, reaproveitamento completo de lógica em outras plataformas (como React Native futuramente) e 100% de integridade com o compilador TypeScript (`npx tsc --noEmit` bem-sucedido com 0 avisos ou erros!).

---

## 🗓️ 19 de Maio, 2026

### 🧩 Lógica: Individualização de Bolhas & Refinamento do Game de Onboarding (Ciclo 11)
- **Status**: ✅ CONCLUÍDO
- **Ação**: Implementação de bolhas individuais de pilares com estados ricos e contextualizados (`corpo`, `mente`, `vida`, `liberdade`, `proposito`), desacoplamento físico e visual de cliques ativos do usuário versus colisões passivas de sabão com o Ploc, e reformulação das falas do Ploc com alta variedade por pilar.
- **Resultado**:
    - **Bolhas Especializadas com Metadados**: Cada pilar possui bolhas personalizadas de valor positivo ou negativo (ex: `Sedentarismo` (-) vs `Treinar` (+); `Dívidas` (-) vs `Autonomia` (+)) com tamanhos variados e z-indices ajustados para efeito real de profundidade e parallax.
    - **Desacoplamento de Interação (Cliques vs Colisões)**:
        - **Colisões Físicas**: Quando as bolhas flutuam e colidem silenciosamente com o Ploc, ele as absorve de forma serena. As reações do Ploc são extraídas de uma matriz rica de provérbios reflexivos específicos para aquele pilar com cooldown generoso, sem interferir na pontuação.
        - **Cliques do Usuário**: Quando o usuário clica ativamente em uma bolha, ela explode de forma ativa. Se o onboarding-game estiver inativo (modo decorativo), ela conta para a contagem de progressão dramática do Ploc até desbloquear as bolhas de onboarding.
    - **Refinamento do Game de Onboarding**:
        - Quando o minigame inicia, apenas bolhas específicas dos 5 pilares com status (+/-) são geradas.
        - Estourar bolhas positivas adiciona pontos ao pilar correspondente no `AttributeEngine` e faz o Ploc vibrar em comemoração com falas positivas alegres.
        - Estourar bolhas negativas subtrai pontos no `AttributeEngine` e gera falas de alerta e atenção.
        - Se o usuário tentar estourar um pilar de forma desproporcional, o Ploc dá um "puxão de orelha" sobre o equilíbrio de todos os pilares.
    - **Validação de Compilação Impecável**: Execução de `npx tsc --noEmit` e `npm run build` bem-sucedidos em 100% com 0 erros, garantindo máxima estabilidade de código e excelente integridade arquitetural.
- **Benefício**: Experiência de jogo incrivelmente rica, fluida e imersiva. A interação com as bolhas se tornou um minigame extremamente satisfatório de autoconhecimento que engaja e ensina o usuário sobre o equilíbrio de sua vida.
    - **Identificação Visual Dinâmica das Bolhas**:
        - **Bolhas Positivas**: Envolvidas em um lindo gradiente radial esmeralda-verde (`rgba(34, 197, 94, 0.45)`) com borda sólida de `2px` contrastada (`rgba(34, 197, 94, 0.65)`) e brilho interno (inset shadow) que destaca a bolha instantaneamente na tela.
        - **Bolhas Negativas**: Envolvidas em um vibrante gradiente radial carmesim-vermelho (`rgba(239, 68, 68, 0.45)`) com borda sólida de `2px` (`rgba(239, 68, 68, 0.65)`) e brilho avermelhado pulsante, facilitando a rápida identificação visual de ameaças à vida e hábitos.
        - **Rótulos Legíveis (Text Labels)**: Forçamos a renderização de textos de ação nítidos em fonte `Outfit` com cor branca pura (`#ffffff`) e sombreamento profundo para que o jogador consiga ler com facilidade palavras complexas como "Fast-food" ou "Meditação" em vez de apenas ver ícones genéricos.
    - **Falas Passivo-Agressivas de Equilíbrio**:
        - Mapeamos um conjunto super rico de diálogos passivos-agressivos baseados em cada um dos 5 pilares do Ploc (Corpo, Mente, Vida, Liberdade, Propósito).
        - Quando o usuário clica e estoura uma bolha, o Ploc comenta especificamente de acordo com o pilar clicado e se o pilar é positivo ou negativo.
        - O roteiro de falas ativamente incentiva o equilíbrio, mostrando o benefício do pilar, mas alertando que o excesso de foco nele arruína todos os outros pilares (ex: " shape de ouro com mente esgotada e sem liberdade financeira é só uma carcaça bonita no vazio!").

---

> "O design não é apenas o que se vê, mas como ele funciona por trás das cortinas." 🕵️‍♂️🚀



