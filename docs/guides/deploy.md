# GUIA: Deploy (Produção e Staging) 🚀

## Quando usar
- Sempre que houver código novo no repositório.
- Após alterações críticas de infraestrutura.

## 🛑 REGRA DE OURO (MANDATÓRIO)
**Antes de disparar qualquer deploy (via API ou terminal), você DEVE perguntar ao Smitti/Usuário se ele prefere que o deploy seja feito de forma MANUAL pelo painel do Coolify ou se pode seguir via automação.**

## Checklist obrigatório
- [ ] O código local foi enviado para o GitHub (`git push`)?
- [ ] As variáveis de ambiente foram sincronizadas?
- [ ] O Smitti autorizou o deploy automático?

## Execução padrão
1. Validar se a branch está correta.
2. Consultar o usuário sobre o modo de deploy (Manual vs Automático).
3. Se Automático: Disparar via API conforme o [Guia de Sincronização Coolify](/docs/guides/coolify_sync.md).
4. Se Manual: Aguardar o "OK" do usuário após ele disparar pelo painel.

## Verificação Final ✅
1. Seguir o [Guia de Validação Operacional](/docs/guides/validacao_operacional.md).

## Erros comuns
- Disparar deploy sem o push do Git ter concluído.
- Ignorar o gate de confirmação do usuário.
