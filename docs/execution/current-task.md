# Tarefa: Resolução de Connection Refused e Padronização de Scripts

## 📝 Descrição
O sistema apresentava erros `net::ERR_CONNECTION_REFUSED` no localhost:3000 porque o backend não estava rodando e o script de desenvolvimento estava quebrado.

## 🛠️ Plano de Execução

### Fase 1: Diagnóstico e Auditoria ✅
- [x] Verificar status da porta 3000 (netstat).
- [x] Testar inicialização manual do backend (node index.js).
- [x] Identificar erro no script `dev:back` (script `dev` ausente no backend).

### Fase 2: Correção de Scripts ✅
- [x] Adicionar `"dev": "node index.js"` ao `apps/backend/package.json`.
- [x] Adicionar script unificado `"dev": "npm run dev:back"` à raiz.
- [x] Validar que o backend sobe e conecta ao banco.

### Fase 3: Governança e Documentação ✅
- [x] Atualizar `CHANGELOG.md` (v0.1.3).
- [x] Atualizar versões nos `package.json`.
- [x] Atualizar `MAPA_DO_PROJETO.md`.

### Fase 4: Sincronia Git (Protocolo de Deploy) 🔄
- [ ] `git add .`
- [ ] `git commit -m "fix: resolve connection refused and add unified dev scripts"`
- [ ] `git push`

## 📊 Telemetria (Saúde)
- Backend respondendo em `http://localhost:3000/api/health`: ✅
- Áudio acessível em `http://localhost:3000/audio/...`: ✅
- Frontend carregando via Backend: ✅
