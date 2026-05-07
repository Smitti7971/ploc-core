# GUIA: Gestão de Segredos e Credenciais 🔒

## Quando usar
- Sempre que for necessário configurar APIs, senhas de banco ou chaves de serviço.

## 🛑 REGRA DE OURO (A ÚNICA FONTE DA VERDADE)
**O único local permitido para armazenar, pesquisar ou incluir informações de segurança (Tokens, Senhas, URLs de Conexão) é o arquivo `.env` na raiz do projeto.** 
É expressamente proibido escrever segredos diretamente no código, em guias ou em logs.

## Práticas Obrigatórias
- **Leitura**: Antes de pedir uma credencial ao usuário, o Agente deve verificar se ela já existe no `.env`.
- **Escrita**: Novos segredos devem ser inseridos via `write_to_file` apenas no `.env`.
- **Coolify**: As variáveis do `.env` local devem ser replicadas manualmente ou via automação no painel do Coolify (Application -> Environment Variables).

## Checklist de Segurança
- [ ] O `.env` está no `.gitignore`? (Deve estar sempre).
- [ ] O arquivo contém apenas variáveis em formato `KEY=VALUE`?
- [ ] O Agente evitou "printar" o conteúdo total do `.env` no chat? (Ler apenas linhas específicas se necessário).

## O que fazer em caso de vazamento?
1. Revogar a chave imediatamente.
2. Gerar uma nova.
3. Atualizar o `.env` e o Coolify.
