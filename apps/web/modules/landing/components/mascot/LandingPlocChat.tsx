'use client';
 
/**
 * ============================================================================
 * Chat do Ploc na Landing Page - LandingPlocChat.tsx
 * ============================================================================
 * Descrição: Input de texto flutuante para o usuário conversar com o mascote
 * na Landing Page antes de realizar o login.
 * ============================================================================
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import { blackboardEventBus } from '@/modules/blackboard/events/eventBus';
import { PANEL_TRANSITION } from '../../constants';

interface LandingPlocChatProps {
  isOpen: boolean;
}
// Formulário de input animado que emite o evento de mensagem do usuário
export default function LandingPlocChat({ isOpen }: LandingPlocChatProps) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    blackboardEventBus.emit('SEND_PLOC_MESSAGE', {
      text: inputText,
      sender: 'user'
    });
    setInputText('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={PANEL_TRANSITION}
          className="w-full max-w-[500px] pointer-events-auto mt-[30px] px-6 z-20"
        >
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 p-2 rounded-[25px] border border-white/10 backdrop-blur-md relative overflow-hidden transition-all duration-300 bg-white/5 hover:bg-white/8 focus-within:bg-white/10 focus-within:border-white/20 shadow-[0_15px_35px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)] focus-within:shadow-[0_15px_35px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)]"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Pergunte algo ou diga como está seu dia..."
              className="flex-1 bg-transparent border-none outline-none text-white text-[0.85rem] placeholder:text-white/45 px-4 h-10 font-bold w-full font-outfit"
            />
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              type="submit"
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center cursor-pointer border-none outline-none shadow-md"
            >
              <Send size={15} className="text-slate-900 ml-[2px]" />
            </motion.button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
