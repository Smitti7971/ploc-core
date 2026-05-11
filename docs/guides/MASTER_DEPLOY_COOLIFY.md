# GUIA MESTRE: Deploy Simplificado (Coolify) ☁️🚀 ✅ (validado: 2026-05-11)

Este é o fluxo obrigatório para atualizações do Ploc em produção.

## 🛠️ O Fluxo de 4 Passos

### 1. SINCRONIA GIT (O Registro)
Antes de qualquer ação, o código deve estar na `main` do GitHub.
- **Ação**: `git add .`, `git commit -m "feat:..."`, `git push`.

### 2. DISPARO DO DEPLOY (Gatilho API)
Usar os UUIDs reais validados no Levantamento Coolify:
- **Backend API**: `leaocf7ke5lgluo0bg2dco0w`
- **Frontend SPA**: `a6n3eh22owgp057dd09t023a`
- **Comando**: `curl -X GET "https://coolify.midializando.cloud/api/v1/deploy?uuid=[UUID]&force=true"` (Requer API Key).


### 3. REGISTRO DE LOGS E VERSÕES  🛡️

- **Registro**: Atualizar o `CHANGELOG.md` com versão do PLOC e registro das atualizações realizadas, para essa versão.  


---

## 💡 Lições de Batalha
- **BinaryTargets**: O `schema.prisma` deve incluir `debian-openssl-3.0.x`.
- **Domínios**: Sempre usar `.cloud` (conforme verificado no Coolify).
- **Cache**: O deploy do frontend limpa o cache do servidor, mas o usuário pode precisar de Refresh forçado (F5).
