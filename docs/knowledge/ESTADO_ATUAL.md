# Estado Atual da Infraestrutura PLOC 🏛️

> **Última Atualização:** 2026-05-05 21:40
> **Contexto:** Estabilização de Repositório e Deploy Inicial.

## 🔗 Repositório
- **Nome:** `Smitti7971/ploc-core`
- **Estrutura:** 
  - `/src/backend`: Servidor Express (Node.js).
  - `/src/backend/public`: Pasta onde reside o Frontend temporário (`index.html`).
  - `/src/frontend`: (Pasta original, atualmente não usada pelo deploy, migrada para dentro do backend para prova de vida).

## 🚀 Coolify & Deploy
- **Aplicação Ativa:** `ploc-backend-v3` (UUID: `leaocf7ke5lgluo0bg2dco0w`).
- **Base Directory:** `/src/backend`.
- **Porta:** 3000.
- **Configuração Especial:** O servidor Express serve arquivos estáticos de `./public`.
- **URL Atual:** `http://leaocf7ke5lgluo0bg2dco0w.72.61.63.84.sslip.io`

## ⚠️ Problemas Pendentes (Para amanhã)
1. **Domínios Invertidos:** O usuário relatou que o subdomínio do Back está no Front e vice-versa.
2. **Banco de Dados:** Conexão com o PostgreSQL ainda não testada na aplicação.
3. **Isolamento:** Decidir se o Frontend voltará a ser uma aplicação separada ou se continuará sendo servido pelo Backend.

## 🛡️ Regras de Ouro (Revisão)
1. **Log Acumulativo:** Nunca apagar falhas do Roadmap.
2. **Emojis:** ✅ (Final), ⚠️ (Técnico), ❌ (Falha).
3. **Powershell:** Comandos sempre individuais (sem `&&`).
