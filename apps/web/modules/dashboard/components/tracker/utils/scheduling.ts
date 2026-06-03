import { TrackerItem } from '../store/trackerStore';

export type FrequencyConfig = 
  | { type: 'DAILY' }
  | { type: 'WEEKLY'; daysOfWeek: number[] } // 0 = Domingo, 1 = Segunda, ...
  | { type: 'INTERVAL'; days: number }
  | { type: 'MONTHLY'; daysOfMonth: number[] }
  | { type: 'UNKNOWN'; raw: string };

/**
 * Tenta parsear a string de frequência (ex: "DAILY", "WEEKLY:1,3,5") para um objeto estruturado.
 */
export function parseFrequency(freqStr?: string): FrequencyConfig {
  if (!freqStr) return { type: 'DAILY' }; // Padrão se não tiver
  
  const upperFreq = freqStr.toUpperCase().trim();
  
  if (upperFreq === 'DAILY' || upperFreq === 'TODOS OS DIAS') return { type: 'DAILY' };
  
  if (upperFreq.startsWith('WEEKLY:')) {
    const days = upperFreq.split(':')[1].split(',').map(d => parseInt(d.trim(), 10)).filter(n => !isNaN(n));
    if (days.length > 0) return { type: 'WEEKLY', daysOfWeek: days };
  }

  if (upperFreq.startsWith('INTERVAL:')) {
    const days = parseInt(upperFreq.split(':')[1].trim(), 10);
    if (!isNaN(days) && days > 0) return { type: 'INTERVAL', days };
  }

  if (upperFreq.startsWith('MONTHLY:')) {
    const days = upperFreq.split(':')[1].split(',').map(d => parseInt(d.trim(), 10)).filter(n => !isNaN(n));
    if (days.length > 0) return { type: 'MONTHLY', daysOfMonth: days };
  }

  return { type: 'UNKNOWN', raw: freqStr };
}

/**
 * Verifica se uma tarefa está agendada para ser feita em uma data específica.
 */
export function isTaskScheduledForDate(item: TrackerItem, targetDate: Date | number): boolean {
  const dateObj = new Date(targetDate);
  // Zera horas para comparação precisa de dias
  const targetTime = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()).getTime();
  const startTime = new Date(item.startDate);
  const startDayTime = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate()).getTime();

  // Se a tarefa nem começou ainda
  if (targetTime < startDayTime) return false;

  const freqStr = item.config?.expectedFrequency as string | undefined;
  const freq = parseFrequency(freqStr);

  switch (freq.type) {
    case 'DAILY':
      return true;
      
    case 'WEEKLY':
      const dayOfWeek = dateObj.getDay(); // 0-6
      return freq.daysOfWeek.includes(dayOfWeek);
      
    case 'INTERVAL':
      const diffMs = targetTime - startDayTime;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      // Ex: INTERVAL:2 -> diff=0(sim), diff=1(não), diff=2(sim)
      return diffDays % freq.days === 0;

    case 'MONTHLY':
      const dayOfMonth = dateObj.getDate();
      return freq.daysOfMonth.includes(dayOfMonth);

    case 'UNKNOWN':
      // Se não conseguimos interpretar a frequência, por precaução assumimos que sempre cai no dia,
      // para não deixar de avisar o usuário sobre correlações importantes.
      return true;
  }
}

/**
 * Verifica se a tarefa está agendada para hoje, mas o horário específico (expectedTime) ainda não chegou.
 * Se expectedTime for "14:30" e for 12:00, retorna true (é futura).
 * Se expectedTime for vazio ou inválido, retorna false (já está ativa o dia todo).
 */
export function isFutureForToday(item: TrackerItem, targetDate: number | Date): boolean {
  if (!item.config?.expectedTime) return false;

  const targetDateObj = new Date(targetDate);
  const [expectedHours, expectedMinutes] = item.config.expectedTime.split(':').map(Number);
  
  if (isNaN(expectedHours) || isNaN(expectedMinutes)) return false;

  const expectedTimeMs = new Date(
    targetDateObj.getFullYear(),
    targetDateObj.getMonth(),
    targetDateObj.getDate(),
    expectedHours,
    expectedMinutes
  ).getTime();

  return targetDateObj.getTime() < expectedTimeMs;
}
