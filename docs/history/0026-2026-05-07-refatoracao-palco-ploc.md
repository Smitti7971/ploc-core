# Tarefa Atual: Refatoração da Experiência Ploc (Fase 1: O Palco e Modais) 🏛️🎨

## 1. Entender (Intenção) 🧠
- **O quê**: Criar a interface de "Palco Único" (index.html) com o Avatar Centralizado e o Gerenciador de Modais.
- **Por quê**: Unificar a experiência do usuário e profissionalizar a arquitetura do Frontend.
- **Metáfora**: Montar o palco do teatro onde o Ploc é o ator e os modais são os diálogos.

## 2. Preparar (Logística) 🎒
- **Arquivos-Alvo**: `src/frontend/index.html`, `src/frontend/css/theme.css`, `src/frontend/login.html`.
- **Ambiente**: Navegador.
- **Risco**: Conflitos de CSS ao centralizar elementos com Blur.
- **Proteção**: Criar arquivos de componentes isolados (`modals.css`, `avatar.css`).

## 3. O Que Executar (Ação) 🛠️ (Heartbeat Ativado)
- [x] **Passo 1**: Criar estrutura de diretórios para componentes (`css/components`, `js/components`).
- [x] **Passo 2**: Criar a Base de Modais (`css/components/modals.css`) com efeito Blur.
- [x] **Passo 3**: Criar o Gerenciador de Modais (`js/components/Modal.js`).
- [x] **Passo 4**: Criar o Componente Avatar Semáforo (`js/components/Avatar.js` e `css/components/avatar.css`).
- [x] **Passo 5**: Unificar o Login: Transformar o `login.html` em um componente de modal dentro da `index.html`.

---
## 🔄 Tentativas e Logs (Heartbeat)
### Passo 1 a 4: Infraestrutura Modular
- Tentativa 1 - ✅ [Sucesso]: Todos os componentes base (Modal, Avatar) criados seguindo o padrão Enterprise de classes e módulos ES6.

### Passo 5: Unificação (O Palco)
- Tentativa 1 - ✅ [Sucesso]: `index.html` transformada em SPA (Single Page App). O login agora é um componente injetado dinamicamente via `ModalManager`.
- Resultado: O Ploc "acorda" ou "dorme" conforme o estado de login detectado pelo `main.js`.
- Código 100% modular (ES6).

## 4. Resultado Esperado (Visão) 👁️
- Ao abrir a `index.html`, o Ploc aparece no centro (Círculo Vermelho se deslogado).
- Um modal de Login aparece automaticamente no centro com fundo desfocado.
- Código 100% modular (ES6).

## 5. Validar & Testar (Prova de Vida) ✅
- **Teste 1**: Verificar se o modal abre e fecha corretamente.
- **Teste 2**: Validar se o círculo troca de cor (Simulação de estado).

---
## 🔄 Tentativas e Logs (Heartbeat)
### Passo 1: Estrutura de Componentes
- **Status**: ⏳ Aguardando Início
