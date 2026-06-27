import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrackerComparisonProps {
  item: any;
  logs: any[];
}

export function TrackerComparison({ item, logs }: TrackerComparisonProps) {
  const stats = useMemo(() => {
    const hasConditions = item.config?.conditions && item.config.conditions.length > 0;
    
    const sortedLogs = [...logs]
      .filter(l => l.type === 'consumption' || l.type === 'milestone')
      .sort((a, b) => b.timestamp - a.timestamp);

    const logsByDay: Record<string, any[]> = {};
    sortedLogs.forEach(log => {
      const day = new Date(log.timestamp).toISOString().split('T')[0];
      if (!logsByDay[day]) logsByDay[day] = [];
      logsByDay[day].push(log);
    });

    const loops = item.config?.dailyLoops ?? 1;
    const targetLoops = loops === 'infinite' ? 1 : (typeof loops === 'number' ? loops : 1);

    const checkDayCompleted = (dayStr: string) => {
      const dayLogs = logsByDay[dayStr] || [];
      let validLogs = dayLogs;
      if (hasConditions) {
        validLogs = dayLogs.filter(l => l.metadata?.allConditionsMet === true);
      }
      return validLogs.length >= targetLoops;
    };

    const getDayLogsCount = (dayStr: string) => {
      const dayLogs = logsByDay[dayStr] || [];
      let validLogs = dayLogs;
      if (hasConditions) {
        validLogs = dayLogs.filter(l => l.metadata?.allConditionsMet === true);
      }
      return validLogs.length;
    };

    let currentStreak = 0;
    const now = new Date();
    
    for (let i = 0; i < 365; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      
      const completed = checkDayCompleted(dStr);
      
      if (i === 0) {
        // Se for hoje, e não está completo, não quebra o streak do passado ainda
        if (completed) currentStreak++;
      } else {
        if (completed) {
          currentStreak++;
        } else {
          break; // Streak quebrou
        }
      }
    }

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      last7Days.push({
        date: dStr,
        completed: checkDayCompleted(dStr),
        isToday: i === 0,
        dayName: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
      });
    }

    const todayStr = new Date(now).toISOString().split('T')[0];
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

    return {
      streak: currentStreak,
      last7Days,
      todayCount: getDayLogsCount(todayStr),
      yesterdayCount: getDayLogsCount(yesterdayStr)
    };
  }, [item, logs]);

  const isVice = item.type === 'vice';
  // Vícios (Libertesse) operam na lógica de evitar, mas para simplificar, 
  // caso o usuário queira tracking inverso podemos estilizar diferente no futuro.
  const isRedMode = isVice; 

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 sm:gap-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-3 w-full"
    >
      {/* Streak */}
      <div className="flex items-center gap-2 pr-3 sm:pr-4 border-r border-white/10">
        <Flame size={16} className={stats.streak > 0 ? "text-orange-500" : "text-white/30"} />
        <div className="flex flex-col">
          <span className="text-sm font-black text-white leading-none">{stats.streak}</span>
          <span className="text-[8px] font-bold text-white/50 uppercase tracking-wider mt-0.5">Ofensiva</span>
        </div>
      </div>

      {/* Volume (Today) */}
      <div className="flex items-center gap-2 pr-3 sm:pr-4 border-r border-white/10">
        {stats.todayCount > stats.yesterdayCount ? (
          <TrendingUp size={16} className="text-emerald-500" />
        ) : stats.todayCount < stats.yesterdayCount ? (
          <TrendingDown size={16} className="text-rose-500" />
        ) : (
          <Minus size={16} className="text-white/30" />
        )}
        <div className="flex flex-col">
          <span className="text-sm font-black text-white leading-none">{stats.todayCount}</span>
          <span className="text-[8px] font-bold text-white/50 uppercase tracking-wider mt-0.5">Hoje</span>
        </div>
      </div>

      {/* 7 Days Minimal */}
      <div className="flex-1 flex items-center justify-between pl-1">
        {stats.last7Days.map((day, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1.5 relative">
            <span className={`text-[7px] font-bold uppercase tracking-widest ${day.isToday ? 'text-white' : 'text-white/30'}`}>
              {day.dayName.substring(0, 1)}
            </span>
            <div 
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                day.completed 
                  ? isRedMode ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
                  : 'bg-white/10 border border-white/5'
              }`}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
