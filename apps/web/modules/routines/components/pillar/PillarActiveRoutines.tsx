import React from 'react';
import { Zap, Dumbbell } from 'lucide-react';
import { useFitnessProfileStore } from '../../../dashboard/components/tracker/store/useFitnessProfileStore';

interface PillarActiveRoutinesProps {
  pillarId: string;
  activeVicesList: any[];
}

export function PillarActiveRoutines({ pillarId, activeVicesList }: PillarActiveRoutinesProps) {
  const currentWorkoutPlan = useFitnessProfileStore(state => state.currentWorkoutPlan);

  return (
    <div style={{ zIndex: 0 /* base */ /* base */, paddingBottom: '2rem' }}>
      <h3 style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px', marginBottom: '1rem', opacity: 0.5 }}>
        ROTINAS ATIVAS
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {pillarId === 'corpo' && currentWorkoutPlan ? (
          <div
            style={{
              padding: '1.25rem',
              background: 'rgba(239,68,68,0.05)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(239,68,68,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ef4444'
                }}
              >
                <Dumbbell size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      fontSize: '0.6rem',
                      fontWeight: 900,
                      letterSpacing: '1px',
                      color: '#ef4444',
                      textTransform: 'uppercase'
                    }}
                  >
                    TREINO ATIVO
                  </span>
                </div>
                <h4 style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 800, margin: '2px 0 0 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {currentWorkoutPlan.name}
                </h4>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'block', fontSize: '0.6rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Progresso
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ef4444' }}>
                Ativo
              </span>
            </div>
          </div>
        ) : pillarId === 'liberdade' && activeVicesList.length > 0 ? (
          activeVicesList.map(activeVice => {
            const isMission = activeVice.config?.mode === 'missao-antitabagismo';
            return (
              <div
                key={activeVice.id}
                style={{
                  padding: '1.25rem',
                  background: isMission ? 'rgba(234,179,8,0.05)' : 'rgba(16,185,129,0.05)',
                  border: isMission ? '1px solid rgba(234,179,8,0.2)' : '1px solid rgba(16,185,129,0.2)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: isMission ? '0 0 15px rgba(234,179,8,0.05)' : 'none'
                }}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: isMission ? 'rgba(234,179,8,0.1)' : 'rgba(16,185,129,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isMission ? '#eab308' : '#10b981'
                    }}
                  >
                    <Zap size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          fontSize: '0.6rem',
                          fontWeight: 900,
                          letterSpacing: '1px',
                          color: isMission ? '#eab308' : '#10b981',
                          textTransform: 'uppercase'
                        }}
                      >
                        {isMission ? 'MISSÃO' : 'ATIVO'}
                      </span>
                    </div>
                    <h4 style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 800, margin: '2px 0 0 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {activeVice.name ? activeVice.name.toUpperCase() : 'VÍCIO'}
                    </h4>
                  </div>
                </div>
                {isMission ? (
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: '0.6rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                      Progresso
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#eab308' }}>
                      Estágio {Math.min(10, (activeVice.config?.antitabagismoLevel ?? 0) + 1)}/10
                    </span>
                  </div>
                ) : (
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: '0.6rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                      Status
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981' }}>
                      Acompanhando
                    </span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div style={{
            padding: '1rem',
            background: 'rgba(255,255,255,0.01)',
            border: '1px dashed rgba(255,255,255,0.1)',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#475569', fontSize: '0.75rem', fontStyle: 'italic', margin: 0 }}>
              Nenhuma rotina ativa para este pilar agora.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
