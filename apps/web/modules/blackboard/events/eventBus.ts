type EventCallback = (data: any) => void;

class EventBus {
  private events: Map<string, EventCallback[]> = new Map();

  subscribe(event: string, callback: EventCallback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)?.push(callback);

    // Retorna função para cancelar inscrição
    return () => {
      const callbacks = this.events.get(event);
      if (callbacks) {
        this.events.set(event, callbacks.filter(cb => cb !== callback));
      }
    };
  }

  emit(event: string, data?: any) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
}

// Singleton para o módulo Blackboard
export const blackboardEventBus = new EventBus();

export const BLACKBOARD_EVENTS = {
  BUBBLE_EXPLODED: 'BUBBLE_EXPLODED',
  BUBBLE_CREATED: 'BUBBLE_CREATED',
  PLOC_REACTION: 'PLOC_REACTION',
  ATTRIBUTE_CHANGED: 'ATTRIBUTE_CHANGED',
  INSIGHT_GENERATED: 'INSIGHT_GENERATED',
  ROUTINE_UPDATED: 'ROUTINE_UPDATED',
  BUBBLE_TIMEOUT: 'BUBBLE_TIMEOUT'
} as const;
