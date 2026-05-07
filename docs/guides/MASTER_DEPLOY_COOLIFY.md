# GUIA MESTRE: Deploy e Nuvem (Coolify) ☁️🚀

## A Lógica das Engrenagens
Imagine que o Ploc é uma planta que vive em uma estufa na nuvem (o Servidor VPS). Para atualizar essa planta, seguimos este caminho:

1.  **O Repositório (GitHub)**: É o nosso "cartório". Toda mudança de código oficial deve ser registrada lá (via `git push`).
2.  **O Gerente (Coolify)**: É um painel que vigia o GitHub. Quando ele vê uma mudança, ele automaticamente reconstrói o seu aplicativo.
3.  **O Ambiente (Nixpacks/Static)**:
    *   **Backend**: Usa o motor **Nixpacks** (Node.js) para rodar o cérebro do Ploc.
    *   **Frontend**: Usa o motor **Static** (Nginx) para entregar as páginas visuais.

---

## 🛠️ Como eu (Agente) controlo isso?

Eu uso um "Controle Remoto" chamado **API do Coolify**. Isso me permite pedir para o servidor reiniciar ou mudar de pasta sem que você precise abrir o painel preto do Coolify.

### Comandos de Controle (Bastidores):
- **Disparar Deploy**: `curl -X GET ".../deploy?uuid=..."` (Força o servidor a ler o código novo).
- **Verificar Saúde**: `curl -s ".../applications"` (Me diz se o servidor está vivo ou se deu erro).

---

## ⚠️ O que pode dar errado? (E como nos protegemos)

1.  **Caminho Errado (Base Directory)**: Se eu disser para o Coolify olhar a pasta `/src`, mas o código estiver em `/src/backend`, ele vai ficar perdido.
    *   *Proteção*: Sempre conferimos o `MAPA_DO_PROJETO.md` antes de qualquer deploy.
2.  **Portas Fechadas**: Se o motor do carro (Node) estiver na porta 3000, mas o gerente (Coolify) estiver procurando na porta 3001, o site não abre.
    *   *Proteção*: Padronizamos o Ploc para usar sempre a **Porta 3000**.
3.  **Segredos Vazados**: Nunca salvamos senhas no código. Usamos o cofre `.env`.

---

## Checklist para o Arquiteto (Smitti)
- [ ] O código já está no GitHub? (Eu farei o `git push`).
- [ ] O UUID do aplicativo está correto no Mapa?
- [ ] O servidor tem acesso ao banco de dados? (Checamos no `ESTADO_DAS_APIS.md`).

---

## 💡 Lições de Batalha (Evolução Contínua)
*Espaço reservado para anotar práticas eficazes e erros evitados durante as execuções.*

- **[2026-05-07]**: O uso da API do Coolify via PowerShell automatiza o deploy e reduz erros manuais.
