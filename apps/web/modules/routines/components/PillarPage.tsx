'use client';

/**
 * ============================================================================
 * Página de Pilar Único - PillarPage.tsx
 * ============================================================================
 * Descrição: Página que renderiza as informações detalhadas de um pilar específico.
 * Mostra o status atual (gauge), descrição, rotinas ativas e um catálogo de 
 * novas rotinas que podem ser adotadas.
 * ============================================================================
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Brain, Heart, Bird, Flag,
  Plus, ArrowRight, Zap, Info, Sparkles, Check, Save
} from 'lucide-react';
import { attributeEngine, UserAttributes } from '@/modules/blackboard/engine/attribute-engine/AttributeEngine';
import { bubbleEngine } from '@/modules/blackboard/engine/bubble-engine/BubbleEngine';
import { PILLARS_DATA, IMPACT_ICONS, RoutineOption } from '../data/routinesData';
import { useTrackerStore } from '@/modules/dashboard/components/tracker/store/trackerStore';
import { PillarHeader } from './pillar/PillarHeader';
import { PillarProfileForm } from './pillar/PillarProfileForm';
import { PillarActiveRoutines } from './pillar/PillarActiveRoutines';

export function PillarPage({ pillarId }: { pillarId: string }) {
  const config = PILLARS_DATA[pillarId];
  if (!config) return null;

  const [isMounted, setIsMounted] = useState(false);
  const [attributes, setAttributes] = useState(attributeEngine.getAttributes());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { items } = useTrackerStore();
  const activeVicesList = Object.values(items || {}).filter(t => t.type === 'vice' && t.status === 'ACTIVE');

  const [profile, setProfile] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ploc_pillar_profiles');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return {
      peso: '',
      altura: '',
      horasSono: '',
      treinoFreq: '',
      aguaLiters: '',
      medidas: '',
      estresse: '',
      meditacao: '',
      horasTela: '',
      focoPrincipal: '',
      alimentacao: '',
      lazerHoras: '',
      relacionamentos: '',
      horasLivres: '',
      viciosAtivos: '',
      autonomia: '',
      metaAno: '',
      alinhamentoCarreira: '',
      sentidoDirecao: ''
    };
  });

  useEffect(() => {
    setIsMounted(true);
    setAttributes(attributeEngine.getAttributes());
  }, []);

  if (!isMounted) return null;

  const currentLevel = attributes[config.id as keyof UserAttributes] ?? 0;
  const Icon = config.icon;

  // Lógica de Cores de Estado - Modificada para não ficar vermelho por pontos baixos
  const getStatusInfo = (val: number, pilarColor?: string) => {
    const baseColor = pilarColor || config.color;
    if (val >= 70) return { color: '#22c55e', label: 'EXCELENTE' };
    return { color: baseColor, label: 'ESTÁVEL' };
  };

  const status = getStatusInfo(currentLevel);

  const saveProfile = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ploc_pillar_profiles', JSON.stringify(profile));
    }
    setSaveSuccess(true);

    // SPARKLE / DROP REWARDS SYSTEM
    // Depending on the pillar, we spawn bubbles for the Ploc!
    import('@/modules/blackboard/engine/resource-engine/ResourceEngine').then(({ resourceEngine }) => {
      // Spawn items near the center of the screen (0,0 is center in our setup)
      const randomOffset = () => -150 + Math.random() * 300;

      if (pillarId === 'corpo') {
        resourceEngine.spawnBubble('food', 'Maçã', randomOffset(), randomOffset());
        resourceEngine.spawnBubble('water', 'Água', randomOffset(), randomOffset());
      } else if (pillarId === 'mente') {
        resourceEngine.spawnBubble('medicine', 'Remédio', randomOffset(), randomOffset());
      } else if (pillarId === 'liberdade') {
        resourceEngine.spawnBubble('food', 'Hambúrguer', randomOffset(), randomOffset());
      } else {
        resourceEngine.spawnBubble('water', 'Água', randomOffset(), randomOffset());
      }
    });

    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  const renderProfileForm = () => {
    return (
      <PillarProfileForm
        pillarId={pillarId}
        profile={profile}
        handleInputChange={handleInputChange}
      />
    );
  };

  return (
    <div style={{
      flex: '0 0 100vw',
      height: '80dvh',
      scrollSnapAlign: 'start',
      padding: '2rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      background: '#0a0c0a',
      overflowY: 'auto',
      overflowX: 'hidden',
      position: 'relative'
    }}>

      {/* Background Decor */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '-10%',
        width: '300px',
        height: '300px',
        background: status.color,
        filter: 'blur(150px)',
        opacity: 0.08,
        transition: 'background 0.5s ease',
        zIndex: 0 /* base */
      }} />

      {/* Header: Resumo do Atributo com Gauge */}
      <PillarHeader
        status={status}
        currentLevel={currentLevel}
        config={config}
        Icon={Icon}
      />

      {/* Seção: Informações Base (Formulário) */}
      <div style={{ zIndex: 0 /* base */ /* base */ }} className="flex flex-col gap-4">
        <h3 style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px', opacity: 0.5, margin: 0, textAlign: 'center' }}>
          CADASTRO DE INFORMAÇÕES BASE
        </h3>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          gap: '1rem',
          background: 'rgba(255,255,255,0.01)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.04)',
          padding: '1.5rem',
          borderRadius: '24px',
        }}>
          {renderProfileForm()}

          <div className="mt-6 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveProfile}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-lg transition-all"
              style={{
                background: `linear-gradient(135deg, ${status.color} 0%, rgba(255,255,255,0.05) 100%)`,
                border: `1px solid ${status.color}10`,
                boxShadow: `0 10px 20px ${status.color}20`
              }}
            >
              {saveSuccess ? (
                <>
                  <Check size={16} />
                  SALVO COM SUCESSO
                </>
              ) : (
                <>
                  <Save size={16} />
                  SALVAR INFORMAÇÕES
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Seção: Rotinas Ativas */}
      <PillarActiveRoutines
        pillarId={pillarId}
        activeVicesList={activeVicesList}
      />
    </div>
  );
}
