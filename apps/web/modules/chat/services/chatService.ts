/**
 * chatService.ts — Lógica de comunicação com a IA do Ploc
 */

import { apiService } from '@/services/api';

export interface ChatResponse {
  message?: string;
  name?: string; // Para criação de tarefas (legacy compatibility)
  [key: string]: any;
}

export const chatService = {
  /**
   * Envia uma mensagem para a IA do Ploc
   */
  sendMessage: async (message: string, options: { isPissedOff?: boolean; fillerText?: string } = {}) => {
    return apiService.post<ChatResponse>('/ai/chat', {
      message,
      isPissedOff: options.isPissedOff || false,
      fillerText: options.fillerText || null,
    });
  },
};
