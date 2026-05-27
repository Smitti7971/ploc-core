const uuidv4 = () => Math.random().toString(36).substring(2) + Date.now().toString(36);
export type ResourceType = 'food' | 'water' | 'medicine';

export interface ResourceBubbleData {
  id: string;
  type: ResourceType;
  name: string;
  x: number;
  y: number;
  createdAt: number;
}

class ResourceEngine {
  private bubbles: ResourceBubbleData[] = [];
  private listeners: Set<() => void> = new Set();

  public spawnBubble(type: ResourceType, name: string, x: number, y: number) {
    const bubble: ResourceBubbleData = {
      id: uuidv4(),
      type,
      name,
      x,
      y,
      createdAt: Date.now()
    };
    this.bubbles.push(bubble);
    this.notify();
  }

  public removeBubble(id: string) {
    this.bubbles = this.bubbles.filter(b => b.id !== id);
    this.notify();
  }

  public getBubbles() {
    return this.bubbles;
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l());
  }
}

export const resourceEngine = new ResourceEngine();
