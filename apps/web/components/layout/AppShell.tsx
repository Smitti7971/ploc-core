'use client';

/**
 * AppShell.tsx — Layout das páginas protegidas
 * Provê: fundo padrão, DockMenu, e área de conteúdo segura.
 */

// Bloco de imports – traz dependências e hooks
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { PlocAvatarClient } from '@/components/mascot/PlocAvatarClient';
import { usePathname } from 'next/navigation';
import { DockMenu } from './DockMenu';

// Define as props esperadas pelo AppShell
interface AppShellProps {
  children: React.ReactNode;
}

// Componente principal que envolve a aplicação protegida
export function AppShell({ children }: AppShellProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const isSettings = pathname === '/settings';
  const isPlocPage = pathname === '/ploc';

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });
    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }
    return () => unsub();
  }, []);

  // Client-side auth guard (Redirecionamento para rota protegida se deslogado)
  useEffect(() => {
    if (!isHydrated) return;
    const token = localStorage.getItem('ploc_token');
    const authDataStr = localStorage.getItem('ploc-auth');
    let hasPersistedAuth = false;
    if (authDataStr) {
      try {
        const authData = JSON.parse(authDataStr);
        if (authData.state?.isAuthenticated) hasPersistedAuth = true;
      } catch (e) {}
    }
    
    if (!token && !isAuthenticated && !hasPersistedAuth) {
      router.replace('/');
    }
  }, [isHydrated, isAuthenticated, router]);

  // Renderiza a estrutura de layout da página
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
      {/* Área onde o conteúdo da página será inserido */}
      <main
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {children}
      </main>

      {/* Menu de navegação global (Dock) */}
      <DockMenu />

      {/* Header do Usuário movido para AuthCapsule (Global) */}

      {/* Mascote Ploc com posicionamento inteligente - Oculto na página dedicada do Ploc */}
      {/* Avatar do Ploc, posicionado dinamicamente */}
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
