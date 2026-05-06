# GUIA: Sincronização Coolify 🚀

## Quando usar
- Sempre que houver mudança na estrutura de pastas (`src/backend`, `src/frontend`).
- Após alteração de portas ou variáveis de ambiente no código.
- Quando o deploy falhar com erros de "File not found" ou "Healtcheck failed".

## Checklist obrigatório
- [ ] O **Base Directory** no Coolify aponta para a pasta correta (ex: `/src/backend`)?
- [ ] O **Install Command** e **Build Command** estão vazios (para Node puro) ou corretos?
- [ ] A **Porta** no Coolify (Ex: 3000) bate com a porta no `index.js`?
- [ ] O **FQDN** (Domínio) está configurado no serviço correto (API vs APP)?

## Execução padrão (MANDATÓRIO: Via API)
> [!IMPORTANT]
> A MENOS QUE haja um erro na API, toda alteração de configuração deve ser feita via terminal usando o `COOLIFY_TOKEN` do `.env`.

1. **Listar Recursos:**
   `curl -s -X GET "http://IP:8000/api/v1/applications" -H "Authorization: Bearer TOKEN"`
2. **Atualizar Configuração:**
   `curl -X PATCH "http://IP:8000/api/v1/applications/UUID" -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" -d '{"base_directory": "/src/backend"}'`
3. **Disparar Deploy:**
   `curl -X POST "http://IP:8000/api/v1/applications/UUID/deploy" -H "Authorization: Bearer TOKEN"`

## Erros comuns
- Tentar rodar deploy manual via Dashboard sem antes validar o Base Directory via API.
- Esquecer de passar o Header de Authorization.

## Estratégias de fallback
- Se o deploy falhar, olhar o log de "Container" para ver se o Node deu erro de inicialização.
- Verificar se o `Start Command` no Coolify está como `npm start`.

## Restrições
- Não alterar variáveis de produção diretamente no Coolify sem documentar no `MAPA_DO_PROJETO.md`.
