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
      className="flex flex-col gap-3 mb-6 mt-2"
    >
      <div className="grid grid-cols-2 gap-3">
        {/* Streak Card */}
        <div className="bg-black/40 border border-white/5 rounded-[20px] p-4 flex flex-col justify-between overflow-hidden relative">
          <div className="flex items-center gap-2 mb-3">
            <Flame size={14} className={stats.streak > 0 ? "text-orange-500" : "text-white/30"} />
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/50">Ofensiva</span>
          </div>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-black text-white leading-none">{stats.streak}</span>
            <span className="text-[10px] text-white/40 mb-1 font-medium">dias</span>
          </div>
          {stats.streak > 0 && (
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-orange-500/10 blur-xl rounded-full" />
          )}
        </div>

        {/* Ontem vs Hoje Card */}
        <div className="bg-black/40 border border-white/5 rounded-[20px] p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            {stats.todayCount > stats.yesterdayCount ? (
              <TrendingUp size={14} className="text-emerald-500" />
            ) : stats.todayCount < stats.yesterdayCount ? (
              <TrendingDown size={14} className="text-rose-500" />
            ) : (
              <Minus size={14} className="text-white/30" />
            )}
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/50">Volume</span>
          </div>
          <div className="flex items-center justify-between mt-1">
             <div className="flex flex-col">
               <span className="text-2xl font-bold text-white leading-none">{stats.todayCount}</span>
               <span className="text-[9px] text-white/30 uppercase tracking-wider mt-1">Hoje</span>
             </div>
             <div className="h-6 w-[1px] bg-white/10" />
             <div className="flex flex-col items-end">
               <span className="text-xl font-bold text-white/50 leading-none">{stats.yesterdayCount}</span>
               <span className="text-[9px] text-white/30 uppercase tracking-wider mt-1">Ontem</span>
             </div>
          </div>
        </div>
      </div>

      {/* 7 Days Calendar */}
      <div className="bg-black/40 border border-white/5 rounded-[20px] p-4 flex flex-col gap-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
           <span className="text-[10px] font-bold tracking-widest uppercase text-white/50">Últimos 7 dias</span>
        </div>
        <div className="flex items-center justify-between px-1">
          {stats.last7Days.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 z-10">
              <span className={`text-[9px] font-bold uppercase tracking-wider ${day.isToday ? 'text-white' : 'text-white/30'}`}>
                {day.dayName.substring(0,3)}
              </span>
              <div 
                className={`w-3 h-3 rounded-full transition-all ${
                  day.completed 
                    ? isRedMode ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' 
                    : 'bg-white/5 border border-white/10'
                }`}
              />
            </div>
          ))}
        </div>
        {stats.last7Days.some(d => d.completed) && (
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 blur-2xl rounded-full ${isRedMode ? 'bg-red-500' : 'bg-emerald-500'}`} />
        )}
      </div>
    </motion.div>
  );
}
