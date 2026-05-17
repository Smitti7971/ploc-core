# 🎯 Mapa de Refatoração e Padronização - PLOC

Este documento define o estado atual de cada página e o plano de ação para a **Fase 4 (Limpeza Profunda)**.

---

## 1. 🏠 Página: Home (`/`)
**Arquivos**: `app/page.tsx`, `app/LandingClient.tsx`

### 🔍 O que temos hoje?
- **Blackboard**: O canvas imersivo com as bolhas de tarefas. [**] [eu vejo 3 elementos na tela, o Avatar do Ploc o local de entre e uma frase motivacional. não vejo nada de tarefas ou bolhas]
- **AuthModal (Zumbi)**: Uma implementação inline gigante de autenticação. [**] [Esse layout do modal não me agrada, mas está funcionando] (ja mudamos o style do modal em outro momento)
- **Lógica de Estado**: Carregamento de tarefas e status da IA. [**] [ainda não implementado nada de IA foi avançado ainda, apenas fizemos testes em versões extremamente antigas, a arquitetura está montada para receber a IA]
- **Estilos**: Muitos estilos inline e cálculos de posição de bolhas misturados com a UI. [**] [Como disse, não temos nada de bolhas aparecendo, então não sei como está]

### 🏗️ Plano de Refatoração [**] [Precisamos dar enfase em transformar todos os modulos inline em modulos soltos, sem a interferencia um do outro para não ocorrer o problema de ficar bugado em alguma area específica]
1. **Extrair o Blackboard**: Mover toda a lógica do canvas para `modules/blackboard/components/BlackboardCanvas.tsx`.
2. **Eliminar AuthModal Inline**: Substituir as +200 linhas de código de login pelo componente unificado `modules/auth/components/AuthModal.tsx`.
3. **Design Tokens**: Substituir cores fixas (ex: `#020617`) pelas variáveis do `design-tokens.json`.
4. **Simplificar `LandingClient`**: Ele deve ser apenas um "orquestrador" que chama o Blackboard e o Modal, sem conter a lógica interna deles.

---

## 2. ✨ Página: Dashboard (`/dashboard`)
**Arquivos**: `app/dashboard/page.tsx`

### 🔍 O que temos hoje?
- **Lista de Rotinas**: Visualização bento-grid das rotinas diárias. [**] [é uma Pagina de importancia, Mas como fizemos apenas a inclusão para testes, podemos modificar tudo para adaptar ao sistema de modulos, em questão de organização e performance e aparencia]
- **Progresso**: Barras de status (Body, Mind, XP). [**] [Aqui não temos nada funcional, apenas um mockup de quando usamos para testes]
- **Cards de Ação**: Botões para executar rotinas. [**] [Aqui não temos nada funcional, acredito que tinhamos o da rrotina do cigarro, mas foi apagada, com a criação da pagina completa]

### 🏗️ Plano de Refatoração
1. **Componentizar Cards**: Criar `modules/routines/components/RoutineCard.tsx` para evitar repetição de código de estilização. [**] [Acho que o ideal é criar um metodo de criação de modulos padrão para que possamos seguir o mesmo padrão em todas as paginas, já que as rotinas estão separadas, sem falar que de alguma forma deve ter um tipo de personalização ou algo assim, por parte do usuario, caso ele queira adicionar rotinas no futuro] 
2. **Hook de Dados**: Criar `modules/routines/hooks/useRoutines.ts` para isolar a chamada da API do componente visual. [**] [Esses seriam os hooks que fazem o Ploc interagir com o servidor, correto? fazendo calculos se necesssário por que imagino que para gerarmos os alertas e as notificações teriamos que ter esse controle], correto?
3. **Uso de `cn()`**: Aplicar a utilidade `cn` para gerenciar estados de "concluído" ou "pendente" nos cards. [**] [Preciso entender melhor como funciona, mas acredito que seja uma boa ideia]

---

## 3. ⚙️ Página: Configurações (`/settings`)
**Arquivos**: `app/settings/page.tsx`

### 🔍 O que temos hoje?
- **Perfil do Usuário**: Nome, email, foto. [**] [Seá nossa quinta vez mexendo nessa pagina, acredito que desta vez ficará boa.]
- **Preferências da IA**: Personalidade e objetivos. [**] [Isso eu quero que seja feito automaticamente com a analise da IA, após o pedido de informações do usuário, ou habilitando automaticamente, dependendo de certas condições, que ainda não parei para pensar sobre, mas o importante é que ele tenha total controle sobre si mesmo e cpm segurança para não falar besteiras.]
- **Tema**: Opções (ainda limitadas). [**] [Esse foi mais um que fizemos várias vezes mas perdemos todas as vezes por algum bug que deletou, ou nossas refatorações cotidianas]

### 🏗️ Plano de Refatoração
1. **Modularizar Seções**: Dividir em `ProfileSettings.tsx` e `AISettings.tsx` dentro de `modules/settings/components/`. [**] [o usuário não deve ter controle do estado da I.A, podemos pensar nisso depois de testes, mas inicialmente quero que ele consiga alterar os estados, um exemplo seria ele usar o Landing client, com um prompt Robusto de venda, para pessoas que não conhecem o ploc, se insentivarem a comprar desde a landing page]
2. **Formulários Padronizados**: Usar um padrão de input único que respeite os Design Tokens. [**] [e mais uma vez faremos mais um formulario, dessa vez vai dar certo]
3. **Sync com Store**: Garantir que as mudanças aqui atualizem o `authStore` instantaneamente. [**] [não entendi muito isso, eu achava que essas atualizações já eram atualizadas instantaneamente.]

---

## 🧩 Componentes Globais (Layout)
**Arquivos**: `AppShell.tsx`, `DockMenu.tsx`, `UserHeader.tsx`

### 🏗️ Plano de Refatoração
1. **Centralizar AppShell**: Mover do nível de página para o `app/layout.tsx`. [**] [Não sei se entendi, mas acredito que esteja falando pelo fato de que o AppShell não estava sendo Chamado pelo layout, acreditamos que ele está sendo injetado diretamente pelas páginas.]
2. **Limpar DockMenu**: Já fizemos a remoção das rotas fantasmas, agora falta remover os estilos inline e usar Tailwind. [**] [Esse Dockmenu está bonito, mas ele será o caminho manual do  usuário, nossa área de vendas e por ai vai, então precisamos repensar no em como fazer esse modo manual conversa com a I.A]
3. **Unificar `UserHeader`**: Garantir que o avatar e o nível (XP) venham do mesmo lugar (Store) em todas as telas. [**] [Aqui eu já não sei o que falar, por que aparentemente temos muitos botões de ação dentro do header.]

---

## 🛠️ Regras de Ouro para a Fase 4:
- **Zero Inline Styles**: Todo estilo novo deve usar Tailwind ou CSS Modules + `cn()`. [**] [Precisamos entender melhor como funciona.]
- **Logic-Less Components**: Componentes visuais não devem fazer `fetch` diretamente (usar hooks ou services). [**] [Precisamos entender melhor como funciona.]
- **Single Source of Truth**: Cores e espaçamentos vêm APENAS do `design-tokens.json`. [**] [Precisamos entender melhor como funciona.]
