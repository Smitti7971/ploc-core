# GUIA: Automação via API do Coolify 🤖🛰️

## Visão Geral
Este guia descreve como o Antigravity interage com o Coolify utilizando a API REST oficial para gerenciar deploys e recursos sem interface visual.

## 1. API REST do Coolify (Controle Total)
Para usar a API, é necessário uma chave de acesso (Bearer Token) e o endereço da sua instância.

**Base URL**: `http://72.61.63.84:8000/api/v1`

### Como gerar a API Key:
1. No Coolify, clique no seu perfil (canto inferior esquerdo).
2. Vá em **Keys & Tokens** > **API Keys**.
3. Clique em **Create New Token**.
4. Copie a chave (ex: `1|abcde...`).

### Como disparar um Deploy via API:
O Agente utilizará o seguinte comando no terminal (substituindo o Token e o UUID):

```powershell
$headers = @{ "Authorization" = "Bearer SEU_TOKEN" }
Invoke-RestMethod -Uri "http://72.61.63.84:8000/api/v1/deploy?uuid=UUID_DO_APP&force=true" -Method Get -Headers $headers
```

---

## 🛑 REGRA DE SEGURANÇA
- **PROIBIDO** salvar a API Key em arquivos `.js`, `.json` ou no Git.
- O Usuário deve fornecer o Token via chat quando necessário ou configurar como variável de ambiente local.

## Checklist para o Agente
- [ ] O Agente possui o Token da API?
- [ ] O UUID da aplicação foi identificado? (Fica na URL do Coolify ou via `GET /applications`).
- [ ] O Agente pediu permissão antes de disparar o comando?
