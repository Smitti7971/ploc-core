import { AppShell } from '@/components/layout/AppShell';
import { CheckSquare } from 'lucide-react';

export default function Page() {
  return (
    <AppShell>
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '100%', gap: '1rem', fontFamily: "'Inter', sans-serif",
      }}>
        <CheckSquare size={64} color="#4ade80" />
        <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 900, letterSpacing: '2px', margin: 0 }}>
          TAREFAS
        </h1>
        <p style={{ color: '#475569', fontSize: '0.85rem', margin: 0 }}>
          Em construção — migração em andamento.
        </p>
      </div>
    </AppShell>
  );
}
