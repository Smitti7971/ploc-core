import { AppShell } from '@/components/layout/AppShell';

export default function Page() {
  return (
    <AppShell>
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '100%', gap: '1rem', fontFamily: "'Inter', sans-serif",
      }}>
        <i className="icon-setting-2" style={{ fontSize: '3rem', color: '#94a3b8' }} />
        <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 900, letterSpacing: '2px', margin: 0 }}>
          CONFIG
        </h1>
        <p style={{ color: '#475569', fontSize: '0.85rem', margin: 0 }}>
          Em construção — migração em andamento.
        </p>
      </div>
    </AppShell>
  );
}
