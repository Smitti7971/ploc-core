import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFitnessProfileStore } from '../store/useFitnessProfileStore';
import { useExerciseDatabaseStore } from '../store/useExerciseDatabaseStore';
import { getEquipmentImage, equipmentImages } from '../utils/equipmentData';
import { X, ArrowRight, Home, Dumbbell, TreePine, Activity, Target, Camera, Search, ChevronDown, ChevronUp, ChevronRight, Calendar, AlertTriangle, Check, Undo } from 'lucide-react';
import { determineRecommendedSplit, hasConsecutiveDays, getCombinedExercises } from '../utils/workoutGenerator';

const MUSCLE_GROUPS = [
  { id: 'chest', label: 'Peito', image: '/muscles/chest.png' },
  { id: 'back', label: 'Costas', image: '/muscles/back.png' },
  { id: 'shoulders', label: 'Ombros', image: '/muscles/shoulders.png' },
  { id: 'abs', label: 'Abdômen', image: '/muscles/abs.png' },
  { id: 'lombar', label: 'Lombar', image: '/muscles/back.png' },
  { id: 'biceps', label: 'Bíceps', image: '/muscles/biceps.png' },
  { id: 'triceps', label: 'Tríceps', image: '/muscles/triceps.png' },
  { id: 'quadriceps', label: 'Quadríceps', image: '/muscles/quadriceps.png' },
  { id: 'hamstrings', label: 'Posteriores', image: '/muscles/hamstrings.png' },
  { id: 'calves', label: 'Panturrilha', image: '/muscles/hamstrings.png' },
  { id: 'glutes', label: 'Glúteos', image: '/muscles/glutes.png' },
];

interface CreateWorkoutModalProps {
  onClose: () => void;
  onComplete: (data: any) => void;
}

export function CreateWorkoutModal({ onClose, onComplete }: CreateWorkoutModalProps) {
  const { biometrics } = useFitnessProfileStore();
  const gender = (biometrics as any)?.gender || 'masculino';
  const guidanceImage = gender === 'feminino' ? '/fitness_photo_guidance_female.png' : '/fitness_photo_guidance_male.png';

  const [step, setStep] = useState(1);
  const [showPhotoGuidance, setShowPhotoGuidance] = useState(false);
  const [showDiscoverGuidance, setShowDiscoverGuidance] = useState(false);
  const [showRestWarning, setShowRestWarning] = useState(false);
  const [hasSeenRestWarning, setHasSeenRestWarning] = useState(false);
  const [selectedAlternativeSplit, setSelectedAlternativeSplit] = useState<string | null>(null);
  const [showSplitWarning, setShowSplitWarning] = useState(false);
  const [eqSearchQuery, setEqSearchQuery] = useState('');
  const { equipmentNameOverrides, equipmentImageOverrides, equipmentDescriptionOverrides, equipmentAffiliateLinkOverrides, customEquipments, deletedStaticEquipments, preSelectedStaticEquipments } = useExerciseDatabaseStore();
  const storeCustomEqs = customEquipments.filter(c => !c.deletedAt);
  const [formData, setFormData] = useState({
    photoTaken: undefined as boolean | undefined,
    modality: '',
    intensityLevel: '',
    location: [] as string[],
    activeDays: [] as string[],
    equipment: [] as string[],
    focusMuscles: MUSCLE_GROUPS.map(m => m.id),
    exercises: [] as string[],
    dietLink: '',
    splitType: '',
  });

  const [expandedEqMuscle, setExpandedEqMuscle] = useState<string | null>(null);
  const [expandedExMuscle, setExpandedExMuscle] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [equipmentModalData, setEquipmentModalData] = useState<{ id: string; name: string; image: string; isSelected: boolean; description?: string; showAffiliateLink?: boolean } | null>(null);
  const [isEqDropdownOpen, setIsEqDropdownOpen] = useState(false);

  const [lastRemovedEq, setLastRemovedEq] = useState<string | null>(null);
  const removeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleRemoveEq = (eq: string) => {
    setFormData(prev => ({ ...prev, equipment: prev.equipment.filter(e => e !== eq) }));
    setLastRemovedEq(eq);
    if (removeTimeoutRef.current) clearTimeout(removeTimeoutRef.current);
    removeTimeoutRef.current = setTimeout(() => {
      setLastRemovedEq(null);
    }, 4000);
  };

  const handleUndoRemove = () => {
    if (lastRemovedEq) {
      setFormData(prev => ({ ...prev, equipment: [...prev.equipment, lastRemovedEq] }));
      setLastRemovedEq(null);
      if (removeTimeoutRef.current) clearTimeout(removeTimeoutRef.current);
    }
  };

  const eqScrollRef = useRef<HTMLDivElement>(null);
  const isEqHoveredRef = useRef(false);

  useEffect(() => {
    // Reset the hover state to prevent the animation from getting stuck 
    // if an element was removed from the DOM while being touched/hovered.
    isEqHoveredRef.current = false;
    
    if (step !== 6 || formData.equipment.length <= 4) return;
    let animationId: number;
    let lastTime = performance.now();
    let fraction = 0;
    
    const loop = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;
      
      if (eqScrollRef.current && !isEqHoveredRef.current) {
        fraction += dt * 0.03;
        if (fraction >= 1) {
          const pixels = Math.floor(fraction);
          eqScrollRef.current.scrollLeft += pixels;
          fraction -= pixels;
        }
        
        // Reset when we've scrolled past the first half
        if (eqScrollRef.current.scrollLeft >= eqScrollRef.current.scrollWidth / 2) {
          eqScrollRef.current.scrollLeft -= eqScrollRef.current.scrollWidth / 2;
        }
      }
      animationId = requestAnimationFrame(loop);
    };
    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [step, formData.equipment.length]);


  const splitExplanations: Record<string, { desc: string, idealDays: number }> = {
    'FullBody': { desc: 'Treina o corpo inteiro em uma única sessão. Ideal para quem tem pouco tempo na semana.', idealDays: 1 },
    'AB': { desc: 'Divide o corpo em Superior e Inferior. Ótimo para treinar 2 a 4 vezes na semana com boa frequência.', idealDays: 2 },
    'ABC': { desc: 'O clássico Push/Pull/Legs (Empurrar, Puxar, Pernas). Foca em sinergia muscular.', idealDays: 3 },
    'ABCD': { desc: 'Divide o treino em 4 partes, permitindo mais volume e foco em grupos musculares específicos.', idealDays: 4 },
    'ABCDE': { desc: 'O "Bro Split". Foca em apenas um grande grupo muscular por dia com volume máximo. Exige constância.', idealDays: 5 }
  };

  const numDays = formData.activeDays.length;
  const recommendedSplit = determineRecommendedSplit(formData.activeDays);
  const consecutive = hasConsecutiveDays(formData.activeDays);

  const handleNext = () => {
    if (step === 1 && formData.activeDays.length === 7 && !hasSeenRestWarning) {
      setShowRestWarning(true);
      setHasSeenRestWarning(true);
      return;
    }
    
    if (step === 3 && formData.location.length === 0) {
      alert('Escolha pelo menos um local de treino');
      return;
    }
    if (step === 4 && formData.activeDays.length === 0) {
      alert('Escolha os dias que deseja treinar');
      return;
    }

    if (step === 5) {
      if (formData.focusMuscles.length === 0) {
        alert('Selecione pelo menos um músculo para treinar hoje.');
        return;
      }
      
      const selectedMuscleIds = formData.focusMuscles;
      const selectedLabels = new Set(selectedMuscleIds.map(id => MUSCLE_GROUPS.find(m => m.id === id)?.label || id));

      const eqList = new Set<string>();

      equipmentGroups.forEach(group => {
        group.equipments.forEach(eqName => {
          if (preSelectedStaticEquipments[eqName] || preSelectedStaticEquipments[`static-${eqName}`]) {
            eqList.add(eqName);
          }
        });
      });

      storeCustomEqs.forEach(c => {
        if (c.preSelected) {
          eqList.add(c.name);
        }
      });

      setFormData(prev => ({ ...prev, equipment: Array.from(eqList) }));
    }

    if (step < 9) setStep(step + 1);
    else {
      onComplete({ ...formData, splitType: selectedAlternativeSplit || recommendedSplit });
    }
  };

  const handleToggleArray = (key: 'location' | 'activeDays' | 'equipment' | 'focusMuscles' | 'exercises', value: string) => {
    setFormData(prev => {
      const currentArray = prev[key] as string[];
      if (currentArray.includes(value)) {
        return { ...prev, [key]: currentArray.filter(v => v !== value) };
      } else {
        return { ...prev, [key]: [...currentArray, value] };
      }
    });
  };

  const handleSingleChoice = (key: keyof typeof formData, value: any) => {
    const newData = { ...formData, [key]: value };
    setFormData(newData);

    if (key === 'intensityLevel' && value === 'descobrir') {
      setShowDiscoverGuidance(true);
    } else {
      setTimeout(() => {
        if (step < 9) setStep(step + 1);
      }, 300);
    }
  };

  const handlePhotoChoice = (val: boolean) => {
    if (val) {
      setFormData({ ...formData, photoTaken: true });
      setShowPhotoGuidance(true);
    } else {
      handleSingleChoice('photoTaken', false);
    }
  };

  const handleGuidanceComplete = () => {
    setShowPhotoGuidance(false);
    setStep(step + 1);
  };

  const handleDiscoverGuidanceComplete = () => {
    setShowDiscoverGuidance(false);
    setStep(step + 1);
  };

  const photoOptions = [
    { id: true, label: 'Tirar Foto Agora', icon: Camera },
    { id: false, label: 'Deixar para depois', icon: X },
  ];

  const modalities = [
    { id: 'musculacao', label: 'MUSCULAÇÃO', icon: Dumbbell },
    { id: 'calistenia', label: 'CALISTENIA', icon: Activity },
    { id: 'crossfit', label: 'CROSSFIT', icon: Target },
    { id: 'cardio', label: 'CARDIO', icon: Activity },
  ];

  const locations = [
    { id: 'casa', label: 'CASA', icon: Home },
    { id: 'academia', label: 'ACADEMIA', icon: Dumbbell },
    { id: 'ar_livre', label: 'AR LIVRE', icon: TreePine },
  ];

  const intensityLevels = [
    { id: 'leve', label: 'LEVE (Iniciante)' },
    { id: 'moderado', label: 'MODERADO (Intermediário)' },
    { id: 'avancado', label: 'AVANÇADO (Experiente)' },
  ];

  const weekDays = [
    { id: 'dom', label: 'D' },
    { id: 'seg', label: 'S' },
    { id: 'ter', label: 'T' },
    { id: 'qua', label: 'Q' },
    { id: 'qui', label: 'Q' },
    { id: 'sex', label: 'S' },
    { id: 'sab', label: 'S' },
  ];
  const allExercises = getCombinedExercises();
  const equipmentGroups = React.useMemo(() => {
    const locs = formData.location;
    const mod = formData.modality;
    if (!mod || locs.length === 0) return [];

    const map = new Map<string, Set<string>>();

    const filteredExs = allExercises.filter(ex => {
      const matchesModality = ex.modalities.includes(mod);
      const matchesLocation = locs.some(l => ex.locations.includes(l));
      
      const targetLevel = formData.intensityLevel === 'leve' ? 'Leve' 
                        : formData.intensityLevel === 'moderado' ? 'Moderado' 
                        : formData.intensityLevel === 'avancado' ? 'Avançado' 
                        : formData.intensityLevel === 'descobrir' ? 'Leve' // Descobrir começa com exercícios leves
                        : null;
                        
      const matchesLevel = !targetLevel || (ex.levels && ex.levels.some((l: any) => l.level === targetLevel));

      return matchesModality && matchesLocation && matchesLevel;
    });

    filteredExs.forEach(ex => {
      const validMuscles = formData.focusMuscles.length > 0 
        ? ex.muscleGroups.filter((m: string) => formData.focusMuscles.includes(m))
        : ex.muscleGroups;

      validMuscles.forEach((m: string) => {
        if (!map.has(m)) map.set(m, new Set<string>());
        ex.requiredEquipment.forEach((eq: string) => {
          // Ignore if it's a deleted custom equipment
          const customEq = customEquipments.find(c => c.name === eq || c.id === eq);
          if (customEq && customEq.deletedAt) return;
          // Ignore if it's a hidden static equipment
          if (!customEq && (deletedStaticEquipments[`static-${eq}`] || deletedStaticEquipments[eq])) return;

          // Ignore if it's a ghost equipment (from old renames)
          const isStaticActive = Object.keys(equipmentImages).includes(eq);
          const isCustomActive = !!customEq && !customEq.deletedAt;
          if (!isStaticActive && !isCustomActive) return;

          map.get(m)!.add(eq);
        });
      });
    });

    const groups: { muscle: string, equipments: string[] }[] = [];
    map.forEach((eqSet, m) => {
      if (eqSet.size > 0) {
        groups.push({ muscle: m, equipments: Array.from(eqSet) });
      }
    });

    return groups;
  }, [allExercises, formData.modality, formData.location, formData.intensityLevel, formData.focusMuscles]);

  const getModalityLabel = () => {
    if (step === 9) return "Treino Criado";
    if (formData.modality) {
      const mod = modalities.find(m => m.id === formData.modality);
      if (mod) return mod.label;
    }
    return "Criar Treino";
  };

  const renderLocations = () => {
    if (formData.location.length === 0) return null;
    
    return (
      <div className="flex flex-wrap items-center gap-1.5 truncate max-w-[260px] sm:max-w-[320px]">
        {formData.location.map((l, index) => {
          const loc = locations.find(loc => loc.id === l);
          if (!loc) return null;
          
          let colorClass = "text-zinc-400";
          if (l === 'casa') colorClass = "text-emerald-400";
          else if (l === 'academia') colorClass = "text-blue-400";
          else if (l === 'ar_livre') colorClass = "text-amber-400";

          return (
            <React.Fragment key={l}>
              <span className={`text-[11px] font-bold ${colorClass}`}>
                {loc.label}
              </span>
              {index < formData.location.length - 1 && (
                <span className="text-zinc-600 text-[10px]">•</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const getLevelInfo = () => {
    if (!formData.intensityLevel) return null;
    if (formData.intensityLevel === 'descobrir') return { label: 'DESCUBRA SEU NÍVEL', color: 'text-sky-400' };
    if (formData.intensityLevel === 'leve') return { label: 'INICIANTE', color: 'text-emerald-400' };
    if (formData.intensityLevel === 'moderado') return { label: 'INTERMEDIÁRIO', color: 'text-yellow-400' };
    if (formData.intensityLevel === 'avancado') return { label: 'AVANÇADO', color: 'text-red-500' };
    return null;
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-md bg-[#121214] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="min-w-0 pr-4 flex flex-col gap-0.5">
            <h2 className="text-base sm:text-lg font-black text-white truncate max-w-[260px] sm:max-w-[320px]" title={getModalityLabel()}>
              {getModalityLabel()}
            </h2>
            
            {renderLocations()}

            {getLevelInfo() ? (
              <div className="flex items-center gap-2 mt-0.5">
                <p className={`text-[11px] font-black uppercase tracking-wider ${getLevelInfo()!.color}`}>
                  {getLevelInfo()!.label}
                </p>
                <span className="text-zinc-600 text-[10px]">•</span>
                <p className="text-[11px] text-red-400 font-bold">Passo {step} de 8</p>
              </div>
            ) : (
              <p className="text-[11px] text-red-400 font-bold mt-0.5">Passo {step} de 8</p>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors shrink-0">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 flex-1 min-h-[350px]">
          <AnimatePresence mode="wait">
            {showPhotoGuidance ? (
              <motion.div
                key="photo-guidance"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6 text-center flex flex-col items-center justify-center h-full"
              >
                <div className="w-48 h-48 bg-[#121214] rounded-2xl overflow-hidden border-2 border-white/10 shadow-xl mb-4 relative flex items-center justify-center p-2">
                  <img
                    src={guidanceImage}
                    alt="Modelo de Orientação"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 border border-red-500/20 rounded-2xl pointer-events-none" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Orientação da Foto</h3>
                  <p className="text-sm text-zinc-400 max-w-[280px] mx-auto">
                    Fique em pé, de corpo inteiro e de frente para a câmera. Use o modelo acima como referência.
                  </p>
                </div>
                <button
                  onClick={handleGuidanceComplete}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-black text-sm w-full transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-red-500/20"
                >
                  <Camera size={18} />
                  Tirar Foto!
                </button>
              </motion.div>
            ) : showDiscoverGuidance ? (
              <motion.div
                key="discover-guidance"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6 text-center flex flex-col items-center justify-center h-full"
              >
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                  <Target size={48} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Como funciona o Teste?</h3>
                  <p className="text-sm text-zinc-400 max-w-[280px] mx-auto leading-relaxed">
                    Você fará o primeiro treino de forma exploratória. Nosso sistema de IA vai monitorar seu desempenho e calibrar automaticamente as cargas, repetições e a dificuldade ideal para os seus próximos dias!
                  </p>
                </div>
                <button
                  onClick={handleDiscoverGuidanceComplete}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-black text-sm w-full transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-red-500/20"
                >
                  Entendi, prosseguir!
                  <ArrowRight size={18} />
                </button>
              </motion.div>
            ) : showRestWarning ? (
              <motion.div
                key="rest-warning"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6 text-center flex flex-col items-center justify-center h-full"
              >
                <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4 text-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                  <Activity size={48} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Atenção ao Descanso!</h3>
                  <p className="text-sm text-zinc-400 max-w-[280px] mx-auto leading-relaxed">
                    Você selecionou 7 dias de treino. O descanso é fundamental para a recuperação e crescimento muscular. Tem certeza que deseja treinar todos os dias sem pausas?
                  </p>
                </div>
                <div className="flex flex-col gap-3 w-full mt-4">
                  <button
                    onClick={() => {
                      setShowRestWarning(false);
                      setStep(step + 1);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-full font-black text-sm w-full transition-all flex items-center justify-center shadow-lg shadow-yellow-500/20"
                  >
                    Sim, seguir mesmo assim
                  </button>
                  <button
                    onClick={() => setShowRestWarning(false)}
                    className="bg-black/50 border border-white/10 hover:bg-white/5 text-zinc-300 px-8 py-3 rounded-full font-bold text-sm w-full transition-all"
                  >
                    Voltar e alterar
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {step === 1 && (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-bold text-white mb-2">Dias livres para treinar</h3>
                      <p className="text-sm text-zinc-400">Quais dias da semana você tem disponibilidade?</p>
                    </div>
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      {weekDays.map((day) => {
                        const isSelected = formData.activeDays.includes(day.id);
                        return (
                          <button
                            key={day.id}
                            onClick={() => {
                              if (isSelected) {
                                setFormData({ ...formData, activeDays: formData.activeDays.filter(d => d !== day.id) });
                              } else {
                                setFormData({ ...formData, activeDays: [...formData.activeDays, day.id] });
                              }
                            }}
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all ${isSelected
                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                                : 'bg-black/50 border border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white'
                              }`}
                          >
                            {day.label}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-bold text-white mb-2">Modalidade de Treino</h3>
                      <p className="text-sm text-zinc-400">Escolha o seu foco principal.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {modalities.map((mod) => (
                        <button
                          key={mod.id}
                          onClick={() => handleSingleChoice('modality', mod.id)}
                          className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${formData.modality === mod.id
                              ? 'bg-red-500/20 border-red-500/50 text-white'
                              : 'bg-black/50 border-white/5 text-zinc-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                          <div className={`p-2 rounded-lg ${formData.modality === mod.id ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-zinc-500'}`}>
                            <mod.icon size={20} />
                          </div>
                          <span className="font-bold">{mod.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-bold text-white mb-2">Onde será feito o treino?</h3>
                      <p className="text-sm text-zinc-400">Escolha os ambientes (pode selecionar mais de um).</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {locations.map((loc) => {
                        const isSelected = formData.location.includes(loc.id);
                        return (
                          <button
                            key={loc.id}
                            onClick={() => handleToggleArray('location', loc.id)}
                            className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${isSelected
                                ? 'bg-red-500/20 border-red-500/50 text-white'
                                : 'bg-black/50 border-white/5 text-zinc-400 hover:bg-white/5 hover:text-white'
                              }`}
                          >
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-zinc-500'}`}>
                              <loc.icon size={20} />
                            </div>
                            <span className="font-bold">{loc.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-bold text-white mb-2">Qual seu nível de treino?</h3>
                      <p className="text-sm text-zinc-400">Isso nos ajuda a definir a intensidade correta.</p>
                    </div>

                    <div className="flex flex-col gap-6">
                      {/* Opção Descobrir Destacada */}
                      <button
                        onClick={() => handleSingleChoice('intensityLevel', 'descobrir')}
                        className={`w-full p-4 rounded-xl border-2 font-black transition-all flex items-center justify-center gap-2 ${formData.intensityLevel === 'descobrir'
                            ? 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/20'
                            : 'bg-red-500/10 border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-white'
                          }`}
                      >
                        <Target size={20} />
                        DESCOBRIR MEU NÍVEL (Fazer Teste)
                      </button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white/5" />
                        </div>
                        <div className="relative flex justify-center text-xs font-bold">
                          <span className="bg-[#121214] px-4 text-zinc-500 tracking-wider">OU ESCOLHA MANUALMENTE</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {intensityLevels.map((lvl) => (
                          <button
                            key={lvl.id}
                            onClick={() => handleSingleChoice('intensityLevel', lvl.id)}
                            className={`p-4 rounded-xl border font-bold transition-all ${formData.intensityLevel === lvl.id
                                ? 'bg-red-500/20 border-red-500/50 text-white'
                                : 'bg-black/50 border-white/5 text-zinc-400 hover:bg-white/5 hover:text-white'
                              }`}
                          >
                            {lvl.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {step === 5 && (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-bold text-white mb-2">Quais músculos NÃO quer trabalhar hoje?</h3>
                      <p className="text-sm text-zinc-400">Eles não entrarão no seu treino.</p>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-3 gap-y-6 gap-x-2 h-72 overflow-y-auto scrollbar-hide pb-10">
                      {MUSCLE_GROUPS.map((mg) => {
                        const isSelected = formData.focusMuscles.includes(mg.id);
                        return (
                          <div key={mg.id} className="flex flex-col items-center gap-2">
                            <button
                              onClick={() => {
                                if (isSelected) {
                                  setFormData({ ...formData, focusMuscles: formData.focusMuscles.filter(m => m !== mg.id) });
                                } else {
                                  setFormData({ ...formData, focusMuscles: [...formData.focusMuscles, mg.id] });
                                }
                              }}
                              className={`relative w-20 h-20 rounded-full overflow-hidden border-2 transition-all group bg-black ${isSelected
                                  ? 'border-emerald-500 shadow-lg shadow-emerald-500/40 ring-4 ring-emerald-500/20'
                                  : 'border-white/10 hover:border-white/30'
                                }`}
                            >
                              <img
                                src={mg.image}
                                alt={mg.label}
                                className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${isSelected ? 'opacity-100 scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'opacity-60 scale-125 group-hover:opacity-100'}`}
                              />
                              <div className={`absolute inset-0 transition-colors ${isSelected ? 'bg-emerald-500/10 mix-blend-overlay' : 'bg-black/20 group-hover:bg-transparent'}`} />
                            </button>
                            <span className={`text-[10px] font-bold text-center leading-tight uppercase tracking-wider ${isSelected ? 'text-emerald-400' : 'text-zinc-400'}`}>
                              {mg.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {step === 6 && (() => {
                  const allAvailableGroups = equipmentGroups.filter(g => g.equipments.length > 0);
                  const allStaticEquipments = Array.from(new Set(allAvailableGroups.flatMap(g => g.equipments)));
                  const selectedCount = formData.equipment.length;
                  const currentMuscle = expandedEqMuscle || 'custom';

                  return (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-bold text-white mb-2">Equipamentos Disponíveis</h3>
                      <p className="text-sm text-zinc-400 mb-1">Selecione os equipamentos que deseja incluir ou excluir do treino.</p>
                      <div className="flex justify-center flex-wrap gap-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                          {selectedCount} Equipamentos no Treino
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 h-[400px] overflow-y-auto scrollbar-hide pb-10">
                      {/* Equipamentos Selecionados */}
                      {selectedCount > 0 && (
                        <div className="bg-[#121214] p-4 rounded-xl border border-emerald-500/30 shrink-0 mb-2">
                          <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-3">Equipamentos Selecionados</h4>
                          <div 
                            className="overflow-x-auto pt-3 pb-2 scrollbar-hide w-full cursor-grab active:cursor-grabbing"
                            ref={eqScrollRef}
                            onMouseEnter={() => { isEqHoveredRef.current = true; }}
                            onMouseLeave={() => { isEqHoveredRef.current = false; }}
                            onTouchStart={() => { isEqHoveredRef.current = true; }}
                            onTouchEnd={() => { isEqHoveredRef.current = false; }}
                          >
                            <div className="flex w-max">
                              <div className={`flex gap-3 ${selectedCount > 4 ? 'pr-12' : ''}`}>
                                {formData.equipment.map((eq, index) => {
                                  const customEq = storeCustomEqs.find(c => c.name === eq);
                                  const displayName = customEq ? customEq.name : (equipmentNameOverrides[`static-${eq}`] || eq);
                                  const displayImage = customEq ? (customEq.image || 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=200&auto=format&fit=crop') : (equipmentImageOverrides[`static-${eq}`] || getEquipmentImage(eq));

                                  return (
                                    <div key={`selected-${eq}-block1`} className="flex flex-col items-center gap-2 shrink-0 w-16 relative">
                                      <div className="absolute -top-1 right-0 z-10 w-5 h-5 bg-emerald-500 text-[#121214] text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#121214] pointer-events-none">
                                        {index + 1}
                                      </div>
                                      <button
                                        onClick={() => handleRemoveEq(eq)}
                                        className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center group"
                                      >
                                        {displayImage === 'none' ? (
                                          <div className="flex items-center justify-center w-full h-full text-zinc-500 font-bold text-sm bg-white/5">{displayName.charAt(0).toUpperCase()}</div>
                                        ) : displayImage === 'icon' ? (
                                          <div className="flex items-center justify-center w-full h-full text-zinc-500 bg-white/5"><Dumbbell size={16} /></div>
                                        ) : (
                                          <img src={displayImage} alt={displayName} className="absolute inset-0 w-full h-full object-cover" />
                                        )}
                                        <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                          <X size={20} className="text-white" />
                                        </div>
                                      </button>
                                      <span className="text-[9px] font-bold text-center leading-tight tracking-wider text-emerald-400 line-clamp-2">
                                        {displayName}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                              
                              {selectedCount > 4 && (
                                <div className="flex gap-3 pr-12">
                                  {formData.equipment.map((eq, index) => {
                                    const customEq = storeCustomEqs.find(c => c.name === eq);
                                    const displayName = customEq ? customEq.name : (equipmentNameOverrides[`static-${eq}`] || eq);
                                    const displayImage = customEq ? (customEq.image || 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=200&auto=format&fit=crop') : (equipmentImageOverrides[`static-${eq}`] || getEquipmentImage(eq));

                                    return (
                                      <div key={`selected-${eq}-block2`} className="flex flex-col items-center gap-2 shrink-0 w-16 relative">
                                        <div className="absolute -top-1 right-0 z-10 w-5 h-5 bg-emerald-500 text-[#121214] text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#121214] pointer-events-none">
                                          {index + 1}
                                        </div>
                                        <button
                                          onClick={() => handleRemoveEq(eq)}
                                          className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center group"
                                        >
                                          {displayImage === 'none' ? (
                                            <div className="flex items-center justify-center w-full h-full text-zinc-500 font-bold text-sm bg-white/5">{displayName.charAt(0).toUpperCase()}</div>
                                          ) : displayImage === 'icon' ? (
                                            <div className="flex items-center justify-center w-full h-full text-zinc-500 bg-white/5"><Dumbbell size={16} /></div>
                                          ) : (
                                            <img src={displayImage} alt={displayName} className="absolute inset-0 w-full h-full object-cover" />
                                          )}
                                          <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X size={20} className="text-white" />
                                          </div>
                                        </button>
                                        <span className="text-[9px] font-bold text-center leading-tight tracking-wider text-emerald-400 line-clamp-2">
                                          {displayName}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Seletor de Musculo Customizado */}
                      <div className="relative shrink-0 z-30">
                        <button
                          type="button"
                          onClick={() => setIsEqDropdownOpen(!isEqDropdownOpen)}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white uppercase tracking-wider focus:outline-none focus:border-emerald-500 flex items-center justify-between"
                        >
                          <span className="flex items-center gap-3">
                            <span>{currentMuscle === 'custom' ? 'Todos os equipamentos' : (MUSCLE_GROUPS.find(m => m.id === currentMuscle)?.label || currentMuscle)}</span>
                            
                            {/* Current selected stats in the button itself */}
                            {(() => {
                              const currentGroupEqs = currentMuscle === 'custom' 
                                ? Array.from(new Set([...storeCustomEqs.map(e => e.name), ...allStaticEquipments]))
                                : (allAvailableGroups.find(g => g.muscle === currentMuscle)?.equipments || []);
                              const selectedInGroup = currentGroupEqs.filter(eq => formData.equipment.includes(eq)).length;
                              const unselectedInGroup = currentGroupEqs.length - selectedInGroup;

                              return (
                                <div className="flex items-center gap-1.5 opacity-80 relative group/info">
                                  <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-[10px] font-bold shadow-sm border border-white/5">
                                    {unselectedInGroup}
                                  </div>
                                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[#121214] text-[10px] font-bold shadow-sm">
                                    {selectedInGroup}
                                  </div>
                                  
                                  {/* Tooltip */}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-zinc-900 border border-white/10 rounded-lg p-3 text-xs text-zinc-300 opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all z-50 shadow-xl flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 shrink-0 border border-white/10"></div>
                                      <span className="leading-tight normal-case font-normal text-left">Equipamentos não selecionados</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></div>
                                      <span className="leading-tight normal-case font-normal text-left">Equipamentos selecionados</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </span>
                          <ChevronDown className={`text-zinc-500 transition-transform ${isEqDropdownOpen ? 'rotate-180' : ''}`} size={16} />
                        </button>

                        {isEqDropdownOpen && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setIsEqDropdownOpen(false)}></div>
                            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-40 py-2 flex flex-col scrollbar-thin">
                              {/* Option: Custom */}
                              {storeCustomEqs.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setExpandedEqMuscle('custom');
                                    setIsEqDropdownOpen(false);
                                  }}
                                  className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-white/5 transition-colors ${currentMuscle === 'custom' ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-300'}`}
                                >
                                  <span className="text-sm font-bold uppercase tracking-wider">Todos os equipamentos</span>
                                  {(() => {
                                    const eqNames = Array.from(new Set([...storeCustomEqs.map(e => e.name), ...allStaticEquipments]));
                                    const sel = eqNames.filter(eq => formData.equipment.includes(eq)).length;
                                    const unsel = eqNames.length - sel;
                                    return (
                                      <div className="flex items-center gap-1.5 opacity-80">
                                        <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-[9px] font-bold shadow-sm border border-white/5">{unsel}</div>
                                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[#121214] text-[9px] font-bold shadow-sm">{sel}</div>
                                      </div>
                                    );
                                  })()}
                                </button>
                              )}

                              {/* Options: Regular Groups */}
                              {allAvailableGroups.map(g => {
                                const sel = g.equipments.filter(eq => formData.equipment.includes(eq)).length;
                                const unsel = g.equipments.length - sel;
                                const isCurrent = currentMuscle === g.muscle;
                                
                                return (
                                  <button
                                    key={g.muscle}
                                    type="button"
                                    onClick={() => {
                                      setExpandedEqMuscle(g.muscle);
                                      setIsEqDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-white/5 transition-colors ${isCurrent ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-300'}`}
                                  >
                                    <span className="text-sm font-bold uppercase tracking-wider">{MUSCLE_GROUPS.find(m => m.id === g.muscle)?.label || g.muscle}</span>
                                    <div className="flex items-center gap-1.5 opacity-80">
                                      <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-[9px] font-bold shadow-sm border border-white/5">{unsel}</div>
                                      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[#121214] text-[9px] font-bold shadow-sm">{sel}</div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Busca opcional */}
                      <div className="relative shrink-0">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input
                          type="text"
                          value={eqSearchQuery}
                          onChange={(e) => setEqSearchQuery(e.target.value)}
                          placeholder="Buscar neste grupo..."
                          className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-white/20"
                        />
                      </div>

                      {/* Grid de Equipamentos */}
                      <div className="bg-[#121214] p-4 rounded-xl border border-white/5 mt-2">
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-6 gap-x-2">
                          {currentMuscle === 'custom' && storeCustomEqs.filter(eq => eq.name.toLowerCase().includes(eqSearchQuery.toLowerCase())).map(eq => {
                            const isSelected = formData.equipment.includes(eq.name);
                            return (
                                  <div key={`custom-${eq.id}`} className="flex flex-col items-center gap-2">
                                      <div className="relative">
                                        <button
                                          onClick={() => {
                                            setEquipmentModalData({
                                              id: eq.name,
                                              name: eq.name,
                                              image: eq.image || 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=200&auto=format&fit=crop',
                                              isSelected,
                                              description: eq.description,
                                              showAffiliateLink: !!eq.showAffiliateLink
                                            });
                                          }}
                                          className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 transition-all flex items-center justify-center group ${isSelected
                                              ? 'border-emerald-500 shadow-lg shadow-emerald-500/40 ring-4 ring-emerald-500/20 brightness-110'
                                              : 'border-white/10 hover:border-white/30'
                                            }`}
                                        >
                                          <img
                                            src={eq.image || 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=200&auto=format&fit=crop'}
                                            alt={eq.name}
                                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${isSelected ? 'opacity-100' : 'opacity-40 group-hover:opacity-60'}`}
                                          />
                                          {isSelected && <div className="absolute inset-0 bg-emerald-500/20 mix-blend-overlay" />}
                                        </button>
                                        {isSelected && (
                                          <div className="absolute -bottom-1 -right-1 z-10 w-6 h-6 bg-emerald-500 text-[#121214] rounded-full flex items-center justify-center border-2 border-[#121214]">
                                            <Check size={14} strokeWidth={3} />
                                          </div>
                                        )}
                                      </div>
                                    <span className={`text-[10px] font-bold text-center leading-tight tracking-wider px-1 ${isSelected ? 'text-emerald-400' : 'text-zinc-400'}`}>
                                      {eq.name}
                                    </span>
                                  </div>
                            );
                          })}

                          {currentMuscle === 'custom' && allStaticEquipments.filter(eq => {
                            if (storeCustomEqs.some(c => c.name === eq)) return false;
                            const displayName = equipmentNameOverrides[`static-${eq}`] || eq;
                            return displayName.toLowerCase().includes(eqSearchQuery.toLowerCase());
                          }).map(eq => {
                            const displayName = equipmentNameOverrides[`static-${eq}`] || eq;
                            const displayImage = equipmentImageOverrides[`static-${eq}`] || getEquipmentImage(eq);
                            const isSelected = formData.equipment.includes(eq);

                            return (
                                      <div key={`all-static-${eq}`} className="flex flex-col items-center gap-2">
                                        <div className="relative">
                                          <button
                                            onClick={() => {
                                              setEquipmentModalData({
                                                id: eq,
                                                name: displayName,
                                                image: displayImage,
                                                isSelected,
                                                description: equipmentDescriptionOverrides[`static-${eq}`],
                                                showAffiliateLink: !!equipmentAffiliateLinkOverrides[`static-${eq}`]
                                              });
                                            }}
                                            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 transition-all flex items-center justify-center group ${isSelected
                                                ? 'border-emerald-500 shadow-lg shadow-emerald-500/40 ring-4 ring-emerald-500/20 brightness-110'
                                                : 'border-white/10 hover:border-white/30'
                                              }`}
                                          >
                                            {displayImage === 'none' ? (
                                              <div className="flex items-center justify-center w-full h-full text-zinc-500 font-bold text-lg bg-white/5">{displayName.charAt(0).toUpperCase()}</div>
                                            ) : displayImage === 'icon' ? (
                                              <div className="flex items-center justify-center w-full h-full text-zinc-500 bg-white/5"><Dumbbell size={24} /></div>
                                            ) : (
                                              <img src={displayImage} alt={displayName} className="absolute inset-0 w-full h-full object-cover" />
                                            )}
                                            {isSelected && <div className="absolute inset-0 bg-emerald-500/20 mix-blend-overlay" />}
                                          </button>
                                          {isSelected && (
                                            <div className="absolute -bottom-1 -right-1 z-10 w-6 h-6 bg-emerald-500 text-[#121214] rounded-full flex items-center justify-center border-2 border-[#121214]">
                                              <Check size={14} strokeWidth={3} />
                                            </div>
                                          )}
                                        </div>
                                        <span className={`text-[10px] font-bold text-center leading-tight tracking-wider px-1 ${isSelected ? 'text-emerald-400' : 'text-zinc-400'}`}>
                                          {displayName}
                                        </span>
                                      </div>
                            );
                          })}

                          {currentMuscle !== 'custom' && (allAvailableGroups.find(g => g.muscle === currentMuscle)?.equipments || []).filter(eq => {
                            const displayName = equipmentNameOverrides[`static-${eq}`] || eq;
                            return displayName.toLowerCase().includes(eqSearchQuery.toLowerCase());
                          }).map(eq => {
                            const displayName = equipmentNameOverrides[`static-${eq}`] || eq;
                            const displayImage = equipmentImageOverrides[`static-${eq}`] || getEquipmentImage(eq);
                            const isSelected = formData.equipment.includes(eq);

                            return (
                                      <div key={`${currentMuscle}-${eq}`} className="flex flex-col items-center gap-2">
                                        <div className="relative">
                                          <button
                                            onClick={() => {
                                              setEquipmentModalData({
                                                id: eq,
                                                name: displayName,
                                                image: displayImage,
                                                isSelected,
                                                description: equipmentDescriptionOverrides[`static-${eq}`],
                                                showAffiliateLink: !!equipmentAffiliateLinkOverrides[`static-${eq}`]
                                              });
                                            }}
                                            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 transition-all flex items-center justify-center group ${isSelected
                                                ? 'border-emerald-500 shadow-lg shadow-emerald-500/40 ring-4 ring-emerald-500/20 brightness-110'
                                                : 'border-white/10 hover:border-white/30'
                                              }`}
                                          >
                                            {displayImage === 'none' ? (
                                              <div className="flex items-center justify-center w-full h-full text-zinc-500 font-bold text-lg bg-white/5">{displayName.charAt(0).toUpperCase()}</div>
                                            ) : displayImage === 'icon' ? (
                                              <div className="flex items-center justify-center w-full h-full text-zinc-500 bg-white/5"><Dumbbell size={24} /></div>
                                            ) : (
                                              <img src={displayImage} alt={displayName} className="absolute inset-0 w-full h-full object-cover" />
                                            )}
                                            {isSelected && <div className="absolute inset-0 bg-emerald-500/20 mix-blend-overlay" />}
                                          </button>
                                          {isSelected && (
                                            <div className="absolute -bottom-1 -right-1 z-10 w-6 h-6 bg-emerald-500 text-[#121214] rounded-full flex items-center justify-center border-2 border-[#121214]">
                                              <Check size={14} strokeWidth={3} />
                                            </div>
                                          )}
                                        </div>
                                        <span className={`text-[10px] font-bold text-center leading-tight tracking-wider px-1 ${isSelected ? 'text-emerald-400' : 'text-zinc-400'}`}>
                                          {displayName}
                                        </span>
                                      </div>
                            );
                          })}
                        </div>
                        {currentMuscle === 'custom' && 
                          storeCustomEqs.filter(eq => eq.name.toLowerCase().includes(eqSearchQuery.toLowerCase())).length === 0 && 
                          allStaticEquipments.filter(eq => {
                            const displayName = equipmentNameOverrides[`static-${eq}`] || eq;
                            return displayName.toLowerCase().includes(eqSearchQuery.toLowerCase());
                          }).length === 0 && (
                           <div className="text-center col-span-3 sm:col-span-4 text-zinc-500 py-8 text-sm">Nenhum equipamento encontrado.</div>
                        )}
                        {currentMuscle !== 'custom' && (allAvailableGroups.find(g => g.muscle === currentMuscle)?.equipments || []).filter(eq => {
                            const displayName = equipmentNameOverrides[`static-${eq}`] || eq;
                            return displayName.toLowerCase().includes(eqSearchQuery.toLowerCase());
                          }).length === 0 && (
                           <div className="text-center text-zinc-500 py-8 text-sm">Nenhum equipamento encontrado.</div>
                        )}
                      </div>

                      {lastRemovedEq && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#121214] border border-emerald-500/30 text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-4 z-50 text-sm animate-in slide-in-from-bottom-5 fade-in">
                          <span className="font-medium text-zinc-300">Equipamento removido.</span>
                          <button onClick={handleUndoRemove} className="flex items-center gap-1.5 text-emerald-400 font-bold hover:text-emerald-300 transition-colors">
                            <Undo size={14} /> Desfazer
                          </button>
                          <button onClick={() => setLastRemovedEq(null)} className="ml-2 text-zinc-500 hover:text-zinc-300">
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                  );
                })()}

                {step === 7 && (() => {
                  const targetLevel = formData.intensityLevel === 'leve' ? 'Leve' 
                                    : formData.intensityLevel === 'moderado' ? 'Moderado' 
                                    : formData.intensityLevel === 'avancado' ? 'Avançado' 
                                    : null; // 'descobrir' uses null

                  const allAvailableExs = allExercises.filter(ex => {
                    // 1. Modality and Location
                    const matchesModality = ex.modalities.includes(formData.modality);
                    const matchesLocation = formData.location.some((l: string) => ex.locations.includes(l));
                    if (!matchesModality || !matchesLocation) return false;

                    // 2. Level
                    const hasTargetLevel = targetLevel ? (ex.levels && ex.levels.some((l: any) => l.level === targetLevel)) : true;
                    if (!hasTargetLevel) return false;

                    // 3. Focus Muscles
                    if (formData.focusMuscles.length > 0) {
                      const belongsToFocus = ex.muscleGroups.some((m: string) => formData.focusMuscles.includes(m));
                      if (!belongsToFocus) return false;
                    }

                    // 4. Equipment
                    if (formData.equipment.length > 0 && ex.requiredEquipment.length > 0) {
                      // Allow if they selected at least ONE of the required equipment,
                      // or if they have selected all of them. .some() is more permissive.
                      const hasEq = ex.requiredEquipment.some((eq: string) => formData.equipment.includes(eq));
                      if (!hasEq) return false;
                    }

                    return true;
                  });

                  // Group available exercises by muscle group (using the first muscle group)
                  const exsByMuscle: Record<string, typeof allAvailableExs> = {};
                  allAvailableExs.forEach(ex => {
                    const m = ex.muscleGroups[0] || 'outros';
                    if (!exsByMuscle[m]) exsByMuscle[m] = [];
                    exsByMuscle[m].push(ex);
                  });

                  const sortedExsByMuscle = Object.entries(exsByMuscle).sort(([mA], [mB]) => {
                    const idxA = formData.focusMuscles.indexOf(mA);
                    const idxB = formData.focusMuscles.indexOf(mB);
                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                    if (idxA !== -1) return -1;
                    if (idxB !== -1) return 1;
                    return mA.localeCompare(mB);
                  });

                  return (
                    <>
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-bold text-white mb-2">Exercícios (Opcional)</h3>
                        <p className="text-sm text-zinc-400">Escolha quais exercícios você quer priorizar. O sistema preencherá o resto automaticamente.</p>
                      </div>

                      <div className="flex flex-col gap-4 h-80 overflow-y-auto scrollbar-hide pb-10 content-start">
                        {sortedExsByMuscle.map(([muscle, exs]) => {
                          const isExpanded = expandedExMuscle === muscle;
                          const selectedCount = exs.filter(ex => formData.exercises.includes(ex.id)).length;
                          const isPrimary = formData.focusMuscles.indexOf(muscle) === 0;
                          const isSecondary = formData.focusMuscles.indexOf(muscle) > 0;
                          
                          const badgeClasses = isPrimary 
                            ? 'bg-yellow-500/20 text-yellow-400' 
                            : (isSecondary ? 'bg-sky-500/20 text-sky-400' : 'bg-white/10 text-zinc-400');
                          
                          const groupBorderClasses = isPrimary 
                            ? 'border-yellow-500/30' 
                            : (isSecondary ? 'border-sky-500/30' : 'border-white/5');

                          return (
                            <div key={muscle} className={`bg-[#121214] rounded-xl border ${groupBorderClasses} overflow-hidden transition-all shrink-0`}>
                              <button
                                onClick={() => setExpandedExMuscle(isExpanded ? null : muscle)}
                                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                                    {MUSCLE_GROUPS.find(m => m.id === muscle)?.label || muscle}
                                  </h4>
                                  {isPrimary && <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded uppercase">Principal</span>}
                                  {isSecondary && <span className="text-[10px] font-bold text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded uppercase">Secundário</span>}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-[10px] px-2 py-1 rounded-md font-bold ${badgeClasses}`}>
                                    {selectedCount} SELECIONADOS
                                  </span>
                                  {isExpanded ? <ChevronUp size={16} className="text-zinc-500" /> : <ChevronDown size={16} className="text-zinc-500" />}
                                </div>
                              </button>

                              {isExpanded && (
                                <div className="p-4 pt-0 border-t border-white/5 mt-2 space-y-2">
                                  {exs.map((ex: any) => {
                                    const isSelected = formData.exercises.includes(ex.id);
                                    return (
                                      <button
                                        key={ex.id}
                                        onClick={() => {
                                          if (isSelected) {
                                            setFormData({ ...formData, exercises: formData.exercises.filter(id => id !== ex.id) });
                                          } else {
                                            setFormData({ ...formData, exercises: [...formData.exercises, ex.id] });
                                          }
                                        }}
                                        className={`w-full flex items-center gap-4 p-3 rounded-xl border transition-all text-left ${isSelected
                                            ? (isPrimary ? 'bg-yellow-500/20 border-yellow-500/50' : (isSecondary ? 'bg-sky-500/20 border-sky-500/50' : 'bg-zinc-500/20 border-zinc-500/50'))
                                            : 'bg-black/50 border-white/5 hover:bg-white/5'
                                          }`}
                                      >
                                        {ex.image === 'none' ? (
                                          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                            <span className="text-zinc-500 font-bold text-lg">{ex.name.charAt(0).toUpperCase()}</span>
                                          </div>
                                        ) : ex.image && ex.image !== 'icon' ? (
                                          <div 
                                            className="w-12 h-12 rounded-lg bg-black flex-shrink-0 relative overflow-hidden group/img cursor-pointer"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setPreviewImage(ex.image);
                                            }}
                                          >
                                            <img src={ex.image} alt={ex.name} className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                              <Search size={16} className="text-white" />
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                            <Dumbbell size={20} className="text-zinc-500" />
                                          </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <h5 className={`font-bold ${isSelected ? (isPrimary ? 'text-yellow-400' : (isSecondary ? 'text-sky-400' : 'text-zinc-300')) : 'text-white'}`}>{ex.name}</h5>
                                          <div className="flex gap-2 mt-1">
                                            {(() => {
                                              const matchedLvl = ex.levels?.find((l: any) => l.level === targetLevel) || ex.levels?.[0];
                                              if (!matchedLvl) return null;
                                              return (
                                                <>
                                                  <span className="text-[10px] text-zinc-500 bg-white/5 px-2 py-0.5 rounded-md uppercase tracking-wider">{matchedLvl.defaultSets}x {matchedLvl.defaultReps}</span>
                                                  {matchedLvl.defaultWeight && <span className="text-[10px] text-zinc-500 bg-white/5 px-2 py-0.5 rounded-md uppercase tracking-wider">Carga: {matchedLvl.defaultWeight}</span>}
                                                  <span className="text-[10px] text-zinc-500 bg-white/5 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                                    {formData.intensityLevel === 'descobrir' ? 'Teste de Nível' : matchedLvl.level}
                                                  </span>
                                                </>
                                              );
                                            })()}
                                          </div>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {Object.keys(exsByMuscle).length === 0 && (
                          <div className="text-center text-zinc-500 py-10">
                            Nenhum exercício encontrado com os equipamentos selecionados.
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}

                {step === 8 && (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-bold text-white mb-2">Registro Fotográfico</h3>
                      <p className="text-sm text-zinc-400">Tire uma foto inicial para comparar seu antes e depois futuramente.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {photoOptions.map((opt) => (
                        <button
                          key={opt.id.toString()}
                          onClick={() => handlePhotoChoice(opt.id)}
                          className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${formData.photoTaken === opt.id
                              ? 'bg-red-500/20 border-red-500/50 text-white'
                              : 'bg-black/50 border-white/5 text-zinc-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                          <div className={`p-2 rounded-lg ${formData.photoTaken === opt.id ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-zinc-500'}`}>
                            <opt.icon size={20} />
                          </div>
                          <span className="font-bold">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === 9 && (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-black text-white mb-2">SEU TREINO FOI CRIADO! 🎉</h3>
                      <p className="text-sm text-zinc-400">Com base nos seus <span className="text-white font-bold">{numDays} dias</span> de treino na semana, o gerador montou a seguinte divisão:</p>
                      
                      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mt-6">
                        <div className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Divisão Recomendada</div>
                        <h4 className="text-3xl font-black text-white">{recommendedSplit}</h4>
                        <p className="text-sm text-zinc-300 mt-4 leading-relaxed">{splitExplanations[recommendedSplit].desc}</p>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Conheça outras divisões:</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {['FullBody', 'AB', 'ABC', 'ABCD', 'ABCDE'].filter(s => s !== recommendedSplit).map(s => (
                          <button 
                            key={s} 
                            onClick={() => {
                              setSelectedAlternativeSplit(s);
                              setShowSplitWarning(false);
                            }} 
                            className="p-4 bg-black/50 border border-white/5 rounded-xl text-zinc-400 font-bold hover:bg-white/5 hover:text-white transition-all text-sm flex items-center justify-between group"
                          >
                            {s}
                            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Alternative Split Modal */}
        <AnimatePresence>
          {selectedAlternativeSplit && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-0 bg-zinc-950 z-20 flex flex-col"
            >
              <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md z-10">
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Divisão {selectedAlternativeSplit}</h2>
                <button onClick={() => setSelectedAlternativeSplit(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-white mb-2">Como funciona?</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {splitExplanations[selectedAlternativeSplit].desc}
                  </p>
                  <div className="mt-6 p-4 bg-black/50 rounded-xl border border-white/5 flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg text-zinc-400">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Frequência Ideal</div>
                      <div className="text-sm font-bold text-white">{splitExplanations[selectedAlternativeSplit].idealDays} {splitExplanations[selectedAlternativeSplit].idealDays === 1 ? 'dia' : 'dias'} por semana</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t border-white/10 pt-6">
                    <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-4">Ajustar dias para alcançar o equilíbrio:</div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      {weekDays.map((day) => {
                        const isSelected = formData.activeDays.includes(day.id);
                        return (
                          <button
                            key={day.id}
                            onClick={() => {
                              if (isSelected) {
                                setFormData({ ...formData, activeDays: formData.activeDays.filter(d => d !== day.id) });
                              } else {
                                setFormData({ ...formData, activeDays: [...formData.activeDays, day.id] });
                              }
                              setShowSplitWarning(false);
                            }}
                            className={`flex-1 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${isSelected
                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                                : 'bg-black/50 border border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white'
                              }`}
                          >
                            {day.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {showSplitWarning && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 flex gap-3 text-amber-500"
                  >
                    <AlertTriangle size={24} className="shrink-0" />
                    <div className="text-sm">
                      {selectedAlternativeSplit === 'FullBody' && consecutive ? (
                        <><strong>Atenção Risco Alto!</strong> Você marcou dias de treino <strong>consecutivos</strong>. O FullBody exige pelo menos 48h de descanso para cada músculo, o que significa pular um dia entre cada treino. Treinar FullBody em dias seguidos pode causar fadiga severa e lesões. Considere adotar {numDays <= 3 ? 'AB' : 'ABC'}. Deseja continuar?</>
                      ) : (
                        <><strong>Atenção!</strong> Você marcou que irá treinar {numDays} dias na semana, mas a divisão {selectedAlternativeSplit} é recomendada para {splitExplanations[selectedAlternativeSplit].idealDays} dias. O gerador tentará adaptar a divisão aos seus dias, mas o resultado pode não ser ideal. Deseja continuar?</>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
              <div className="p-6 border-t border-white/5 bg-black/20">
                {(() => {
                  let isBalanced = false;
                  if (selectedAlternativeSplit === 'FullBody') {
                    isBalanced = !consecutive && numDays > 0;
                  } else if (selectedAlternativeSplit === 'AB') {
                    isBalanced = numDays >= 2;
                  } else if (selectedAlternativeSplit === 'ABC') {
                    isBalanced = numDays >= 3;
                  } else if (selectedAlternativeSplit === 'ABCD') {
                    isBalanced = numDays >= 4;
                  } else if (selectedAlternativeSplit === 'ABCDE') {
                    isBalanced = numDays >= 5;
                  }

                  return (
                    <button
                      onClick={() => {
                        const ideal = splitExplanations[selectedAlternativeSplit].idealDays;
                        // Mismatch validation (fallback for warnings)
                        if (!showSplitWarning && !isBalanced) {
                          const isFullBodyConsecutive = selectedAlternativeSplit === 'FullBody' && consecutive;
                          const isLowFrequencyForHighSplit = 
                            (ideal === 5 && numDays < 4) ||
                            (ideal === 4 && numDays < 3) ||
                            (ideal === 3 && numDays < 3 && numDays > 0);

                          if (isFullBodyConsecutive || isLowFrequencyForHighSplit) {
                            setShowSplitWarning(true);
                            return;
                          }
                        }
                        onComplete({ ...formData, splitType: selectedAlternativeSplit });
                      }}
                      className={`w-full rounded-xl py-4 font-bold transition-all flex items-center justify-center gap-2 ${
                        isBalanced 
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      {isBalanced ? 'TREINO EQUILIBRADO' : 'IGNORAR SUGESTÃO E ADOTAR ESSE TREINO'} <ArrowRight size={20} />
                    </button>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {(!showPhotoGuidance && !showDiscoverGuidance && !showRestWarning && !selectedAlternativeSplit) && (
          <div className="p-6 border-t border-white/5 bg-black/20">
            <div className="flex gap-3">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white rounded-xl py-4 font-bold transition-colors"
                >
                  Voltar
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && formData.activeDays.length === 0) ||
                  (step === 2 && !formData.modality) ||
                  (step === 3 && !formData.location) ||
                  (step === 4 && !formData.intensityLevel) ||
                  (step === 5 && formData.focusMuscles.length === 0 && formData.modality !== 'cardio') ||
                  (step === 6 && formData.equipment.length === 0) ||
                  (step === 8 && formData.photoTaken === undefined)
                }
                className={`flex-[2] bg-red-500 hover:bg-red-600 text-white rounded-xl py-4 font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
              >
                {step === 9 ? `Adotar Recomendação (${recommendedSplit})` : 'Continuar'} <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Equipment Detail Modal */}
      <AnimatePresence>
        {equipmentModalData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEquipmentModalData(null)}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative max-w-md w-full bg-[#121214] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 w-full">
                {equipmentModalData.image === 'none' ? (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500 font-bold text-6xl">
                    {equipmentModalData.name.charAt(0).toUpperCase()}
                  </div>
                ) : equipmentModalData.image === 'icon' ? (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500">
                    <Dumbbell size={64} />
                  </div>
                ) : (
                  <img src={equipmentModalData.image} alt={equipmentModalData.name} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121214] to-transparent"></div>
                <button
                  onClick={() => setEquipmentModalData(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-6">
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">{equipmentModalData.name}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
                    {equipmentModalData.description || 'Este equipamento é excelente para otimizar seus resultados. Em breve, instruções detalhadas de uso estarão disponíveis aqui.'}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      if (equipmentModalData.isSelected) {
                        handleRemoveEq(equipmentModalData.id);
                      } else {
                        setFormData({ ...formData, equipment: [...formData.equipment, equipmentModalData.id] });
                      }
                      setEquipmentModalData(null);
                    }}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      equipmentModalData.isSelected
                        ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'
                    }`}
                  >
                    {equipmentModalData.isSelected ? (
                      <>Remover do Treino</>
                    ) : (
                      <><Check size={20} /> Adicionar ao Treino</>
                    )}
                  </button>

                  {equipmentModalData.showAffiliateLink && (
                    <button
                      onClick={() => {
                        window.open(`https://amazon.com.br/s?k=${encodeURIComponent(equipmentModalData.name)}`, '_blank');
                      }}
                      className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-orange-500/20 transition-all"
                    >
                      ADQUIRA
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute -top-12 right-0 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
              <img src={previewImage} alt="Preview" className="w-full h-auto rounded-2xl object-contain max-h-[80vh]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
