'use client';

import { useState, useEffect } from 'react';
import { blackboardEventBus, BLACKBOARD_EVENTS } from '@/modules/blackboard/events/eventBus';
import { attributeEngine } from '@/modules/blackboard/engine/attribute-engine/AttributeEngine';

export function useAttributesSync() {
  const [attributes, setAttributes] = useState<any>({ corpo: 3, mente: 3, vida: 3, liberdade: 3, proposito: 3 });

  useEffect(() => {
    // Carrega o estado atual imediatamente
    setAttributes(attributeEngine.getAttributes());

    const unsub = blackboardEventBus.subscribe(BLACKBOARD_EVENTS.ATTRIBUTE_CHANGED, (change: any) => {
      setAttributes((prev: any) => ({ ...prev, [change.pillar]: change.value }));
    });
    return unsub;
  }, []);

  return { attributes, setAttributes };
}
