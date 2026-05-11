# DRAFT-003: Refatoração Modular do Frontend (Passo a Passo)

## 🎯 Objetivo
Migrar o CSS inline dos componentes JavaScript para um arquivo externo (`app.css`), reduzindo o tamanho dos arquivos JS e facilitando a manutenção, sem quebrar a aplicação.

## 🏗️ Lógica e Engrenagens
1. **Nenhum corte grande**: As alterações serão feitas por componente, uma de cada vez.
2. **Validação Contínua**: Após cada componente refatorado, o servidor será verificado no navegador.
3. **Design System Incremental**: O `app.css` crescerá conforme os componentes forem migrados.

## 📋 Fases de Execução

### Fase 1: Fundação (Setup)
- [ ] Criar/Limpar `src/frontend/css/app.css`.
- [ ] Definir Tokens (Cores, Fontes, Glassmorphism).
- [ ] Linkar no `index.html`.

### Fase 2: O Piloto (LoginPage)
- [ ] Identificar estilos comuns na `LoginPage.js`.
- [ ] Mover para classes utilitárias no `app.css`.
- [ ] Substituir `Object.assign` por `container.className`.
- [ ] **Gatilho de Validação**: Testar login e visual.

### Fase 3: Expansão (Dashboard & Kanban)
- [ ] Refatorar `DashboardPage.js`.
- [ ] Refatorar `KanbanPage.js`.
- [ ] Validar estados de hover e interações.

### Fase 4: O Coração (LandingPage)
- [ ] Esta é a fase mais complexa devido ao GSAP.
- [ ] Mover apenas os estilos estruturais (Hero, Containers).
- [ ] Manter propriedades dinâmicas que o GSAP manipula.

## 🛡️ Regras de Segurança
- Se o visual quebrar, `git checkout <arquivo>` imediato.
- Proibido refatorar dois arquivos ao mesmo tempo.
