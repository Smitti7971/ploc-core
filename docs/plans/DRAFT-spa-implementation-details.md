# Estratégia: Implementação Detalhada da SPA 🏗️

## 🎯 Objetivo
Implementar o roteador e os primeiros componentes da SPA, seguindo a lógica de "Zero Page Reload" e manipulação direta do DOM.

## 🛠️ Engrenagens (Componentização)

### 1. Estrutura de Pastas
Criaremos a pasta `src/frontend/js/components/` para hospedar as telas como funções que retornam elementos DOM ou strings HTML.

### 2. O Roteador (`js/router.js`)
O roteador será uma função simples que:
- Lê o estado atual (ex: `hash` da URL ou um estado interno).
- Limpa o container `#app`.
- Instancia e injeta o componente correspondente.
- Gerencia o estado de autenticação (redireciona para Login se não houver token).

### 3. Componentes Iniciais
- **LandingPage.js**: Hero section, chamada para ação (CTA), visual minimalista.
- **LoginForm.js**: Formulário de entrada com validação simples.
- **RegisterForm.js**: Formulário de cadastro.

## 🔄 Fluxo de Trabalho
1. Criar diretório `js/components`.
2. Implementar `LandingPage.js` exportando uma função `renderLanding()`.
3. Refatorar `main.js` para usar o roteador.

## 🧪 Validação
- Testar navegação entre Landing e Login sem recarregar a página.
- Verificar se os estilos aplicados via JS no `main.js` continuam funcionando ou se devem ser movidos para o CSS global.

---
**Aguardando aprovação do USER para iniciar a execução do Passo 2 (Roteador).**
