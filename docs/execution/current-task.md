# CURRENT TASK: Teste de Deploy e Validação Operacional 🚀

## 1. Entender (Intenção) 🧠
- **O quê**: Sincronizar as mudanças da refatoração enterprise e disparar o deploy no Coolify.
- **Por quê**: Validar se a nova arquitetura modular (Routes/Controllers/Config) funciona no ambiente de produção e se a conexão com o banco via host interno está estável.
- **Metáfora**: "Estamos ligando a nova rede elétrica da fábrica e testando se as máquinas ligam sem curto-circuito".

## 2. Preparar (Logística) 🎒
- **Arquivos-Alvo**:
    - Todo o repositório (via git push).
- **Ambiente**:
    - Coolify Dashboard (ploc-backend-v3).
    - Variáveis: `DATABASE_URL`, `JWT_SECRET`, `COOLIFY_DEPLOY_UUID`.
- **Risco**:
    - Falha no build do Nixpacks devido à versão do Node ou Prisma.
    - Erro de conexão com banco de dados (Host Interno).
- **Proteção**:
    - O frontend atual continuará servindo o que está no cache até que o novo backend responda.

## 3. O Que Executar (Ação) 🛠️
- [ ] Passo 1: Sincronização Git (Commit & Push) ✅/⚠️/❌
- [ ] Passo 2: Disparo de Deploy no Coolify ✅/⚠️/❌
- [ ] Passo 3: Monitoramento de Logs e Sentinela (180s) ✅/⚠️/❌
- [ ] Passo 4: Validação de Saúde (Live Health Check) ✅/⚠️/❌

### Logs de Heartbeat 💓
- `Passo 1`: [Aguardando início]
- `Passo 2`: [Aguardando início]
- `Passo 3`: [Aguardando início]
- `Passo 4`: [Aguardando início]

## 4. Resultado Esperado (Visão) 👁️
- Backend respondendo em `https://backend.midializando.cloud/health`.
- Status do banco indicando "Connected" em `/api/db-status`.

## 5. Validar & Testar (Prova de Vida) ✅
- [ ] Acessar `https://backend.midializando.cloud/health`.
- [ ] Acessar `https://backend.midializando.cloud/api/db-status`.
- [ ] Verificar logs do container no Coolify após 3 minutos.
