import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn — Utilitário de mesclagem de classes Tailwind
 * Combina condicionalmente classes e resolve conflitos de prioridade.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
