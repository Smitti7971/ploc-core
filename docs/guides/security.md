# Guia de Segurança do Backend (PLOC) 🛡️

## Visão Geral
Este guia define os padrões de segurança para a API do PLOC, visando proteger os dados dos usuários e a integridade da infraestrutura.

## Checklist de Segurança Inicial
- [ ] **Desabilitar Portas Públicas**: Garantir que o PostgreSQL não esteja acessível via internet.
- [ ] **HTTP Headers (Helmet)**: Proteger contra ataques comuns de cabeçalho.
- [ ] **CORS**: Restringir acessos apenas aos domínios autorizados.
- [ ] **Rate Limiting**: Prevenir ataques de negação de serviço (DoS).
- [ ] **Sanitização de Dados**: Validar todas as entradas via Zod/Joi.
- [ ] **Variáveis de Ambiente**: Nunca expor segredos no código.

## Ferramentas Obrigatórias
1. **Helmet**: Proteção de cabeçalhos.
2. **CORS**: Controle de origens.
3. **Express Rate Limit**: Controle de tráfego.
4. **Dotenv**: Gestão de segredos.

## Procedimento de Implementação
1. Instalar dependências de segurança.
2. Configurar middlewares globais no `index.js`.
3. Validar bloqueio de origens não autorizadas.
4. Auditar logs de acesso.
