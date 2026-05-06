# GUIA: Reorganização Estrutural 🏛️

## Quando usar
- Renomeação de pastas principais (src/backend, src/frontend).
- Mudança na hierarquia do projeto.
- Desacoplamento de componentes.

## Checklist obrigatório
- [ ] Verificar se há arquivos abertos no editor que serão afetados.
- [ ] Mapear todas as referências internas (imports, scripts no package.json).
- [ ] Confirmar se o deploy no Coolify permite a mudança de "Base Directory".
- [ ] Fazer commit do estado atual antes de iniciar.

## Execução padrão
1. Mapear referências.
2. Criar novas pastas.
3. Mover arquivos.
4. Atualizar referências de código.
5. Limpar pastas vazias ou obsoletas.
6. Testar localmente.

## Erros comuns
- Esquecer de atualizar o `main` no `package.json`.
- Quebrar caminhos de arquivos estáticos.
- Perder histórico do Git por não usar `git mv`.

## Estratégias de fallback
- `git checkout .` ou `git reset --hard` para reverter mudanças de arquivos.
- Desfazer renomeação de pastas manualmente caso o Git se perca.

## Restrições
- Proibido renomear sem atualizar referências no mesmo passo.
- Proibido deletar arquivos sem backup/commit prévio.
