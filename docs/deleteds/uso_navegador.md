# GUIA: Uso de Navegador (Browser Subagent) 🌐

## Quando usar
- Para auditoria de configurações em painéis visuais (ex: Coolify, Cloudflare).
- Para conferência visual de páginas quando o usuário solicitar ou em tarefas complexas de UI.
- Para extração de informações de documentações web que não possuem API.

## 🛑 REGRA DE OURO (PERMISSÃO)
**O Agente NUNCA deve iniciar uma navegação autônoma em ferramentas de configuração (Coolify/VPS) sem antes descrever o objetivo da navegação e pedir a permissão do Smitti/Usuário.** 
Se a informação puder ser obtida mais rapidamente pelo Usuário, o Agente deve PREFERIR perguntar em vez de navegar.

## Checklist obrigatório
- [ ] O objetivo da navegação está claro?
- [ ] O usuário autorizou o acesso ao painel específico?
- [ ] Existe uma alternativa via API ou terminal? (Preferir API se disponível).

## Execução padrão
1. Descrever o que se pretende buscar ou validar no navegador.
2. Solicitar autorização: "Posso usar o navegador para verificar [X] ou você prefere conferir e me passar os dados?".
3. Se autorizado: Executar com o menor número de passos possível.
4. Reportar: Descrever exatamente o que foi visto na tela (baseado em screenshots).

## Erros comuns
- Tentar adivinhar botões ou fluxos complexos sem permissão.
- Confiar cegamente no subagent sem validar o screenshot final.
- Navegar em áreas sensíveis (senhas/chaves) sem necessidade.

## Estratégias de fallback
- Se o subagent falhar em navegar, pedir para o usuário enviar um print da tela ou copiar o texto.
