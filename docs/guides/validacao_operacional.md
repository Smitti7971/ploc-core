# GUIA: Validação Operacional ✅

## Quando usar
- OBRIGATÓRIO ao final de cada tarefa de infraestrutura, deploy ou código.
- Nenhuma tarefa pode ser fechada no `current-task.md` sem passar por este guia.

## Protocolo de Testes (Checklist)

### 1. Disponibilidade (Luz Verde)
- [ ] O serviço responde com Status 200 OK?
- [ ] O domínio/URL configurado resolve para o IP correto?

### 2. Integridade de Dados
- [ ] Os arquivos esperados estão no local correto (ex: `index.html` no frontend)?
- [ ] A API responde o JSON esperado no endpoint `/api/health` ou similar?

### 3. Comunicação Cruzada (E2E)
- [ ] O Frontend consegue realizar chamadas para o Backend (CORS check)?
- [ ] O Backend consegue conectar ao Banco de Dados?

## Ferramentas recomendadas
- `curl` ou `Invoke-RestMethod` para checagem de endpoints.
- Browser DevTools para verificar erros de rede (404, 500, CORS).
- Logs do Coolify para verificar erros de runtime.

## Critério de Aceite
- **Status da Tarefa**: Só pode ser movida para `history` se todos os itens acima forem validados e os resultados registrados no `current-task.md`.
