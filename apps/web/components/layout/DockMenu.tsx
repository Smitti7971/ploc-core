'use client';

/**
 * DockMenu.tsx — Menu de Navegação Global
 * Design atualizado: Barra fixa de 100% de largura na base, apenas visível no Blackboard.
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
  { icon: <Calendar size={20} />, route: '/calendar', color: '#eab308', label: 'Calendário' }, // yellow-500
  { icon: <GalleryHorizontal size={20} />, route: '/dashboard', color: '#10b981', label: 'Rotinas' }, // emerald-500
  { icon: <Radar size={20} />, route: '/', color: '#a855f7', label: 'Blackboard' }, // purple-500
  { icon: <Ghost size={20} />, route: '/ploc', color: '#f43f5e', label: 'Ploc' }, // rose-500
  { icon: <Settings size={20} />, route: '/settings', color: '#94a3b8', label: 'Config' }, // slate-400
];

import { useState, useEffect, useRef } from 'react';

// Componente principal do Menu Inferior Flutuante
export function DockMenu() {
  const pathname = usePathname(); // Resgata a rota atual da URL para acender ícone ativo
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Na Blackboard (rota '/'), a navbar nunca deve sumir
    if (pathname === '/') {
      setIsVisible(true);
      return;
    }

    const handleScroll = (e: Event) => {
      let currentScrollY = window.scrollY;
      
      const target = e.target as HTMLElement;
      if (target && target.tagName && target.tagName !== 'HTML' && target.tagName !== 'BODY' && target !== document as any) {
        // Ignorar eventos de scroll de elementos pequenos (ex: popups, dropdowns, AuthCapsule)
        if (target.clientHeight < window.innerHeight * 0.5) return;
        currentScrollY = target.scrollTop;
      }
      
      // Ignorar scrolls muito curtos ou no topo da página
      if (currentScrollY < 10) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }
      
      if (currentScrollY > lastScrollY.current + 5) {
        // Rolando para baixo -> Esconder
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current - 5) {
        // Rolando para cima -> Mostrar
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [pathname]);

  // Retorna a barra de navegação glassmorphism fixada na base da tela
  return (
    <div
      id="global-dock-menu"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 'var(--z-index-dock)',
        pointerEvents: 'none',
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        className="ploc-bottom-nav"
        style={{
          pointerEvents: 'auto',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '12px 16px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%',
            maxWidth: '400px',
            gap: '8px',
          }}
        >
          {DOCK_ITEMS.map((item) => {
            const isActive = item.route === '/' 
              ? pathname === '/' 
              : (pathname === item.route || pathname.startsWith(item.route + '/'));
              
            return (
              <Link
                key={item.route}
                href={item.route}
                title={item.label}
                style={{ textDecoration: 'none' }}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('dock-menu-clicked'));
                  }
                }}
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
                    color: isActive ? item.color : 'rgba(255, 255, 255, 0.4)',
                    background: isActive
                      ? `${item.color}20`
                      : `rgba(255, 255, 255, 0.03)`,
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
