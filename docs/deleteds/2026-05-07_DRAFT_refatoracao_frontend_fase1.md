# DRAFT: Refatoração Modular do Frontend (Fase 1) 🎨🏗️

## 1. Entender (Intenção) 🧠
- **O quê**: Organizar o Frontend em módulos e componentes, mesmo usando Vanilla (HTML/JS puro).
- **Por quê**: Facilitar a manutenção e permitir que a gente mude o "visual" no futuro sem tocar na "lógica".
- **Referências**: 
    - **MVC (Model-View-Controller)**: Separar o código que busca dados do código que desenha na tela.
    - **Atomic Design (Simplificado)**: Criar pequenos pedaços de CSS reutilizáveis.
- **Metáfora**: O Guarda-Roupa Modular. Lógica em uma gaveta, Visual em outra.

---

## 2. As Engrenagens (A Lógica)

Vamos dividir o Frontend em três "Departamentos" dentro da pasta `src/frontend`:

1.  **Módulo de API (`js/api.js`)**: O único lugar que sabe falar com o Backend. Ninguém mais faz `fetch()` direto.
2.  **Módulo de UI (`js/ui.js`)**: O lugar que sabe desenhar coisas na tela (ex: criar um card, abrir um modal).
3.  **Módulo Principal (`dashboard.js`, `index.js`)**: O "maestro" que coordena quando chamar a API e quando mandar a UI desenhar.

**No CSS**:
- Criaremos um arquivo `css/theme.css` para as cores e fontes (as roupas).
- Criaremos um arquivo `css/layout.css` para o esqueleto (as prateleiras).

---

## 3. Blindagem (O que pode quebrar?)

- **Ponto Crítico**: Não podemos perder as funções de login e carregamento do Kanban que já funcionam.
- **Segurança**: Garantir que o `localStorage` (onde guardamos o token de acesso) seja gerenciado por apenas um arquivo.

---

## 4. O Rascunho Final (Nova Estrutura)

```text
src/frontend/
├── css/
│   ├── theme.css       # Cores, Bordas, Fontes
│   └── layout.css      # Grids, Flexbox, Estrutura
├── js/
│   ├── api/            # Comunicação com o Backend
│   ├── components/     # Desenho de Cards, Menus, Toasts
│   └── utils/          # Formatadores de data, validadores
├── dashboard.html      # Limpo, apenas chamando os módulos
└── index.html          # Limpo, apenas chamando os módulos
```

---

## 5. Próximos Passos (Ação)
1. Criar a nova estrutura de pastas.
2. Criar o `js/api/client.js` para centralizar as chamadas ao backend.
3. Mover a lógica de Login para o novo padrão modular como teste de fogo.
