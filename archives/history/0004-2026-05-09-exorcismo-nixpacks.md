# CURRENT TASK: Exorcismo de Nixpacks (Limpeza Total de Referências) 🧹🚫

## 1. Entender (Intenção) 🧠
- **O quê**: Remover toda e qualquer menção ao "Nixpacks" do repositório (documentação, histórico, padrões).
- **Por quê**: Evitar "fantasmas" de configuração e garantir que a documentação reflita 100% o novo padrão Dockerfile.
- **Metáfora**: "Estamos apagando as pegadas de um inquilino antigo para que o novo dono não se confunda."

## 2. Preparar (Logística) 🎒
- **Arquivos-Alvo**:
    - `docs/knowledge/PILHA_TECNOLOGICA.md`
    - `docs/standards/BLUEPRINT_SAAS.md`
    - `docs/history/0003-2026-05-09-migracao-dockerfile-backend.md`
    - `docs/deleteds/*`
- **Risco**: Nenhum risco técnico (arquivos de documentação apenas).
- **Proteção**: Sincronização Git antes e depois.

## 3. O Que Executar (Ação) 🛠️
- [ ] Passo 1: Atualizar `PILHA_TECNOLOGICA.md` ✅/⚠️/❌
- [ ] Passo 2: Atualizar `BLUEPRINT_SAAS.md` ✅/⚠️/❌
- [ ] Passo 3: Limpeza de Histórico e Deletados ✅/⚠️/❌
- [ ] Passo 4: Varredura Final "Pente Fino" ✅/⚠️/❌

## 4. Resultado Esperado (Visão) 👁️
- `grep -r "nixpacks" .` deve retornar zero resultados.

## 5. Validar & Testar (Prova de Vida) ✅
- [ ] Executar busca case-insensitive por "nixpacks" e "nickpacks".
