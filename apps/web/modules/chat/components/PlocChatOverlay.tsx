/**
 * @module PlocChatOverlay
 * @description Overlay principal do chat, agregando controles, input e balões de fala do mascote.
 */

import { createPortal } from 'react-dom';
import { PlocSpeechBox } from './PlocSpeechBox';
import { PlocChatInput } from './PlocChatInput';

interface PlocChatOverlayProps {
  isChatOpen: boolean;
  isChatInputVisible: boolean;
  currentSpokenText: string;
  isPending: boolean;
  isTTSLoading: boolean;
  gameMode: string | null;
  inputValue: string;
  isLanding: boolean;
  setInputValue: (val: string) => void;
  handleSendMessage: (val: string) => void;
  customControls?: React.ReactNode;
}

export function PlocChatOverlay({
  isChatOpen,
  isChatInputVisible,
  currentSpokenText,
  isPending,
  isTTSLoading,
  gameMode,
  inputValue,
  isLanding,
  setInputValue,
  handleSendMessage,
  customControls
}: PlocChatOverlayProps) {
  if (typeof window === 'undefined') return null;

  return createPortal(
    <>
      {(isChatOpen || isChatInputVisible || !!currentSpokenText || isPending || isTTSLoading) && (
        <>
          {/* Top section: Ploc's spoken text and onboarding UI */}
          <div className="fixed top-[6vh] sm:top-[12vh] left-1/2 -translate-x-1/2 w-[88%] sm:w-[68%] max-w-[680px] z-modal pointer-events-none flex flex-col items-center gap-4 sm:gap-6">
            <PlocSpeechBox
              currentSpokenText={currentSpokenText}
              isPending={isPending}
              isTTSLoading={isTTSLoading}
            />

            {customControls}
          </div>

          {/* Bottom section: Chat Input */}
          <PlocChatInput
            isChatInputVisible={isChatInputVisible}
            isLanding={isLanding}
            gameMode={gameMode}
            inputValue={inputValue}
            isPending={isPending}
            setInputValue={setInputValue}
            handleSendMessage={handleSendMessage}
          />
        </>
      )}
    </>,
    document.body
  );
}
