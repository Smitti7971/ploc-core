/**
 * @module usePlocColorState
 * @description Hook responsável por calcular a coloração e sombras (RGBA) do mascote Ploc
 * baseado no seu estado atual de vida: aparência customizada, sono e se foi machucado ou acariciado.
 */

import { useMemo } from 'react';

interface UsePlocColorStateProps {
  appearance?: { bodyColor?: string };
  isSleeping: boolean;
  isHurt: boolean;
  isHit: boolean;
  isPositiveHit: boolean;
  isSick?: boolean;
}

export function usePlocColorState({
  appearance,
  isSleeping,
  isHurt,
  isHit,
  isPositiveHit,
  isSick,
}: UsePlocColorStateProps) {
  return useMemo(() => {
    let baseR = 14, baseG = 144, baseB = 255;
    const chosenColor = appearance?.bodyColor || 'classic';

    if (chosenColor === 'rose') { baseR = 244; baseG = 63; baseB = 94; }
    else if (chosenColor === 'gold') { baseR = 245; baseG = 158; baseB = 11; }
    else if (chosenColor === 'emerald') { baseR = 16; baseG = 185; baseB = 129; }
    else if (chosenColor === 'purple') { baseR = 139; baseG = 92; baseB = 246; }
    else if (chosenColor === 'lava') { baseR = 239; baseG = 68; baseB = 68; }

    let stateR = baseR, stateG = baseG, stateB = baseB, stateAlpha = 0.35;

    if (isHit) { stateR = 255; stateG = 255; stateB = 255; stateAlpha = 0.9; }
    else if (isPositiveHit) { stateR = 134; stateG = 239; stateB = 172; stateAlpha = 0.8; }
    else if (isHurt) { stateR = 153; stateG = 27; stateB = 27; stateAlpha = 0.85; }
    else if (isSick) {
      // Mistura a cor base com um tom de verde musgo/amarelado para aparência apática (doente)
      stateR = Math.floor((baseR + 130) / 2);
      stateG = Math.floor((baseG + 180) / 2);
      stateB = Math.floor((baseB + 90) / 2);
      stateAlpha = 0.4;
    }

    const bodyColor = `rgba(${stateR}, ${stateG}, ${stateB}, ${stateAlpha})`;
    let limbColor = `rgba(${baseR}, ${baseG}, ${baseB}, 0.65)`;
    let limbShadow = `0 0 3px rgba(${baseR}, ${baseG}, ${baseB}, 0.3)`;

    if (isSleeping) {
      limbColor = '#0f172a';
      limbShadow = 'none';
    } else {
      if (isHit) { limbColor = 'rgba(255,255,255,0.9)'; limbShadow = '0 0 8px rgba(255,255,255,0.6)'; }
      else if (isPositiveHit) { limbColor = 'rgba(134, 239, 172, 0.9)'; limbShadow = '0 0 6px rgba(134, 239, 172, 0.5)'; }
      else if (isHurt) { limbColor = 'rgba(153, 27, 27, 0.8)'; limbShadow = '0 0 5px rgba(153, 27, 27, 0.5)'; }
      else if (isSick) { limbColor = `rgba(${Math.floor((baseR + 130) / 2)}, ${Math.floor((baseG + 180) / 2)}, ${Math.floor((baseB + 90) / 2)}, 0.65)`; }
    }

    return { bodyColor, limbColor, limbShadow, baseR, baseG, baseB, stateR, stateG, stateB, stateAlpha };
  }, [isHurt, isHit, isPositiveHit, isSleeping, isSick, appearance?.bodyColor]);
}
