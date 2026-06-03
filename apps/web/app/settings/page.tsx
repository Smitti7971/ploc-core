'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { SettingsHeader } from '@/modules/settings/components/SettingsHeader';
import { SettingsMenu } from '@/modules/settings/components/SettingsMenu';
import { SettingsDebug } from '@/modules/settings/components/SettingsDebug';

export default function AppSettingsPage() {
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
        <SettingsHeader title="Configurações do App" />

        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
          <SettingsMenu />
          <SettingsDebug />
        </div>
      </div>
    </AppShell>
  );
}
