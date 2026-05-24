import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMonthDays, getLocalizedMonthName, getLocalizedDayName } from '../../utils/dateUtils';
import { CalendarTask } from '../../store/calendarStore';

interface MonthViewProps {
  baseDate: Date;
  allEvents: CalendarTask[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDayClick: (dateObj: Date) => void;
}

export function MonthView({ baseDate, allEvents, onPrevMonth, onNextMonth, onDayClick }: MonthViewProps) {
  const monthDays = getMonthDays(baseDate);
  const monthName = getLocalizedMonthName(baseDate, 'long');
  const year = baseDate.getFullYear();

  // Get a dummy week to extract the 7 day names in localized format
  const dummyWeek = getMonthDays(new Date()).slice(0, 7);

  return (
    <div className="bg-[#1a1c23]/80 backdrop-blur-md border border-white/5 rounded-3xl p-4 mt-4 shadow-xl">
      {/* Month Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white capitalize">{monthName} <span className="text-white/40 font-normal">{year}</span></h2>
        <div className="flex gap-1">
          <button onClick={onPrevMonth} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button onClick={onNextMonth} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
        {dummyWeek.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-bold text-white/40 uppercase tracking-wider py-1">
            {getLocalizedDayName(d.dateObj, 'short')}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {monthDays.map((day, idx) => {
          const dayEvents = allEvents.filter(e => e.dateStr === day.dateStr);
          const isToday = day.isToday;

          return (
            <div 
              key={`${day.dateStr}-${idx}`}
              onClick={() => onDayClick(day.dateObj)}
              className={`relative aspect-square p-1 md:p-2 rounded-xl md:rounded-2xl border transition-all cursor-pointer flex flex-col justify-start items-center
                ${day.isCurrentMonth ? 'bg-white/5 hover:bg-white/10 border-white/5' : 'bg-transparent border-transparent opacity-30'}
                ${isToday ? 'border-sky-500/50 bg-sky-500/10' : ''}
              `}
            >
              <span className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full text-xs md:text-sm font-bold mt-0.5
                ${isToday ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' : 'text-white/80'}
              `}>
                {day.dateObj.getDate()}
              </span>
              
              {/* Event indicators (Dots for mobile, text for larger screens) */}
              <div className="flex gap-0.5 mt-auto mb-1 flex-wrap justify-center">
                {dayEvents.slice(0, 3).map(ev => {
                  let dotColor = 'bg-white/50';
                  if (ev.category === 'Libertesse') dotColor = 'bg-rose-400';
                  else if (ev.category === 'Academia') dotColor = 'bg-emerald-400';
                  else if (ev.category === 'Dieta') dotColor = 'bg-lime-400';

                  return (
                    <div key={ev.id} className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                  );
                })}
                {dayEvents.length > 3 && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
