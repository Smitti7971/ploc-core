'use client';

/**
 * Blackboard.tsx — O novo espaço de trabalho imersivo do Ploc.
 * Design: Quadro negro (chalkboard) com notas adesivas e o Ploc flutuando.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { PlocAvatarClient } from '@/components/mascot/PlocAvatarClient';
import { Settings, LogOut, Maximize2, Minimize2, Grid3X3, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DockMenu } from '@/components/layout/DockMenu';
import { UserHeader } from '@/components/layout/UserHeader';

interface StickyNote {
  id: number;
  content: string;
  x: number;
  y: number;
  colorClass: string;
}

const NOTE_COLORS = ['', 'note-blue', 'note-green', 'note-pink', 'note-purple'] as const;

export default function Blackboard() {
  const { user, logout } = useAuthStore();
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [capsuleOpen, setCapsuleOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [scale, setScale] = useState(1);

  // Load notes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ploc_blackboard_notes');
      if (saved) setNotes(JSON.parse(saved));
    } catch {
      setNotes([]);
    }
  }, []);

  const saveNotes = useCallback((updated: StickyNote[]) => {
    setNotes(updated);
    localStorage.setItem('ploc_blackboard_notes', JSON.stringify(updated));
  }, []);

  const addNote = () => {
    const newNote: StickyNote = {
      id: Date.now(),
      content: '',
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      colorClass: '',
    };
    saveNotes([...notes, newNote]);
  };

  const deleteNote = (id: number) => saveNotes(notes.filter((n) => n.id !== id));

  const updateNoteContent = (id: number, content: string) =>
    saveNotes(notes.map((n) => (n.id === id ? { ...n, content } : n)));

  const cycleNoteColor = (id: number) =>
    saveNotes(
      notes.map((n) => {
        if (n.id !== id) return n;
        const idx = NOTE_COLORS.indexOf(n.colorClass as typeof NOTE_COLORS[number]);
        return { ...n, colorClass: NOTE_COLORS[(idx + 1) % NOTE_COLORS.length] };
      })
    );

  const updateNotePosition = (id: number, x: number, y: number) =>
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, x, y } : n)));

  // Zoom Logic
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        setScale(s => Math.min(Math.max(s + delta, 0.2), 3));
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullScreen(true);
      // Zoom out automático para dar impressão de "abrir a visão"
      setScale(0.5);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullScreen(false);
      // Volta ao zoom padrão
      setScale(1.0);
    }
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100dvh', 
      overflow: 'hidden', 
      position: 'fixed',
      inset: 0,
      background: '#0a0c0a', // Quase preto, tom carvão
      fontFamily: "'Outfit', sans-serif"
    }}>
      {/* ── Textura de Quadro Negro ────────────────── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("https://www.transparenttextures.com/patterns/black-linen.png")`,
        opacity: 0.2,
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* Grade removida daqui para ser colocada dentro do canvas */}
      
      {/* Moldura de Madeira removida para um look ultra-minimalista */}

      {/* ── Canvas de Notas (Scrollable) ────────────────── */}
      <div 
        id="blackboard-canvas"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'auto',
          position: 'relative',
          padding: '40px',
          cursor: 'crosshair',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <motion.div 
          animate={{ scale }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ 
            minWidth: '300vw', 
            minHeight: '300vh', 
            position: 'relative',
            transformOrigin: '0 0' // Zoom a partir do topo-esquerdo para manter consistência com o scroll
          }}
        >
          {/* ── Grade de Orientação (Interna para rolar com as notas) ── */}
          <AnimatePresence>
            {showGrid && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1.5px, transparent 1.5px)',
                  backgroundSize: '40px 40px',
                  pointerEvents: 'none',
                  zIndex: 0
                }}
              />
            )}
          </AnimatePresence>
          
          {/* Welcome Message removido conforme solicitado */}

          {/* Sticky Notes */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
            {notes.map((note) => (
              <StickyNoteEl
                key={note.id}
                note={note}
                onDelete={() => deleteNote(note.id)}
                onContentChange={(c) => updateNoteContent(note.id, c)}
                onColorCycle={() => cycleNoteColor(note.id)}
                onPositionChange={(x, y) => updateNotePosition(note.id, x, y)}
                onSave={() => localStorage.setItem('ploc_blackboard_notes', JSON.stringify(notes))}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Controles Flutuantes ────────────────── */}
      
      {/* Add Note Trigger Minimalista */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={addNote}
        style={{
          position: 'fixed',
          bottom: '120px',
          right: '40px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          cursor: 'pointer',
          zIndex: 100
        }}
      >
        <Plus size={32} strokeWidth={1.5} />
      </motion.button>

      {/* ── Controles Flutuantes (Topo Direito) ────────────────── */}
      <div style={{ 
        position: 'fixed', 
        top: '30px', 
        right: '30px', 
        display: 'flex', 
        alignItems: 'center',
        gap: '12px', 
        zIndex: 100001,
        pointerEvents: 'none'
      }}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => setShowGrid(!showGrid)}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50px',
            background: showGrid ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: showGrid ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255,255,255,0.1)',
            color: showGrid ? '#38bdf8' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            pointerEvents: 'all'
          }}
        >
          <Grid3X3 size={18} />
        </motion.button>

        {/* Indicador de Zoom */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '50px',
          padding: '0 16px',
          height: '44px',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
          fontSize: '0.75rem',
          fontWeight: 900,
          pointerEvents: 'all'
        }}>
          {Math.round(scale * 100)}%
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={toggleFullScreen}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50px',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            pointerEvents: 'all'
          }}
        >
          {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </motion.button>

        {/* Cápsula do Usuário integrada no mesmo flex para empurrar os botões ao expandir */}
        <UserHeader />
      </div>

      {/* ── Menu de Navegação Global (Dock) ────────────────── */}
      <DockMenu />

      {/* ── Mascote Flutuante (CENTRALIZADO no Blackboard) ── */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${isFullScreen ? 0.6 : 1})`,
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 1000,
        pointerEvents: 'none'
      }}>
        <div style={{ pointerEvents: 'all' }}>
          <PlocAvatarClient />
        </div>
      </div>
    </div>
  );
}

function StickyNoteEl({ note, onDelete, onContentChange, onColorCycle, onPositionChange, onSave }: any) {
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
}
