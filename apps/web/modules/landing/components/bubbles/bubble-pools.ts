import { BubbleConcept } from './types';

// Pool de bolhas decorativas (modo 'decor') - exibe palavras reais em formato glassmorphic
export const DECOR_CONCEPTS: BubbleConcept[] = [
  {
    word: 'Postura',
    pillar: 'corpo',
    ref: 'postura',
    label: 'Postura',
    value: 'decor',
    points: 0,
    isGameActive: false,
    left: '10%',
    size: 55,
    duration: 19,
    delay: 0,
    theme: 'glass',
    maxOpacity: 0.65,
    zIndex: 12 // lvl2 - Atrás do letreiro, na frente do Atmosphere
  },
  {
    word: 'Foco',
    pillar: 'mente',
    ref: 'foco',
    label: 'Foco',
    value: 'decor',
    points: 0,
    isGameActive: false,
    left: '22%',
    size: 65,
    duration: 22,
    delay: 2,
    theme: 'glass',
    maxOpacity: 0.75,
    zIndex: 18 // lvl3 - À frente do letreiro, atrás do PLOC
  },
  {
    word: 'Lazer',
    pillar: 'vida',
    ref: 'lazer',
    label: 'Lazer',
    value: 'decor',
    points: 0,
    isGameActive: false,
    left: '35%',
    size: 45,
    duration: 17,
    delay: 4,
    theme: 'glass',
    maxOpacity: 0.55,
    zIndex: 5 // lvl1 - Atrás do Atmosphere
  },
  {
    word: 'Tempo',
    pillar: 'liberdade',
    ref: 'tempo',
    label: 'Tempo',
    value: 'decor',
    points: 0,
    isGameActive: false,
    left: '48%',
    size: 70,
    duration: 21,
    delay: 5,
    theme: 'glass',
    maxOpacity: 0.85,
    zIndex: 21 // lvl4 - À frente do letreiro, colide fisicamente com o PLOC!
  },
  {
    word: 'Sonhos',
    pillar: 'proposito',
    ref: 'sonhos',
    label: 'Sonhos',
    value: 'decor',
    points: 0,
    isGameActive: false,
    left: '62%',
    size: 55,
    duration: 20,
    delay: 8,
    theme: 'glass',
    maxOpacity: 0.60,
    zIndex: 12 // lvl2 - Atrás do letreiro, na frente do Atmosphere
  },
  {
    word: 'Sono',
    pillar: 'corpo',
    ref: 'sono',
    label: 'Sono',
    value: 'decor',
    points: 0,
    isGameActive: false,
    left: '78%',
    size: 48,
    duration: 23,
    delay: 9,
    theme: 'glass',
    maxOpacity: 0.55,
    zIndex: 5 // lvl1 - Atrás do Atmosphere
  },
  {
    word: 'Leitura',
    pillar: 'mente',
    ref: 'leitura',
    label: 'Leitura',
    value: 'decor',
    points: 0,
    isGameActive: false,
    left: '90%',
    size: 60,
    duration: 18,
    delay: 11,
    theme: 'glass',
    maxOpacity: 0.80,
    zIndex: 21 // lvl4 - À frente do letreiro, colide fisicamente com o PLOC!
  },
  {
    word: 'Saúde',
    pillar: 'corpo',
    ref: 'saude',
    label: 'Saúde',
    value: 'decor',
    points: 0,
    isGameActive: false,
    left: '55%',
    size: 80,
    duration: 16,
    delay: 3,
    theme: 'glass',
    maxOpacity: 0.95,
    zIndex: 25 // lvl5 - Passa à frente do PLOC e do restante sem colidir
  },
  {
    word: 'Rotina',
    pillar: 'proposito',
    ref: 'rotina',
    label: 'Rotina',
    value: 'decor',
    points: 0,
    isGameActive: false,
    left: '15%',
    size: 75,
    duration: 24,
    delay: 6,
    theme: 'glass',
    maxOpacity: 0.90,
    zIndex: 25 // lvl5 - Passa à frente do PLOC e do restante sem colidir
  }
];

/**
 * ── FASE 1: DIAGNÓSTICO DE CONHECIMENTO ──
 * Lista enxuta e organizada de hábitos por pilar para simplificar a edição de bolhas,
 * deixando mais dinâmico e randomizado sem requerer centenas de linhas de código.
 */
export const ONBOARDING_HABITS: Record<'corpo' | 'mente' | 'vida' | 'liberdade' | 'proposito', { word: string; value: 'positive' | 'negative' }[]> = {
  corpo: [
    { word: 'Academia', value: 'positive' },
    { word: 'Beber Água', value: 'positive' },
    { word: 'Alongamento', value: 'positive' },
    { word: 'Dormir 8h', value: 'positive' },
    { word: 'Comer Limpo', value: 'positive' },
    { word: 'Caminhar', value: 'positive' },
    { word: 'Fast-food', value: 'negative' },
    { word: 'Sedentarismo', value: 'negative' },
    { word: 'Insônia', value: 'negative' },
    { word: 'Dormir Tarde', value: 'negative' },
    { word: 'Postura Ruim', value: 'negative' },
    { word: 'Pular Refeições', value: 'negative' }
  ],
  mente: [
    { word: 'Meditação', value: 'positive' },
    { word: 'Leitura', value: 'positive' },
    { word: 'Terapia', value: 'positive' },
    { word: 'Autoelogio', value: 'positive' },
    { word: 'Limitar Telas', value: 'positive' },
    { word: 'Aprender Algo', value: 'positive' },
    { word: 'Telas até Tarde', value: 'negative' },
    { word: 'Ansiedade', value: 'negative' },
    { word: 'Redes Sociais', value: 'negative' },
    { word: 'Overthinking', value: 'negative' },
    { word: 'Reclamações', value: 'negative' },
    { word: 'Autocrítica', value: 'negative' }
  ],
  vida: [
    { word: 'Família', value: 'positive' },
    { word: 'Amigos', value: 'positive' },
    { word: 'Pesca/Hobbies', value: 'positive' },
    { word: 'Tempo Livre', value: 'positive' },
    { word: 'Lazer Criativo', value: 'positive' },
    { word: 'Passear no Parque', value: 'positive' },
    { word: 'Trabalho Excessivo', value: 'negative' },
    { word: 'Isolamento', value: 'negative' },
    { word: 'Fofocas', value: 'negative' },
    { word: 'Negligenciar Lazer', value: 'negative' },
    { word: 'Brigas', value: 'negative' },
    { word: 'Ambiente Tóxico', value: 'negative' }
  ],
  liberdade: [
    { word: 'Investir', value: 'positive' },
    { word: 'Poupar', value: 'positive' },
    { word: 'Orçamento', value: 'positive' },
    { word: 'Renda Extra', value: 'positive' },
    { word: 'Estudar Finanças', value: 'positive' },
    { word: 'Comprar à Vista', value: 'positive' },
    { word: 'Dívidas', value: 'negative' },
    { word: 'Consumismo', value: 'negative' },
    { word: 'Gastar sem Planejar', value: 'negative' },
    { word: 'Falta de Reserva', value: 'negative' },
    { word: 'Empréstimos', value: 'negative' },
    { word: 'Cartão Estourado', value: 'negative' }
  ],
  proposito: [
    { word: 'Metas Claras', value: 'positive' },
    { word: 'Aprender/Evoluir', value: 'positive' },
    { word: 'Foco no Futuro', value: 'positive' },
    { word: 'Ajudar Pessoas', value: 'positive' },
    { word: 'Fazer o que Ama', value: 'positive' },
    { word: 'Planos de Longo Prazo', value: 'positive' },
    { word: 'Procrastinação', value: 'negative' },
    { word: 'Rotina Vazia', value: 'negative' },
    { word: 'Trabalho Automático', value: 'negative' },
    { word: 'Falta de Objetivos', value: 'negative' },
    { word: 'Desistir Fácil', value: 'negative' },
    { word: 'Medo de Mudar', value: 'negative' }
  ]
};

// Mapeamento automático dos hábitos cruas para gerar o array PHASE1_BUBBLES com variabilidade controlada:
const pillarsList: ('corpo' | 'mente' | 'vida' | 'liberdade' | 'proposito')[] = ['corpo', 'mente', 'vida', 'liberdade', 'proposito'];
const generatedBubbles: BubbleConcept[] = [];

pillarsList.forEach((pillar) => {
  const habits = ONBOARDING_HABITS[pillar];
  habits.forEach((habit, idx) => {
    // Escalonamento de profundidade zIndex determinístico (12: Fundo, 18: Meio, 25: Frente)
    const zIndexes = [12, 18, 25];
    const zIndex = zIndexes[idx % 3];

    // Tamanhos baseados nas camadas de profundidade 3D
    let size = 70;
    if (zIndex === 12) size = 52 + (idx * 2) % 10;
    else if (zIndex === 18) size = 74 + (idx * 2) % 10;
    else if (zIndex === 25) size = 90 + (idx * 2) % 10;

    // Duração de subida lenta e relaxante
    const duration = 36 + (idx * 3) % 13;

    // Atraso de entrada para spawn gradual
    const delay = idx * 1.5;

    // Margem horizontal segura (entre 15% e 85%) para que a palavra NUNCA bata ou corte nas laterais
    const leftPercent = 15 + ((idx * 27) % 60);
    const left = `${leftPercent}%`;

    // Opacidade máxima associada ao plano tridimensional
    let maxOpacity = 0.8;
    if (zIndex === 12) maxOpacity = 0.55;
    else if (zIndex === 18) maxOpacity = 0.80;
    else if (zIndex === 25) maxOpacity = 0.95;

    generatedBubbles.push({
      word: habit.word,
      pillar,
      ref: `${pillar}_${habit.word.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_")}`,
      label: habit.word,
      value: habit.value,
      points: habit.value === 'positive' ? 1 : -1, // No Onboarding Fase 1, cada bolha dá estritamente no MÁXIMO 1 ponto!
      isGameActive: true,
      left,
      size,
      duration,
      delay,
      theme: 'glass', // Estilo glass translúcido clássico para manter a serenidade do onboarding
      maxOpacity,
      zIndex
    });
  });
});

export const PHASE1_BUBBLES: BubbleConcept[] = generatedBubbles;

/**
 * ── FASE 2: DESAFIO DE EQUILÍBRIO MULTIDIMENSIONAL ──
 * Soltadas simultaneamente com cores vivas e velocidades padrão.
 * Cada bolha afeta múltiplos pilares através do objeto 'impacts'.
 */
export const PHASE2_BUBBLES: BubbleConcept[] = [
  {
    word: 'Fast-food',
    pillar: 'corpo',
    ref: 'fast_food_2',
    label: 'Fast-food',
    value: 'negative',
    points: -2,
    isGameActive: true,
    left: '12%',
    size: 52,
    duration: 25,
    delay: 0,
    theme: 'rose',
    maxOpacity: 0.55,
    zIndex: 12, // lvl2 - Atrás do letreiro, sem colisão
    impacts: { corpo: -3, mente: 0, vida: 2, liberdade: -1, proposito: -1 }
  },
  {
    word: 'Hora Extra',
    pillar: 'liberdade',
    ref: 'hora_extra',
    label: 'Hora Extra',
    value: 'positive',
    points: 1,
    isGameActive: true,
    left: '28%',
    size: 74,
    duration: 22,
    delay: 2,
    theme: 'gold',
    maxOpacity: 0.80,
    zIndex: 21, // lvl4 - À frente do letreiro, colide fisicamente com o PLOC!
    impacts: { corpo: -2, mente: -2, vida: -2, liberdade: 3, proposito: 1 }
  },
  {
    word: 'Academia',
    pillar: 'corpo',
    ref: 'academia_2',
    label: 'Academia',
    value: 'positive',
    points: 2,
    isGameActive: true,
    left: '44%',
    size: 92,
    duration: 24,
    delay: 4,
    theme: 'emerald',
    maxOpacity: 0.95,
    zIndex: 21, // lvl4 - À frente do letreiro, colide fisicamente com o PLOC!
    impacts: { corpo: 3, mente: 1, vida: -1, liberdade: -1, proposito: 0 }
  },
  {
    word: 'Viagem Amigos',
    pillar: 'vida',
    ref: 'viagem_amigos',
    label: 'Viagem Amigos',
    value: 'positive',
    points: 2,
    isGameActive: true,
    left: '60%',
    size: 56,
    duration: 21,
    delay: 1,
    theme: 'blue',
    maxOpacity: 0.55,
    zIndex: 12, // lvl2 - Atrás do letreiro, sem colisão
    impacts: { corpo: 1, mente: 2, vida: 3, liberdade: -2, proposito: 0 }
  },
  {
    word: 'Estudos',
    pillar: 'proposito',
    ref: 'estudos',
    label: 'Estudos/Curso',
    value: 'positive',
    points: 2,
    isGameActive: true,
    left: '76%',
    size: 76,
    duration: 23,
    delay: 3,
    theme: 'violet',
    maxOpacity: 0.80,
    zIndex: 21, // lvl4 - À frente do letreiro, colide fisicamente com o PLOC!
    impacts: { corpo: 0, mente: 2, vida: -1, liberdade: -1, proposito: 3 }
  },
  {
    word: 'Netflix',
    pillar: 'vida',
    ref: 'netflix',
    label: 'Maratonar Netflix',
    value: 'negative',
    points: -1,
    isGameActive: true,
    left: '90%',
    size: 94,
    duration: 26,
    delay: 5,
    theme: 'rose',
    maxOpacity: 0.95,
    zIndex: 25, // lvl5 - À frente do PLOC, sem colisão
    impacts: { corpo: -1, mente: -1, vida: 2, liberdade: 0, proposito: -2 }
  },
  {
    word: 'Meditação',
    pillar: 'mente',
    ref: 'meditacao_2',
    label: 'Meditação',
    value: 'positive',
    points: 2,
    isGameActive: true,
    left: '18%',
    size: 54,
    duration: 25,
    delay: 7,
    theme: 'emerald',
    maxOpacity: 0.55,
    zIndex: 18, // lvl3 - À frente do letreiro, atrás do PLOC, sem colisão
    impacts: { corpo: 1, mente: 3, vida: 0, liberdade: 0, proposito: 1 }
  },
  {
    word: 'Consumismo',
    pillar: 'liberdade',
    ref: 'consumismo_2',
    label: 'Compras por Impulso',
    value: 'negative',
    points: -2,
    isGameActive: true,
    left: '34%',
    size: 78,
    duration: 22,
    delay: 8,
    theme: 'rose',
    maxOpacity: 0.80,
    zIndex: 21, // lvl4 - À frente do letreiro, colide fisicamente com o PLOC!
    impacts: { corpo: 0, mente: -1, vida: 1, liberdade: -3, proposito: -1 }
  },
  {
    word: 'Dormir Cedo',
    pillar: 'corpo',
    ref: 'dormir_cedo',
    label: 'Dormir Cedo',
    value: 'positive',
    points: 2,
    isGameActive: true,
    left: '52%',
    size: 96,
    duration: 23,
    delay: 10,
    theme: 'emerald',
    maxOpacity: 0.95,
    zIndex: 25, // lvl5 - À frente do PLOC, sem colisão
    impacts: { corpo: 3, mente: 2, vida: -1, liberdade: 0, proposito: 0 }
  },
  {
    word: 'Procrastinação',
    pillar: 'proposito',
    ref: 'procrastinacao_2',
    label: 'Procrastinação',
    value: 'negative',
    points: -2,
    isGameActive: true,
    left: '70%',
    size: 80,
    duration: 26,
    delay: 12,
    theme: 'rose',
    maxOpacity: 0.80,
    zIndex: 21, // lvl4 - À frente do letreiro, colide fisicamente com o PLOC!
    impacts: { corpo: -1, mente: -2, vida: 1, liberdade: 0, proposito: -3 }
  }
];

// Mantido por compatibilidade legada apenas para evitar quebras em arquivos não editados
export const BASE_CONCEPTS = PHASE2_BUBBLES;
