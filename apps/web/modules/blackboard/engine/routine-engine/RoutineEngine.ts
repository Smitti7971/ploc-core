import { bubbleEngine } from '../bubble-engine/BubbleEngine';
import { blackboardEventBus, BLACKBOARD_EVENTS } from '../../events/eventBus';

export interface Routine {
  id: string;
  name: string;
  description: string;
  type: 'habit' | 'goal' | 'health';
  intervalMinutes: number;
  lastSpawnAt: number;
  isActive: boolean;
  metadata?: any;
}

class RoutineEngine {
  private routines: Routine[] = [];

  constructor() {
    // Carregar rotinas padrão ou do localStorage
    this.initDefaultRoutines();

    // Check loop a cada minuto
    setInterval(() => this.checkRoutines(), 60000);
  }

  private initDefaultRoutines() {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('ploc_routines') : null;
    if (saved) {
      this.routines = JSON.parse(saved);
      // Remove a antiga rotina de antitabagismo se ela existir no cache do usuário
      this.routines = this.routines.filter(r => r.id !== 'antismoking-01');
      this.save();
    } else {
      // Sem rotinas padrão iniciais para não poluir
      this.routines = [];
      this.save();
    }
  }

  private checkRoutines() {
    const now = Date.now();
    this.routines.forEach(routine => {
      if (!routine.isActive) return;

      const elapsed = (now - routine.lastSpawnAt) / 60000;
      if (elapsed >= routine.intervalMinutes) {
        this.spawnRoutineBubble(routine);
        routine.lastSpawnAt = now;
        this.save();
      }
    });
  }

  private spawnRoutineBubble(routine: Routine) {
    console.log(`RoutineEngine: Spawning bubble for routine ${routine.name}`);

    const content = routine.metadata?.habit === 'smoking'
      ? 'Resisti a mais um ciclo sem fumar! '
      : `Progresso na rotina: ${routine.name}`;

    bubbleEngine.spawnBubble('routine', content, 30, routine.metadata); // 30 min para clicar

    // Podemos emitir um evento global se necessário
    blackboardEventBus.emit(BLACKBOARD_EVENTS.ROUTINE_UPDATED, { routine, action: 'SPAWN' });
  }

  private save() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ploc_routines', JSON.stringify(this.routines));
    }
  }

  getRoutines() {
    return this.routines;
  }

  toggleRoutine(id: string) {
    this.routines = this.routines.map(r =>
      r.id === id ? { ...r, isActive: !r.isActive } : r
    );
    this.save();
    blackboardEventBus.emit(BLACKBOARD_EVENTS.ROUTINE_UPDATED, { id, action: 'TOGGLE' });
  }
}

export const routineEngine = new RoutineEngine();
