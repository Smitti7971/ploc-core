'use client';

/**
 * DockMenu.tsx — Menu de Navegação Global
 * Design preservado: ilha flutuante no bottom, ícones coloridos, item ativo destacado.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GalleryHorizontal,
  Ghost,
  Settings,
  Radar,
  Calendar
} from 'lucide-react';

interface DockItem {
  icon: React.ReactNode;
  route: string;
  color: string;
  label: string;
}

// Definição da lista de itens do Dock, contendo ícone, rota de destino, cor tema e rótulo
const DOCK_ITEMS: DockItem[] = [
  { icon: <Calendar size={20} />, route: '/calendar', color: '#ffffffff', label: 'Calendário' },
  { icon: <Radar size={20} />, route: '/', color: '#ffffffff', label: 'Blackboard' },
  { icon: <GalleryHorizontal size={20} />, route: '/dashboard', color: '#ffffffff', label: 'Rotinas' },
  { icon: <Ghost size={20} />, route: '/ploc', color: '#ffffffff', label: 'Ploc' },
  { icon: <Settings size={20} />, route: '/settings', color: '#ffffffff', label: 'Config' },
];

// Componente principal do Menu Inferior Flutuante
export function DockMenu() {
  const pathname = usePathname(); // Resgata a rota atual da URL para acender ícone ativo

  // Retorna a casca da Doc em glassmorphism fixada na base da tela
  return (
    <div
      id="global-dock-menu"
      style={{
        position: 'fixed', // Fixo na tela inteira
        bottom: '20px', // Distância da margem inferior
        left: '50%',
        transform: 'translateX(-50%)', // Centraliza horizontalmente perfeitamente
        zIndex: 999998, // Quase infinito para sempre sobrepor tudo (menos Ploc)
        pointerEvents: 'none', // Não bloqueia clique em áreas invisíveis da dock
      }}
    >
      <div
        className="ploc-dock-island"
        style={{
          pointerEvents: 'auto',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '28px',
          padding: '10px 16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {DOCK_ITEMS.map((item) => {
            const isActive = pathname === item.route || pathname.startsWith(item.route + '/');
            return (
              <Link
                key={item.route}
                href={item.route}
                title={item.label}
                style={{ textDecoration: 'none' }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div
                  className="menu-btn"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color,
                    background: isActive
                      ? `${item.color}20`
                      : `${item.color}08`,
                    border: isActive
                      ? `1px solid ${item.color}44`
                      : `1px solid ${item.color}18`,
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: isActive ? `0 4px 16px ${item.color}30` : 'none',
                    cursor: 'pointer',
                  }}
                >
                  {item.icon}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
