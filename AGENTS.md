# Agent Instructions

## Idioma e Estilo (Brasil)
- **Idioma:** Toda a documentação, planos de implementação e comentários devem ser escritos em **Português do Brasil (PT-BR)**.
- **Estilo de Planos:** 
    - Títulos de Tarefas devem usar `###`.
    - Subtítulos de Passos devem ser listas indentadas com blockquotes (ex: `    - **Passo N:** > Descrição`).

## Aprovação do Usuário e Permissões
- **Permissão Obrigatória:** SEMPRE peça permissão explícita antes de executar QUALQUER comando de terminal, rodar scripts ou modificar arquivos. 
- **Fronteira de Produtividade:** Não realize tarefas "proativas" que não foram solicitadas. Foque em ser um assistente, não um agente autônomo.

## Governança Arquitetural
- **Revisão Obrigatória:** Toda criação, modificação ou exclusão de arquivo DEVE ser precedida por uma revisão da skill `@senior-architect`.

## Protocolo de Execução Pesada (Roadmap & Follow-up)
- **Roadmap Fiel:** Para tarefas complexas ou deploys, crie um documento em `docs/plans/YYYY-MM-DD-assunto-PLOC.md`.
- **Execução Passo a Passo:** Execute uma única tarefa por vez.
- **Follow-up Permanente e Visual:** 
    - **AÇÃO OBRIGATÓRIA:** Antes de cada tarefa, leia o Roadmap atual. Após cada tarefa, atualize-o imediatamente.
    - **INTEGRIDADE DO LOG:** NUNCA apague tentativas anteriores. Se uma tentativa falhar, ela fica lá para sempre como aprendizado.
    - **REGRA TÉCNICA DE EDIÇÃO:** Ao usar ferramentas de edição em Roadmaps, foque apenas na linha do status (`⏳` ou `🔄`) para não sobrescrever acidentalmente o histórico superior.
    - **Semântica de Emojis:**
        - ✅ : SUCESSO FINAL (Tarefa concluída com objetivo atingido).
        - ⚠️ : SUCESSO PARCIAL (Passo técnico ok, mas objetivo final da tarefa ainda não atingido).
        - ❌ : FALHA (Erro técnico ou bloqueio).
        - ⏳ : EM AGUARDO/PLANEJADO.
        - 🔄 : EM EXECUÇÃO/INVESTIGAÇÃO.

## Estabilidade e Prevenção de Loops (Anti-Logic Traps)
- **Detecção de Ação Duplicada:** Se uma chamada de ferramenta com os mesmos argumentos falhar duas vezes, PARE e peça intervenção humana.
- **Critério de "Concluído" Explícito:** Toda tarefa deve ter um estado de sucesso claro. Pare imediatamente ao atingi-lo.
- **Escada de Fallback:** 
    1. Tentar correção lógica.
    2. Tentar ferramenta/método alternativo.
    3. Abortar e reportar se ambos falharem.

## Web Search & Scraping Rules
- **REGRA CRÍTICA:** NÃO use ferramentas baseadas em navegador (Chrome/Scrapping) para buscas ou leitura de conteúdo, A MENOS QUE EXPLICITAMENTE solicitado pelo usuário.
- Prefira sempre `search_web` ou `read_url_content` (baseado em markdown).

## VPS & Infraestrutura
- **IP:** `72.61.63.84`
- **User:** `root`
- **Credenciais:** SEMPRE carregue do arquivo `.env`. NUNCA escreva senhas ou segredos no código.
- **Estratégia SSH:** Siga a [Estratégia de Fallback SSH](file:///C:/Users/smitt/OneDrive/Área de Trabalho\AntiGravity/ploc/knowledge/ssh_fallback_strategy.md).

## Convenções de Código
- **Padrões Funcionais:** Use padrões de programação funcional para lógica complexa.
- **Componentização:** Mantenha componentes e funções pequenos, atômicos e reutilizáveis.
- **Documentação Primeiro:** Atualize o `AGENTS.md` ou Knowledge Items (KIs) imediatamente quando novas ferramentas, padrões ou insights críticos do projeto forem estabelecidos.
