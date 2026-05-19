/**
 * ============================================================================
 * Ploc Achievements System - achievements.ts
 * ============================================================================
 * Descrição: Centralizador do sistema de conquistas gamificado do Ploc.
 * Fornece a lista de conquistas, validações e disparo de áudio procedural.
 * ============================================================================
 */

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  hint: string;
}

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'paciencia_jo',
    title: 'Paciência Zero 🕊️',
    desc: 'Despertou a irritação do Ploc pela primeira vez com cliques rápidos.',
    hint: 'Clique rapidamente 5 vezes seguidas no Ploc.',
    icon: '⚡'
  },
  {
    id: 'tornado_vermelho',
    title: 'Tornado Vermelho 😡',
    desc: 'Fez o Ploc atingir o Nível 5 de irritação no cabo de guerra (Enfurecido).',
    hint: 'Desafie o Ploc no cabo de guerra de cliques até o limite da fúria.',
    icon: '🌋'
  },
  {
    id: 'estilista_gel',
    title: 'Estilista Gelatinoso 👑',
    desc: 'Customizou o Ploc por completo equipando itens em todos os slots.',
    hint: 'Equipe Cabelo, Roupas, Chapéu, Sapatos e Aura simultaneamente.',
    icon: '👔'
  },
  {
    id: 'astronauta_caos',
    title: 'Astronauta do Caos 💫',
    desc: 'Emanou poder cósmico equipando qualquer aura holográfica.',
    hint: 'Equipe qualquer Aura na Central do Ploc.',
    icon: '🔮'
  },
  {
    id: 'domador_sabao',
    title: 'Domador de Sabão 🫧',
    desc: 'Restabeleceu o foco do Ploc estourando 10 bolhas no mini-game do Dashboard.',
    hint: 'Conclua o desafio de bolhas do Ploc com 10 acertos.',
    icon: '🎯'
  }
];

// Toca uma fanfarra mágica e triunfante de conquista usando a Web Audio API
export const playAchievementSound = () => {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Arpejo clássico de 8-bit alegre (Dó maior -> Sol maior -> Dó oitava)
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    const noteDuration = 0.08;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = idx === notes.length - 1 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * noteDuration);

      gain.gain.setValueAtTime(0, now + idx * noteDuration);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * noteDuration + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * noteDuration + (idx === notes.length - 1 ? 0.35 : 0.12));

      osc.start(now + idx * noteDuration);
      osc.stop(now + idx * noteDuration + 0.4);
    });
  } catch (e) {}
};

/**
 * Destrava uma conquista caso ainda não tenha sido conquistada
 */
export const triggerAchievementUnlock = (id: string) => {
  if (typeof window === 'undefined') return;

  try {
    const saved = localStorage.getItem('ploc_achievements') || '[]';
    const list: Array<{ id: string; date: string }> = JSON.parse(saved);

    const alreadyUnlocked = list.some(item => item.id === id);
    if (alreadyUnlocked) return;

    const newUnlock = {
      id,
      date: new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updated = [...list, newUnlock];
    localStorage.setItem('ploc_achievements', JSON.stringify(updated));

    // Reproduz sonoridade mágica
    playAchievementSound();

    // Dispara evento global para que qualquer componente atualize em tempo real
    window.dispatchEvent(new CustomEvent('ploc_achievement_unlocked', { detail: newUnlock }));

    // Emite no blackboard para feedbacks contextuais se necessário
    const achievementInfo = ACHIEVEMENTS_LIST.find(a => a.id === id);
    if (achievementInfo) {
      const event = new CustomEvent('ploc_toast_notification', {
        detail: {
          title: '🏆 Conquista Desbloqueada!',
          message: `${achievementInfo.icon} ${achievementInfo.title}: ${achievementInfo.desc}`,
          type: 'achievement'
        }
      });
      window.dispatchEvent(event);
    }
  } catch (e) {
    console.error('Erro ao registrar conquista:', e);
  }
};
