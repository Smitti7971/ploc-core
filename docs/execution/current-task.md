# CURRENT TASK: Implementação da Blindagem de Cache 2.0 🛡️⚡

## 1. Entender (Intenção) 🧠
- **O quê**: Corrigir a persistência de cache que impede o App de atualizar automaticamente.
- **Por quê**: Garantir que o usuário sempre veja a versão mais recente do Ploc sem precisar limpar o cache manual.
- **Metáfora**: "Estamos ensinando o navegador a sempre perguntar se há novidades antes de assumir que o que ele tem no bolso é o melhor."

## 2. Preparar (Logística) 🎒
- **Arquivos-Alvo**:
    - `Dockerfile` (Raiz)
    - `src/frontend/sw.js`
    - `docs/knowledge/MAPA_DO_PROJETO.md`
- **Risco**: Quebra momentânea do PWA se o SW não for baixado corretamente.
- **Proteção**: Backup das versões v0.0.3.

## 3. O Que Executar (Ação) 🛠️
- [ ] Passo 1: Atualizar Nginx no `Dockerfile` (Novas Regras de Cache) ✅/⚠️/❌
- [ ] Passo 2: Atualizar `sw.js` para v0.0.4 e mudar Estratégia de Fetch ✅/⚠️/❌
- [ ] Passo 3: Atualizar `MAPA_DO_PROJETO.md` (PWA v15) ✅/⚠️/❌
- [ ] Passo 4: Sincronização Git (Push) 🚀
- [ ] Passo 5: Validação (Check Headers via Browser/Curl) 🧪

## 4. Resultado Esperado (Visão) 👁️
- `sw.js` deve retornar `Cache-Control: no-cache`.
- App deve detectar nova versão no próximo refresh.

## 5. Validar & Testar (Prova de Vida) ✅
- [ ] `curl -I https://ploc.midializando.cloud/sw.js` -> Deve mostrar `max-age=0` ou `no-cache`.
