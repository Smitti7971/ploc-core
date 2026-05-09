# Tarefa: Estabilização de Identidade & Deploy Total (PLOC SPA) 🚀

## 📝 Descrição
Implementar a Cápsula Camaleão, Carrossel Infinito e a nova SettingsPage, garantindo a estabilidade do roteador e realizando o deploy sincronizado (Front + Back) na infraestrutura Coolify.

## 📅 Data: 2026-05-08

## 🕹️ Fases do Plano

### (1) Entender & Mapear 🧠
- [x] Analisar erros de roteamento e referências órfãs (`btnDash`). ✅
- [x] Identificar chaves de autenticação (`ploc_token`). ✅
- [x] Mapear UUIDs de deploy no Coolify. ✅

### (2) Preparar & Ajustar 🛠️
- [x] Unificar padrões do roteador para suportar funções e objetos. ✅
- [x] Corrigir `ReferenceError` na LandingPage. ✅
- [x] Sincronizar `localStorage` na LoginPage. ✅
- [x] Criar `SettingsPage.js` estruturada. ✅

### (3) Executar & Construir 🏗️
- [x] Implementar Looping Infinito no Carrossel de Rotinas. ✅
- [x] Implementar Cápsula Camaleão com botões invertidos (Sair/Config). ✅
- [x] Realizar `git push` de todas as alterações (Back + Front). ✅
- [x] Disparar deploy via API Coolify (Porta 8000). ✅

### (4) Resultado & Telemetria 📊
- [x] Aguardar conclusão do build (Backend com fix CORS). ✅
- [ ] Validar logs do Backend (`q6kk07d73iufqcel2zuctx7i`). ⏳
- [ ] Verificar desaparecimento do erro CORS no console. ⏳
- [x] Validar logs do Frontend (`f2tbgpa9qsi65exdixnqzlg4`). ✅

### (5) Validar & Evoluir ✅
- [ ] Teste de fumaça na Landing Page Online. ⏳
- [ ] Teste de navegação para Settings Online. ⏳
- [ ] Atualizar `MAPA_DO_PROJETO.md`. ⏳

---

## 🚀 Status da Execução
- **Estado Atual**: Aguardando Telemetria do Fix CORS (Fase 4).
- **Gatilhos de Deploy**: CORS Fix disparado às 21:55 (Hora Local).
