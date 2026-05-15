'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Target, MousePointer2, Clock, CheckCircle2 } from 'lucide-react';

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlightId?: string;
}

const STEPS: TutorialStep[] = [
  {
    title: "Bem-vindo ao Oceano Mental",
    description: "Este é o Blackboard. Um espaço infinito para suas ideias, tarefas e hábitos coexistirem com o Ploc.",
    icon: <Sparkles className="text-sky-400" size={32} />
  },
  {
    title: "O Ploc é o seu Centro",
    description: "Ele vive no Marco Zero. Tudo o que você faz reflete no estado emocional e na energia dele.",
    icon: <Target className="text-sky-400" size={32} />,
    highlightId: "ploc-anchor"
  },
  {
    title: "A Física do Tempo",
    description: "Observe as auras. Quanto mais perto do Ploc, mais próximo o evento está de acontecer (ou expirar).",
    icon: <Clock className="text-sky-400" size={32} />
  },
  {
    title: "Bolhas de Intenção",
    description: "Clique nas bolhas para coletar vitórias. Se elas chegarem ao Ploc sem serem clicadas, elas 'explodem' e podem estressá-lo.",
    icon: <MousePointer2 className="text-sky-400" size={32} />
  },
  {
    title: "Tudo Pronto!",
    description: "Organize sua mente, cuide do Ploc e evolua seus atributos. O oceano é seu.",
    icon: <CheckCircle2 className="text-emerald-400" size={32} />
  }
];

export function TutorialOcean({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(8px)'
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.1, y: -20 }}
          style={{
            width: '90%',
            maxWidth: '400px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            textAlign: 'center',
            color: '#fff'
          }}
        >
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
            {STEPS[currentStep].icon}
          </div>
          
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px', color: '#38bdf8' }}>
            {STEPS[currentStep].title}
          </h3>
          
          <p style={{ fontSize: '1rem', opacity: 0.8, lineHeight: 1.6, marginBottom: '32px' }}>
            {STEPS[currentStep].description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {STEPS.map((_, i) => (
                <div 
                  key={i} 
                  style={{ 
                    width: i === currentStep ? '24px' : '8px', 
                    height: '8px', 
                    borderRadius: '4px',
                    background: i === currentStep ? '#38bdf8' : 'rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease'
                  }} 
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={next}
              style={{
                background: '#38bdf8',
                color: '#0f172a',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {currentStep === STEPS.length - 1 ? 'Começar' : 'Próximo'}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
