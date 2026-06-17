'use client';

/**
 * @module AttributeMonitor
 * @description Componente orquestrador do painel de monitoramento de atributos.
 * Delega o estado para o hook `useAttributeMonitor` e a renderização visual para os 
 * subcomponentes `AttributeMonitorHeader`, `AttributePillars` e `AttributeHistory`.
 */

import React from 'react';
import { useAttributeMonitor } from './useAttributeMonitor';
import { AttributeMonitorHeader } from './AttributeMonitorHeader';
import { AttributePillars } from './AttributePillars';
import { AttributeHistory } from './AttributeHistory';

interface AttributeMonitorProps {
  onClose: () => void;
  inline?: boolean;
  onTooltipChange?: (tooltip: string | null) => void;
}

export function AttributeMonitor(props: AttributeMonitorProps) {
  const { onClose, inline = false } = props;
  const {
    attributes,
    lastChanges,
    history,
    activeTab,
    setActiveTab,
    activeTooltip,
    setActiveTooltip,
    handleManualSync,
    handleUserActivity
  } = useAttributeMonitor(onClose, inline);

  React.useLayoutEffect(() => {
    if (props.onTooltipChange) {
      props.onTooltipChange(activeTooltip);
    }
  }, [activeTooltip, props.onTooltipChange]);

  return (
    <div 
      className="monitor-panel" 
      onMouseMove={handleUserActivity}
      onClick={handleUserActivity}
      style={inline ? {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        width: '100%',
      } : {
        position: 'fixed',
        top: '140px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        zIndex: 0 /* base */ /* base */,
      }}>
      <AttributePillars 
        attributes={attributes}
        lastChanges={lastChanges}
        activeTooltip={activeTooltip}
        setActiveTooltip={setActiveTooltip}
      />
    </div>
  );
}
