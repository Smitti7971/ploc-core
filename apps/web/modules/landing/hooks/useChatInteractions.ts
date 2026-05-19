'use client';

import { useState, useEffect } from 'react';
import { blackboardEventBus } from '@/modules/blackboard/events/eventBus';

export function useChatInteractions() {
  const [isLandingChatOpen, setIsLandingChatOpen] = useState(false);

  // Escuta abertura de chat
  useEffect(() => {
    const unsubOpen = blackboardEventBus.subscribe('OPEN_LANDING_CHAT', (open: boolean) => {
      setIsLandingChatOpen(open);
    });
    return () => unsubOpen();
  }, []);

  // Cliques fora do chat para fechar
  useEffect(() => {
    if (!isLandingChatOpen) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('#ploc-singleton-mount') ||
        target.tagName === 'INPUT' ||
        target.closest('form')
      ) {
        return;
      }
      blackboardEventBus.emit('OPEN_LANDING_CHAT', false);
    };

    document.addEventListener('pointerdown', handleOutsideClick, true);
    return () => document.removeEventListener('pointerdown', handleOutsideClick, true);
  }, [isLandingChatOpen]);

  return { isLandingChatOpen };
}
