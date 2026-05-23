export type BubbleType = 
  | 'task' 
  | 'knowledge' 
  | 'reflection' 
  | 'routine' 
  | 'memory' 
  | 'insight'
  | 'bright_idea'
  | 'work'
  | 'study'
  | 'health';

export interface BlackboardBubble {
  id: string;
  type: BubbleType;
  content: string;
  x: number;
  y: number;
  vx: number; // velocidade x
  vy: number; // velocidade y
  size: number;
  energy: number; // 0 a 100
  createdAt: number;
  deadlineAt?: number; // Quando deve chegar ao centro (Ploc)
  minutesRemaining?: number;
  angle?: number;
  metadata?: Record<string, unknown>;
}
