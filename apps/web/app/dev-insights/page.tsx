import { AppShell } from '@/components/layout/AppShell';

export default function Page() {
  return (
    <AppShell>
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '100%', gap: '1rem', fontFamily: "'Inter', sans-serif",
      }}>
        <i className="icon-chart-square" style={{ fontSize: '3rem', color: '#f59e0b' }} />
        <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 900, letterSpacing: '2px', margin: 0 }}>
          DEV INSIGHTS
        </h1>
        <p style={{ color: '#475569', fontSize: '0.85rem', margin: 0 }}>
          Em construção — migração em andamento.
        </p>
      </div>
    </AppShell>
  );
}
