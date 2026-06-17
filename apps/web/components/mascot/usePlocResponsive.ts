import { useState, useEffect } from 'react';

export function usePlocResponsive(isLanding: boolean) {
  const [isMobile, setIsMobile] = useState(false);
  const [bounds, setBounds] = useState({ left: -2000, right: 30, top: -2000, bottom: 30 });

  useEffect(() => {
    const checkMobile = () => {
      const isMobileSize = window.innerWidth < 768;
      setIsMobile(isMobileSize);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isLanding]);
  
  const SIZE = isLanding ? (isMobile ? 90 : 120) : 80;

  return { isMobile, SIZE, bounds };
}
