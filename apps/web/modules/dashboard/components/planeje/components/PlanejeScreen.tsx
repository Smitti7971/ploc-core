'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar as CalendarIcon, MoreVertical } from 'lucide-react';

export function PlanejeScreen() {
  const [calendars, setCalendars] = useState([
    { id: '1', name: 'Trabalho', color: '#3b82f6' }, // blue-500
    { id: '2', name: 'Pessoal', color: '#10b981' }   // emerald-500
  ]);

  return (
    <div className="flex-1 min-h-0 w-full px-4 overflow-y-auto pb-24 scrollbar-hide">
      {/* Header local (além do que o dashboard já tem) */}
      <div className="mb-6 mt-2 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white mb-2 tracking-widest uppercase">Planeje</h2>
          <p className="text-slate-400 text-sm font-medium">Seus calendários e planejamentos</p>
        </div>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors shadow-lg"
          title="Novo Calendário"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {calendars.map(cal => (
          <motion.div
            key={cal.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full border rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-colors shadow-lg bg-[#0f1115] border-white/5 hover:bg-white/5"
          >
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              style={{ backgroundColor: `${cal.color}20`, border: `1px solid ${cal.color}40` }}
            >
              <CalendarIcon size={24} color={cal.color} />
            </div>
            
            <div className="flex-1">
              <h3 className="text-white text-sm font-extrabold tracking-widest mb-1">
                {cal.name.toUpperCase()}
              </h3>
              <p className="text-slate-400 text-xs">0 eventos programados</p>
            </div>

            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-colors">
              <MoreVertical size={16} />
            </div>
          </motion.div>
        ))}

        {calendars.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <CalendarIcon size={32} className="text-white/30" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Nenhum calendário</h2>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mb-6">Você ainda não tem nenhum calendário criado. Comece a organizar sua rotina e seus projetos.</p>
            <button className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold transition-colors flex items-center gap-2">
              <Plus size={20} />
              Criar Calendário
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
