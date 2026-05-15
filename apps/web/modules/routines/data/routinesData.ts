import { Activity, Brain, Heart, Bird, Flag } from 'lucide-react';
import { UserAttributes } from '@/modules/blackboard/engine/attribute-engine/AttributeEngine';

export interface RoutineImpact {
  pilar: keyof UserAttributes;
  val: number;
}

export interface RoutineOption {
  id: string;
  title: string;
  desc: string;
  image: string;
  impacts: RoutineImpact[];
}

export interface PillarConfig {
  id: keyof UserAttributes;
  label: string;
  color: string;
  icon: any;
  summary: string;
  options: RoutineOption[];
}

export const PILLARS_DATA: Record<string, PillarConfig> = {
  corpo: {
    id: 'corpo',
    label: 'CORPO',
    color: '#ef4444',
    icon: Activity,
    summary: 'Saúde, sono e energia física.',
    options: [
      { id: 'heavy-workout', title: 'Treino Intenso', desc: 'Foco em força total.', image: '/images/routines/workout.png', impacts: [{ pilar: 'corpo', val: 8 }, { pilar: 'mente', val: -2 }] },
      { id: 'diet-strict', title: 'Dieta Restritiva', desc: 'Alimentação limpa.', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400', impacts: [{ pilar: 'corpo', val: 6 }, { pilar: 'vida', val: -4 }] },
      { id: 'sleep-deep', title: 'Sono Profundo', desc: '8h de descanso.', image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=400', impacts: [{ pilar: 'corpo', val: 5 }, { pilar: 'mente', val: 3 }] }
    ]
  },
  mente: {
    id: 'mente',
    label: 'MENTE',
    color: '#38bdf8',
    icon: Brain,
    summary: 'Foco, clareza e aprendizado.',
    options: [
      { id: 'deep-work', title: 'Trabalho Profundo', desc: 'Foco total por 4h.', image: '/images/routines/mind.png', impacts: [{ pilar: 'mente', val: 7 }, { pilar: 'vida', val: -3 }, { pilar: 'proposito', val: 2 }] },
      { id: 'meditation', title: 'Zen 15min', desc: 'Silêncio absoluto.', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400', impacts: [{ pilar: 'mente', val: 5 }, { pilar: 'proposito', val: 1 }] },
      { id: 'study-tech', title: 'Estudo Técnico', desc: 'Novas habilidades.', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400', impacts: [{ pilar: 'mente', val: 4 }, { pilar: 'liberdade', val: 1 }] }
    ]
  },
  vida: {
    id: 'vida',
    label: 'VIDA',
    color: '#facc15',
    icon: Heart,
    summary: 'Equilíbrio, lazer e relações.',
    options: [
      { id: 'party-night', title: 'Noite com Amigos', desc: 'Socialização intensa.', image: '/images/routines/social.png', impacts: [{ pilar: 'vida', val: 8 }, { pilar: 'corpo', val: -5 }, { pilar: 'liberdade', val: -2 }] },
      { id: 'hobby-time', title: 'Tempo de Hobby', desc: 'Puro prazer pessoal.', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400', impacts: [{ pilar: 'vida', val: 5 }, { pilar: 'mente', val: 2 }] },
      { id: 'rest-day', title: 'Dia de Preguiça', desc: 'Recuperação total.', image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=400', impacts: [{ pilar: 'vida', val: 4 }, { pilar: 'proposito', val: -2 }] }
    ]
  },
  liberdade: {
    id: 'liberdade',
    label: 'LIBERDADE',
    color: '#2dd4bf',
    icon: Bird,
    summary: 'Autonomia e finanças.',
    options: [
      { id: 'extra-gig', title: 'Freela Extra', desc: 'Aumento de renda.', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=400', impacts: [{ pilar: 'liberdade', val: 7 }, { pilar: 'vida', val: -4 }, { pilar: 'mente', val: -2 }] },
      { id: 'saving-plan', title: 'Economia Mensal', desc: 'Guardar R$ 100.', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=400', impacts: [{ pilar: 'liberdade', val: 5 }] },
      { id: 'investment', title: 'Estudo Financeiro', desc: 'Aprender a investir.', image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400', impacts: [{ pilar: 'liberdade', val: 3 }, { pilar: 'mente', val: 2 }] }
    ]
  },
  proposito: {
    id: 'proposito',
    label: 'PROPÓSITO',
    color: '#c084fc',
    icon: Flag,
    summary: 'Direção e progresso existencial.',
    options: [
      { id: 'mission-action', title: 'Ação da Missão', desc: 'Um passo rumo ao fim.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400', impacts: [{ pilar: 'proposito', val: 10 }, { pilar: 'liberdade', val: -3 }] },
      { id: 'legacy-build', title: 'Construção de Legado', desc: 'Algo que dura.', image: 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&q=80&w=400', impacts: [{ pilar: 'proposito', val: 6 }, { pilar: 'vida', val: -2 }] },
      { id: 'volunteering', title: 'Voluntariado', desc: 'Ajudar o próximo.', image: 'https://images.unsplash.com/photo-1559027615-cd9d7a915490?auto=format&fit=crop&q=80&w=400', impacts: [{ pilar: 'proposito', val: 5 }, { pilar: 'vida', val: 4 }] }
    ]
  }
};

export const IMPACT_ICONS = {
  corpo: Activity,
  mente: Brain,
  vida: Heart,
  liberdade: Bird,
  proposito: Flag
};
