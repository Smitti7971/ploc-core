# GUIA: Manipulação de DOM (Vanilla JS) 🌳

## Quando usar
- Sempre que precisar atualizar a interface sem recarregar a página.
- Na criação de novos elementos dinâmicos (Cards, Modais, Notificações).
- Na implementação de interações em tempo real (Drag and Drop, Scroll Infinito).

## Checklist obrigatório
- [ ] O elemento alvo existe no HTML ou foi criado via JS?
- [ ] Se estiver criando múltiplos elementos, use um `Fragment` ou uma função fábrica para manter a modularidade.
- [ ] Verifique se IDs e Classes seguem o padrão do projeto para evitar conflitos de CSS.

## Execução padrão (O Padrão PLOC)

### 1. Seleção de Elementos
Prefira sempre `querySelector` e `getElementById` para clareza:
```javascript
const kanbanBoard = document.querySelector('#kanbanBoard');
```

### 2. Criação Modular (Factory Pattern)
Em vez de escrever strings de HTML gigantes, use a criação de elementos para ter mais controle:
```javascript
function createComponent(data) {
    const div = document.createElement('div');
    div.className = 'my-component';
    div.innerHTML = `<p>${data.text}</p>`;
    return div;
}
```

### 3. Inserção Inteligente
- **Append**: Adiciona ao final (`appendChild`).
- **Prepend**: Adiciona ao início (`prepend`) - *Usado no nosso Scroll de Passado*.
- **Replace**: Substitui um elemento existente.

### 4. Gerenciamento de Eventos
Sempre use `addEventListener` em vez de atributos `onclick` no HTML:
```javascript
btn.addEventListener('click', (e) => {
    // Lógica aqui
});
```

## Erros comuns
- **Vazamento de Memória**: Criar milhares de elementos no DOM e nunca removê-los.
- **Reflow Excessivo**: Alterar o DOM dentro de loops muito grandes (Dica: altere tudo fora e injete uma vez só).
- **Z-Index Hell**: Injetar elementos (como modais) sem garantir que eles ficarão no topo da árvore.

## Estratégias de fallback
- Se o elemento não for encontrado no DOM, registre um erro no console e pare a execução da função para evitar que o site trave.

## Restrições
- **PROIBIDO** usar `document.write()`.
- **EVITE** o uso excessivo de `innerHTML` com dados vindos de usuários para prevenir ataques XSS (prefira `innerText` ou `textContent` para textos puros).
