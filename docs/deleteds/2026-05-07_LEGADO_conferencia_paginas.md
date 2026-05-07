# GUIA: Conferência de Páginas (Visual Check) 👁️

## Quando usar
- Imediatamente após um deploy ser marcado como concluído no Coolify.
- Para validar se as alterações de UI ou estrutura de pastas refletiram no ar.
- Como primeiro "filtro" antes de realizar testes técnicos profundos.

## Checklist obrigatório
- [ ] Listar as URLs afetadas pela tarefa atual.
- [ ] Limpar o cache do navegador (ou usar aba anônima).
- [ ] Ter em mãos o que é o "resultado esperado" (ex: "Não deve mais mostrar o frontend no domínio da API").

## Execução padrão
1. Acessar as URLs oficiais:
   - **Frontend**: https://ploc.midializando.cloud/
   - **Backend**: http://backend.midializando.cloud/
2. Verificar visualmente se o conteúdo corresponde à pasta configurada (`/src/frontend` ou `/src/backend`).
3. Se o resultado for SATISFATÓRIO: Seguir para o [Guia de Validação Operacional](/docs/guides/validacao_operacional.md).
4. Se o resultado for INSATISFATÓRIO: Iniciar Plano de Correção.

## Erros comuns
- Confundir cache do navegador com erro de deploy.
- Testar a URL errada (inversão de domínios).
- Ignorar pequenos erros visuais que indicam caminhos de arquivos quebrados.

## Estratégias de fallback
- Caso a página esteja errada, verificar o **Base Directory** na API do Coolify.
- Checar se o último commit do GitHub foi realmente o que o Coolify usou.

## Restrições
- Proibido dar como "Concluído" se a página visual não refletir 100% da mudança.
