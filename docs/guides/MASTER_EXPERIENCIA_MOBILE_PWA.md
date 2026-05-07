# GUIA MESTRE: Experiência Mobile (PWA) 📱✨

## A Lógica da "Ponte para o Celular"
O Ploc é um site, mas ele quer se comportar como um aplicativo. Para isso, ele usa dois componentes invisíveis que servem como a "Identidade" e a "Memória" do app no bolso do usuário:

1.  **A Identidade (Manifest)**: É o arquivo `manifest.json`. Ele diz ao celular qual é o nome do app, quais são as cores da marca e, principalmente, qual foto (ícone) deve aparecer na tela inicial.
2.  **A Memória (Service Worker)**: É o arquivo `sw.js`. Ele é como um "Garçom" que guarda os pratos favoritos (fotos e estilos) na cozinha (cache) para não precisar buscar no restaurante (servidor) toda vez, tornando tudo instantâneo.

---

## 🖼️ O Rosto do Ploc (Ícones e Fotos)

Para que o celular aceite "instalar" o Ploc como um app de elite, precisamos seguir regras de fotografia:

*   **O Ícone**: Deve ser um quadrado perfeito. É o que o usuário vai clicar todo dia.
*   **As Vitrines (Screenshots)**: Quando o usuário clica em "Instalar", o Google/Apple mostra fotos do app. Para isso funcionar, as fotos devem ter o tamanho exato da tela do celular.

---

## 🔄 Como atualizar o Aplicativo?

Sempre que mudarmos algo visual e quisermos que os usuários recebam a novidade no celular:
1.  **Mudar a Versão**: Avisamos o "Garçom" (`sw.js`) que o cardápio mudou (ex: de v5 para v6).
2.  **Deploy**: Mandamos para a nuvem.
3.  **Atualização Automática**: Na próxima vez que o usuário abrir o Ploc, o celular vai sussurrar: *"Tem coisa nova!"* e atualizará sozinho.

---

## Checklist para o Arquiteto (Smitti)
- [ ] O ícone do Ploc está bonito na tela do meu celular?
- [ ] Quando eu abro o app, ele carrega rápido mesmo com internet lenta?
- [ ] O nome "Ploc" aparece corretamente embaixo do ícone?

---

## 💡 Lições de Batalha (Evolução Contínua)
*Espaço reservado para anotar práticas eficazes e erros evitados durante as execuções.*

- **[2026-05-07]**: Screenshot e ícones PWA exigem dimensões exatas em pixels para o Chrome validar o "Rich Install UI".
