import { useMemo, useEffect } from 'react';
import { useViceStore } from '../../dashboard/components/libertesse/store/viceStore';
import { useCalendarStore, CalendarTask } from '../store/calendarStore';
import { toISODate } from '../utils/dateUtils';

const LOG_META: Record<string, { title: string, category: string, color: string }> = {
  start: { title: 'Iniciou Controle', category: 'Libertesse', color: 'text-emerald-400' },
  end: { title: 'Parou Controle', category: 'Libertesse', color: 'text-slate-400' },
  consumption: { title: 'Consumo', category: 'Libertesse', color: 'text-rose-400' },
  expense: { title: 'Gasto', category: 'Libertesse', color: 'text-amber-400' },
};

const VICES_MAP: Record<string, string> = {
  tabagismo: 'TABAGISMO',
  alcoolismo: 'ALCOOLISMO',
  drogas: 'DROGAS',
  pornografia: 'PORNOGRAFIA',
  personalizado: 'PERSONALIZADO'
};

export const useCalendarData = () => {
  const { logs, activeVices, fetchVices } = useViceStore();
  const { tasks, fetchTasks, addTask, updateTask, deleteTask, moveTaskToDate } = useCalendarStore();

  // Load data if not loaded
  useEffect(() => {
    fetchVices();
    fetchTasks();
  }, [fetchVices, fetchTasks]);

  const allEvents = useMemo(() => {
    const events: CalendarTask[] = [];

    // 1. Mapear Logs Históricos do Libertesse (Não arrastáveis)
    logs.forEach(log => {
      const meta = LOG_META[log.type] || { title: 'Evento', category: 'Libertesse', color: 'text-white' };
      const d = new Date(log.timestamp);
      
      const customName = activeVices[log.viceId]?.customName;
      const viceName = log.viceId === 'personalizado' && customName 
        ? customName 
        : VICES_MAP[log.viceId] || 'LIBERTESSE';

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
        title: `[${viceName}] ${meta.title}`,
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
    Object.values(activeVices).forEach(activeVice => {
      const viceName = activeVice.viceId === 'personalizado' && activeVice.customName
        ? activeVice.customName
        : VICES_MAP[activeVice.viceId] || 'LIBERTESSE';
        
      if (activeVice.isConsuming && activeVice.consumptionStartTime) {
        const now = new Date();

        events.push({
          id: `active_consumption_${activeVice.viceId}`,
          title: `[${viceName}] Consumindo Agora`,
          description: activeVice.currentMotivator ? `Motivo: ${activeVice.currentMotivator}` : 'Cronômetro rodando...',
          dateStr: toISODate(now),
          timeStr: 'Agora',
          color: 'text-sky-400',
          isDraggable: false,
          status: 'active',
          category: 'Libertesse'
        });
      } else {
        // Evento genérico para indicar que o vício está sendo monitorado hoje
        const today = new Date();
        events.push({
          id: `tracking_${activeVice.viceId}_${toISODate(today)}`,
          title: `[${viceName}] Monitoramento Ativo`,
          description: activeVice.mode === 'diminua' ? 'Desafio de redução em andamento' : 'Acompanhamento de uso',
          dateStr: toISODate(today),
          timeStr: new Date(activeVice.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          color: 'text-emerald-400/70',
          isDraggable: false,
          status: 'pending',
          category: 'Libertesse'
        });
      }
    });

    return events;
  }, [logs, activeVices, tasks]);

  const getEventsByDate = (dateStr: string) => {
    return allEvents.filter(e => e.dateStr === dateStr).sort((a, b) => {
      // Ordena 'active' primeiro, depois por tempo decrescente (mais recente no topo)
      if (a.status === 'active') return -1;
      if (b.status === 'active') return 1;
      const timeA = a.timeStr || '00:00';
      const timeB = b.timeStr || '00:00';
      return timeB.localeCompare(timeA);
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
