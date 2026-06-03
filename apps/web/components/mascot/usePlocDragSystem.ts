import { useRef } from 'react';
import { MotionValue } from 'framer-motion';
import { blackboardEventBus } from '@/modules/blackboard/events/eventBus';
import { PILLARS_DATA } from '@/modules/routines/data/routinesData';

interface UsePlocDragSystemProps {
  x: MotionValue<number>;
  y: MotionValue<number>;
  facingTargetX: MotionValue<number>;
  SIZE: number;
  pathname: string;
  isAuthenticated: boolean;
  isSleeping: boolean;
  setIsDragging: (val: boolean) => void;
  setIsTapped: (val: boolean) => void;
  setIsHovered: (val: boolean) => void;
  triggerHurt: () => void;
  setFocusedRoutine: (val: any) => void;
  setFocusedPillar: (val: any) => void;
  setShowSimulation: (val: boolean) => void;
  focusedRoutine: any;
}

export function usePlocDragSystem({
  x,
  y,
  facingTargetX,
  SIZE,
  pathname,
  isAuthenticated,
  isSleeping,
  setIsDragging,
  setIsTapped,
  setIsHovered,
  triggerHurt,
  setFocusedRoutine,
  setFocusedPillar,
  setShowSimulation,
  focusedRoutine
}: UsePlocDragSystemProps) {
  const hasDraggedRef = useRef(false);

  const onDragStart = () => {
    setIsDragging(true);
    setIsTapped(false);
    hasDraggedRef.current = true;
    if (pathname === '/' && isAuthenticated) {
      blackboardEventBus.emit('PLOC_DRAG_MOVE', { x: x.get(), y: y.get() });
    }
  };

  const onDrag = (e: any, info: any) => {
    if (isSleeping) return;

    if (info.delta.x > 0.5) {     //Vira o ploc de lado.
      facingTargetX.set(80);
    } else if (info.delta.x < -0.5) {
      facingTargetX.set(-80);
    }

    if (pathname === '/' && isAuthenticated) {
      blackboardEventBus.emit('PLOC_DRAG_MOVE', { x: x.get(), y: y.get() });
    }

    const el = document.elementFromPoint(info.point.x, info.point.y);
    const card = el?.closest('[data-routine-id]');
    if (card) {
      const rId = card.getAttribute('data-routine-id');
      const pId = card.getAttribute('data-pillar-id');
      if (rId && pId && PILLARS_DATA[pId]) {
        const routine = PILLARS_DATA[pId].options.find((o: any) => o.id === rId);
        if (routine && routine.id !== focusedRoutine?.id) {
          setFocusedRoutine(routine);
          setFocusedPillar(pId);
        }
      }
    } else if (focusedRoutine) {
      setFocusedRoutine(null);
      setFocusedPillar(null);
      setShowSimulation(false);
    }
  };

  const onDragEnd = (e: any, info: any) => {
    facingTargetX.set(0);

    if (isSleeping) {
      setIsDragging(true);
      setIsTapped(false);
      setIsHovered(false);
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 150);
      return;
    }

    setIsDragging(false);
    setIsTapped(false);
    setIsHovered(false);
    const threshold = 600;
    if (Math.abs(info.velocity.x) > threshold || Math.abs(info.velocity.y) > threshold) {
      setTimeout(() => { triggerHurt(); }, 150);
    }

    if (pathname === '/' && isAuthenticated) {
      blackboardEventBus.emit('PLOC_DRAG_END', { x: x.get(), y: y.get() });
    }

    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 150);
  };

  return {
    hasDraggedRef,
    onDragStart,
    onDrag,
    onDragEnd
  };
}
