'use client';

/**
 * AppShell.tsx — Layout das páginas protegidas
 * Provê: fundo padrão, DockMenu, e área de conteúdo segura.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { DockMenu } from './DockMenu';
import { PlocAvatarClient } from '@/components/mascot/PlocAvatarClient';
import { UserHeader } from './UserHeader';
import { usePathname } from 'next/navigation';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const isSettings = pathname === '/settings';
  const isPlocPage = pathname === '/ploc';

  // Client-side auth guard (backup do middleware)
  useEffect(() => {
    const token = localStorage.getItem('ploc_token');
    if (!token && !isAuthenticated) {
      router.replace('/');
    } else if (isAuthenticated) {
      // Garante que o cookie existe para o Middleware
      document.cookie = `ploc-auth=true; path=/; max-age=${60 * 60 * 24 * 7}`;
    }
  }, [isAuthenticated, router]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        background: '#020617',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      }}
    >
      {/* Conteúdo da página */}
      <main
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {children}
      </main>

      {/* Menu de navegação global */}
      <DockMenu />

      {/* Header do Usuário (Cápsula Camaleão) - Oculto em settings ou ploc para evitar duplicidade */}
      {!isSettings && !isPlocPage && (
        <div style={{ position: 'fixed', top: '30px', right: '30px', zIndex: 100000, pointerEvents: 'none' }}>
          <UserHeader />
        </div>
      )}

      {/* Mascote Ploc com posicionamento inteligente - Oculto na página dedicada do Ploc */}
      {!isPlocPage && (
        <div style={{
          position: 'fixed',
          top: pathname === '/' ? '50%' : 'auto',
          left: pathname === '/' ? '50%' : 'auto',
          bottom: pathname === '/' ? 'auto' : '110px',
          right: pathname === '/' ? 'auto' : '30px',
          transform: pathname === '/' ? 'translate(-50%, -50%)' : 'none',
          zIndex: 1000,
          pointerEvents: 'none'
        }}>
          <div style={{ pointerEvents: 'all' }}>
            <PlocAvatarClient />
          </div>
        </div>
      )}
    </div>
  );
}
