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
import { useViceStore } from '@/modules/dashboard/components/libertesse/store/viceStore';

export function PillarPage({ pillarId }: { pillarId: string }) {
  const config = PILLARS_DATA[pillarId];
  if (!config) return null;

  const activeVices = useViceStore(state => state.activeVices);
  const activeVicesList = Object.values(activeVices || {});

  const [isMounted, setIsMounted] = useState(false);
  const [attributes, setAttributes] = useState(attributeEngine.getAttributes());
  const [saveSuccess, setSaveSuccess] = useState(false);

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
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    color: '#fff',
    fontSize: '0.85rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
  };

  const labelStyle = {
    display: 'block',
    color: '#94a3b8',
    fontSize: '0.75rem',
    fontWeight: 700,
    marginBottom: '6px',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  };

  const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  };

  const renderProfileForm = () => {
    if (pillarId === 'corpo') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div style={formGroupStyle}>
            <label style={labelStyle}>PESO (KG)</label>
            <input 
              type="text" 
              placeholder="Ex: 75" 
              value={profile.peso || ''} 
              onChange={e => handleInputChange('peso', e.target.value)} 
              style={inputStyle}
              className="focus:border-red-500/50 focus:bg-white/[0.05]"
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>ALTURA (CM)</label>
            <input 
              type="text" 
              placeholder="Ex: 180" 
              value={profile.altura || ''} 
              onChange={e => handleInputChange('altura', e.target.value)} 
              style={inputStyle}
              className="focus:border-red-500/50 focus:bg-white/[0.05]"
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>HORAS DE SONO DIÁRIAS</label>
            <input 
              type="text" 
              placeholder="Ex: 7h a 8h" 
              value={profile.horasSono || ''} 
              onChange={e => handleInputChange('horasSono', e.target.value)} 
              style={inputStyle}
              className="focus:border-red-500/50 focus:bg-white/[0.05]"
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>FREQUÊNCIA DE ACADEMIA / TREINO</label>
            <input 
              type="text" 
              placeholder="Ex: 3x na semana" 
              value={profile.treinoFreq || ''} 
              onChange={e => handleInputChange('treinoFreq', e.target.value)} 
              style={inputStyle}
              className="focus:border-red-500/50 focus:bg-white/[0.05]"
            />
          </div>
          <div style={formGroupStyle} className="sm:col-span-2">
            <label style={labelStyle}>TAMANHOS / MEDIDAS CORPORAIS</label>
            <input 
              type="text" 
              placeholder="Ex: Peito: 100cm, Cintura: 80cm, Bíceps: 38cm" 
              value={profile.medidas || ''} 
              onChange={e => handleInputChange('medidas', e.target.value)} 
              style={inputStyle}
              className="focus:border-red-500/50 focus:bg-white/[0.05]"
            />
          </div>
          <div style={formGroupStyle} className="sm:col-span-2">
            <label style={labelStyle}>CONSUMO DE ÁGUA DIÁRIO</label>
            <input 
              type="text" 
              placeholder="Ex: 2.5 Litros" 
              value={profile.aguaLiters || ''} 
              onChange={e => handleInputChange('aguaLiters', e.target.value)} 
              style={inputStyle}
              className="focus:border-red-500/50 focus:bg-white/[0.05]"
            />
          </div>
        </div>
      );
    }

    if (pillarId === 'mente') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div style={formGroupStyle}>
            <label style={labelStyle}>NÍVEL DE ESTRESSE</label>
            <select
              value={profile.estresse || ''}
              onChange={e => handleInputChange('estresse', e.target.value)}
              style={inputStyle}
              className="focus:border-sky-500/50 focus:bg-white/[0.05] appearance-none"
            >
              <option value="" disabled style={{background: '#0d0f0d'}}>Selecione...</option>
              <option value="Baixo" style={{background: '#0d0f0d'}}>Baixo</option>
              <option value="Médio" style={{background: '#0d0f0d'}}>Médio</option>
              <option value="Alto" style={{background: '#0d0f0d'}}>Alto</option>
            </select>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>PRÁTICA DE MEDITAÇÃO</label>
            <select
              value={profile.meditacao || ''}
              onChange={e => handleInputChange('meditacao', e.target.value)}
              style={inputStyle}
              className="focus:border-sky-500/50 focus:bg-white/[0.05]"
            >
              <option value="" disabled style={{background: '#0d0f0d'}}>Selecione...</option>
              <option value="Sim, Diariamente" style={{background: '#0d0f0d'}}>Sim, Diariamente</option>
              <option value="Sim, Ocasionalmente" style={{background: '#0d0f0d'}}>Sim, Ocasionalmente</option>
              <option value="Não pratico" style={{background: '#0d0f0d'}}>Não pratico</option>
            </select>
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>HORAS DE TELA DIÁRIAS</label>
            <input 
              type="text" 
              placeholder="Ex: 5h" 
              value={profile.horasTela || ''} 
              onChange={e => handleInputChange('horasTela', e.target.value)} 
              style={inputStyle}
              className="focus:border-sky-500/50 focus:bg-white/[0.05]"
            />
          </div>
          <div style={formGroupStyle} className="sm:col-span-2">
            <label style={labelStyle}>FOCO PRINCIPAL ATUAL</label>
            <input 
              type="text" 
              placeholder="Ex: Controlar ansiedade / Manter foco nos estudos" 
              value={profile.focoPrincipal || ''} 
              onChange={e => handleInputChange('focoPrincipal', e.target.value)} 
              style={inputStyle}
              className="focus:border-sky-500/50 focus:bg-white/[0.05]"
            />
          </div>
        </div>
      );
    }

    if (pillarId === 'vida') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div style={formGroupStyle}>
            <label style={labelStyle}>QUALIDADE DA ALIMENTAÇÃO</label>
            <input 
              type="text" 
              placeholder="Ex: Saudável, equilibrada" 
              value={profile.alimentacao || ''} 
              onChange={e => handleInputChange('alimentacao', e.target.value)} 
              style={inputStyle}
              className="focus:border-emerald-500/50 focus:bg-white/[0.05]"
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>TEMPO DE LAZER DIÁRIO</label>
            <input 
              type="text" 
              placeholder="Ex: 2 horas" 
              value={profile.lazerHoras || ''} 
              onChange={e => handleInputChange('lazerHoras', e.target.value)} 
              style={inputStyle}
              className="focus:border-emerald-500/50 focus:bg-white/[0.05]"
            />
          </div>
          <div style={formGroupStyle} className="sm:col-span-2">
            <label style={labelStyle}>SATISFAÇÃO COM RELACIONAMENTOS</label>
            <input 
              type="text" 
              placeholder="Ex: Muito satisfeito com a família e círculo social" 
              value={profile.relacionamentos || ''} 
              onChange={e => handleInputChange('relacionamentos', e.target.value)} 
              style={inputStyle}
              className="focus:border-emerald-500/50 focus:bg-white/[0.05]"
            />
          </div>
        </div>
      );
    }

    if (pillarId === 'liberdade') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div style={formGroupStyle}>
            <label style={labelStyle}>HORAS LIVRES DIÁRIAS</label>
            <input 
              type="text" 
              placeholder="Ex: 4h livres" 
              value={profile.horasLivres || ''} 
              onChange={e => handleInputChange('horasLivres', e.target.value)} 
              style={inputStyle}
              className="focus:border-amber-500/50 focus:bg-white/[0.05]"
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>VÍCIOS EM MONITORAMENTO</label>
            <input 
              type="text" 
              placeholder="Ex: Tabagismo, Redes Sociais" 
              value={profile.viciosAtivos || ''} 
              onChange={e => handleInputChange('viciosAtivos', e.target.value)} 
              style={inputStyle}
              className="focus:border-amber-500/50 focus:bg-white/[0.05]"
            />
          </div>
          <div style={formGroupStyle} className="sm:col-span-2">
            <label style={labelStyle}>NÍVEL DE AUTONOMIA PESSOAL</label>
            <input 
              type="text" 
              placeholder="Ex: Consigo organizar meus horários de trabalho de forma flexível" 
              value={profile.autonomia || ''} 
              onChange={e => handleInputChange('autonomia', e.target.value)} 
              style={inputStyle}
              className="focus:border-amber-500/50 focus:bg-white/[0.05]"
            />
          </div>
        </div>
      );
    }

    if (pillarId === 'proposito') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div style={formGroupStyle}>
            <label style={labelStyle}>META PRINCIPAL DO ANO</label>
            <input 
              type="text" 
              placeholder="Ex: Passar na prova X / Lançar o produto Y" 
              value={profile.metaAno || ''} 
              onChange={e => handleInputChange('metaAno', e.target.value)} 
              style={inputStyle}
              className="focus:border-purple-500/50 focus:bg-white/[0.05]"
            />
          </div>
          <div style={formGroupStyle}>
            <label style={labelStyle}>ALINHAMENTO COM CARREIRA</label>
            <input 
              type="text" 
              placeholder="Ex: Super alinhado com meus objetivos" 
              value={profile.alinhamentoCarreira || ''} 
              onChange={e => handleInputChange('alinhamentoCarreira', e.target.value)} 
              style={inputStyle}
              className="focus:border-purple-500/50 focus:bg-white/[0.05]"
            />
          </div>
          <div style={formGroupStyle} className="sm:col-span-2">
            <label style={labelStyle}>SENTIMENTO DE DIREÇÃO ATUAL</label>
            <input 
              type="text" 
              placeholder="Ex: Totalmente focado nas minhas conquistas diárias" 
              value={profile.sentidoDirecao || ''} 
              onChange={e => handleInputChange('sentidoDirecao', e.target.value)} 
              style={inputStyle}
              className="focus:border-purple-500/50 focus:bg-white/[0.05]"
            />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      flex: '0 0 100vw',
      height: '100dvh',
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
        zIndex: 0
      }} />

      {/* Header: Resumo do Atributo com Gauge */}
      <div style={{ zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1.5rem' }}>
          {/* Gauge Circular Simplificado */}
          <div style={{ position: 'relative', width: '80px', height: '80px' }}>
            <svg width="80" height="80" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="45" fill="none"
                stroke={status.color}
                strokeWidth="8"
                strokeDasharray="283"
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 283 - (283 * currentLevel) / 100 }}
                strokeLinecap="round"
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <Icon size={24} style={{ color: status.color, opacity: 0.8 }} />
              <span style={{ fontSize: '0.9rem', fontWeight: 900 }}>{currentLevel}</span>
            </div>
          </div>

          <div>
            <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 900, margin: 0, letterSpacing: '2px' }}>
              {config.label}
            </h2>
            <div style={{ 
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: '6px',
              background: `${status.color}20`,
              border: `1px solid ${status.color}40`,
              marginTop: '4px'
            }}>
              <span style={{ color: status.color, fontSize: '0.65rem', fontWeight: 900, letterSpacing: '1px' }}>
                STATUS: {status.label}
              </span>
            </div>
          </div>
        </div>

        <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          padding: '1.2rem',
          borderRadius: '24px'
        }}>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.6', margin: 0 }}>
            {config.summary} Manter este pilar em alta garante estabilidade emocional e evolução para o seu PLOC.
          </p>
        </div>
      </div>

      {/* Seção: Informações Base (Formulário) */}
      <div style={{ zIndex: 1 }} className="flex flex-col gap-4">
        <h3 style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px', opacity: 0.5, margin: 0 }}>
          CADASTRO DE INFORMAÇÕES BASE
        </h3>
        
        <div style={{
          background: 'rgba(255,255,255,0.01)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.04)',
          padding: '1.5rem',
          borderRadius: '24px',
        }}>
          {renderProfileForm()}

          <div className="mt-6 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveProfile}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-lg transition-all"
              style={{
                background: `linear-gradient(135deg, ${status.color} 0%, rgba(255,255,255,0.05) 100%)`,
                border: `1px solid ${status.color}40`,
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
      <div style={{ zIndex: 1, paddingBottom: '2rem' }}>
        <h3 style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px', marginBottom: '1rem', opacity: 0.5 }}>
          ROTINAS ATIVAS
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {pillarId === 'liberdade' && activeVicesList.length > 0 ? (
            activeVicesList.map(activeVice => {
              const isMission = activeVice.mode === 'missao-antitabagismo';
              return (
                <div 
                  key={activeVice.viceId} 
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
                        {activeVice.viceId === 'tabagismo' ? 'TABAGISMO' : activeVice.viceId.toUpperCase()}
                      </h4>
                    </div>
                  </div>
                  {isMission ? (
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ display: 'block', fontSize: '0.6rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        Progresso
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#eab308' }}>
                        Estágio {Math.min(10, (activeVice.antitabagismoLevel ?? 0) + 1)}/10
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
    </div>
  );
}
