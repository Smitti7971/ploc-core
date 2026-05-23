/**
 * @module BlackboardStickyNote
 * @description Componente visual que representa um "Post-it" (nota adesiva) no Blackboard.
 * Permite arrastar, alterar a cor de fundo, editar conteúdo e remover a nota.
 */
import React, { memo, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export const BlackboardStickyNote = memo(({ 
  note, 
  onDelete, 
  onContentChange, 
  onColorCycle, 
  onPositionChange, 
  onSave 
}: {
  note: { id: number; x: number; y: number; content: string; colorClass: string };
  onDelete: () => void;
  onContentChange: (content: string) => void;
  onColorCycle: () => void;
  onPositionChange: (x: number, y: number) => void;
  onSave: () => void;
}) => {
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.note-btn')) return;
    setDragging(true);
    setOffset({ x: e.clientX - note.x, y: e.clientY - note.y });
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging) return;
    onPositionChange(e.clientX - offset.x, e.clientY - offset.y);
  }, [dragging, offset, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    if (dragging) { setDragging(false); onSave(); }
  }, [dragging, onSave]);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp]);

  const colorMap: Record<string, string> = {
    '': '#fef3c7', // Amarelo clássico
    'note-blue': '#dbeafe',
    'note-green': '#dcfce7',
    'note-pink': '#fce7f3',
    'note-purple': '#f3e8ff',
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, rotate: (note.id % 4) - 2 }}
      style={{
        position: 'absolute',
        left: `${note.x}px`,
        top: `${note.y}px`,
        pointerEvents: 'all',
        zIndex: dragging ? 1000 : 1,
        background: colorMap[note.colorClass] || '#fef3c7',
        borderRadius: '2px', // Mais quadrado como post-it
        padding: '12px',
        minWidth: '220px',
        boxShadow: dragging ? '0 20px 40px rgba(0,0,0,0.5)' : '2px 5px 15px rgba(0,0,0,0.3)',
        transition: 'box-shadow 0.2s ease',
        transform: `rotate(${(note.id % 4) - 2}deg)`
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        style={{ cursor: 'grab', display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '8px' }}
      >
        <button className="note-btn" onClick={onColorCycle} style={{ background: 'none', border: 'none', cursor: 'pointer', filter: 'grayscale(1)' }}>🎨</button>
        <button className="note-btn" onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>✕</button>
      </div>
      <textarea
        defaultValue={note.content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Escreva algo..."
        style={{
          width: '100%',
          minHeight: '120px',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: '#1a1c1a',
          fontSize: '1rem',
          lineHeight: '1.4',
          resize: 'both',
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500
        }}
      />
      {/* ── Detalhe de "Fita Adesiva" ────────────────── */}
      <div style={{
        position: 'absolute',
        top: '-15px',
        left: '50%',
        transform: 'translateX(-50%) rotate(-1deg)',
        width: '60px',
        height: '25px',
        background: 'rgba(255,255,255,0.4)',
        backdropFilter: 'blur(2px)',
        zIndex: -1
      }} />
    </motion.div>
  );
});

BlackboardStickyNote.displayName = 'BlackboardStickyNote';
