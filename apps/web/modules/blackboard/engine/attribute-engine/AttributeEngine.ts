import { blackboardEventBus, BLACKBOARD_EVENTS } from '../../events/eventBus';
import { UserStats } from '@/types/global.types';

export interface UserAttributes {
  corpo: number;
  mente: number;
  vida: number;
  liberdade: number;
  proposito: number;
}

export interface AttributeChange {
  pillar: keyof UserAttributes;
  value: number;
  diff: number;
}

class AttributeEngine {
  private attributes: UserAttributes = {
    corpo: 50,
    mente: 50,
    vida: 50,
    liberdade: 50,
    proposito: 50
  };

  private score: number = 0;

  constructor() {
    this.init();
  }

  private init() {
    // Tenta carregar do localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ploc_attributes');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          this.attributes = data.attributes || this.attributes;
          this.score = data.score || 0;
        } catch (e) {
          console.error('Erro ao carregar atributos:', e);
        }
      }
    }

    blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_EXPLODED, (bubble) => this.processExplosion(bubble));
    blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_TIMEOUT, (bubble) => this.processTimeout(bubble));
  }

  private save() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ploc_attributes', JSON.stringify({
        attributes: this.attributes,
        score: this.score
      }));
    }
  }

  private processExplosion(bubble: any) {
    this.updateScore(10); // Pontos por foco

    // Suporte para Atributos Dinâmicos (para testes e expansões)
    if (bubble.metadata?.rewardAttribute) {
      this.updateAttribute(bubble.metadata.rewardAttribute, 2);
      return;
    }

    if (bubble.type === 'routine') {
      const habit = bubble.metadata?.habit;
      if (habit === 'smoking') {
        this.updateAttribute('corpo', 5);
        this.updateAttribute('liberdade', 3);
      } else {
        this.updateAttribute('mente', 2);
        this.updateAttribute('corpo', 2);
      }
    } else {
      // Recompensa padrão para bolhas comuns (insight, work, etc)
      this.updateAttribute('mente', 1);
    }
  }

  private processTimeout(bubble: any) {
    this.updateScore(-5); // Perda por distração
    const pillars: Array<keyof UserAttributes> = ['corpo', 'mente', 'vida', 'liberdade', 'proposito'];
    pillars.forEach(p => this.updateAttribute(p, -1));
  }

  private updateScore(diff: number) {
    this.score = Math.max(0, this.score + diff);
    this.save();
    blackboardEventBus.emit(BLACKBOARD_EVENTS.ATTRIBUTE_CHANGED, {
      pillar: 'foco' as any,
      value: this.score,
      diff
    });
  }

  getScore() {
    return this.score;
  }

  applySleepPenalty() {
    this.updateScore(-10); // Perde 10 pontos de foco
    this.updateAttribute('corpo', -8); // Perde 8 pontos de corpo (sono/energia física)
    this.updateAttribute('mente', -4); // Perde 4 pontos de mente (fadiga)
  }

  private updateAttribute(pillar: keyof UserAttributes, diff: number) {
    const oldValue = this.attributes[pillar];
    this.attributes[pillar] = Math.max(0, Math.min(100, this.attributes[pillar] + diff));
    this.save();
    
    blackboardEventBus.emit(BLACKBOARD_EVENTS.ATTRIBUTE_CHANGED, {
      pillar,
      value: this.attributes[pillar],
      diff
    } as AttributeChange);
  }

  getBubbleImpact(bubble: any, status: string): Record<string, number> {
    const impacts: Record<string, number> = {};
    const s = status.toLowerCase().trim();
    const t = (bubble.type || '').toLowerCase().trim();
    
    if (s === 'success' || s === 'resisted') {
      if (t === 'routine') {
        const habit = bubble.metadata?.habit;
        if (habit === 'smoking') {
          impacts['corpo'] = 5;
          impacts['liberdade'] = 3;
        } else {
          impacts['mente'] = 2;
          impacts['corpo'] = 2;
        }
      } else {
        impacts['mente'] = 1; 
      }
    } else if (s === 'failed' || s === 'gave_up') {
      impacts['corpo'] = -1;
      impacts['mente'] = -1;
      impacts['vida'] = -1;
      impacts['liberdade'] = -1;
      impacts['proposito'] = -1;
    }

    // Garantia final
    if (Object.keys(impacts).length === 0 && (s === 'success' || s === 'resisted')) {
      impacts['mente'] = 1;
    }
    
    return impacts;
  }

  getAttributes() {
    return this.attributes;
  }

  /**
   * Sincroniza os atributos visuais com os dados reais do banco de dados.
   */
  syncWithBackend(stats: UserStats) {
    if (!stats) return;
    
    console.log('🧬 [AttributeEngine] SINCRONIZANDO COM BANCO:', stats);

    // Limpa o lixo do localStorage antes de aplicar os novos
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ploc_attributes');
    }

    this.attributes = {
      corpo: stats.body || 10,
      mente: stats.mind || 10,
      vida: stats.life || 10,
      liberdade: stats.freedom || 10,
      proposito: stats.purpose || 10
    };

    this.score = stats.xp ?? 0;
    
    // Notifica o sistema (AttributeMonitor) para atualizar IMEDIATAMENTE
    const pillars: Array<keyof UserAttributes> = ['corpo', 'mente', 'vida', 'liberdade', 'proposito'];
    pillars.forEach((pillar) => {
      blackboardEventBus.emit(BLACKBOARD_EVENTS.ATTRIBUTE_CHANGED, {
        pillar,
        value: this.attributes[pillar],
        diff: 0
      });
    });

    this.save();
  }
}

export const attributeEngine = new AttributeEngine();
