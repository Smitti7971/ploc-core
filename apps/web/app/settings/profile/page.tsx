'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { useAuthStore } from '@/store/authStore';
import { SettingsHeader } from '@/modules/settings/components/SettingsHeader';
import { ProfileSettings } from '@/modules/settings/components/ProfileSettings';

export default function ProfilePage() {
  const { token } = useAuthStore();
  const router = useRouter();
  
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

  useEffect(() => {
    if (isHydrated && !token && typeof window !== 'undefined') {
      router.push('/');
    }
  }, [isHydrated, token, router]);

  return (
    <AppShell>
      <div style={{
        width: '100vw',
        height: '100dvh',
        overflowY: 'auto',
        background: 'radial-gradient(circle at top right, rgba(56, 189, 248, 0.05) 0%, transparent 40%)',
        paddingBottom: '120px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        color: '#fff'
      }}>
        {/* Header Glass */}
        <SettingsHeader title="Perfil do Usuário" />

        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
          <ProfileSettings />
        </div>
      </div>
    </AppShell>
  );
}
