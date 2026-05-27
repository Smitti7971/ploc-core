/**
 * @module usePlocResponsive
 * @description Hook responsável por lidar com o redimensionamento da janela e os limites físicos (bounds) do mascote Ploc. 
 * Garante que o Ploc se mantenha dentro da tela e ajusta seu tamanho base dependendo se o usuário está no mobile ou na landing page.
 */

import { useState, useEffect } from 'react';
import { MotionValue } from 'framer-motion';

export function usePlocResponsive(x: MotionValue<number>, y: MotionValue<number>, isLanding: boolean) {
  const [isMobile, setIsMobile] = useState(false);
  const [bounds, setBounds] = useState({ left: -2000, right: 30, top: -2000, bottom: 30 }); // Valores seguros iniciais

  useEffect(() => {
    const checkMobile = () => {
      const isMobileSize = window.innerWidth < 768;
      setIsMobile(isMobileSize);

      const currentX = x.get();
      const currentY = y.get();
      const sizeVal = isLanding ? (isMobileSize ? 90 : 120) : 80;

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
      
      setBounds({ left: minX, right: maxX, top: minY, bottom: maxY });

      const clampedX = Math.max(minX, Math.min(maxX, currentX));
      const clampedY = Math.max(minY, Math.min(maxY, currentY));

      if (currentX !== clampedX) x.set(clampedX);
      if (currentY !== clampedY) y.set(clampedY);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [x, y, isLanding]);
  
  const SIZE = isLanding ? (isMobile ? 90 : 120) : 80;

  return { isMobile, SIZE, bounds };
}
