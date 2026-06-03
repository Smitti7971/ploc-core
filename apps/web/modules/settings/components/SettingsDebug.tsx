import React from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Activity } from 'lucide-react';

export function SettingsDebug() {
  const router = useRouter();

  return (
    <>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '40px', marginBottom: '20px', color: '#f8fafc' }}>
        Avançado / Debug
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button 
          onClick={() => router.push('/lab')}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}
        >
          <Sparkles size={16} /> Acessar Laboratório (Testes de GPU)
        </button>
        
        <button 
          onClick={() => {
            const current = localStorage.getItem('debug_fps') === 'true';
            localStorage.setItem('debug_fps', current ? 'false' : 'true');
            window.dispatchEvent(new Event('fps_toggled'));
          }}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}
        >
          <Activity size={16} /> Ligar/Desligar Medidor de FPS
        </button>
      </div>
    </>
  );
}
