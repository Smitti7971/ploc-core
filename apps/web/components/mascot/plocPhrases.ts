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
      "Ah, o Corpo! Excelente estourar essa bolha. Mas lembre-se: passar 5 horas na academia todo dia atrofia sua 'Mente' e te rouba tempo precioso de 'Vida' social ou 'Liberdade' financeira. O shape dos sonhos não adianta de nada se a cabeça estiver vazia, né? Equilíbrio, tá?",
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
      "Estourou 'Mente'! Meditar, ler... ótimo. Mas se você ficar só lendo livros e meditando no topo da montanha sem agir de verdade, sua 'Liberdade' financeira zera e seu 'Corpo' atrofia. Monge sem boleto pago não dura um mês!",
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
      "Viu só? Essa bolha representa a Vida (amigos, lazer). Mas focar demais na Vida e em diversão sem limites faz você esquecer do 'Propósito' e da 'Liberdade' de construir algo real. Foco excessivo em diversão é só fuga. A regra é Equilíbrio, sacou?",
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
      "Liberdade! Dinheiro, autonomia... sensacional. Mas focar obcecadamente em acumular grana e economizar cada centavo destrói sua 'Vida' social e enche sua 'Mente' de paranoia. Do que adianta ser o mais rico do cemitério se não viveu?",
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
      "Propósito! Missão, sonhos, carreira... inspirador. Mas quem vive apenas para o trabalho e a missão acaba sacrificando a 'Vida' familiar e destruindo o 'Corpo' com estresse crônico. O cemitério está cheio de pessoas insubstituíveis que morreram de burnout!",
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

export const MASCOT_COLLISION_PHRASES = {
  annoyed: [
    "CARA, tô tentando me concentrar aqui! Que ataque de bolhas é esse?",
    "Ei! Assim você me tira do sério! Estoura essas coisas longe de mim!",
    "Socorro! Alguém me ajuda a tirar esse sabão todo da minha frente!",
    "Não dá pra manter a pose com essas bolhas batendo! Me dá um help!"
  ],
  negativeHit: [
    "Putz... essa bolha negativa tirou pontos do nosso status!",
    "Poxa, perdemos pontos de equilíbrio! Cuidado com hábitos ruins!",
    "Que droga, fomos atingidos! Nosso equilíbrio caiu um pouco!",
    "Cuidado! Essas bolhas negativas puxam a gente pro fundo do poço!"
  ],
  positiveSuccess: [
    "Nossa, adorei essa bolha!",
    "Hum, que energia boa!",
    "Essa me fez muito bem!",
    "Oba, ponto pra nós!"
  ],
  caboDeGuerra: [
    "Puts, focou muito em uma coisa e acabou tirando de outra! Foque em outras coisas para equilibrar!",
    "Ganhamos de um lado, mas perdemos do outro! Lembre-se de balancear os atributos!",
    "Foco excessivo desgasta outros pilares! Tente espalhar mais os seus pontos!",
    "Cuidado, focar apenas em um pilar faz outro decair. Tente focar em outras coisas!"
  ]
};

export const ONBOARDING_DIALOGUES = {
  intro: [
    "Veio aqui me dar desculpinhas né?",
    "Não quero nem te ouvir, eu sei que você não cuida nem de você, por que acha que vai cuidar de mim?",
    "CHEGA! Vamos fazer algo produtivo. Quero te conhecer de verdade antes de te dar conselhos. Vamos iniciar o nosso Diagnóstico de Vida (Fase 1)!",
    "Para começarmos, soltei 5 bolhas flutuando acima da minha cabeça, cada uma representando um pilar. Estoure o pilar que você considera de MAIOR IMPORTÂNCIA na sua vida hoje para dar início ao jogo!"
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
    "Você me chamou, estou aqui para ajudar, mas só se você quiser ajuda, me diga... você sabe onde está? sua realidade? Tem uma bolha amiga minha que disse, Só sabe pra onde vai, quem sabe onde está!",
    "Cutucando um ser gelatinoso virtual? Isso diz muito sobre sua rotina... Já pensou em direcionar esse foco para entender sua própria vida? Vamos fazer esse teste rápido de autoconhecimento!",
    "Oi! Sabia que cada clique seu é tempo que não volta? Se quer mesmo gastar tempo comigo, que tal fazer isso valer a pena com o nosso teste de equilíbrio?",
    "Estou aqui flutuando e observando... a maioria das pessoas corre sem direção. Você sabe onde está pisando hoje? Tenho uma proposta de diagnóstico pra você!"
  ],
  bullyingQuote: "Olha que interessante, muitas pessoas não se importam com detalhes, já vejo que você pensa fora da caixa... mas não gostei de ver você estourando meu nome, isso é bullying sabia?",
  ignoreQuotes: [
    "Olha as pessoas tem total controle do que elas podem fazer, assim como você, e por isso quero perguntar... faz sentido fazer coisas sem sentido? por exemplo... estourar bolhas sem conhecelas?",
    "Olha, o que estou te oferecendo não é algo simples eu sei, mas o complexo só é complexo até você entender, depois disso... tudo fica fácil, pare de estourar bolhas sem proposito..."
  ]
};
