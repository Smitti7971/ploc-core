'use client';

/**
 * AppShell.tsx — Layout das páginas protegidas
 * Provê: fundo padrão, DockMenu, e área de conteúdo segura.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { DockMenu } from './DockMenu';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Client-side auth guard (backup do middleware)
  useEffect(() => {
    const token = localStorage.getItem('ploc_token');
    if (!token && !isAuthenticated) {
      router.replace('/');
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
    </div>
  );
}
