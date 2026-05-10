# 💡 Cofre de Ideias e Funcionalidades Futuras - PLOC

Este documento serve como repositório para a visão criativa do PLOC, garantindo que ideias inovadoras sejam registradas enquanto focamos na estabilidade do core engine.

---

## 🎨 Identidade e Mascote "Vivo"
- **O Mascote "O"**: A letra "O" do logotipo PLOC é o mascote.
    - **Estados Visuais**: 
        - *Dormindo*: Respiração lenta, minimalista.
        - *Ocupado*: De costas, digitando ou organizando arquivos (indica processamento).
        - *Ouvindo*: De frente, focado no usuário (modo escuta ativo).
- **Abertura "Fumaça"**: Intro onde as letras P-L-C somem como fumaça, restando apenas o "O".
- **Psicologia Reversa**: Frase "NÃO ME ACORDE" piscando para incentivar o clique (Wake up trigger).
- **Customização (Skins)**: Venda de temas e sprites (ex: peruca para voz feminina, temas sazonais como Natal e Dia das Mães).

---

## 🤖 Interatividade e IA Conversacional
- **Modo "Sócio da Vida"**: Interface baseada em chat estilo ChatGPT/Grok.
- **UI Contextual**: Botões de (Sim/Não) e opções que aparecem apenas sob demanda do Ploc, evitando poluição visual.
- **Interação por Voz**: Prioridade para comandos de voz com resposta em áudio e texto (Balões de fala quando o som estiver desligado).
- **Avatar Miniatura**: Ploc assume uma forma miniatura no canto da tela durante o tutorial ou conversas longas.
- **Personalidade Adaptativa (Machine Learning)**: 
    - O humor do Ploc muda com base na performance do usuário.
    - *Modo "Orgulhoso"*: Recompensas e elogios para alta produtividade.
    - *Modo "Brabo/Desistente"*: Psicologia reversa e cobranças duras para baixa performance (ex: "Desliguei os lembretes porque você não se importa").
    - *Mudança Dinâmica de Persona (Contextual Persona Shift)*:
        - O Ploc hackeia o próprio prompt de sistema (AIOrchestrator) para se adaptar à "Rotina Ativa" do momento do usuário.
        - *Treino*: Ativa o modo Coach (frases de maromba, cobrança dura, foco em suor).
        - *Meditação*: Ativa o modo Zen (frases curtas, calmas, foco em respiração).
        - O sistema injeta um bloco `[MODE OVERRIDE]` no final do Super Prompt base, alterando a diretriz de tom instantaneamente.
    - *Estados Emocionais (Tamagotchi Style)*: O Ploc pode ficar "triste" ou "doente" se o usuário falhar em suas rotinas.
    - *Metamorfose Física*: A aparência do corpo do Ploc muda com base nos hábitos (ex: fica forte se o usuário treina, gordo/magro com base na alimentação).
    - *Animações de Preparação Contextual*: Ploc demonstra estar "se arrumando" (arrumando mala, penteando cabelo) quando detecta compromissos iminentes na agenda.
    - *Mecânica de Culpa*: Diálogos personalizados onde o Ploc expressa que sua única missão é cuidar do usuário e que se sente inútil quando o usuário não cumpre as tarefas.
    - *Reatividade a Toques Físicos (Síndrome do "Não Cutuque o Urso")*:
        - Se o usuário ficar clicando/tocando no Ploc repetidamente, ele se irrita.
        - Toca áudios cacheáveis agressivos de imediato: *"Ei, tira o dedo de mim!", "Não sou brinquedo!", "Quer brigar?"* (Pool de ~50 frases aleatórias).
        - A irritação contamina o próximo Prompt da LLM. Se perguntado após ser cutucado, ele responde com tédio ou raiva: *"Mano, me deixa em paz, eu ainda tô sendo compilado. O que você quer?"*
    - *Análise Biométrica e Sentimental de Voz*:
        - O Ploc reconhece a "assinatura de voz" do dono da conta.
        - *Modo Privacidade*: Se detectar vozes de terceiros ou se a voz não for reconhecida, o Ploc entra em modo silencioso e exibe "Desligado para privacidade".
        - *Escuta Empática*: O sistema analisa tom, ritmo e volume para detectar o humor (triste, feliz, cansado) e adapta o diálogo (ex: "Notei sua voz diferente, quer conversar?").
    - **Desafios de Validação**: Exigir uma prova visual (vídeo/foto) para reativar funcionalidades (ex: vídeo bebendo água ou foto na academia).
- **Arsenal de Saudações Contextuais (Latência Zero)**: 
    - Biblioteca de centenas de áudios curtos (fillers e saudações) categorizados por contexto.
    - **Categorização Comportamental**: O sistema detecta padrões do usuário (ex: esquecimento de chaves, atrasos frequentes, alta produtividade) e faz o download em segundo plano (background fetch) de uma "bateria" de áudios específicos para aquele tema.
    - **Personalidade Reativa**: O Ploc acorda com frases específicas sobre os problemas ou vitórias atuais do usuário (ex: "Pegou a chave hoje?" ou "Ontem você foi fera, vamos manter o ritmo?").
    - **Smart Buffer**: Pré-carregamento dinâmico de lotes de saudações para garantir resposta instantânea sem sobrecarregar o carregamento inicial do app.

---

## 🛠️ Infraestrutura e Manutenção
- **Mecanismo de Cache Automático (Cache Busting)**: Implementar versões dinâmicas nos assets (ex: `style.css?v=1.2`) para garantir que os usuários sempre vejam a versão mais recente sem precisar de refresh manual.


---

## 🚀 Funcionalidades Premium (High-End)
- **Modo Flutuante (Picture-in-Picture)**: Janela flutuante do Ploc que fica sobre outros apps (Desktop) para assistência contínua.
- **Inteligência Preditiva de Trânsito**: 
    - Integração com Agenda + Google Maps.
    - Cálculo proativo de tempo de deslocamento.
    - Pop-up com animação de veículo e resumo da reunião futura.
- **Notificações Ativas**: Uso de Web Push para "cobrar" rotinas e lembretes mesmo com o app fechado.

---

## 💰 Modelo de Negócio
- **Subsídio por Estética**: O uso básico do sistema pode ser mais barato ou gratuito, sustentado pela venda de Skins e Personalidades para o Ploc.

---

## 🌐 Conectividade e Social (A Ideia Matadora)
- **Sistema de Presentes (Gifts) Simplificado**: Envio de mimos sem necessidade de conexão complexa em tempo real.
    - **Mecânica de "Código de DNA de Skin"**: 
        - Ao enviar um presente, o sistema gera um código identificador da Skin e roupas do remetente.
        - O destinatário recebe o código, o sistema baixa/carrega os assets necessários e renderiza uma animação local.
    - **Efeito Teleporte Efêmero**: O Ploc do remetente aparece como uma "gravação/gesto" na tela do destinatário, permanece por alguns segundos entregando o presente e depois "se teleporta" de volta (some).
    - **Incentivo de Skins**: A exibição efêmera motiva o colecionismo e a ostentação de raridades.
    - **Skins de Identidade e Fanatismo**: 
        - Skins exclusivas para figuras públicas (ex: jogadores de futebol famosos).
        - Roupas de fanatismo religioso, político ou esportivo.
        - *Restrição Ética*: Proibido criar skins de pessoas que fizeram mal ao mundo.

---

## 🛒 Marketplace de Rotinas (O "Netflix" dos Hábitos)
- **Rotinas Assinadas**: Marketplace onde profissionais validados (Treinadores, Médicos, Professores, Mentores) vendem suas rotinas personalizadas.
- **Conteúdo Híbrido (Vídeo + Execução)**: 
    - Cada tarefa gerada pela rotina pode vir acompanhada de um vídeo curto do especialista explicando a execução ou motivando o usuário.
    - Exemplo: Uma tarefa de "Agachamento" abre um mini-player com o vídeo do treinador executando a técnica correta.
- **Encaixe Inteligente**: A rotina comprada é automaticamente "fatiada" e encaixada nos horários livres do usuário, respeitando sua agenda atual e preferências de dias.
- **Monetização para Criadores**: Especialistas podem criar, hospedar e vender suas "receitas de vida" e metodologias de produtividade dentro da plataforma PLOC.

---

## 🕵️ Modo "Tocaia" e Monitoramento
- **Assistente de Saudade / Monitor**: O Ploc pode ficar de "vigia" a pedido do usuário.
- **Integração WhatsApp**: Monitorar quando um contato específico fica online para avisar o momento exato de puxar conversa (ex: "Ela ficou online agora, a hora é essa!").
- **Multitarefa Interno**: O Ploc atua como um assistente que fica "na espreita" realizando múltiplas verificações enquanto o usuário faz outras coisas.

---

*Documento em constante evolução. Registre aqui antes de codar.*
