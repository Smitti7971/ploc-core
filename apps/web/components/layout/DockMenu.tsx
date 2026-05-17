'use client';

/**
 * DockMenu.tsx — Menu de Navegação Global
 * Design preservado: ilha flutuante no bottom, ícones coloridos, item ativo destacado.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare, 
  Sparkles, 
  Heart, 
  User, 
  Settings,
  Presentation
} from 'lucide-react';

interface DockItem {
  icon: React.ReactNode;
  route: string;
  color: string;
  label: string;
}

const DOCK_ITEMS: DockItem[] = [
  { icon: <Presentation size={20} />,    route: '/',           color: '#facc15', label: 'Blackboard' },
  { icon: <Sparkles size={20} />,        route: '/dashboard',  color: '#60a5fa', label: 'Rotinas' },
  { icon: <Settings size={20} />,        route: '/settings',   color: '#94a3b8', label: 'Config' },
];

export function DockMenu() {
  const pathname = usePathname();

  return (
    <div
      id="global-dock-menu"
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999998,
        pointerEvents: 'none',
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
