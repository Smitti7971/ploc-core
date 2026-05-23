/**
 * @module PlocChatInput
 * @description Componente de campo de texto para o usuário conversar em tempo real com o Ploc.
 * Permite inserção de texto manual e também dita estado de gravação do microfone.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';

interface PlocChatInputProps {
  isChatInputVisible: boolean;
  isLanding: boolean;
  gameMode: string | null;
  inputValue: string;
  isPending: boolean;
  setInputValue: (val: string) => void;
  handleSendMessage: (val: string) => void;
}

export function PlocChatInput({
  isChatInputVisible,
  isLanding,
  gameMode,
  inputValue,
  isPending,
  setInputValue,
  handleSendMessage
}: PlocChatInputProps) {
  return (
    <AnimatePresence>
      {isChatInputVisible && !isLanding && gameMode !== 'onboarding_game' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed bottom-[31vh] left-1/2 -translate-x-1/2 w-[90%] max-w-[460px] z-[999999] pointer-events-auto"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex gap-3 bg-slate-900/45 border border-white/12 shadow-[0_8px_32px_rgba(0,0,0,0.55),_inset_0_0_20px_rgba(255,255,255,0.02)] rounded-full py-1.5 pr-2 pl-5 backdrop-blur-[16px]"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escreva algo para o Ploc..."
              disabled={isPending}
              className="flex-1 bg-transparent border-none text-white text-sm outline-none py-1.5"
            />
            <button
              type="submit"
              disabled={isPending || !inputValue.trim()}
              className={`bg-white/10 border border-white/20 rounded-full w-8 h-8 flex items-center justify-center text-white cursor-pointer transition-all duration-200 ${inputValue.trim() ? 'opacity-100' : 'opacity-40'
                }`}
            >
              <Send size={14} />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
