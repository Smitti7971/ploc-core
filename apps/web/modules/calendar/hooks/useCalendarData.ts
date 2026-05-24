import { useMemo } from 'react';
import { useViceStore } from '../../dashboard/components/libertesse/store/viceStore';
import { useCalendarStore, CalendarTask } from '../store/calendarStore';
import { toISODate } from '../utils/dateUtils';

const LOG_META: Record<string, { title: string, category: string, color: string }> = {
  start: { title: 'Iniciou Controle', category: 'Libertesse', color: 'text-emerald-400' },
  end: { title: 'Parou Controle', category: 'Libertesse', color: 'text-slate-400' },
  consumption: { title: 'Consumo', category: 'Libertesse', color: 'text-rose-400' },
  expense: { title: 'Gasto', category: 'Libertesse', color: 'text-amber-400' },
};

export const useCalendarData = () => {
  const { logs, activeVice } = useViceStore();
  const { tasks, addTask, updateTask, deleteTask, moveTaskToDate } = useCalendarStore();

  const allEvents = useMemo(() => {
    const events: CalendarTask[] = [];

    // 1. Mapear Logs Históricos do Libertesse (Não arrastáveis)
    logs.forEach(log => {
      const meta = LOG_META[log.type] || { title: 'Evento', category: 'Libertesse', color: 'text-white' };
      const d = new Date(log.timestamp);
      
      let description = '';
      if (log.type === 'consumption') {
        description = log.durationSeconds ? `Duração: ${log.durationSeconds}s` : 'Consumo rápido';
        if (log.motivator) description += ` • Motivador: ${log.motivator}`;
      } else if (log.type === 'start') {
        description = 'Cronômetro iniciado';
      } else if (log.type === 'end') {
        description = 'Monitoramento pausado';
      }

      events.push({
        id: `log_${log.id}`,
        title: meta.title,
        description,
        dateStr: toISODate(d),
        timeStr: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        color: meta.color,
        isDraggable: false, // Regra: Histórico não pode ser arrastado
        status: 'completed',
        category: meta.category
      });
    });

    // 2. Mapear Tarefas Customizadas (Arrastáveis)
    tasks.forEach(t => {
      events.push(t);
    });

    // 3. Adicionar Consumo Ativo se houver
    if (activeVice?.isConsuming && activeVice.consumptionStartTime) {
      const now = new Date();
      events.push({
        id: 'active_consumption_now',
        title: 'Consumindo Agora',
        description: activeVice.currentMotivator ? `Motivo: ${activeVice.currentMotivator}` : 'Cronômetro rodando...',
        dateStr: toISODate(now),
        timeStr: 'Agora',
        color: 'text-sky-400',
        isDraggable: false,
        status: 'active',
        category: 'Libertesse'
      });
    }

    return events;
  }, [logs, activeVice, tasks]);

  const getEventsByDate = (dateStr: string) => {
    return allEvents.filter(e => e.dateStr === dateStr).sort((a, b) => {
      // Sort active first, then by time, then by title
      if (a.status === 'active') return -1;
      if (b.status === 'active') return 1;
      const timeA = a.timeStr || '23:59';
      const timeB = b.timeStr || '23:59';
      return timeA.localeCompare(timeB);
    });
  };

  return {
    allEvents,
    getEventsByDate,
    addTask,
    updateTask,
    deleteTask,
    moveTaskToDate
  };
};
