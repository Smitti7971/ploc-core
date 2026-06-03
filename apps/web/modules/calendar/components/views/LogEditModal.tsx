import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Clock, AlignLeft, Hash } from 'lucide-react';
import { TrackerLog, useTrackerStore } from '@/modules/dashboard/components/tracker/store/trackerStore';

interface LogEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: TrackerLog | null;
}

export function LogEditModal({ isOpen, onClose, log }: LogEditModalProps) {
  const [info, setInfo] = useState('');
  const [value, setValue] = useState('');
  const [time, setTime] = useState('');

  const { updateLog } = useTrackerStore();

  useEffect(() => {
    if (log && isOpen) {
      setInfo(log.info || '');
      setValue(log.value ? log.value.toString() : '');
      const date = new Date(log.timestamp);
      setTime(date.toTimeString().substring(0, 5));
    }
  }, [log, isOpen]);

  if (!isOpen || !log) return null;

  const handleSave = () => {
    const updates: Partial<TrackerLog> = {
      info: info,
    };
    
    if (value.trim()) {
      updates.value = parseFloat(value);
    } else {
      updates.value = undefined;
    }

    if (time) {
      const [hours, minutes] = time.split(':').map(Number);
      const newDate = new Date(log.timestamp);
      newDate.setHours(hours, minutes, 0, 0);
      updates.timestamp = newDate.getTime();
    }

    updateLog(log.id, updates);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1a1c23] w-full max-w-sm rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center p-5 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">Editar Registro</h2>
              <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="log-time" className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
                  <Clock size={14} /> Horário
                </label>
                <input
                  id="log-time"
                  name="time"
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500/50 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="log-info" className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
                  <AlignLeft size={14} /> Informação / Nota
                </label>
                <input
                  id="log-info"
                  name="info"
                  type="text"
                  value={info}
                  onChange={e => setInfo(e.target.value)}
                  placeholder="Ex: Dose extra, dor de cabeça..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-sky-500/50 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="log-value" className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
                  <Hash size={14} /> Valor (Opcional)
                </label>
                <input
                  id="log-value"
                  name="value"
                  type="number"
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  placeholder="Ex: 1, 200..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-sky-500/50 transition-colors"
                />
              </div>

              <button
                onClick={handleSave}
                className="mt-2 w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Salvar Alterações
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
