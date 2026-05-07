# GUIA MESTRE: Desenvolvimento Visual (Frontend & DOM) 🎨🌳

## A Lógica da Árvore (DOM)
O que você vê na tela do Ploc não é uma imagem estática, é um organismo vivo chamado **DOM**. Imagine que o site é uma árvore:

1.  **O Tronco (HTML)**: Define onde cada coisa fica (Aqui é o Menu, aqui é o Kanban).
2.  **A Decoração (CSS)**: Define as cores, o arredondamento dos cards e as animações que dão o aspecto "Premium".
3.  **O Movimento (JavaScript)**: É quem faz a mágica. Se você arrasta um card, o JS é quem "tira ele de um galho e coloca em outro" sem precisar derrubar a árvore toda (recarregar a página).

---

## 🛠️ Como eu (Agente) manipulo isso?

Eu uso uma técnica chamada **Criação de Peças (LEGO)**. Em vez de escrever o site inteiro de uma vez, eu crio funções que montam peças pequenas.

### O Padrão de Construção:
- **Identificar o Alvo**: Primeiro eu encontro onde a peça deve ir (usando um ID como `#kanbanBoard`).
- **Criar a Peça**: Eu monto o elemento (ex: um novo Card) com as classes de estilo corretas.
- **Injetar**: Eu coloco a peça na árvore. Se for para o futuro, uso `append` (final). Se for para o passado, uso `prepend` (início).

---

## ⚠️ O que pode dar errado?

1.  **Conflito de Nomes**: Se eu chamar duas coisas de "Botão Azul", o estilo de uma pode estragar a outra.
    *   *Proteção*: Usamos nomes específicos (ex: `.ploc-card-task`).
2.  **Lentidão**: Se eu tentar balançar 1000 folhas ao mesmo tempo, o site trava.
    *   *Proteção*: Fazemos as mudanças "nos bastidores" e injetamos tudo de uma vez só.
3.  **Invisibilidade**: Às vezes a peça é criada, mas fica "atrás" de outra.
    *   *Proteção*: Gerenciamos as camadas (Z-Index) com cuidado.

---

## Checklist para o Arquiteto (Smitti)
- [ ] O visual está conforme o planejado no Rascunho (Draft)?
- [ ] O site funciona bem no celular (Mobile-First)?
- [ ] As animações estão suaves ou estão "engasgando"?

---

## 💡 Lições de Batalha (Evolução Contínua)
*Espaço reservado para anotar práticas eficazes e erros evitados durante as execuções.*

- **[2026-05-07]**: Ao migrar estilos de um HTML para um arquivo `.css` externo, realize a transição de forma incremental. Nunca remova o bloco `<style>` antes de garantir que o arquivo externo foi carregado com sucesso.
- **[2026-05-07]**: A limpeza de arquivos redundantes (23 para 6) melhora drasticamente a clareza da execução e evita conflitos de estilo.
