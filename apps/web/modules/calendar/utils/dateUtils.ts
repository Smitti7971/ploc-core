export const getLocalizedDayName = (date: Date, format: 'short' | 'long' = 'short') => {
  return new Intl.DateTimeFormat(undefined, { weekday: format }).format(date);
};

export const getLocalizedMonthName = (date: Date, format: 'short' | 'long' = 'long') => {
  return new Intl.DateTimeFormat(undefined, { month: format }).format(date);
};

export const getLocalizedHeaderDate = (date: Date) => {
  return new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(date);
};

export const toISODate = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const getWeekDays = (baseDate: Date) => {
  const week = [];
  const startOfWeek = new Date(baseDate);
  // Defaulting to Monday as first day of the week
  const day = startOfWeek.getDay();
  const diff = day === 0 ? 6 : day - 1; // if Sunday, go back 6 days. Otherwise, go back (day - 1) days.
  startOfWeek.setDate(startOfWeek.getDate() - diff);
  startOfWeek.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    
    week.push({
      dateObj: d,
      dateStr: toISODate(d),
      dayName: getLocalizedDayName(d),
      dateNum: d.getDate(),
      isToday: d.toDateString() === new Date().toDateString()
    });
  }
  return week;
};

// Nova função para carrossel infinito do Dia
export const getSurroundingDays = (centerDate: Date, pastWeeks: number = 4, futureWeeks: number = 4) => {
  const days = [];
  const startOfWeek = new Date(centerDate);
  const day = startOfWeek.getDay();
  const diff = day === 0 ? 6 : day - 1; // Monday as first day
  startOfWeek.setDate(startOfWeek.getDate() - diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const pastDays = pastWeeks * 7;
  const totalDays = (pastWeeks + 1 + futureWeeks) * 7;

  for (let i = -pastDays; i < totalDays - pastDays; i++) {
    const d = new Date(startOfWeek);
    d.setHours(0, 0, 0, 0);
    d.setDate(startOfWeek.getDate() + i);
    days.push({
      dateObj: d,
      dateStr: toISODate(d),
      dayName: getLocalizedDayName(d),
      dateNum: d.getDate(),
      isToday: d.toDateString() === new Date().toDateString(),
      isMonday: d.getDay() === 1
    });
  }
  return days;
};

export const getMonthDays = (baseDate: Date) => {
  const month = [];
  const startOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const endOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);

  // Pad start with previous month days to align to Monday
  const startDay = startOfMonth.getDay();
  const startPadding = startDay === 0 ? 6 : startDay - 1;
  for (let i = startPadding - 1; i >= 0; i--) {
    const d = new Date(startOfMonth);
    d.setDate(startOfMonth.getDate() - (i + 1));
    month.push({ dateObj: d, dateStr: toISODate(d), isCurrentMonth: false, isToday: d.toDateString() === new Date().toDateString() });
  }

  // Current month days
  for (let i = 1; i <= endOfMonth.getDate(); i++) {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), i);
    month.push({ dateObj: d, dateStr: toISODate(d), isCurrentMonth: true, isToday: d.toDateString() === new Date().toDateString() });
  }

  // Pad end to complete the last week
  const endDay = endOfMonth.getDay();
  const endPadding = endDay === 0 ? 0 : 7 - endDay;
  for (let i = 1; i <= endPadding; i++) {
    const d = new Date(endOfMonth);
    d.setDate(endOfMonth.getDate() + i);
    month.push({ dateObj: d, dateStr: toISODate(d), isCurrentMonth: false, isToday: d.toDateString() === new Date().toDateString() });
  }

  return month;
};
