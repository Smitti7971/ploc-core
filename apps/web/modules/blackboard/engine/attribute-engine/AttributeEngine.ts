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
    blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_EXPLODED, (bubble) => this.processExplosion(bubble));
    blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_TIMEOUT, (bubble) => this.processTimeout(bubble));
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

  private processExplosion(bubble: any) {
    const gameMode = typeof window !== 'undefined' ? localStorage.getItem('ploc_game_mode') || 'decor' : 'decor';
    if (gameMode === 'decor') {
      return; // Ignore absolutely all attribute changes in decor mode!
    }

    let pillar: keyof UserAttributes | null = null;
    let diff = 1;

    // Fallback/Parsing automático baseado no padrão do jogo (S1..S10, n1..n20)
    const word = (bubble.word || '').toUpperCase().trim();
    if (word.startsWith('S')) {
      const num = parseInt(word.substring(1));
      if (!isNaN(num) && num >= 1 && num <= 10) {
        const pillars: Array<keyof UserAttributes> = ['corpo', 'mente', 'vida', 'liberdade', 'proposito'];
        pillar = pillars[(num - 1) % 5];
        diff = num <= 5 ? 2 : -2;
      }
    } else if (word.startsWith('N')) {
      const num = parseInt(word.substring(1));
      if (!isNaN(num) && num >= 1 && num <= 20) {
        const pillars: Array<keyof UserAttributes> = ['corpo', 'mente', 'vida', 'liberdade', 'proposito'];
        pillar = pillars[((num - 1) % 10) % 5];
        diff = num <= 10 ? 1 : -1;
      }
    }

    // Se tiver metadados explícitos, utilize-os com prioridade
    if (bubble.metadata?.pillar) {
      pillar = bubble.metadata.pillar;
    }
    if (typeof bubble.metadata?.value === 'number') {
      diff = bubble.metadata.value;
    }

    if (pillar) {

      if (gameMode === 'onboarding_game') {
        const attributes = this.attributes;
        const values = [attributes.corpo, attributes.mente, attributes.vida, attributes.liberdade, attributes.proposito];
        const maxVal = Math.max(...values);
        const minVal = Math.min(...values);
        const isBalanced = (maxVal - minVal) <= 1;

        const pillars: Array<keyof UserAttributes> = ['corpo', 'mente', 'vida', 'liberdade', 'proposito'];

        // 1. SE FOR NEGATIVA: Apenas subtrai do pilar alvo, sem punição geral!
        if (diff < 0) {
          this.attributes[pillar] = Math.max(0, this.attributes[pillar] + diff);
          this.save();
          blackboardEventBus.emit(BLACKBOARD_EVENTS.ATTRIBUTE_CHANGED, {
            pillar,
            value: this.attributes[pillar],
            diff
          });
          return;
        }

        // 2. SE NÃO ESTIVER EQUILIBRADO (sabemos que diff > 0 aqui):
        if (!isBalanced) {
          // Se eles estão estourando uma bolha positiva de um pilar que já é o maior de todos (aumentando o desequilíbrio), pune!
          if (attributes[pillar] === maxVal) {
            // PUNISHMENT: Lose -1 in all attributes!
            pillars.forEach(p => {
              this.attributes[p] = Math.max(0, this.attributes[p] - 1);
            });
            this.save();
            // Emit events
            pillars.forEach(p => {
              blackboardEventBus.emit(BLACKBOARD_EVENTS.ATTRIBUTE_CHANGED, {
                pillar: p,
                value: this.attributes[p],
                diff: -1
              });
            });
            // Dispatch custom event for Ploc reaction
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('ploc_unbalanced_pop'));
            }
            return;
          }

          // Se eles estão estourando uma bolha positiva de um atributo menor para tentar reequilibrar (catch-up):
          this.attributes[pillar] = Math.min(10, this.attributes[pillar] + diff);
          this.save();
          blackboardEventBus.emit(BLACKBOARD_EVENTS.ATTRIBUTE_CHANGED, {
            pillar,
            value: this.attributes[pillar],
            diff
          });
          return;
        }

        // 3. SE ESTIVER EQUILIBRADO (sabemos que diff > 0 aqui):
        this.attributes[pillar] = Math.min(10, this.attributes[pillar] + diff);
        this.save();
        blackboardEventBus.emit(BLACKBOARD_EVENTS.ATTRIBUTE_CHANGED, {
          pillar,
          value: this.attributes[pillar],
          diff
        });
        return;
      }

      // Recompensa de Foco normal fora do modo onboarding
      this.updateAttribute(pillar, diff);
      this.updateScore(Math.abs(diff) * 10);
      return;
    }

    // Recompensa genérica para bolhas legadas
    this.updateScore(10);
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
      this.updateAttribute('mente', 1);
    }
  }

  private processTimeout(bubble: any) {
    const gameMode = typeof window !== 'undefined' ? localStorage.getItem('ploc_game_mode') || 'decor' : 'decor';
    if (gameMode === 'decor' || gameMode === 'onboarding_game') {
      return; // Ignore absolutely all attribute changes in decor and onboarding game mode!
    }
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
