import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Trash2, X } from 'lucide-react';

export type ConfirmActionStyle = 'danger' | 'success' | 'warning';

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  actionStyle?: ConfirmActionStyle;
}

export function ConfirmActionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  actionStyle = "danger"
}: ConfirmActionModalProps) {
  const styleConfig = {
    danger: {
      icon: <Trash2 size={16} className="text-rose-400" />,
      buttonBg: "bg-rose-500 hover:bg-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
    },
    success: {
      icon: <CheckCircle size={16} className="text-emerald-400" />,
      buttonBg: "bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
    },
    warning: {
      icon: <AlertTriangle size={16} className="text-amber-400" />,
      buttonBg: "bg-amber-500 hover:bg-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
    }
  };

  const { icon, buttonBg } = styleConfig[actionStyle];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-popover bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              {icon}
              {title}
            </h3>
            <button onClick={onClose} className="p-1 rounded-full text-white/50 hover:bg-white/10 transition-colors">
              <X size={16} />
            </button>
          </div>
          
          <div className="p-5 flex flex-col gap-6">
            <p className="text-sm text-white/70 text-center leading-relaxed">
              {description}
            </p>
            
            <div className="flex gap-3 w-full">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 py-3 text-white text-sm font-bold rounded-xl transition-colors ${buttonBg}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
