'use client';

/**
 * ============================================================================
 * Grupo de Controle de Pilares - PillarsControlGroup.tsx
 * ============================================================================
 * Descrição: Componente que agrupa e exibe os botões de controle de HUD para 
 * os pilares (Corpo, Mente, Vida, etc.) e o controle de densidade de bolhas.
 * ============================================================================
 */import React from 'react';
import { PILLARS_CONFIG } from './PillarTooltipDetail';
import PillarHUDButton from './PillarHUDButton';
import { BubbleDensityButton } from '../bubbles';

interface PillarsControlGroupProps {
  gameMode: 'decor' | 'onboarding_game' | 'normal';
  density: 'none' | 'low' | 'medium' | 'high';
  activeTooltip: string | null;
  attributes: any;
  onToggleTooltip: (pillarKey: string) => void;
  onChangeDensity: (newDensity: 'none' | 'low' | 'medium' | 'high') => void;
  onboardingStage?: string;
}
// Componente que renderiza o grupo de botões na interface
export default function PillarsControlGroup({
  gameMode,
  density,
  activeTooltip,
  attributes,
  onToggleTooltip,
  onChangeDensity,
  onboardingStage
}: PillarsControlGroupProps) {
  const showHUD = gameMode !== 'onboarding_game' || onboardingStage === 'fase2';

  if (!showHUD) return null;

  return (
    <div className="absolute bottom-6 right-6 pointer-events-auto z-100 flex flex-col items-center gap-3">
      {/* Atributos Fixos da Landing Page (Acima do controle de bolhas) */}
      {gameMode !== 'decor' && (Object.keys(PILLARS_CONFIG) as Array<keyof typeof PILLARS_CONFIG>).map((key) => {
        const config = PILLARS_CONFIG[key];
        const isActive = activeTooltip === key;
        const value = attributes[key] ?? 3;

        return (
          <PillarHUDButton
            key={key}
            pillarKey={key}
            config={config}
            isActive={isActive}
            value={value}
            onToggleTooltip={onToggleTooltip}
          />
        );
      })}

      <BubbleDensityButton
        gameMode={gameMode}
        density={density}
        onChangeDensity={onChangeDensity}
      />
    </div>
  );
}
