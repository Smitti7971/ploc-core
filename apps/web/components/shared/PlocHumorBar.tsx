/**
 * @module PlocHumorBar
 * @description Barra de humor/status visível que exibe os níveis das necessidades do Ploc.
 */


interface PlocHumorBarProps {
  isSleeping: boolean;
  angerLevel: number;
  angerPercentage: number;
  isPositiveHit: boolean;
  levelLockTimer: number;
  ANGER_LEVELS: {
    label: string;
    lockDuration: number;
    unlockClicksNeeded: number;
    percentPerClick: number;
    ignoredClicks: number;
  }[];
}

export function PlocHumorBar({
  isSleeping,
  angerLevel,
  angerPercentage,
  isPositiveHit,
  levelLockTimer,
  ANGER_LEVELS,
}: PlocHumorBarProps) {
  if (isSleeping || (angerLevel === 0 && angerPercentage === 0)) {
    return null;
  }

  const lvlCfg = ANGER_LEVELS[angerLevel];
  const isFurious = angerLevel === 5;
  const hasTimer = levelLockTimer > 0;

  const getHumorLabel = () => {
    if (angerLevel === 0) {
      if (isSleeping) return 'DORMINDO';
      if (isPositiveHit) return 'FELIZ';
      return 'CALMO';
    }
    return lvlCfg?.label || '???';
  };

  const barColor =
    angerLevel === 5
      ? 'from-red-600 via-rose-500 to-red-600'
      : angerLevel === 4
      ? 'from-red-500 to-orange-500'
      : angerLevel === 3
      ? 'from-orange-500 to-amber-500'
      : angerLevel === 2
      ? 'from-amber-500 to-yellow-400'
      : angerLevel === 1
      ? 'from-yellow-400 to-lime-400'
      : 'from-emerald-400 to-teal-400';

  return (
    <div className="absolute bottom-[-32px] left-1/2 -translate-x-1/2 w-[86px] flex flex-col items-center gap-[3px] z-modal pointer-events-none">
      <span
        className={`text-[7px] font-black tracking-wider uppercase font-mono px-1.5 py-[1.5px] rounded-full leading-none whitespace-nowrap border ${
          isFurious
            ? 'text-red-300 bg-red-950/80 border-red-500/40 animate-pulse'
            : angerLevel >= 3
            ? 'text-orange-300 bg-orange-950/80 border-orange-500/30'
            : 'text-amber-300 bg-amber-950/80 border-amber-500/30'
        }`}
      >
        {getHumorLabel()}
      </span>

      {isFurious ? (
        // Nivel 5: cronometro pulsante vermelho
        <span
          
          
          className="text-[8px] font-black text-red-400 font-mono"
        >
          {levelLockTimer}s
        </span>
      ) : hasTimer ? (
        // Niveis 1-4 com timer de estado ativo
        <div className="flex flex-col items-center gap-[2px] w-full">
          <span className="text-[8px] font-black text-amber-400 font-mono leading-none">{levelLockTimer}s</span>
          {/* Barra de progresso para cliques (retrocede com inatividade) */}
          <div className="w-full h-1 bg-slate-950/85 border border-white/10 rounded-full overflow-hidden p-[0.5px] shadow-lg flex items-center">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
              
              
            />
          </div>
        </div>
      ) : (
        // Barra de progresso padrão
        <div className="w-full h-1.5 bg-slate-950/85 border border-white/10 rounded-full overflow-hidden p-[0.5px] shadow-lg flex items-center">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
            
            
          />
        </div>
      )}
    </div>
  );
}
