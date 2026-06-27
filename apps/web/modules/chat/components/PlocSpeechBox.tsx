/**
 * @module PlocSpeechBox
 * @description Componente visual responsável por renderizar o balão de fala do mascote Ploc.
 * Lida com o texto sendo digitado/falado gradualmente.
 */

// Este componente lida apenas com a exibição do texto digitado de forma fluída (balão de pensamento/fala), além da sombra e dos efeitos de digitação...")

import { TypewriterText, ThinkingDots } from '@/components/ui/TypewriterText';

interface PlocSpeechBoxProps {
  currentSpokenText: string;
  isPending: boolean;
  isTTSLoading: boolean;
}

export function PlocSpeechBox({
  currentSpokenText,
  isPending,
  isTTSLoading
}: PlocSpeechBoxProps) {
  if (!currentSpokenText && !isPending && !isTTSLoading) return null;

  return (
    <div className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm max-w-[250px] text-center pointer-events-none">
      {isPending || isTTSLoading ? (
        <ThinkingDots />
      ) : (
        <TypewriterText text={currentSpokenText} />
      )}
    </div>
  );
}
