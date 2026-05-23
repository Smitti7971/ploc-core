/**
 * @module usePlocResponsive
 * @description Hook responsável por lidar com o redimensionamento da janela e os limites físicos (bounds) do mascote Ploc. 
 * Garante que o Ploc se mantenha dentro da tela e ajusta seu tamanho base dependendo se o usuário está no mobile ou na landing page.
 */

import { useState, useEffect } from 'react';
import { MotionValue } from 'framer-motion';

export function usePlocResponsive(x: MotionValue<number>, y: MotionValue<number>, isLanding: boolean) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileSize = window.innerWidth < 768;
      setIsMobile(isMobileSize);

      const currentX = x.get();
      const currentY = y.get();
      const sizeVal = isMobileSize ? (isLanding ? 90 : 70) : (isLanding ? 120 : 100);

      let minX, maxX, minY, maxY;

      if (isLanding) {
        const paddingX = sizeVal / 2;
        const paddingY = sizeVal / 2;
        minX = -window.innerWidth / 2 + paddingX;
        maxX = window.innerWidth / 2 - paddingX;
        minY = -window.innerHeight / 2 + paddingY;
        maxY = window.innerHeight / 2 - paddingY;
      } else {
        minX = -window.innerWidth + 100;
        maxX = 30;
        minY = -window.innerHeight + 150;
        maxY = 30;
      }

      const clampedX = Math.max(minX, Math.min(maxX, currentX));
      const clampedY = Math.max(minY, Math.min(maxY, currentY));

      if (currentX !== clampedX) x.set(clampedX);
      if (currentY !== clampedY) y.set(clampedY);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [x, y, isLanding]);
  const SIZE = isMobile ? (isLanding ? 90 : 70) : (isLanding ? 120 : 100);

  return { isMobile, SIZE };
}
