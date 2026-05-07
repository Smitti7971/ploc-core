# GUIA MESTRE: Segurança e Credenciais 🔐🛡️

## A Lógica do Cofre
No Ploc, as informações sensíveis (senhas do banco, tokens de API, IPs de servidores) nunca devem "viver" dentro do código. Imagine o seguinte:

1.  **O Cofre (Arquivo `.env`)**: É onde as chaves reais estão guardadas. No Ploc, **este arquivo mora exclusivamente na RAIZ do projeto**. O código do Backend deve ser configurado para ler este cofre central, evitando cópias espalhadas pelas pastas.
2.  **O Crachá (Variáveis de Ambiente)**: O código apenas diz: *"Ei, Sistema, me dê o que estiver escrito na gaveta DATABASE_URL"*. Se alguém roubar o seu código, não levará o acesso ao banco, pois o cofre não foi junto.

---

## 🏗️ As Camadas de Proteção

Para manter o Ploc seguro como um SaaS Enterprise, usamos 4 camadas:

1.  **O Porteiro (CORS)**: Ele checa de onde vem a requisição. Se alguém tentar acessar seu banco de dados de um site pirata, o CORS barra na hora.
2.  **O Capacete (Helmet)**: Ele coloca proteções extras nas mensagens que o servidor envia, impedindo que hackers descubram qual tecnologia estamos usando.
3.  **O Limitador (Rate Limit)**: Se alguém tentar testar 1000 senhas por segundo, o Limitador tranca a porta para aquele usuário.
4.  **A Criptografia (Bcrypt)**: Mesmo se um hacker invadir o banco, ele não verá as senhas dos usuários, verá apenas um monte de letras e números aleatórios.

---

## 🚨 Regras de Ouro para o Agente e para o Arquiteto

- **A Fonte da Verdade**: Sempre pesquise no arquivo `.env` antes de pedir uma senha.
- **Proibido "Hardcoding"**: Nunca escreva um IP ou Token diretamente nos arquivos `.js` ou `.html`.
- **Cofres Sincronizados**: Quando mudarmos uma senha no seu PC (no `.env`), precisamos avisar o gerente da nuvem (Coolify) para ele atualizar o cofre de lá também.

---

## Checklist de Segurança
- [ ] O arquivo `.env` está na lista de "proibidos de subir" (`.gitignore`)?
- [ ] As senhas do banco estão complexas?
- [ ] O Porteiro (CORS) só deixa passar o nosso domínio oficial?

---

## 💡 Lições de Batalha (Evolução Contínua)
*Espaço reservado para anotar práticas eficazes e erros evitados durante as execuções.*

- **[2026-05-07]**: O arquivo `.env` deve ser a única fonte da verdade para segredos; nunca espalhar chaves em arquivos de configuração.
