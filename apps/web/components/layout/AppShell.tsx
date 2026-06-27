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
import { useAuth } from '@/modules/auth/hooks/useAuth';

// Define as props esperadas pelo AppShell
interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isAuthenticated } = useAuthStore();
  const { refreshProfile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isSettings = pathname === '/settings';
  const isPlocPage = pathname === '/ploc';
  const isDashboard = pathname === '/dashboard';
  const hidePloc = isPlocPage || isDashboard;

  const [isHydrated, setIsHydrated] = useState(false);
  const [profileSynced, setProfileSynced] = useState(false);

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
    } else if ((hasPersistedAuth || isAuthenticated) && !profileSynced) {
      // Força a atualização do perfil para carregar o inventário do banco
      setProfileSynced(true);
      refreshProfile().catch(console.error);
    }
  }, [isHydrated, isAuthenticated, router, refreshProfile, profileSynced]);

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

      {/* Mascote Ploc com posicionamento inteligente - Oculto na página dedicada do Ploc e Dashboard */}
      {/* Usando Flexbox para posicionar ao invés de bottom/right/transform para evitar bugs de pulo no drag do Framer Motion */}
      {!hidePloc && (
        <div style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: pathname === '/' ? 'center' : 'flex-end',
          alignItems: pathname === '/' ? 'center' : 'flex-end',
          paddingBottom: pathname === '/' ? 0 : '110px',
          paddingRight: pathname === '/' ? 0 : '30px',
          zIndex: 200 /* sticky */,
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
