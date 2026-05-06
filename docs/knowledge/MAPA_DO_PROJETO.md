# Mapa do Projeto PLOC 🗺️

Este é o documento vivo que define o estado atual da infraestrutura. **Toda mudança de deploy ou arquitetura deve ser refletida aqui.**

## 🔗 Repositório e Infra
- **Repositório:** `Smitti7971/ploc-core`
- **VPS IP:** `72.61.63.84`
- **Plataforma de Deploy:** Coolify
- **Aplicação Ativa:** `ploc-backend-v3` (UUID: `leaocf7ke5lgluo0bg2dco0w`)

## 🏗️ Arquitetura Atual
- **Backend:** Node.js + Express (Porta 3000) em `/src/backend`. (API Pura).
- **Frontend:** HTML/JS independente em `/src/frontend`. (Desacoplado).
- **Banco de Dados:** PostgreSQL (Configurado no Coolify, conexão pendente de teste).

## ⚠️ Bloqueios e Dívidas Técnicas
1.  **Domínios Invertidos:** Backend e Frontend com URLs trocadas no Coolify.
2.  **ORM:** Decidir entre Prisma ou outro método para gerenciar o PostgreSQL.

## 📅 Histórico Recente
- **2026-05-06:** Implementação do novo padrão de execução e guias de tarefa.
- **2026-05-06:** Reorganização das pastas `docs/history`, `docs/deleteds` e `docs/standards`.
