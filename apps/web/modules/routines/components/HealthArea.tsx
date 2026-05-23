'use client';

/**
 * ============================================================================
 * Área de Saúde - HealthArea.tsx
 * ============================================================================
 * Descrição: Componente/slide focado no pilar de saúde.
 * Contém o questionário antitabagismo como demonstração de fluxo.
 * ============================================================================
 */import React, { useState } from 'react';
import { Activity, ChevronRight, Cigarette, Flame, Target, Calendar, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { blackboardEventBus, BLACKBOARD_EVENTS } from '@/modules/blackboard/events/eventBus';

interface HealthAreaProps {
  hasLeft?: boolean;
  hasRight?: boolean;
}
// Componente que engloba o questionário e visualização de saúde
export function HealthArea({ hasLeft = true, hasRight = true }: HealthAreaProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = searchParams.get('step');
  
  // Se houver um step na URL, mostramos o questionário
  const isAnswering = step !== null;

  return (
    <section
      id="slide-saude"
      style={{
        flexShrink: 0,
        width: '100vw',
        height: '100dvh',
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '2rem 1rem 6rem',
        position: 'relative',
        background: '#000',
        overflowY: 'auto',
      }}
    >
      {/* Texto Fantasma de Fundo */}
      <h2 style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 'clamp(2rem, 15vw, 6rem)',
        fontWeight: 950,
        letterSpacing: '20px',
        color: '#ef4444',
        textTransform: 'uppercase',
        opacity: 0.05,
        filter: 'blur(1px)',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        zIndex: 0
      }}>
        SAÚDE
      </h2>

      <div style={{ zIndex: 1, width: '100%', maxWidth: '400px' }}>
        <AnimatePresence mode="wait">
          {!isAnswering ? (
            <motion.div
              key="main-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              {/* Header da Área */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                  <Activity size={20} />
                </div>
                <div>
                  <h3 style={{ color: '#fff', margin: 0, fontSize: '1rem', fontWeight: 800 }}>SAÚDE</h3>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '0.7rem', fontWeight: 600 }}>CUIDADO E PREVENÇÃO</p>
                </div>
              </div>

              {/* Card do Hábito Antitabagismo */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('?step=1')}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '24px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 10px 20px rgba(239, 68, 68, 0.2)' }}>
                    <Cigarette size={28} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: '#fff', margin: 0, fontSize: '1rem', fontWeight: 800 }}>Anti-Tabagismo</h4>
                    <p style={{ color: '#94a3b8', margin: '4px 0 0', fontSize: '0.75rem', fontWeight: 500 }}>Parada e Redução de Uso</p>
                  </div>
                  <ChevronRight size={20} color="#334155" />
                </div>
                
                <div style={{ marginTop: '1.2rem', display: 'flex', gap: '8px' }}>
                  <Badge icon={<Flame size={12} />} label="DIFICULDADE ALTA" color="#ef4444" />
                  <Badge icon={<Target size={12} />} label="FOCO" color="#f97316" />
                </div>
              </motion.div>

              {/* Outros (Em Construção) */}
              <div style={{ opacity: 0.3, pointerEvents: 'none' }}>
                <p style={{ color: '#64748b', fontSize: '0.7rem', textAlign: 'center', fontWeight: 700, letterSpacing: '1px' }}>OUTROS HÁBITOS EM BREVE</p>
              </div>
            </motion.div>
          ) : (
            <Questionnaire step={parseInt(step || '1')} onBack={() => router.push('/dashboard')} />
          )}
        </AnimatePresence>
      </div>

      {hasLeft && <ChevronHint side="left" />}
      {hasRight && <ChevronHint side="right" />}
    </section>
  );
}

function Badge({ icon, label, color }: { icon: React.ReactNode, label: string, color: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 10px',
      borderRadius: '8px',
      background: `${color}15`,
      border: `1px solid ${color}30`,
      color: color,
      fontSize: '0.6rem',
      fontWeight: 800,
      letterSpacing: '0.5px'
    }}>
      {icon}
      {label}
    </div>
  );
}

function Questionnaire({ step, onBack }: { step: number, onBack: () => void }) {
  const router = useRouter();
  
  const questions = [
    {
      id: 1,
      title: "Há quanto tempo você fuma?",
      description: "Precisamos entender a profundidade do hábito.",
      icon: <Calendar size={32} />,
      options: ["Menos de 1 ano", "1 a 5 anos", "5 a 10 anos", "Mais de 10 anos"]
    },
    {
      id: 2,
      title: "Quais são seus maiores gatilhos?",
      description: "O que te faz querer acender um cigarro?",
      icon: <Flame size={32} />,
      options: ["Estresse/Ansiedade", "Após as refeições", "Socialização/Álcool", "Tédio"]
    },
    {
      id: 3,
      title: "Qual o resultado esperado?",
      description: "O que você busca com o PLOC?",
      icon: <Target size={32} />,
      options: ["Parada Total", "Redução Gradual", "Melhora na Saúde", "Economia Financeira"]
    }
  ];

  const currentQ = questions[step - 1];

  const handleNext = () => {
    if (step < 3) {
      router.push(`?step=${step + 1}`);
    } else {
      // Finaliza e cria a Bolha no Blackboard
      blackboardEventBus.emit(BLACKBOARD_EVENTS.BUBBLE_CREATED, {
        type: 'routine',
        content: 'Rotina Antitabagismo Iniciada',
        metadata: { habit: 'smoking' }
      });
      onBack();
    }
  };

  return (
    <motion.div
      key={`q-${step}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>VOLTAR</button>
        <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 900 }}>PASSO {step}/3</div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', margin: '0 auto 1.5rem' }}>
          {currentQ.icon}
        </div>
        <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.5rem' }}>{currentQ.title}</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>{currentQ.description}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {currentQ.options.map((opt) => (
          <motion.button
            key={opt}
            whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.08)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            style={{
              padding: '1.2rem',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#fff',
              textAlign: 'left',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function ChevronHint({ side }: { side: 'left' | 'right' }) {
  return (
    <div style={{
      position: 'absolute',
      [side]: '15px',
      top: '50%',
      transform: side === 'left' ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)',
      opacity: 0.2,
      pointerEvents: 'none',
    }}>
      <ChevronRight size={24} color="#fff" />
    </div>
  );
}
