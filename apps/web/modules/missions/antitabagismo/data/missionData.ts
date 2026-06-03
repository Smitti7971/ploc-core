export interface MissionRequirement {
  id: string;
  type: 'count_logs' | 'count_motivators' | 'custom_action';
  target: number;
  label: string;
}

export interface MissionStage {
  id: number;
  dayText: string;
  title: string;
  desc: string;
  challenge: string;
  requirements: MissionRequirement[];
  rewardText: string;
  rewardStats: { body?: number; mind?: number; xp?: number };
}

export const STAGES: MissionStage[] = [
  {
    id: 0,
    dayText: "ESTÁGIO 1",
    title: "A Grande Decisão",
    desc: "A jornada de mil milhas começa com o primeiro passo.",
    challenge: "Jogue fora todos os cinzeiros, isqueiros e maços de cigarro de sua casa e escritório. Crie um ambiente 100% purificado.",
    requirements: [
      { id: 'consumption_logs', type: 'count_logs', target: 10, label: 'Registros de uso real de cigarro' },
      { id: 'motivator_logs', type: 'count_motivators', target: 5, label: 'Registrar o que motivou' },
      { id: 'profile_update', type: 'custom_action', target: 1, label: 'Atualizar dados de Liberdade' }
    ],
    rewardText: "+15 Corpo, +10 Foco",
    rewardStats: { body: 15, xp: 10 }
  },
  {
    id: 1,
    dayText: "ESTÁGIO 2",
    title: "Primeiras 24 Horas",
    desc: "O monóxido de carbono e a nicotina começam a deixar seu corpo.",
    challenge: "Fique 24 horas inteiras sem fumar nenhum cigarro. Quando sentir fissura, beba um copo de água extremamente gelada imediatamente.",
    requirements: [
      { id: 'fasting_24h', type: 'custom_action', target: 1, label: 'Alcançar 24 horas de jejum registrado' }
    ],
    rewardText: "+20 Mente, +15 Foco",
    rewardStats: { mind: 20, xp: 15 }
  },
  {
    id: 2,
    dayText: "ESTÁGIO 3",
    title: "Pico de Limpeza",
    desc: "Seus pulmões começam a relaxar e a capacidade respiratória aumenta.",
    challenge: "Realize 3 sessões de respiração controlada (4s inspira, 4s segura, 4s expira) hoje para acalmar a ansiedade física.",
    requirements: [
      { id: 'breathing_logs', type: 'custom_action', target: 3, label: 'Sessões de respiração controlada' }
    ],
    rewardText: "+15 Corpo, +15 Mente",
    rewardStats: { body: 15, mind: 15 }
  },
  {
    id: 3,
    dayText: "ESTÁGIO 4",
    title: "Olfato Restaurado",
    desc: "Suas terminações nervosas olfativas e gustativas voltam a crescer.",
    challenge: "Saboreie uma refeição de forma extremamente lenta hoje, listando mentalmente 3 sabores/temperos novos que você não sentia antes.",
    requirements: [
      { id: 'mindful_eating', type: 'custom_action', target: 1, label: 'Registrar refeição consciente' }
    ],
    rewardText: "+20 Corpo, +20 Foco",
    rewardStats: { body: 20, xp: 20 }
  },
  {
    id: 4,
    dayText: "ESTÁGIO 5",
    title: "Uma Semana Limpa",
    desc: "Primeiro grande marco de oxigenação corporal completa!",
    challenge: "Escreva em um papel (ou nota mental) seus 3 maiores motivos de vitória pessoal e leia-os em voz alta ao acordar.",
    requirements: [
      { id: 'fasting_7d', type: 'custom_action', target: 1, label: 'Alcançar 7 dias de jejum' }
    ],
    rewardText: "+25 Mente, +30 Foco",
    rewardStats: { mind: 25, xp: 30 }
  },
  {
    id: 5,
    dayText: "ESTÁGIO 6",
    title: "Vencendo Gatilhos",
    desc: "O cérebro reconfigura a rotina de hábitos sem nicotina.",
    challenge: "Se houver gatilho para acender um cigarro (ex: após o almoço ou estresse), faça uma caminhada rápida de 5 min ou tome um chá gelado.",
    requirements: [
      { id: 'resist_trigger', type: 'custom_action', target: 3, label: 'Registrar gatilhos resistidos' }
    ],
    rewardText: "+15 Mente, +15 Foco",
    rewardStats: { mind: 15, xp: 15 }
  },
  {
    id: 6,
    dayText: "ESTÁGIO 7",
    title: "Regeneração Física",
    desc: "A circulação sanguínea periférica e a fadiga caem drasticamente.",
    challenge: "Pratique 20 minutos de exercícios físicos moderados (corrida, agachamentos, alongamento) para comemorar seu fôlego novo.",
    requirements: [
      { id: 'exercise_20m', type: 'custom_action', target: 1, label: 'Registrar 20 min de exercício' }
    ],
    rewardText: "+30 Corpo, +20 Foco",
    rewardStats: { body: 30, xp: 20 }
  },
  {
    id: 7,
    dayText: "ESTÁGIO 8",
    title: "Pulmões Livres",
    desc: "Seus cílios bronquiais limpam as vias aéreas de resíduos antigos.",
    challenge: "Consuma pelo menos 2.5 litros de água hoje para expulsar toxinas residuais e manter sua garganta hidratada.",
    requirements: [
      { id: 'water_2500ml', type: 'custom_action', target: 1, label: 'Registrar 2.5L de hidratação' }
    ],
    rewardText: "+20 Corpo, +10 Mente",
    rewardStats: { body: 20, mind: 10 }
  },
  {
    id: 8,
    dayText: "ESTÁGIO 9",
    title: "Nova Plasticidade",
    desc: "O cérebro se acostuma à dopamina natural livre de vícios.",
    challenge: "Compartilhe sua jornada de quase um mês com alguém próximo ou tire 10 minutos para meditar em silêncio profundo.",
    requirements: [
      { id: 'meditation_10m', type: 'custom_action', target: 1, label: 'Registrar 10 min de meditação' }
    ],
    rewardText: "+25 Mente, +25 Foco",
    rewardStats: { mind: 25, xp: 25 }
  },
  {
    id: 9,
    dayText: "ESTÁGIO 10",
    title: "Liberdade Absoluta!",
    desc: "O grande troféu de ouro da reconquista da sua vida saudável.",
    challenge: "Comemore 30 dias sem cigarro! Dê um presente a si mesmo usando o dinheiro economizado no período. Você é livre!",
    requirements: [
      { id: 'fasting_30d', type: 'custom_action', target: 1, label: 'Alcançar 30 dias sem fumar!' }
    ],
    rewardText: "+50 Corpo, +50 Mente, +100 Foco",
    rewardStats: { body: 50, mind: 50, xp: 100 }
  }
];

export interface NodeConfig {
  id: number;
  x: number;
  y: number;
  isTrophy?: boolean;
}

export const NODES_CONFIG: NodeConfig[] = [
  { id: 0, x: 50, y: 7 },
  { id: 1, x: 76, y: 16 },
  { id: 2, x: 50, y: 25 },
  { id: 3, x: 24, y: 34 },
  { id: 4, x: 50, y: 43 },
  { id: 5, x: 76, y: 52 },
  { id: 6, x: 50, y: 61 },
  { id: 7, x: 24, y: 70 },
  { id: 8, x: 50, y: 79 },
  { id: 9, x: 76, y: 88 },
  { id: 10, x: 50, y: 96, isTrophy: true }
];
