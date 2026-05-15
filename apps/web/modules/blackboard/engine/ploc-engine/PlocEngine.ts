import { blackboardEventBus, BLACKBOARD_EVENTS } from '../../events/eventBus';

export type PlocEmotion = 'calm' | 'happy' | 'stressed' | 'pissed' | 'sleeping' | 'dizzy';

export interface PlocState {
  emotion: PlocEmotion;
  energy: number; // 0 to 100
  lastAction: string;
}

class PlocEngine {
  private state: PlocState = {
    emotion: 'calm',
    energy: 50,
    lastAction: 'none'
  };

  constructor() {
    this.initListeners();
  }

  private initListeners() {
    // Reage quando uma bolha explode por sucesso
    blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_EXPLODED, (data) => {
      this.handleBubbleExplosion(data);
    });

    // Reage quando uma bolha explode por omissão (Tonto)
    blackboardEventBus.subscribe(BLACKBOARD_EVENTS.BUBBLE_TIMEOUT, (data) => {
      this.handleBubbleTimeout(data);
    });
  }

  private handleBubbleExplosion(bubble: any) {
    console.log('PlocEngine: Reagindo a explosão de bolha (Sucesso)', bubble);
    
    let message = 'Ploc adorou o seu progresso! ✨';
    let energyBoost = 5;

    // Lógica Específica: Resistência ao Cigarro
    if (bubble.metadata?.habit === 'smoking') {
      message = 'Isso aí! Resistir ao cigarro é evoluir! 🔥🚭';
      energyBoost = 15;
    }

    this.updateState({ 
      energy: Math.min(this.state.energy + energyBoost, 100),
      emotion: 'happy'
    });

    blackboardEventBus.emit(BLACKBOARD_EVENTS.PLOC_REACTION, { 
      type: 'JOY',
      message
    });

    setTimeout(() => this.updateState({ emotion: 'calm' }), 3000);
  }

  private handleBubbleTimeout(bubble: any) {
    console.log('PlocEngine: Reagindo a explosão por omissão (Tonto)', bubble);
    
    let message = 'Opa... uma oportunidade explodiu no Ploc! 😵‍💫';
    let energyLoss = 10;
    let emotion: PlocEmotion = 'dizzy';

    // Lógica Específica: Falha no hábito do Cigarro
    if (bubble.metadata?.habit === 'smoking') {
      message = 'Ploc está sufocado com a fumaça... 🚬🤢';
      energyLoss = 25;
      emotion = 'stressed';
    }

    this.updateState({ 
      energy: Math.max(this.state.energy - energyLoss, 0),
      emotion
    });

    blackboardEventBus.emit(BLACKBOARD_EVENTS.PLOC_REACTION, { 
      type: emotion === 'stressed' ? 'STRESS' : 'DIZZY',
      message
    });

    setTimeout(() => this.updateState({ emotion: 'calm' }), 5000);
  }

  private updateState(partial: Partial<PlocState>) {
    this.state = { ...this.state, ...partial };
    blackboardEventBus.emit(BLACKBOARD_EVENTS.ATTRIBUTE_CHANGED, this.state);
  }

  getState() {
    return this.state;
  }
}

export const plocEngine = new PlocEngine();
