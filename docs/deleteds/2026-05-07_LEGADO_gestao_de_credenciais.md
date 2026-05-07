# GUIA: Gestão de Credenciais e Segredos 🔐

## Quando usar
- Ao configurar novos serviços (APIs, Banco de Dados).
- Ao realizar deploys.
- Sempre que uma senha ou token precisar ser atualizado.

## Checklist obrigatório
- [ ] O segredo está no arquivo `.env`?
- [ ] O segredo está sendo exposto em algum log ou console?
- [ ] Se o segredo for para o Frontend, ele está sendo injetado via variável de ambiente no build (e não escrito no código)?
- [ ] O `.env` está no `.gitignore`?

## Mapa de Dependências (Onde os segredos são usados)

### 1. Infraestrutura (Coolify & VPS)
- **COOLIFY_TOKEN**: Usado nos scripts de deploy via API para autenticação no painel do Coolify.
- **COOLIFY_FRONTEND_UUID**: Identificador único do app frontend no Coolify.
- **COOLIFY_BACKEND_UUID**: Identificador único da API no Coolify.
- **VPS_IP**: Endereço do servidor para acesso SSH e chamadas de API do Coolify.

### 2. Persistência (Banco de Dados)
- **DATABASE_URL**: String completa de conexão usada pelo Prisma ORM no backend.
- **DB_PASS**: Senha do PostgreSQL (contida na DATABASE_URL).

### 3. Integração (GitHub)
- **GITHUB_TOKEN**: Usado para sincronização do repositório e ações automatizadas (se houver).

## Execução padrão para o Agente
1. **Verificação**: Antes de qualquer ação que exija auth, leia o `.env`.
2. **Confirmação**: Se uma variável estiver vazia ou parecer inválida, peça ao USER para validar o `.env` (nunca tente "adivinhar" uma senha).
3. **Proteção**: Se precisar criar um novo segredo, gere-o de forma segura e adicione ao `.env` imediatamente.

## Erros comuns
- **Hardcoding**: Escrever o IP ou Token direto no código JavaScript do frontend. (Sempre use variáveis ou chame via backend).
- **Mismatch de UUID**: Tentar fazer deploy usando o UUID do backend no app de frontend.

## Estratégias de fallback
- Se o `COOLIFY_TOKEN` falhar (401 Unauthorized), verifique se ele não expirou no painel do Coolify.

## Restrições
- **PROIBIDO** comitar arquivos `.env`.
- **PROIBIDO** escrever valores de senhas em arquivos de documentação (`.md`). Escreva apenas o nome da chave.
