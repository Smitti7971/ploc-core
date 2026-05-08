# GUIA MESTRE: Deploy Simplificado (Coolify) ☁️🚀

Este é o fluxo obrigatório e simplificado para atualizações do Ploc. Nenhuma etapa deve ser pulada.

## 🛠️ O Fluxo de 4 Passos

### 1. UPLOAD PARA O GIT (O Registro)
Antes de qualquer ação na nuvem, o código local deve ser enviado para o repositório oficial.
- **Ação do Agente**: Executar `git add .`, `git commit` e `git push`.
- **Objetivo**: Garantir que o Coolify puxe a versão mais recente.

### 2. INÍCIO DO DEPLOY (O Gatilho)
O Agente dispara o comando para o Coolify iniciar a reconstrução do container.
- **Ação do Agente**: Executar o comando `curl` via API na porta 8000 usando o UUID correto.
- **UUIDs de Referência**: 
  - Backend: `leaocf7ke5lgluo0bg2dco0w`
  - Frontend: `a6n3eh22owgp057dd09t023a`

### 3. CONFIRMAÇÃO MANUAL (O Olho do Dono)
**PAUSA OBRIGATÓRIA.** O Agente não deve prosseguir automaticamente.
- **Ação**: O Agente deve notificar o Smitti que o deploy foi disparado e **aguardar um "OK" ou confirmação manual** do usuário sobre o estado do deploy (via painel ou percepção).

### 4. CHECAGEM (A Validação Final)
Após a confirmação, o Agente realiza o teste de saúde.
- **Ação**: Validar os endpoints de saúde e logs para garantir que não há erros silenciosos.
- **Endpoints**:
  - `https://backend.midializando.cloud/health`
  - `https://ploc.midializando.cloud/`

---

## 💡 Lições de Batalha (Não Esquecer!)
- **PRISMA**: Sempre garantir que o `binaryTargets` no `schema.prisma` inclua `debian-openssl-3.0.x` para evitar crash em produção.
- **PORTAS**: Backend (3000) | Frontend (80).
- **SEGURANÇA**: Senhas apenas no `.env`. Nunca no Mapa do Projeto ou no código.
