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
    corpo: 0,
    mente: 0,
    vida: 0,
    liberdade: 0,
    proposito: 0
  };

  private score: number = 0;
  private isDemoMode: boolean = false;

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
  }

  public setDemoMode(active: boolean) {
    this.isDemoMode = active;
    if (active) {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('ploc_demo_attributes');
        if (saved) {
          try {
            this.attributes = JSON.parse(saved);
            this.score = 0;
          } catch (e) {
            this.attributes = { corpo: 0, mente: 0, vida: 0, liberdade: 0, proposito: 0 };
            this.score = 0;
          }
        } else {
          this.attributes = { corpo: 0, mente: 0, vida: 0, liberdade: 0, proposito: 0 };
          this.score = 0;
        }
      }

      // Notifica todos os ouvintes do front-end com os novos valores da demo
      const pillars: Array<keyof UserAttributes> = ['corpo', 'mente', 'vida', 'liberdade', 'proposito'];
      pillars.forEach((pillar) => {
        blackboardEventBus.emit(BLACKBOARD_EVENTS.ATTRIBUTE_CHANGED, {
          pillar,
          value: this.attributes[pillar],
          diff: 0
        });
      });
    } else {
      this.init();

      // Notifica todos os ouvintes do front-end com os valores reais carregados
      const pillars: Array<keyof UserAttributes> = ['corpo', 'mente', 'vida', 'liberdade', 'proposito'];
      pillars.forEach((pillar) => {
        blackboardEventBus.emit(BLACKBOARD_EVENTS.ATTRIBUTE_CHANGED, {
          pillar,
          value: this.attributes[pillar],
          diff: 0
        });
      });
    }
  }

  public getIsDemoMode(): boolean {
    return this.isDemoMode;
  }

  private save() {
    if (typeof window !== 'undefined') {
      if (this.isDemoMode) {
        localStorage.setItem('ploc_demo_attributes', JSON.stringify(this.attributes));
      } else {
        localStorage.setItem('ploc_attributes', JSON.stringify({
          attributes: this.attributes,
          score: this.score
        }));
      }
    }
  }

  // A lógica de processamento de bolhas foi removida temporariamente a pedido do usuário

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

  private updateAttribute(pillar: keyof UserAttributes, diff: number, skipStole = false) {
    const oldValue = this.attributes[pillar];
    this.attributes[pillar] = Math.max(0, Math.min(100, this.attributes[pillar] + diff));
    this.save();

    blackboardEventBus.emit(BLACKBOARD_EVENTS.ATTRIBUTE_CHANGED, {
      pillar,
      value: this.attributes[pillar],
      diff
    } as AttributeChange);

    // Mecânica "Cabo de Guerra" de Atributos (Resource Stealing)
    // Se o valor do atributo anterior já era >= 5 e estamos ganhando pontos (diff > 0)
    if (!skipStole && oldValue >= 5 && diff > 0) {
      const RELATION_MAP: Record<keyof UserAttributes, keyof UserAttributes> = {
        corpo: 'mente',
        mente: 'vida',
        vida: 'liberdade',
        liberdade: 'proposito',
        proposito: 'corpo'
      };
      const refPillar = RELATION_MAP[pillar];
      if (refPillar) {
        // Subtrai 1 do pilar adjacente, evitando recursão infinita
        this.updateAttribute(refPillar, -1, true);
      }
    }
  }

  // Função de cálculo de impactos de bolha removida.

  getAttributes() {
    return this.attributes;
  }

  /**
   * Sincroniza os atributos visuais com os dados reais do banco de dados.
   */
  syncWithBackend(stats: UserStats) {
    if (!stats) return;
    if (this.isDemoMode) return;

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
