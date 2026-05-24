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
  // Defaulting to Sunday as first day of the week
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
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
export const getSurroundingDays = (centerDate: Date, range: number = 3) => {
  const days = [];
  for (let i = -range; i <= range; i++) {
    const d = new Date(centerDate);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    days.push({
      dateObj: d,
      dateStr: toISODate(d),
      dayName: getLocalizedDayName(d),
      dateNum: d.getDate(),
      isToday: d.toDateString() === new Date().toDateString()
    });
  }
  return days;
};

export const getMonthDays = (baseDate: Date) => {
  const month = [];
  const startOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const endOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);

  // Pad start with previous month days to align to Sunday
  const startPadding = startOfMonth.getDay();
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
  const endPadding = 6 - endOfMonth.getDay();
  for (let i = 1; i <= endPadding; i++) {
    const d = new Date(endOfMonth);
    d.setDate(endOfMonth.getDate() + i);
    month.push({ dateObj: d, dateStr: toISODate(d), isCurrentMonth: false, isToday: d.toDateString() === new Date().toDateString() });
  }

  return month;
};
