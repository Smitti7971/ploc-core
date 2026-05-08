# GUIA MESTRE: Auditoria e Limpeza (Frontend) 🛡️🏗️

Este guia define o padrão de integridade para o Frontend do Ploc. Use-o para garantir que o projeto permaneça organizado, modular e seguro contra vulnerabilidades comuns de navegador.

---

## 🔒 BLOCO 1: Protocolo Sentinela (Segurança)

O Frontend é a porta de entrada. Se ele for vulnerável, o usuário está em risco.

### 1. Prevenção de XSS (A Regra de Ouro)
**NUNCA** use `.innerHTML` para exibir dados que venham do usuário (nomes de tarefas, descrições, nomes de categorias).
- **Como Auditar**: Procure por `.innerHTML =` no código.
- **Correção**: Substitua por `.textContent =` ou use a técnica de `createElement` e `appendChild`.
- **Por que?**: Evita que scripts maliciosos sejam injetados e roubem o Token JWT do usuário.

### 2. Gestão de Identidade (Tokens)
- **Logout Seguro**: O comando `logout()` deve obrigatoriamente limpar o `localStorage` COMPLETAMENTE (`localStorage.clear()`).
- **Exposição de Dados**: Verifique se não há `console.log(token)` ou `console.log(userData)` ativos em ambiente de produção.
- **Redirecionamento**: Toda página protegida (como o Dashboard) deve verificar o token IMEDIATAMENTE no topo do script.

### 3. Blindagem de Formulários
- **Double-Click Lock**: Todo botão de "Salvar" ou "Entrar" deve ser desabilitado (`disabled = true`) assim que o primeiro clique for detectado.
- **Sanitização de Input**: Antes de enviar dados para a API, use `.trim()` para remover espaços em branco acidentais que podem causar erros no banco de dados.

---

## 🏗️ BLOCO 2: Engenharia de Fluxo (Organização)

Um projeto bagunçado é um projeto que quebra.

### 1. Unificação de Rede (O Princípio do Cliente Único)
Nenhum arquivo HTML deve usar `fetch()` diretamente.
- **Padrão**: Toda comunicação deve passar pelo `apiClient` em `js/api/client.js`.
- **Vantagem**: Se mudarmos a forma como o Token é enviado, mudamos em UM arquivo, e não em dez.

### 2. Fonte da Verdade (Configuração)
A URL da API e as chaves de configuração devem residir exclusivamente no `js/config.js`.
- **Proibido**: URLs hardcoded (ex: `https://api.meusite.com`) espalhadas pelo código.

### 3. Modularidade (ES Modules)
Sempre use `<script type="module">`.
- **Por que?**: Evita "poluição do escopo global". Variáveis de um arquivo não vazam para o outro acidentalmente.
- **Nota**: Funções que precisam ser chamadas pelo HTML (como `onclick`) devem ser penduradas no objeto `window` (ex: `window.minhaFuncao = ...`).

---

## 📦 BLOCO 3: Resiliência (PWA e Offline)

O Ploc deve se comportar como um App nativo no celular do usuário.

### 1. Auditoria de Cache (`sw.js`)
Sempre que um novo arquivo JS ou CSS for criado:
- Ele deve ser adicionado à lista `ASSETS_TO_PRECACHE` no `sw.js`.
- A versão do `CACHE_NAME` deve ser incrementada (ex: `v10` -> `v11`).

### 2. Feedback de Estado
- **Carregamento**: Toda coluna ou lista que depende de dados da internet deve exibir um indicador de carregamento (Loader) enquanto os dados não chegam.
- **Erro Amigável**: Se a API falhar, o erro deve ser capturado pelo `catch` e exibido de forma legível (via Toast), nunca deixando a tela "congelada".

---

## 💡 Lições de Batalha (Frontend)
- **[2026-05-08]**: O uso de `.innerHTML` em cartões de tarefa era a maior vulnerabilidade do Ploc. Corrigido usando `textContent` seletivo nos IDs de título.
- **[2026-05-08]**: Centralizar a API no `client.js` permitiu que o App se tornasse modular. O `fetch` direto no HTML foi banido.
- **[2026-05-08]**: A viewport móvel foi travada (`user-scalable=no`) para evitar que o zoom acidental do iPhone "quebrasse" o layout do Kanban.
