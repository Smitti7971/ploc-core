/**
 * @module usePlocColorState
 * @description Hook responsável por calcular a coloração e sombras (RGBA) do mascote Ploc
 * baseado no seu estado atual de vida: aparência customizada, sono, nível de raiva e se foi machucado ou acariciado.
 */

import { useMemo } from 'react';
import { PlocAppearance } from './types';

interface PlocColorStateProps {
  appearance: PlocAppearance;
  isSleeping: boolean;
  angerLevel: number;
  isHurt: boolean;
  isHit: boolean;
  isPositiveHit: boolean | undefined;
}

export function usePlocColorState({
  appearance,
  isSleeping,
  angerLevel,
  isHurt,
  isHit,
  isPositiveHit,
}: PlocColorStateProps) {
  return useMemo(() => {
    let baseR = 14, baseG = 144, baseB = 255;
    const chosenColor = appearance?.bodyColor || 'classic';

    if (chosenColor === 'rose') { baseR = 244; baseG = 63; baseB = 94; }
    else if (chosenColor === 'gold') { baseR = 245; baseG = 158; baseB = 11; }
    else if (chosenColor === 'emerald') { baseR = 16; baseG = 185; baseB = 129; }
    else if (chosenColor === 'purple') { baseR = 139; baseG = 92; baseB = 246; }
    else if (chosenColor === 'lava') { baseR = 239; baseG = 68; baseB = 68; }

    let stateR = baseR, stateG = baseG, stateB = baseB, stateAlpha = 0.35;

    if (isHurt) { stateR = 244; stateG = 63; stateB = 94; stateAlpha = 0.45; }
    else if (isPositiveHit) { stateR = 16; stateG = 185; stateB = 129; stateAlpha = 0.45; }
    else if (isHit) { stateR = 251; stateG = 191; stateB = 36; stateAlpha = 0.38; }
    else if (angerLevel === 1) { stateR = 254; stateG = 240; stateB = 138; stateAlpha = 0.42; }
    else if (angerLevel === 2) { stateR = 251; stateG = 191; stateB = 36; stateAlpha = 0.48; }
    else if (angerLevel === 3) { stateR = 249; stateG = 115; stateB = 22; stateAlpha = 0.55; }
    else if (angerLevel === 4) { stateR = 239; stateG = 68; stateB = 68; stateAlpha = 0.68; }
    else if (angerLevel === 5) { stateR = 153; stateG = 27; stateB = 27; stateAlpha = 0.85; }

    const bodyColor = `rgba(${stateR}, ${stateG}, ${stateB}, ${stateAlpha})`;
    let limbColor = `rgba(${baseR}, ${baseG}, ${baseB}, 0.65)`;
    let limbShadow = `0 0 3px rgba(${baseR}, ${baseG}, ${baseB}, 0.3)`;

    if (isSleeping) {
      limbColor = '#0f172a';
      limbShadow = 'none';
    } else {
      if (isHurt) { limbColor = 'rgba(244, 63, 94, 0.65)'; limbShadow = '0 0 3px rgba(244, 63, 94, 0.3)'; }
      else if (isPositiveHit) { limbColor = 'rgba(16, 185, 129, 0.65)'; limbShadow = '0 0 3px rgba(16, 185, 129, 0.3)'; }
      else if (isHit) { limbColor = 'rgba(251, 191, 36, 0.55)'; limbShadow = '0 0 3px rgba(251, 191, 36, 0.25)'; }
      else if (angerLevel === 1) { limbColor = 'rgba(254, 240, 138, 0.65)'; limbShadow = '0 0 3px rgba(254, 240, 138, 0.3)'; }
      else if (angerLevel === 2) { limbColor = 'rgba(251, 191, 36, 0.65)'; limbShadow = '0 0 3px rgba(251, 191, 36, 0.3)'; }
      else if (angerLevel === 3) { limbColor = 'rgba(249, 115, 22, 0.7)'; limbShadow = '0 0 3px rgba(249, 115, 22, 0.4)'; }
      else if (angerLevel === 4) { limbColor = 'rgba(239, 68, 68, 0.7)'; limbShadow = '0 0 3px rgba(239, 68, 68, 0.4)'; }
      else if (angerLevel === 5) { limbColor = 'rgba(153, 27, 27, 0.8)'; limbShadow = '0 0 5px rgba(153, 27, 27, 0.5)'; }
    }

    return { bodyColor, limbColor, limbShadow, baseR, baseG, baseB, stateR, stateG, stateB, stateAlpha };
  }, [angerLevel, isHurt, isHit, isPositiveHit, isSleeping, appearance?.bodyColor]);
}
