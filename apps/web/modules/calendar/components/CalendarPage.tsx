'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Calendar as CalendarIcon, AlignJustify, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendarData } from '../hooks/useCalendarData';
import { getWeekDays, getSurroundingDays, getLocalizedHeaderDate } from '../utils/dateUtils';
import { DayView } from './views/DayView';
import { WeekView } from './views/WeekView';
import { MonthView } from './views/MonthView';
import { TaskModal } from './views/TaskModal';

type ViewMode = 'day' | 'week' | 'month';

export function CalendarPage() {
  const { allEvents, getEventsByDate, moveTaskToDate } = useCalendarData();
  
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  
  const [baseDate, setBaseDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [selectedDate, setSelectedDate] = useState<Date>(baseDate);
  const selectedDateStr = selectedDate.toISOString().split('T')[0];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDateStr, setModalDateStr] = useState(selectedDateStr);

  const [isCapsuleOpen, setIsCapsuleOpen] = useState(false);

  // Arrays de data baseados no view
  const weekDays = getWeekDays(baseDate);
  const surroundingDays = getSurroundingDays(selectedDate, 3); // -3 a +3 dias

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d);
  };

  const handlePrevWeek = () => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - 7);
    setBaseDate(d);
    setSelectedDate(d);
  };

  const handleNextWeek = () => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + 7);
    setBaseDate(d);
    setSelectedDate(d);
  };

  const handlePrevMonth = () => {
    const d = new Date(baseDate);
    d.setMonth(d.getMonth() - 1);
    setBaseDate(d);
    setSelectedDate(d);
  };

  const handleNextMonth = () => {
    const d = new Date(baseDate);
    d.setMonth(d.getMonth() + 1);
    setBaseDate(d);
    setSelectedDate(d);
  };

  const handleOpenModal = (dateStr: string) => {
    setModalDateStr(dateStr);
    setIsModalOpen(true);
  };

  const handleDayClickFromMonth = (dateObj: Date) => {
    setBaseDate(dateObj);
    setSelectedDate(dateObj);
    setViewMode('day');
  };

  // Icone ativo
  const ActiveIcon = viewMode === 'day' ? AlignJustify : viewMode === 'week' ? LayoutGrid : CalendarIcon;

  return (
    <div className="flex-1 w-full h-full min-h-screen bg-[#0f1115] text-white flex flex-col relative overflow-hidden font-sans">
      
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1c23] to-[#0a0b0e] z-0" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/10 blur-[120px] rounded-full z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full z-0 pointer-events-none" />

      {/* Conteúdo */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 pb-24 scrollbar-hide overflow-x-hidden">
        <div className="w-full max-w-6xl mx-auto pt-16 sm:pt-19">

          {/* Cabeçalho */}
          <div className="flex justify-between items-center mb-6 relative z-20">
            <div>
              <p className="text-sky-400 text-sm font-bold tracking-widest uppercase mb-1">
                {viewMode === 'day' && (selectedDate.toDateString() === new Date().toDateString() ? 'Hoje' : surroundingDays.find(d => d.dateStr === selectedDateStr)?.dayName)}
                {viewMode === 'week' && 'Semana'}
                {viewMode === 'month' && 'Mês'}
              </p>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight capitalize leading-none flex gap-2">
                <span className="text-white">{selectedDate.getDate()}</span>
                <span className="text-sky-400">
                  {selectedDate.toLocaleDateString(undefined, { month: 'long' })}
                </span>
                <span className="text-sky-500/50">
                  {selectedDate.getFullYear()}
                </span>
              </h1>
            </div>

            {/* Chameleon Capsule (Seletor de View) */}
            <motion.div 
              className="flex items-center bg-white/10 border border-white/5 rounded-full overflow-hidden shadow-lg backdrop-blur-md"
              initial={false}
              animate={{ width: isCapsuleOpen ? 'auto' : 44 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            >
              <AnimatePresence mode="wait">
                {!isCapsuleOpen ? (
                  <motion.button
                    key="closed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsCapsuleOpen(true)}
                    className="w-11 h-11 flex items-center justify-center text-sky-400 hover:bg-white/5 transition-colors"
                  >
                    <ActiveIcon size={20} />
                  </motion.button>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex px-1"
                  >
                    <button 
                      onClick={() => { setViewMode('day'); setIsCapsuleOpen(false); }}
                      className={`p-2.5 m-0.5 rounded-full transition-colors ${viewMode === 'day' ? 'bg-sky-500 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                    >
                      <AlignJustify size={18} />
                    </button>
                    <button 
                      onClick={() => { setViewMode('week'); setIsCapsuleOpen(false); }}
                      className={`p-2.5 m-0.5 rounded-full transition-colors ${viewMode === 'week' ? 'bg-sky-500 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                    >
                      <LayoutGrid size={18} />
                    </button>
                    <button 
                      onClick={() => { setViewMode('month'); setIsCapsuleOpen(false); }}
                      className={`p-2.5 m-0.5 rounded-full transition-colors ${viewMode === 'month' ? 'bg-sky-500 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                    >
                      <CalendarIcon size={18} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Seletor Semanal / Carrossel de Dias */}
          {viewMode === 'day' && (
            <div className="flex items-center justify-between mb-6 bg-white/5 rounded-2xl border border-white/5 p-1 relative z-10 w-full overflow-hidden">
              <motion.div className="flex-1 flex justify-around items-center px-1" layout>
                <AnimatePresence mode="popLayout">
                  {surroundingDays.map((d) => {
                    const isActive = d.dateStr === selectedDateStr;
                    return (
                      <motion.div 
                        key={d.dateStr} 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="group flex flex-col items-center gap-1 cursor-pointer py-1 px-2 rounded-xl transition-colors hover:bg-white/5"
                        onClick={() => setSelectedDate(d.dateObj)}
                      >
                        <span className={`text-[10px] uppercase font-bold transition-colors ${isActive ? 'text-sky-400' : 'text-white/30 group-hover:text-white/50'}`}>
                          {d.dayName}
                        </span>
                        <span className={`text-sm font-bold transition-all ${isActive ? 'text-white bg-sky-500 w-6 h-6 rounded-full flex items-center justify-center shadow-lg shadow-sky-500/20' : 'text-white/80 w-6 h-6 flex items-center justify-center rounded-full group-hover:bg-white/10 group-hover:text-white'}`}>
                          {d.dateNum}
                        </span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </div>
          )}

          {viewMode === 'week' && (
            <div className="flex items-center justify-between mb-6 bg-white/5 rounded-2xl border border-white/5 p-1 relative z-10">
              <button onClick={handlePrevWeek} className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                <ChevronLeft size={20} />
              </button>
              <div className="flex-1 flex justify-around items-center px-1">
                {weekDays.map((d) => (
                  <div 
                    key={d.dateStr} 
                    className="group flex flex-col items-center gap-1 py-1 px-2 cursor-pointer hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <span className="text-[10px] uppercase font-bold text-white/30 group-hover:text-white/50 transition-colors">
                      {d.dayName}
                    </span>
                    <span className="text-sm font-bold text-white/80 w-6 h-6 flex items-center justify-center rounded-full group-hover:bg-white/10 group-hover:text-white transition-all">
                      {d.dateNum}
                    </span>
                  </div>
                ))}
              </div>
              <button onClick={handleNextWeek} className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* VIEWS */}
          {viewMode === 'day' && (
            <div className="max-w-2xl mx-auto overflow-hidden">
              <DayView 
                selectedDate={selectedDate} 
                dateStr={selectedDateStr}
                tasks={getEventsByDate(selectedDateStr)} 
                onOpenTaskModal={handleOpenModal}
                onPrevDay={handlePrevDay}
                onNextDay={handleNextDay}
              />
            </div>
          )}

          {viewMode === 'week' && (
            <div className="-mx-4 sm:mx-0">
              <WeekView 
                baseDate={baseDate}
                allEvents={allEvents}
                onMoveTask={moveTaskToDate}
                onOpenTaskModal={handleOpenModal}
              />
            </div>
          )}

          {viewMode === 'month' && (
            <MonthView 
              baseDate={baseDate}
              allEvents={allEvents}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onDayClick={handleDayClickFromMonth}
            />
          )}

        </div>
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultDateStr={modalDateStr} 
      />
    </div>
  );
}
