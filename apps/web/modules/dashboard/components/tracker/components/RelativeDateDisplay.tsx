import React, { useState } from 'react';

interface RelativeDateDisplayProps {
  date: Date | string | number;
  className?: string;
}

export function RelativeDateDisplay({ date, className = "" }: RelativeDateDisplayProps) {
  const [showRelative, setShowRelative] = useState(true);

  const getRelativeString = (targetDate: Date) => {
    const now = new Date();
    // Reset times to compare just the dates
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays === -1) return 'Ontem';

    const isFuture = diffDays > 0;
    const absDays = Math.abs(diffDays);

    if (absDays < 7) {
      return isFuture ? `Daqui a ${absDays} dias` : `Há ${absDays} dias`;
    }

    const absWeeks = Math.floor(absDays / 7);
    if (absWeeks < 4) {
      return isFuture ? `Daqui a ${absWeeks} semana${absWeeks > 1 ? 's' : ''}` : `Há ${absWeeks} semana${absWeeks > 1 ? 's' : ''}`;
    }

    const absMonths = Math.floor(absDays / 30);
    if (absMonths < 12) {
      return isFuture ? `Daqui a ${absMonths} mês${absMonths > 1 ? 'es' : ''}` : `Há ${absMonths} mês${absMonths > 1 ? 'es' : ''}`;
    }

    const absYears = Math.floor(absDays / 365);
    return isFuture ? `Daqui a ${absYears} ano${absYears > 1 ? 's' : ''}` : `Há ${absYears} ano${absYears > 1 ? 's' : ''}`;
  };

  const parsedDate = new Date(date);
  const exactString = parsedDate.toLocaleDateString('pt-BR');
  const displayString = showRelative ? getRelativeString(parsedDate) : exactString;

  return (
    <span 
      className={`cursor-pointer hover:opacity-80 transition-opacity ${className}`}
      onClick={(e) => {
        e.stopPropagation(); // Prevent triggering parent clicks
        setShowRelative(!showRelative);
      }}
      title={showRelative ? exactString : 'Clique para ver data relativa'}
    >
      {displayString}
    </span>
  );
}
