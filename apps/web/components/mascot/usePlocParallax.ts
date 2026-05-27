import { useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';

export function usePlocParallax() {
  const facingTargetX = useMotionValue(0);
  const smoothFacingX = useSpring(facingTargetX, { stiffness: 350, damping: 25 });

  const faceX = useTransform(smoothFacingX, [-80, 80], [-18, 18], { clamp: true });
  const hatHairX = useTransform(smoothFacingX, [-80, 80], [-10, 10], { clamp: true });
  const clothesX = useTransform(smoothFacingX, [-80, 80], [-8, 8], { clamp: true });
  const bubblesX = useTransform(smoothFacingX, [-80, 80], [-12, 12], { clamp: true });
  const shineX = useTransform(smoothFacingX, [-80, 80], [8, -8], { clamp: true });

  return {
    facingTargetX,
    smoothFacingX,
    faceX,
    hatHairX,
    clothesX,
    bubblesX,
    shineX,
  };
}
