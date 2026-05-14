'use client';

/**
 * LandingPage.tsx — Página principal do Ploc
 * Design preservado: canvas scrollável 250vw, sticky notes, cápsula camaleão.
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/modules/auth/services/authService';
import { AuthModal } from '@/modules/auth/components/AuthModal';
import type { AuthModalType } from '@/modules/auth/types/auth.types';

interface StickyNote {
  id: number;
  content: string;
  x: number;
  y: number;
  colorClass: string;
}

const NOTE_COLORS = ['', 'note-blue', 'note-green', 'note-pink', 'note-purple'] as const;

export default function LandingPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [authModal, setAuthModal] = useState<AuthModalType | null>(null);
  const [capsuleOpen, setCapsuleOpen] = useState(false);
  const [notes, setNotes] = useState<StickyNote[]>([]);

  // Health check
  useEffect(() => {
    authService.checkHealth()
      .then(() => setIsOnline(true))
      .catch(() => setIsOnline(false));
  }, []);

  // Load notes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ploc_sticky_notes');
      if (saved) setNotes(JSON.parse(saved));
    } catch {
      setNotes([]);
    }
  }, []);

  const saveNotes = useCallback((updated: StickyNote[]) => {
    setNotes(updated);
    localStorage.setItem('ploc_sticky_notes', JSON.stringify(updated));
  }, []);

  const addNote = () => {
    const newNote: StickyNote = {
      id: Date.now(),
      content: '',
      x: 100 + Math.random() * 50,
      y: 100 + Math.random() * 50,
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

  const handleLogout = () => {
    logout();
    setCapsuleOpen(false);
  };

  const statusColor =
    isOnline === null ? '#94a3b8' : isOnline ? '#22c55e' : '#ef4444';

  return (
    <>
      {/* Viewport wrapper — mobile-safe, sem overflow horizontal no body */}
      <div style={{ width: '100vw', height: '100dvh', overflow: 'hidden', position: 'relative' }}>
        <div
          id="landing-container"
          className="landing-page"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at top right, #1e293b 0%, #020617 100%)',
            zIndex: 1,
            overflowX: 'auto',
            overflowY: 'auto',
            fontFamily: "'Inter', sans-serif",
            /* Canvas interno pode ser 250vw para o efeito de workspace */
          }}
        >
          {/* Canvas interno com largura expandida */}
          <div style={{ minWidth: '250vw', minHeight: '100%', position: 'relative' }}>

            {/* Texture overlay */}
        <div
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundImage: "url('/css/dark-matter.png')",
            opacity: 0.05, pointerEvents: 'none',
          }}
        />

        {/* Sticky Notes Canvas */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9000 }}>
          {notes.map((note) => (
            <StickyNoteEl
              key={note.id}
              note={note}
              onDelete={() => deleteNote(note.id)}
              onContentChange={(c) => updateNoteContent(note.id, c)}
              onColorCycle={() => cycleNoteColor(note.id)}
              onPositionChange={(x, y) => updateNotePosition(note.id, x, y)}
              onSave={() => localStorage.setItem('ploc_sticky_notes', JSON.stringify(notes))}
            />
          ))}
        </div>

        {/* Add Note Button */}
        <button
          onClick={addNote}
          className="add-note-trigger"
          style={{ pointerEvents: 'all' }}
        >
          <i className="icon-edit-2" />
        </button>

        {/* Network Status */}
        <div style={{ position: 'fixed', top: '1.5rem', left: '1.5rem', zIndex: 1000 }}>
          <div
            id="status-dot"
            style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: statusColor, transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: `0 0 15px ${statusColor}4d`,
            }}
          />
        </div>

        {/* User Capsule */}
        <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 1000 }}>
          {isAuthenticated && user ? (
            <div
              id="user-capsule-container"
              onClick={(e) => { e.stopPropagation(); setCapsuleOpen(!capsuleOpen); }}
              style={{
                display: 'flex', alignItems: 'center', padding: '4px', gap: '12px',
                cursor: 'pointer', minWidth: '50px',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(20px)',
                borderRadius: '50px',
              }}
            >
              {/* Avatar */}
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #38bdf8, #1d4ed8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: '0.9rem', color: '#fff',
                flexShrink: 0, overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.1)',
              }}>
                {user.profilePhoto
                  ? <img src={user.profilePhoto} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : (user.username || user.name || 'U').charAt(0).toUpperCase()
                }
              </div>

              {/* Profile info */}
              {!capsuleOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: '12px', transition: 'all 0.4s ease' }}>
                  <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 800, letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {user.username || user.name?.split(' ')[0] || 'USUÁRIO'}
                  </span>
                </div>
              )}

              {/* Actions */}
              {capsuleOpen && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingRight: '4px' }}>
                  <a href="/profile" style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <i className="icon-setting-2" style={{ fontSize: '1.3rem', color: '#38bdf8' }} />
                  </a>
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: '6px 14px', borderRadius: '20px',
                      background: '#ef4444', color: '#fff',
                      fontSize: '0.65rem', fontWeight: 900, letterSpacing: '1.5px',
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                      border: 'none', cursor: 'pointer',
                    }}
                  >
                    SAIR
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setAuthModal('login')}
              style={{
                padding: '10px 24px', color: '#fff',
                fontSize: '0.75rem', fontWeight: 800, letterSpacing: '3px',
                cursor: 'pointer', borderRadius: '50px',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)',
                backdropFilter: 'blur(20px)',
              }}
            >
              ACESSAR
            </button>
          )}
          </div>{/* /User Capsule fixed */}

          </div>{/* /canvas 250vw */}
        </div>{/* /landing-container scrollable */}
      </div>{/* /viewport wrapper */}

      {/* Auth Modal */}
      {authModal && (
        <AuthModal
          initialType={authModal}
          onClose={() => setAuthModal(null)}
        />
      )}
    </>
  );
}

// ── Sticky Note Component ────────────────────────────────────────────────────
interface StickyNoteElProps {
  note: StickyNote;
  onDelete: () => void;
  onContentChange: (content: string) => void;
  onColorCycle: () => void;
  onPositionChange: (x: number, y: number) => void;
  onSave: () => void;
}

function StickyNoteEl({ note, onDelete, onContentChange, onColorCycle, onPositionChange, onSave }: StickyNoteElProps) {
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
    '': '#1e293b',
    'note-blue': '#0c4a6e',
    'note-green': '#14532d',
    'note-pink': '#831843',
    'note-purple': '#4c1d95',
  };

  return (
    <div
      className={`sticky-note ${note.colorClass}`}
      style={{
        position: 'absolute',
        left: `${note.x}px`,
        top: `${note.y}px`,
        pointerEvents: 'all',
        zIndex: dragging ? 1000000 : 1,
        opacity: dragging ? 0.9 : 1,
        background: colorMap[note.colorClass] || '#1e293b',
        borderRadius: '12px',
        padding: '8px',
        minWidth: '180px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      <div
        className="note-header"
        onMouseDown={handleMouseDown}
        style={{ cursor: 'grab', display: 'flex', justifyContent: 'flex-end', gap: '4px', marginBottom: '4px' }}
      >
        <button className="note-btn" onClick={onColorCycle} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>🎨</button>
        <button className="note-btn" onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.8rem' }}>✕</button>
      </div>
      <textarea
        defaultValue={note.content}
        onChange={(e) => onContentChange(e.target.value)}
        style={{
          width: '100%', minHeight: '80px', background: 'transparent',
          border: 'none', outline: 'none', color: '#e2e8f0',
          fontSize: '0.85rem', resize: 'both', fontFamily: "'Inter', sans-serif",
        }}
      />
    </div>
  );
}
