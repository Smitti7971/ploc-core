# DRAFT: Arquitetura da Experiência Ploc (O Palco Digital) 🏛️🤖🎨

## 1. Entender (Intenção) 🧠
- **O quê**: Criar uma interface ultra-minimalista focada na interação com o Avatar da IA (PLOC).
- **Por quê**: Diferenciação de mercado. O Ploc não é uma lista de tarefas, é um assistente vivo.
- **Referências**: ChatGPT (Simplicidade), Linear (Minimalismo/Atalhos), Assistentes Virtuais (Personalidade).
- **Metáfora**: "O Palco Digital". O Avatar é o ator principal, os modais são holofotes centrais, e as ferramentas são os bastidores (Sidebars).

---

## 2. As Engrenagens (A Lógica)

### A. O Sistema de Estados do Avatar (AvatarSystem)
- O Ploc terá um "Cérebro Visual" que alterna entre:
    - `DORMINDO`: Interface passiva, apenas notificações sutis.
    - `TRABALHANDO`: Foco em tarefas, notificações sonoras.
    - `INTERAGINDO`: Modo Chat ativo, ouvindo comandos.

### B. O Gerenciador de Modais (ModalManager)
- Sistema centralizado que dispara janelas no meio da tela com fundo em **Blur**.
- Usado para: Login, Registro, Configurações de Perfil e Edição de Tarefas.

### C. Layout Adaptativo (ResponsiveEngine)
- **Mobile**: Menu superior (Header) com acesso rápido.
- **Web**: Lateral Esquerda fixa/recolhível e Lateral Direita (Agenda) retrátil.

---

## 3. Blindagem (O que pode quebrar?)

- **Performance**: O efeito de Blur e animações do Avatar podem pesar em celulares antigos. Precisamos de um código "leve como uma pluma".
- **UX**: Garantir que, ao clicar fora de um modal, ele feche suavemente sem perder os dados que o usuário estava digitando.

---

## 4. O Rascunho Final (Estrutura de Componentes)

```text
src/frontend/
├── css/
│   ├── theme.css           # Cores e Variáveis
│   ├── components/
│   │   ├── avatar.css      # Animações e Estados do Ploc
│   │   ├── modals.css      # Estilos de Blur e Centralização
│   │   └── sidebars.css    # Layouts Web/Mobile
├── js/
│   ├── components/
│   │   ├── Avatar.js       # Lógica de animação e estados
│   │   ├── Modal.js        # Gerenciador de janelas flutuantes
│   │   └── Sidebar.js      # Controle de menus retráteis
│   └── main.js             # O "Maestro" do Palco
```

---

## 5. Próximos Passos (Ação)
1. Criar os estilos de base para **Modais e Blur** no `modals.css`.
2. Criar o esqueleto do **Gerenciador de Modais** em `js/components/Modal.js`.
3. Transformar o `login.html` atual no primeiro uso oficial do `ModalManager` dentro da `index.html`.
