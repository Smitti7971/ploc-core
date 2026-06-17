/**
 * @module plocPhrases
 * @description Banco de falas, frases e resmungos do Ploc para diferentes situações e sentimentos.
 */

export const PILLAR_EXPLANATIONS: Record<string, string> = {
  corpo: "O Corpo é o seu templo físico, sua energia e saúde. Sem ele, você não tem força nem pra estourar bolha! Cuide do seu sono, alimentação e treinos para manter isso alto.",
  mente: "A Mente é a sua saúde mental, foco e resiliência. Estourar bolhas erradas destrói a mente! Tire um tempo para respirar, descansar e organizar seus pensamentos.",
  vida: "A Vida representa suas conexões, lazer e relacionamentos. Ninguém vive só de obrigações! Reserve um tempo sagrado para seus amigos, família e o que te faz sorrir.",
  liberdade: "A Liberdade é a sua autonomia, controle financeiro e independência. Sem grana e sem tempo livre, você vira prisioneiro da rotina! Planeje-se para conquistar suas asas.",
  proposito: "O Propósito é o seu norte, sua missão de vida e legado. De que adianta equilibrar todos os outros pilares se você não sabe para onde está caminhando?"
};

export const PASSIVE_AGGRESSIVE_QUOTES: Record<string, { positive: string[], negative: string[] }> = {
  corpo: {
    positive: [
      "Ah, o Corpo! você deve ser forte ou quer ser, bom para começar... mas é um tanto pragmático focar só no físico, né?",
      "Cuidar do físico é muito bom! Mas quem foca obsessivamente em treinar e comer limpo muitas vezes esquece de viver, trabalhar ou descansar a cabeça. Se virar neurose, seu pilar 'Vida' vai pro ralo. Vigia!",
      "Que lindo, focando no físico! Mas lembre-se: um corpo sarado com uma mente esgotada e zero de liberdade financeira é só uma carcaça bonita flutuando no vazio. A regra de ouro é o equilíbrio!"
    ],
    negative: [
      "Viu só? Estourou essa de Corpo negativa (como sedentarismo ou fast-food). Comer tranqueira e ficar deitado é cômodo na hora, mas aí sua energia zera, sua 'Mente' fica lenta e você destrói seu pilar de 'Vida' saudável. Não se sabote!",
      "Eita, essa bolha ruim de Corpo vai puxar nossos status pra baixo! Alimentar maus hábitos físicos é o caminho mais curto para falhar em todos os outros pilares. Vamos equilibrar!",
      "Putz... escolheu estourar uma bolha de Corpo negativa. Cuidar de si dá trabalho, eu sei, mas a alternativa é a preguiça cobrando juros caríssimos do seu futuro. Foco!"
    ]
  },
  mente: {
    positive: [
      "Mente é o pilar que todos precisam dar atenção, ele traz inúmeros benefícios, ",
      "Silenciar o ruído mental é essencial. Mas cuidado para não se isolar do mundo real sob a desculpa de 'proteger sua saúde mental'. Focar demais na Mente e ignorar a 'Vida' (amigos/família) te deixa sozinho no silêncio.",
      "Mente afiada! Mas um cérebro genial preso em um corpo doente e sedentário, com zero diversão, é receita certa para o colapso. O segredo não é ser o mais inteligente, é ter harmonia!"
    ],
    negative: [
      "Putz, alimentou uma bolha de Mente negativa! Deixar a ansiedade, a distração ou o estresse dominar sabota seu 'Corpo' e drena sua energia para focar no seu 'Propósito'. Vamos reverter isso!",
      "Estourou uma de Mente negativa! Alimentar pensamentos tóxicos e distrações baratas é como tomar veneno esperando que o dia melhore. Limpe essa mente e busque o equilíbrio!",
      "Eita! Estresse ou distração estourados... Isso suga seu foco e destrói sua 'Mente'. Quando a cabeça não pensa direito, todos os outros pilares desmoronam juntos!"
    ]
  },
  vida: {
    positive: [
      "Vida! engloba uma série de momentos marcantes... conexões... lazer... e até vícios, realmente é muito bom para começar!",
      "Lazer é fantástico! Mas viver de férias perpétuas sem trabalhar seu 'Propósito' ou cuidar do seu 'Corpo' só acumula boletos. A vida vira um vazio hedonista se não tiver equilíbrio e responsabilidade.",
      "Amigos e diversão recarregam as energias! Mas se sua vida for só festa e você não cultivar sua 'Mente' ou sua 'Liberdade' financeira, você vai acabar quebrado e estressado. Curta com equilíbrio!"
    ],
    negative: [
      "Estourou essa de Vida negativa (como solidão ou excessos). Isolar-se do mundo ou abusar dos excessos sabota a 'Mente' e encurta o 'Corpo'. Ninguém vence na vida sendo uma ilha solitária ou se destruindo!",
      "Ugh! Essa bolha ruim de Vida vai puxar a gente pra baixo! Perder tempo com conexões rasas e hábitos vazios drena a sua alma e destrói seu equilíbrio. Acorda!",
      "Eita! Estourou uma de Vida negativa. Focar em isolamento ou em drama inútil consome o tempo precioso que você poderia usar para expandir sua 'Mente' ou sua 'Liberdade'!"
    ]
  },
  liberdade: {
    positive: [
      "Liberdade é algo meio complexo, aqui centraliza aspectos como finanças e tempo livre.. ou a falta disso também, boa pedida para começar!",
      "Quer ser livre e independente financeiramente? Lindo. Mas se para ter 'Liberdade' você trabalhar 18 horas por dia sem parar, seu 'Corpo' pifa e sua 'Vida' afetiva some. A busca pela liberdade virou a sua própria prisão?",
      "Dinheiro traz autonomia, sim. Mas acumular recursos sem um 'Propósito' real ou sem saúde no 'Corpo' é inútil. Não seja um prisioneiro do próprio cofre, equilibre sua liberdade!"
    ],
    negative: [
      "Eita! Estourou consumismo ou dívidas... Isso sabota brutalmente sua 'Liberdade'! Lembre-se: cada boleto de impulso que você assina é uma hora a mais que você vende do seu tempo, matando sua liberdade real!",
      "Putz! Estourou uma bolha de Liberdade negativa. A impulsividade financeira de hoje é a escravidão de amanhã. Controle suas contas para não virar refém da própria rotina!",
      "Ugh! Estourar essa bolha negativa drena nossa Liberdade financeira. Sem autonomia e com dívidas, você perde a paz na 'Mente' e a energia no 'Corpo' para trabalhar nos seus sonhos!"
    ]
  },
  proposito: {
    positive: [
      "Propósito é o pilar mais complexo, tão importante que sem ele todos os outros pilares acabam por desmoronar aos poucos, quero muito saber o que você pensa sobre isso!",
      "Ter um norte é essencial para caminhar. Mas se você ficar tão obcecado com seu 'Propósito' a ponto de ignorar o lazer da 'Vida' e a paz da sua 'Mente', você vai surtar antes de chegar lá. A jornada precisa de equilíbrio!",
      "Trabalhar com amor é lindo. Mas se você foca 100% no Propósito e zera o tempo com quem ama ('Vida') ou destrói seu 'Corpo' com insônia, sua grande missão virou sua ruína. Equilibre-se!"
    ],
    negative: [
      "Estourou apatia ou burnout... viver sem direção ou trabalhar até adoecer destrói seu 'Propósito' e sabota seu 'Corpo'. Sem rumo, qualquer vento forte te arrasta para o colapso físico e mental!",
      "Eita! Essa bolha de pilar de Propósito negativa drena nossa alma! Viver de forma automática sem saber por que acorda de manhã faz o seu dia a dia parecer cinza e vazio. Encontre seu equilíbrio!",
      "Putz! Estourou uma de Propósito negativa. Sem uma missão clara, você perde a motivação para treinar o 'Corpo', estudar a 'Mente' ou aproveitar a 'Vida'. Defina sua bússola!"
    ]
  }
};



export const ONBOARDING_DIALOGUES = {
  intro: [
    "Dias frios me deixam com frio, não esqueça de colocar uma blusa em mim, não quero ficar resfriado!",
    "Não quero nem te ouvir, eu sei que você não cuida nem de você, por que acha que vai cuidar de mim?",
    "CHEGA! Vamos fazer algo produtivo. Quero te conhecer de verdade antes de te dar conselhos. Vamos iniciar o nosso Diagnóstico de Vida (Fase 1)!",
    "OK, vamos começar esse teste, fiz 5 bolhas aparecerem na tela, cada uma representa um pilar da vida, escolha sabiamente qual é o seu foco hoje, daí, iniciaremos o teste!"
  ],
  phase1Corpo: [
    "Excelente! Definimos a prioridade. Agora, vamos analisar o pilar do CORPO. Soltei bolhas com hábitos do seu cotidiano.",
    "Estoure apenas as bolhas que representam coisas que você REALMENTE faz hoje na sua vida atual. Escolha com honestidade!"
  ],
  phase1Mente: [
    "Agora vamos para o pilar da MENTE. Pensamentos, sono e foco.",
    "O que ocupa sua mente no dia a dia? Estoure as bolhas correspondentes com paciência."
  ],
  phase1Vida: [
    "Entendido. E quanto ao pilar da VIDA? Lazer, conexões, relacionamentos.",
    "Escolha as bolhas que refletem sua vida social e tempo livre atualmente."
  ],
  phase1Liberdade: [
    "Chegamos no pilar da LIBERDADE. Finanças, tempo livre e autonomia.",
    "O que se aplica à sua vida financeira e de rotina hoje? Estoure com sinceridade."
  ],
  phase1Proposito: [
    "Por fim, o pilar do PROPÓSITO. Seus sonhos, missão e rotina automática.",
    "Quais desses hábitos de carreira ou propósito fazem parte da sua realidade atual?"
  ],
  phase2Intro: [
    "Impressionante! Terminamos a Fase 1. Agora eu conheço as engrenagens da sua rotina atual.",
    "Vamos dar início à Fase 2: O Desafio de Equilíbrio Supremo! ⚖️",
    "Agora, as bolhas sobem misturadas. Mas cuidado: cada hábito tem impacto cruzado! (ex: Fast-food te dá lazer, mas detona seu Corpo).",
    "Seu objetivo é equilibrar todos os 5 pilares no patamar saudável (nível 5). Eu estarei aqui te guiando e apontando o que precisamos focar!"
  ],
  incentives: [
    "As pessoas normalmente acham que sabem da vida, tenho uma proposta para te fazer, vamos conhecer a qual bolha você pertence?",
    "Estourando bolhas por aí sem rumo? Tenho um desafio pra você: que tal descobrir em qual bolha você realmente se encaixa?",
    "Olha só, um mestre estourador de sabão! Mas me diz, você saberia equilibrar seus pilares no mundo real? Vamos testar?",
    "Você acha que tem total controle da sua rotina atual, né? Te desafio a provar! Vamos ver se você aguenta o nosso Diagnóstico?"
  ],
  clickMascots: [
    "Aqui eu preciso fazer alguma piadinha sobre você me tocar, e a bolha verde vai subir... que massa isso né?",
    "Mania feia de cutucar os outros, isso me mostra muito de você! Olha essa bolha verde subindo, que legal né?",
    "Cliques Cliques e mais cliques... já que quer clicar em bolhas, clique nessa verde para vermos",
    "Aqui estava tão vazio, que bom que você chegou! posso te conhecer? "
  ],
  bullyingQuote: "Misericórdia! estourou meu nome, né? Fala sério, isso é bullying...! brincadeira! só por curiosidade, as pessoas não fazem isso, já gostei de você, você meio que pensa fora da caixa!",
  ignoreQuotes: [
    "Olha lá, estourou mais uma bolha, parece divertido, mas se eu fizer, pode ser considerado assassinato, pode deixar, não vou te julgar, o juiz que vai! ha ha ha ha",
    "Olha, o que estou te oferecendo não é algo simples eu sei, mas o complexo só é complexo até você entender, depois disso... tudo fica fácil, pare de estourar bolhas sem propósito..."
  ]
};
