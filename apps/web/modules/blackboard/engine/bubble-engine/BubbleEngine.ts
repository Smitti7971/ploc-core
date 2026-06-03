import { BLACKBOARD_EVENTS, blackboardEventBus } from '../../events/eventBus';
import { BlackboardBubble, BubbleType } from '../../types/bubbles';
import { useAuthStore } from '@/store/authStore';
import { apiService } from '@/services/api';

class BubbleEngine {
  private bubbles: BlackboardBubble[] = [];
  private listeners: ((bubbles: BlackboardBubble[]) => void)[] = [];
  private lastUpdate: number = Date.now();
  private readonly MAX_MINUTES = 43200; // Suporta até 1 mês
  private readonly DISTANCE_PER_MINUTE = 200; // 10 min = 2000px (um quarto do mapa)
  private readonly PLOC_RADIUS = 120; // Raio de "colisão" do Ploc

  constructor() {
    this.init();
    setInterval(() => this.update(), 100);
  }

  private init() {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('ploc_bubbles');
    if (saved) {
      try {
        const savedBubbles: BlackboardBubble[] = JSON.parse(saved);
        const now = Date.now();

        // Filtra bolhas: inward precisam estar no prazo, outward sempre ficam (overtime)
        this.bubbles = savedBubbles
          .filter(b => {
            const isOutward = b.metadata?.direction === 'outward';
            const isOldSmoking = b.metadata?.habit === 'smoking' || b.content?.includes('Fumar');
            if (isOldSmoking) return false;
            return isOutward || (b.deadlineAt || 0) > now;
          })
          .map(b => ({
            ...b,
            minutesRemaining: ((b.deadlineAt || 0) - now) / 60000
          }));
      } catch (e) {
        console.error('Erro ao carregar bolhas:', e);
      }
    }

    // Boilerplate/Tutorial start
    if (this.bubbles.length === 0) {
      setTimeout(() => {
        this.spawnBubble('insight', 'Bem-vindo ao Radar Ploc! ⏱️', 10);
      }, 1000);
    }
  }

  private save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem('ploc_bubbles', JSON.stringify(this.bubbles));
  }

  subscribe(listener: (bubbles: BlackboardBubble[]) => void) {
    this.listeners.push(listener);
    listener([...this.bubbles]);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l([...this.bubbles]));
  }

  getActiveBubbles() {
    return [...this.bubbles];
  }

  /** Calcula a posição X/Y baseada no tempo restante e ângulo */
  private calculatePosition(minutesRemaining: number, angle: number, totalMinutes: number, direction: 'inward' | 'outward' = 'inward') {
    let distance = 0;

    if (direction === 'outward') {
      // Começa no 0 (centro) e vai até a borda (500px fixos para teste visual)
      const progress = Math.min(1, 1 - (minutesRemaining / totalMinutes));
      distance = progress * 500;
    } else {
      // Padrão: Vem de fora para dentro, mas para na borda do Ploc
      distance = Math.max(this.PLOC_RADIUS, minutesRemaining * this.DISTANCE_PER_MINUTE);
    }

    return {
      x: 4000 + Math.cos(angle) * distance,
      y: 4000 + Math.sin(angle) * distance
    };
  }

  spawnBubble(type: BubbleType, content: string, minutes?: number, metadata?: any) {
    const initialMinutes = minutes ?? 10;
    const direction = metadata?.direction || 'inward';
    const angle = Math.random() * Math.PI * 2;
    const { x, y } = this.calculatePosition(initialMinutes, angle, initialMinutes, direction);

    const newBubble: BlackboardBubble = {
      id: (Date.now() + Math.random()).toString(),
      type,
      content,
      x,
      y,
      vx: 0,
      vy: 0,
      size: 60 + Math.random() * 40,
      energy: 100,
      createdAt: Date.now(),
      deadlineAt: Date.now() + initialMinutes * 60000,
      metadata: { ...metadata, direction, totalMinutes: initialMinutes },
      minutesRemaining: initialMinutes,
      angle
    };

    this.bubbles.push(newBubble);
    this.save();
    this.notify();
    blackboardEventBus.emit(BLACKBOARD_EVENTS.BUBBLE_CREATED, newBubble);
    return newBubble;
  }

  explodeBubble(id: string, note?: string) {
    const bubble = this.bubbles.find(b => b.id === id);
    if (bubble) {
      this.bubbles = this.bubbles.filter(b => b.id !== id);
      this.save();
      this.notify();

      const direction = bubble.metadata?.direction || 'inward';
      let reward = 5;
      let status: 'success' | 'failed' | 'resisted' | 'gave_up' = 'success';

      if (direction === 'outward') {
        // Se explodiu bolha de resistência
        // Tolerância de 5 segundos (0.08 min) para evitar erro de precisão
        if ((bubble.minutesRemaining || 0) <= 0.08) {
          // VITÓRIA: Meta alcançada
          reward = 15;
          status = 'resisted';
          blackboardEventBus.emit(BLACKBOARD_EVENTS.BUBBLE_EXPLODED, bubble);
        } else {
          // CEDEU AO VÍCIO antes da hora (Punição)
          reward = -10;
          status = 'gave_up';
          blackboardEventBus.emit(BLACKBOARD_EVENTS.BUBBLE_TIMEOUT, bubble);
        }
      } else {
        // Se explodiu bolha normal = FOCO (Sucesso)
        reward = 5;
        status = 'success';
        blackboardEventBus.emit(BLACKBOARD_EVENTS.BUBBLE_EXPLODED, bubble);
        
        // Dar +1 Foco Coin
        try {
          const state = useAuthStore.getState();
          if (state.user) {
            const currentCoins = state.user.stats?.focoCoins || 0;
            state.updateUser({ stats: { ...state.user.stats, focoCoins: currentCoins + 1 } as any });
            apiService.post('/users/debug/foco-coins', { amount: 1 }).catch(e => console.error(e));
          }
        } catch (e) {
          console.error("Erro ao adicionar foco coin:", e);
        }
      }

      // SALVA NO LOG DE HISTÓRICO
      const impacts = this.calculateLocalImpact(bubble, status);
      this.saveToHistory({
        timestamp: Date.now(),
        bubbleId: bubble.id,
        content: bubble.content,
        type: bubble.type,
        status,
        reward,
        impacts,
        note: note || ''
      });

      // SE FOR HABITO (OUTWARD), RESPÁUNA AUTOMATICAMENTE PARA CRIAR O LOOPING
      if (direction === 'outward') {
        setTimeout(() => {
          this.spawnBubble(bubble.type, bubble.content, 60, {
            ...bubble.metadata,
            totalMinutes: 60
          });
        }, 800);
        // Delay para garantir que a explosão foi processada
      }
    }
  }

  private calculateLocalImpact(bubble: any, status: string): Record<string, number> {
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

    if (Object.keys(impacts).length === 0 && (s === 'success' || s === 'resisted')) {
      impacts['mente'] = 1;
    }

    return impacts;
  }

  private saveToHistory(entry: any) {
    if (typeof window === 'undefined') return;
    const history = JSON.parse(localStorage.getItem('ploc_interaction_history') || '[]');
    history.push(entry);
    localStorage.setItem('ploc_interaction_history', JSON.stringify(history.slice(-100))); // Guarda os últimos 100
  }

  private update() {
    const now = Date.now();
    const dt = (now - this.lastUpdate) / 1000 / 60; // Delta em minutos
    this.lastUpdate = now;

    let changed = false;

    this.bubbles = this.bubbles.map(bubble => {
      const currentMinutes = bubble.minutesRemaining || 0;
      const direction = (bubble.metadata?.direction as 'inward' | 'outward') || 'inward';
      const totalMinutes = (bubble.metadata?.totalMinutes as number) || 10;

      // Bolhas outward podem ter tempo negativo (continuidade)
      let newMinutes = currentMinutes - dt;
      if (direction !== 'outward') {
        newMinutes = Math.max(0, newMinutes);
      }

      // Para cálculo de posição, travamos no 0 para ela não fugir da tela no overtime
      const posMinutes = Math.max(0, newMinutes);
      const { x, y } = this.calculatePosition(posMinutes, bubble.angle || 0, totalMinutes, direction);

      const newEnergy = Math.max(0, bubble.energy - 0.1);

      if (Math.abs(newMinutes - currentMinutes) > 0.0001) {
        changed = true;
        return { ...bubble, x, y, energy: newEnergy, minutesRemaining: newMinutes };
      }
      return bubble;
    });

    // Filtra bolhas que terminaram o ciclo (Apenas inward)
    const completed = this.bubbles.filter(b => {
      const direction = b.metadata?.direction || 'inward';
      return direction === 'inward' && (b.minutesRemaining || 0) <= 0;
    });
    if (completed.length > 0) {
      completed.forEach(b => {
        this.bubbles = this.bubbles.filter(bub => bub.id !== b.id);
        const direction = b.metadata?.direction || 'inward';

        if (direction === 'outward') {
          // VITÓRIA! Resistiu até a bolha sair do radar
          blackboardEventBus.emit(BLACKBOARD_EVENTS.BUBBLE_EXPLODED, b);
          const impacts = this.calculateLocalImpact(b, 'resisted');
          this.saveToHistory({
            timestamp: Date.now(),
            bubbleId: b.id,
            content: b.content,
            type: b.type,
            status: 'resisted',
            reward: 20,
            impacts,
            note: 'Resistência concluída com sucesso! 💪'
          });
        } else {
          // DERROTA! A distração colidiu
          blackboardEventBus.emit(BLACKBOARD_EVENTS.BUBBLE_TIMEOUT, b);
          const impacts = this.calculateLocalImpact(b, 'failed');
          this.saveToHistory({
            timestamp: Date.now(),
            bubbleId: b.id,
            content: b.content,
            type: b.type,
            status: 'failed',
            reward: -5,
            impacts,
            note: 'A distração venceu desta vez.'
          });
        }
      });
      this.save();
      changed = true;
    }

    if (changed) {
      this.notify();
      if (Math.random() < 0.05) this.save();
    }
  }
}

export const bubbleEngine = new BubbleEngine();
