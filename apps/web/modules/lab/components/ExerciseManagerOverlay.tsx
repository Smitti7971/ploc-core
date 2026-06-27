import React, { useState } from 'react';
import { useExerciseDatabaseStore } from '@/modules/dashboard/components/tracker/store/useExerciseDatabaseStore';
import { equipmentImages } from '@/modules/dashboard/components/tracker/utils/equipmentData';
import { exerciseDatabase } from '@/modules/dashboard/components/tracker/utils/workoutGenerator';
import { X, Plus, Trash2, ChevronDown, ChevronUp, Dumbbell, Edit2, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ExerciseManagerOverlay({ onClose }: { onClose: () => void }) {
  const { 
    customEquipments, customExercises, 
    deletedStaticEquipments, deletedStaticExercises,
    preSelectedStaticEquipments, setStaticEquipmentPreSelected,
    addCustomEquipment, removeCustomEquipment, updateCustomEquipment, restoreCustomEquipment,
    addCustomExercise, removeCustomExercise, updateCustomExercise, restoreCustomExercise,
    hideStaticEquipment, hideStaticExercise, restoreStaticEquipment, restoreStaticExercise, 
    cleanupRecycleBin,
    exerciseImageOverrides, setExerciseImage,
    exerciseModalityOverrides, setExerciseModalities,
    exerciseLocationOverrides, setExerciseLocations,
    equipmentImageOverrides, setEquipmentImage,
    equipmentNameOverrides, setEquipmentName,
    equipmentDescriptionOverrides, setEquipmentDescription,
    equipmentAffiliateLinkOverrides, setEquipmentAffiliateLink
  } = useExerciseDatabaseStore();
  
  const [activeTab, setActiveTab] = useState<'ativos' | 'lixeira'>('ativos');
  const [newExMainEq, setNewExMainEq] = useState<string>('');
  const [expandedEqId, setExpandedEqId] = useState<string | null>(null);

  const [newEqName, setNewEqName] = useState('');
  const [newEqImage, setNewEqImage] = useState('');
  const [newEqImageType, setNewEqImageType] = useState<'url'|'icon'|'none'>('url');

  const [newExImage, setNewExImage] = useState('');
  const [newExImageType, setNewExImageType] = useState<'url' | 'icon' | 'none'>('url');
  
  const [showExFormForEq, setShowExFormForEq] = useState<string | null>(null);
  const [expandedLevels, setExpandedLevels] = useState<string[]>(['Acompanhamento', 'Leve', 'Moderado', 'Avançado']);
  
  const [editingExId, setEditingExId] = useState<string | null>(null);

  const [newExName, setNewExName] = useState('');
  const [newExMuscles, setNewExMuscles] = useState<string[]>([]);
  const [newExAdditionalEqs, setNewExAdditionalEqs] = useState<string[]>([]);
  const [newExLevels, setNewExLevels] = useState<{level: string, defaultSets: number, defaultReps: string, defaultWeight?: string}[]>([
    { level: 'Acompanhamento', defaultSets: 3, defaultReps: 'Até a falha', defaultWeight: 'Leve' },
    { level: 'Leve', defaultSets: 3, defaultReps: '12-15', defaultWeight: 'Leve' },
    { level: 'Moderado', defaultSets: 3, defaultReps: '10-12', defaultWeight: 'Moderada' },
    { level: 'Avançado', defaultSets: 4, defaultReps: '8-10', defaultWeight: 'Pesada' },
  ]);
  const [newExModalities, setNewExModalities] = useState<string[]>(['musculacao']);
  const [newExLocations, setNewExLocations] = useState<string[]>(['academia']);
  const [showAdditionalEqs, setShowAdditionalEqs] = useState(false);

  const LEVELS = ['Acompanhamento', 'Leve', 'Moderado', 'Avançado'];

  const getLevelColorClass = (level: string) => {
    switch (level) {
      case 'Acompanhamento': return 'text-blue-400';
      case 'Leve': return 'text-green-400';
      case 'Moderado': return 'text-amber-400';
      case 'Avançado': return 'text-red-400';
      default: return 'text-sky-400';
    }
  };
  
  const MUSCLE_LABELS: Record<string, string> = {
    chest: 'Peito',
    back: 'Costas',
    shoulders: 'Ombros',
    biceps: 'Bíceps',
    triceps: 'Tríceps',
    quadriceps: 'Quadríceps',
    hamstrings: 'Posterior',
    glutes: 'Glúteos',
    calves: 'Panturrilha',
    abs: 'Abdômen',
    lombar: 'Lombar'
  };
  const MUSCLE_GROUPS = Object.keys(MUSCLE_LABELS);

  const toggleMuscle = (m: string) => {
    setNewExMuscles(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  };

  const toggleModality = (m: string) => {
    setNewExModalities(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  };

  const toggleLocation = (l: string) => {
    setNewExLocations(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);
  };

  // Ativos
  const staticEquipments = Object.keys(equipmentImages)
    .filter(name => {
      const id = `static-${name}`;
      const oldArr = Array.isArray(deletedStaticEquipments) ? deletedStaticEquipments : [];
      const isDeletedObj = !Array.isArray(deletedStaticEquipments) && !!(deletedStaticEquipments as any)[id];
      return !oldArr.includes(id as never) && !isDeletedObj;
    })
    .map(name => {
      const id = `static-${name}`;
      return {
        id,
        name: equipmentNameOverrides[id] || name,
        image: equipmentImageOverrides[id] || equipmentImages[name],
        isStatic: true
      };
    });

  const allEquipments = [...staticEquipments, ...customEquipments.filter(e => !e.deletedAt).map(e => ({ ...e, isStatic: false }))];
  
  const staticExercises = exerciseDatabase
    .filter(ex => {
      const oldArr = Array.isArray(deletedStaticExercises) ? deletedStaticExercises : [];
      const isDeletedObj = !Array.isArray(deletedStaticExercises) && !!(deletedStaticExercises as any)[ex.id];
      return !oldArr.includes(ex.id as never) && !isDeletedObj;
    })
    .map(ex => ({ 
      ...ex, 
      isStatic: true, 
      image: exerciseImageOverrides[ex.id] || (ex as any).image,
      modalities: exerciseModalityOverrides[ex.id] || (ex as any).modalities || ['musculacao'],
      locations: exerciseLocationOverrides[ex.id] || (ex as any).locations || ['academia']
    }));
    
  const allExercises = [...staticExercises, ...customExercises.filter(e => !e.deletedAt).map(e => ({ ...e, isStatic: false }))];

  // Lixeira
  const recycleBinEquipments = [
    ...(Object.keys(Array.isArray(deletedStaticEquipments) ? {} : deletedStaticEquipments)).map(id => {
      const name = id.replace('static-', '');
      return {
        id,
        name: equipmentNameOverrides[id] || name,
        image: equipmentImageOverrides[id] || equipmentImages[name],
        isStatic: true,
        deletedAt: (deletedStaticEquipments as any)[id] as number
      };
    }),
    ...customEquipments.filter(e => e.deletedAt).map(e => ({ ...e, isStatic: false }))
  ].sort((a, b) => (b.deletedAt || 0) - (a.deletedAt || 0));

  const recycleBinExercises = [
    ...(Object.keys(Array.isArray(deletedStaticExercises) ? {} : deletedStaticExercises)).map(id => {
      const ex = exerciseDatabase.find(e => e.id === id);
      if (!ex) return null;
      return {
        ...ex,
        isStatic: true,
        image: exerciseImageOverrides[id] || (ex as any).image,
        deletedAt: (deletedStaticExercises as any)[id] as number
      };
    }).filter(Boolean) as any[],
    ...customExercises.filter(e => e.deletedAt).map(e => ({ ...e, isStatic: false }))
  ].sort((a, b) => (b.deletedAt || 0) - (a.deletedAt || 0));

  const handleAddEq = () => {
    if (!newEqName.trim()) return;
    const id = `eq-${Date.now()}`;
    const finalImage = newEqImageType === 'url' 
      ? (newEqImage.trim() || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop')
      : newEqImageType;

    addCustomEquipment({
      id,
      name: newEqName.trim(),
      image: finalImage,
      preSelected: false
    });
    setNewEqName('');
    setNewEqImage('');
    setNewEqImageType('url');
    setExpandedEqId(id);
  };

  const handleEditEx = (ex: any) => {
    setEditingExId(ex.id);
    setShowExFormForEq(null);
    setNewExName(ex.name);
    setNewExMuscles(ex.muscleGroups);
    const mainEqName = allEquipments.find(e => e.id === expandedEqId)?.name || ex.requiredEquipment[0] || '';
    setNewExMainEq(mainEqName);
    setNewExAdditionalEqs(ex.requiredEquipment.filter((req: string) => req !== mainEqName));
    setNewExLevels(ex.levels || [
      { level: 'Acompanhamento', defaultSets: 3, defaultReps: 'Até a falha', defaultWeight: 'Leve' },
      { level: 'Leve', defaultSets: 3, defaultReps: '12-15', defaultWeight: 'Leve' },
      { level: 'Moderado', defaultSets: 3, defaultReps: '10-12', defaultWeight: 'Moderada' },
      { level: 'Avançado', defaultSets: 4, defaultReps: '8-10', defaultWeight: 'Pesada' },
    ]);
    if (ex.image === 'icon' || ex.image === 'none') {
      setNewExImageType(ex.image);
      setNewExImage('');
    } else {
      setNewExImageType('url');
      setNewExImage(ex.image || '');
    }
    setNewExModalities(ex.modalities || ['musculacao']);
    setNewExLocations(ex.locations || ['academia']);
  };

  const handleDuplicateEx = (ex: any) => {
    const finalImage = ex.image === 'icon' || ex.image === 'none' ? ex.image : (ex.image || undefined);
    addCustomExercise({
      id: `ex-${Date.now()}`,
      name: `${ex.name} (Cópia)`,
      muscleGroups: ex.muscleGroups,
      requiredEquipment: ex.requiredEquipment,
      levels: ex.levels || [
        { level: 'Acompanhamento', defaultSets: 3, defaultReps: 'Até a falha', defaultWeight: 'Leve' },
        { level: 'Leve', defaultSets: 3, defaultReps: '12-15', defaultWeight: 'Leve' },
        { level: 'Moderado', defaultSets: 3, defaultReps: '10-12', defaultWeight: 'Moderada' },
        { level: 'Avançado', defaultSets: 4, defaultReps: '8-10', defaultWeight: 'Pesada' },
      ],
      image: finalImage,
      modalities: ex.modalities || ['musculacao'],
      locations: ex.locations || ['academia']
    });
  };

  const handleAddEx = () => {
    const eqName = newExMainEq;
    if (!newExName.trim() || newExMuscles.length === 0) return;

    const finalImage = newExImageType === 'url' 
      ? (newExImage.trim() || undefined)
      : newExImageType;

    if (editingExId) {
      const existing = allExercises.find(e => e.id === editingExId);
      if (existing) {
        if (existing.isStatic) {
          hideStaticExercise(existing.id);
          addCustomExercise({
            id: `ex-${Date.now()}`,
            name: newExName.trim(),
            muscleGroups: newExMuscles,
            requiredEquipment: [eqName, ...newExAdditionalEqs],
            levels: newExLevels,
            image: finalImage,
            modalities: newExModalities,
            locations: newExLocations
          });
        } else {
          updateCustomExercise(editingExId, {
            name: newExName.trim(),
            muscleGroups: newExMuscles,
            requiredEquipment: [eqName, ...newExAdditionalEqs],
            levels: newExLevels,
            image: finalImage,
            modalities: newExModalities,
            locations: newExLocations
          });
        }
      }
    } else {
      addCustomExercise({
        id: `ex-${Date.now()}`,
        name: newExName.trim(),
        muscleGroups: newExMuscles,
        requiredEquipment: [eqName, ...newExAdditionalEqs],
        levels: newExLevels,
        image: finalImage,
        modalities: newExModalities,
        locations: newExLocations
      });
    }

    setNewExName('');
    setNewExMuscles([]);
    setNewExAdditionalEqs([]);
    setNewExMainEq('');
    setNewExLevels([
      { level: 'Acompanhamento', defaultSets: 3, defaultReps: 'Até a falha', defaultWeight: 'Leve' },
      { level: 'Leve', defaultSets: 3, defaultReps: '12-15', defaultWeight: 'Leve' },
      { level: 'Moderado', defaultSets: 3, defaultReps: '10-12', defaultWeight: 'Moderada' },
      { level: 'Avançado', defaultSets: 4, defaultReps: '8-10', defaultWeight: 'Pesada' },
    ]);
    setNewExImage('');
    setNewExImageType('url');
    setNewExModalities(['musculacao']);
    setNewExLocations(['academia']);
    setShowExFormForEq(null);
    setEditingExId(null);
  };

  const toggleLevel = (e: React.MouseEvent, level: string) => {
    e.stopPropagation();
    setExpandedLevels(prev => prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#0f172a] border border-slate-700/50 rounded-[2rem] w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400">
              <Dumbbell size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Equipamentos & Exercícios</h2>
              <p className="text-sm text-slate-400 font-medium">Gerencie a base de dados do PLOC</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pt-4">
          <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl w-max">
            <button
              onClick={() => setActiveTab('ativos')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'ativos' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Ativos
            </button>
            <button
              onClick={() => setActiveTab('lixeira')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'lixeira' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Lixeira
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {activeTab === 'ativos' ? (
          <>
          {/* Add New Equipment Section */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-5 flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">Novo Equipamento</label>
              <input 
                type="text" 
                placeholder="Ex: Polia Alta" 
                value={newEqName}
                onChange={e => setNewEqName(e.target.value)}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-2xl px-4 py-3 text-sm outline-none focus:border-sky-500 transition-colors"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">Estilo de Ícone</label>
              <select 
                value={newEqImageType}
                onChange={e => setNewEqImageType(e.target.value as any)}
                className="w-full bg-slate-900 text-white border border-slate-700 rounded-2xl px-4 py-3 text-sm outline-none focus:border-sky-500 transition-colors"
              >
                <option value="url">Imagem (URL)</option>
                <option value="icon">Ícone Padrão</option>
                <option value="none">Nenhum</option>
              </select>
            </div>
            {newEqImageType === 'url' && (
              <div className="flex-1 w-full">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">Imagem URL ou Upload</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="https://..." 
                    value={newEqImage}
                    onChange={e => setNewEqImage(e.target.value)}
                    className="w-full bg-slate-900 text-white border border-slate-700 rounded-2xl px-4 py-3 text-sm outline-none focus:border-sky-500 transition-colors"
                  />
                  <label className="shrink-0 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-sky-400 cursor-pointer hover:bg-slate-700 hover:text-white transition-colors flex items-center justify-center font-bold">
                    Upload
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => setNewEqImage(ev.target?.result as string);
                          reader.readAsDataURL(file);
                        }
                      }} 
                    />
                  </label>
                </div>
              </div>
            )}
            <button  
              onClick={handleAddEq}
              disabled={!newEqName.trim()}
              className="w-full md:w-auto bg-sky-500 hover:bg-sky-400 text-white rounded-2xl px-6 py-3 text-sm font-bold disabled:opacity-50 transition-colors flex items-center justify-center gap-2 h-[46px]"
            >
              <Plus size={18} /> Adicionar
            </button>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent my-2 opacity-50"></div>

          {/* List of Equipments (Accordion) */}
          <div className="space-y-4">
            {allEquipments.map(eq => {
              const isExpanded = expandedEqId === eq.id;
              const baseName = eq.isStatic ? eq.id.replace('static-', '') : eq.name;
              const eqExercises = allExercises.filter(ex => ex.requiredEquipment.includes(eq.name) || ex.requiredEquipment.includes(baseName));
              
              return (
                <div key={eq.id} className={`border transition-all duration-300 rounded-[1.5rem] overflow-hidden ${isExpanded ? 'border-sky-500/50 bg-slate-800/80 shadow-lg' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'}`}>
                  
                  {/* Equipment Header (Clickable) */}
                  <div 
                    onClick={() => setExpandedEqId(isExpanded ? null : eq.id)}
                    className="p-4 flex items-center gap-4 cursor-pointer select-none"
                  >
                    <div 
                      className="relative group/eqimg"
                      onClick={(e) => {
                        e.stopPropagation();
                        const url = window.prompt('Cole a nova URL da foto do equipamento (ou digite "icon" para usar o ícone, ou "none" para remover a imagem):', eq.image);
                        if (url !== null) {
                          setEquipmentImage(eq.id, url.trim());
                        }
                      }}
                    >
                      {eq.image === 'none' ? (
                        <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 font-bold text-lg transition-opacity group-hover/eqimg:opacity-50">
                          {eq.name.charAt(0).toUpperCase()}
                        </div>
                      ) : eq.image === 'icon' ? (
                        <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 transition-opacity group-hover/eqimg:opacity-50">
                          <Dumbbell size={20} />
                        </div>
                      ) : (
                        <img src={eq.image} alt={eq.name} className="w-14 h-14 rounded-2xl object-cover bg-slate-950 border border-slate-800 transition-opacity group-hover/eqimg:opacity-50" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/eqimg:opacity-100 transition-opacity">
                        <span className="text-[10px] font-bold bg-black/60 text-white px-2 py-1 rounded">Editar</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-white">{eq.name}</h3>
                      <p className="text-sm text-slate-400">{eqExercises.length} {eqExercises.length === 1 ? 'exercício vinculado' : 'exercícios vinculados'}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Switch Pré-selecionado */}
                      <label 
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Padrão</span>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={eq.isStatic ? !!preSelectedStaticEquipments[eq.id] : !!eq.preSelected}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              if (eq.isStatic) {
                                setStaticEquipmentPreSelected(eq.id, checked);
                              } else {
                                updateCustomEquipment(eq.id, { preSelected: checked });
                              }
                            }}
                          />
                          <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
                        </div>
                      </label>

                      {/* Switch Venda */}
                      <label 
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Venda</span>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={eq.isStatic ? !!equipmentAffiliateLinkOverrides[eq.id] : !!eq.showAffiliateLink}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setEquipmentAffiliateLink(eq.id, checked);
                            }}
                          />
                          <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                        </div>
                      </label>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedEqId(eq.id);
                          setShowExFormForEq(eq.id);
                          setEditingExId(null);
                          setNewExName('');
                          setNewExMainEq(eq.name);
                          setNewExMuscles([]);
                          setNewExAdditionalEqs([]);
                          setNewExLevels([
                            { level: 'Acompanhamento', defaultSets: 3, defaultReps: 'Até a falha', defaultWeight: 'Leve' },
                            { level: 'Leve', defaultSets: 3, defaultReps: '12-15', defaultWeight: 'Leve' },
                            { level: 'Moderado', defaultSets: 3, defaultReps: '10-12', defaultWeight: 'Moderada' },
                            { level: 'Avançado', defaultSets: 4, defaultReps: '8-10', defaultWeight: 'Pesada' },
                          ]);
                          setNewExImageType('url');
                          setNewExImage('');
                        }}
                        className="p-2 text-slate-500 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-xl transition-colors"
                        title="Vincular Exercício"
                      >
                        <Plus size={20} />
                      </button>
                      {/* Rename and description moved to expanded area */}
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if (eq.isStatic) {
                            hideStaticEquipment(eq.id);
                          } else {
                            removeCustomEquipment(eq.id); 
                          }
                        }}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className={`p-2 rounded-xl transition-colors ${isExpanded ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-800 text-slate-400'}`}>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Area: Exercises */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 border-t border-slate-800/50 mt-2">
                          
                          <div className="mb-4 bg-slate-800/20 border border-slate-800 rounded-2xl p-4 space-y-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nome do Equipamento</label>
                              <input 
                                type="text"
                                value={eq.name}
                                onChange={(e) => setEquipmentName(eq.id, e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-sky-500 transition-colors"
                                placeholder="Nome..."
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Descrição / Instruções de uso</label>
                              <textarea 
                                value={eq.isStatic ? (equipmentDescriptionOverrides[eq.id] || '') : (eq.description || '')}
                                onChange={(e) => setEquipmentDescription(eq.id, e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-amber-500 transition-colors resize-none h-20"
                                placeholder="Este equipamento serve para..."
                              />
                            </div>
                          </div>

                          <div className="bg-slate-800/20 border border-slate-800 rounded-2xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                            {eqExercises.length === 0 ? (
                              <div className="md:col-span-2 text-center py-6 text-slate-500 text-sm border border-slate-800 border-dashed rounded-2xl">
                                Nenhum exercício. Adicione um abaixo.
                              </div>
                            ) : (
                              eqExercises.map(ex => (
                                <div key={ex.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex gap-3 group relative overflow-hidden hover:border-slate-700 transition-colors">
                                    <div 
                                      className="relative group/eximg cursor-pointer shrink-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const url = window.prompt('Cole a nova URL da foto do exercício (ou digite "icon" para usar o ícone, ou "none" para remover a imagem):', ex.image || '');
                                        if (url !== null) {
                                          setExerciseImage(ex.id, url.trim());
                                        }
                                      }}
                                    >
                                      {ex.image === 'none' ? (
                                        <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 font-bold transition-opacity group-hover/eximg:opacity-50">
                                          {ex.name.charAt(0).toUpperCase()}
                                        </div>
                                      ) : ex.image === 'icon' ? (
                                        <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 transition-opacity group-hover/eximg:opacity-50">
                                          <Dumbbell size={24} />
                                        </div>
                                      ) : ex.image ? (
                                        <img src={ex.image} alt={ex.name} className="w-16 h-16 rounded-xl object-cover border border-slate-700 bg-slate-950 transition-opacity group-hover/eximg:opacity-50" />
                                      ) : (
                                        <div className="w-16 h-16 rounded-xl border border-slate-700 border-dashed bg-slate-800/50 flex items-center justify-center text-slate-600 transition-opacity group-hover/eximg:opacity-50">
                                          <Dumbbell size={24} />
                                        </div>
                                      )}
                                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/eximg:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-bold bg-black/60 text-white px-2 py-1 rounded">Editar</span>
                                      </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-bold text-slate-200 mb-1.5">
                                        {ex.name}
                                      </div>
                                      <div className="flex flex-wrap gap-2 mb-2">
                                        {ex.levels?.map(l => (
                                          <span key={l.level} className={`text-[10px] uppercase font-bold tracking-wider bg-slate-800 px-2 py-1 rounded-md ${getLevelColorClass(l.level)}`}>
                                            {l.level}: {l.defaultSets}x {l.defaultReps}
                                          </span>
                                        ))}
                                        <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-800 text-slate-400 px-2 py-1 rounded-md">
                                          {ex.muscleGroups.map(m => MUSCLE_LABELS[m] || m).join(', ')}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="absolute right-2 bottom-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all bg-slate-900 rounded-lg shadow-[0_0_10px_10px_rgba(15,23,42,1)] p-1">
                                      <button 
                                        onClick={() => handleDuplicateEx(ex)}
                                        className="p-2 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all"
                                        title="Duplicar"
                                      >
                                        <Copy size={16} />
                                      </button>
                                      <button 
                                        onClick={() => handleEditEx(ex)}
                                        className="p-2 text-sky-500 hover:text-sky-400 hover:bg-sky-400/10 rounded-lg transition-all"
                                        title="Editar"
                                      >
                                        <Edit2 size={16} />
                                      </button>
                                      <button 
                                        onClick={() => {
                                            if (ex.isStatic) {
                                              hideStaticExercise(ex.id);
                                            } else {
                                              removeCustomExercise(ex.id);
                                            }
                                        }}
                                        className="p-2 text-red-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                        title="Remover"
                                      >
                                        <Trash2 size={16} />
                                        </button>
                                      </div>
                                    </div>
                                  ))
                            )}
                          </div>



                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              );
            })}
          </div>
          </>) : (
            <div className="space-y-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><Trash2 className="text-red-400" /> Itens Excluídos (Últimos 30 dias)</h3>
                <button 
                  onClick={cleanupRecycleBin}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm transition-colors"
                >
                  Limpar Antigos (&gt;30d)
                </button>
              </div>

              {recycleBinEquipments.length === 0 && recycleBinExercises.length === 0 && (
                <div className="text-center py-10 text-slate-500">A lixeira está vazia.</div>
              )}

              {recycleBinEquipments.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-md font-bold text-slate-400">Equipamentos Excluídos</h4>
                  {recycleBinEquipments.map(eq => (
                    <div key={eq.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between opacity-75">
                      <div className="flex items-center gap-4">
                        <img src={eq.image} alt={eq.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <p className="text-white font-bold">{eq.name}</p>
                          <p className="text-xs text-slate-500">Deletado em: {new Date(eq.deletedAt || Date.now()).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => eq.isStatic ? restoreStaticEquipment(eq.id) : restoreCustomEquipment(eq.id)}
                        className="px-4 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-xl font-bold transition-colors"
                      >
                        Restaurar
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {recycleBinExercises.length > 0 && (
                <div className="space-y-4 mt-8">
                  <h4 className="text-md font-bold text-slate-400">Exercícios Excluídos</h4>
                  {recycleBinExercises.map(ex => (
                    <div key={ex.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between opacity-75">
                      <div className="flex items-center gap-4">
                        {ex.image && ex.image !== 'icon' && ex.image !== 'none' ? (
                          <img src={ex.image} alt={ex.name} className="w-10 h-10 rounded-xl object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500"><Dumbbell size={16} /></div>
                        )}
                        <div>
                          <p className="text-white font-bold">{ex.name}</p>
                          <p className="text-xs text-slate-500">Deletado em: {new Date(ex.deletedAt || Date.now()).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => ex.isStatic ? restoreStaticExercise(ex.id) : restoreCustomExercise(ex.id)}
                        className="px-4 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-xl font-bold transition-colors"
                      >
                        Restaurar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Exercise Modal */}
      <AnimatePresence>
        {(showExFormForEq || editingExId) && (() => {
          const activeEqId = showExFormForEq || expandedEqId;
          const activeEq = allEquipments.find(e => e.id === activeEqId);
          if (!activeEq) return null;

          return (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-slate-900 border ${editingExId ? 'border-sky-800' : 'border-slate-800'} rounded-[1.5rem] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl`}
              >
                {/* Header */}
                <div className={`p-4 border-b ${editingExId ? 'border-sky-800 bg-sky-900/20' : 'border-slate-800 bg-slate-900/50'} flex items-center justify-between rounded-t-[1.5rem]`}>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    {editingExId ? 'Editar Exercício' : `Vincular Novo Exercício: ${activeEq.name}`}
                  </h4>
                  <button 
                    onClick={() => {
                      setEditingExId(null);
                      setShowExFormForEq(null);
                    }}
                    className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {/* Form Content */}
                <div className="p-4 flex flex-col gap-4 overflow-y-auto scrollbar-hide">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    <div className="md:col-span-12 flex flex-col gap-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nome do Exercício</label>
                      <input 
                        type="text" 
                        placeholder="Nome (ex: Tríceps Polia)" 
                        value={newExName}
                        onChange={e => setNewExName(e.target.value)}
                        className="w-full bg-transparent text-white border-b-2 border-slate-700 px-0 py-2 text-xl font-black outline-none focus:border-sky-500 transition-colors placeholder:text-slate-600"
                      />
                    </div>
                    
                    <div className="md:col-span-12">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Equipamento Principal</label>
                      <select 
                        value={newExMainEq}
                        onChange={e => setNewExMainEq(e.target.value)}
                        className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-sky-500 transition-colors"
                      >
                        <option value="">Selecione o equipamento principal</option>
                        {allEquipments.map(eq => (
                          <option key={eq.id} value={eq.name}>{eq.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-12">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 mt-2">Níveis Configurados:</div>
                      <div className="space-y-2">
                        {newExLevels.map((lvl, idx) => (
                          <div key={idx} className="flex gap-2 items-center bg-slate-800/50 p-2 rounded-xl border border-slate-700">
                            <select 
                              value={lvl.level}
                              onChange={e => {
                                const newArr = [...newExLevels];
                                newArr[idx].level = e.target.value;
                                setNewExLevels(newArr);
                              }}
                              className={`bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs font-bold outline-none w-32 ${getLevelColorClass(lvl.level)}`}
                            >
                              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                            <input 
                              type="number" 
                              placeholder="Séries"
                              value={lvl.defaultSets || ''}
                              onChange={e => {
                                const newArr = [...newExLevels];
                                newArr[idx].defaultSets = Number(e.target.value);
                                setNewExLevels(newArr);
                              }}
                              className="w-16 bg-slate-900 text-white border border-slate-700 rounded-lg px-2 py-1.5 text-xs outline-none"
                            />
                            <input 
                              type="text" 
                              placeholder="Reps (ex: 10-12)"
                              value={lvl.defaultReps}
                              onChange={e => {
                                const newArr = [...newExLevels];
                                newArr[idx].defaultReps = e.target.value;
                                setNewExLevels(newArr);
                              }}
                              className="w-20 bg-slate-900 text-white border border-slate-700 rounded-lg px-2 py-1.5 text-xs outline-none"
                            />
                            <input 
                              type="text" 
                              placeholder="Carga (ex: Moderada)"
                              value={lvl.defaultWeight || ''}
                              onChange={e => {
                                const newArr = [...newExLevels];
                                newArr[idx].defaultWeight = e.target.value;
                                setNewExLevels(newArr);
                              }}
                              className="w-24 flex-1 bg-slate-900 text-white border border-slate-700 rounded-lg px-2 py-1.5 text-xs outline-none"
                            />
                            <button 
                              onClick={() => {
                                if (newExLevels.length > 1) {
                                  setNewExLevels(newExLevels.filter((_, i) => i !== idx));
                                }
                              }}
                              disabled={newExLevels.length <= 1}
                              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 disabled:opacity-50 disabled:hover:text-slate-500 disabled:hover:bg-transparent rounded-lg transition-colors ml-auto"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        {newExLevels.length < LEVELS.length && (
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              const available = LEVELS.find(l => !newExLevels.some(nl => nl.level === l)) || LEVELS[0];
                              setNewExLevels([...newExLevels, { level: available, defaultSets: 3, defaultReps: '10-12' }]);
                            }}
                            className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 mt-2"
                          >
                            <Plus size={14} /> Adicionar Nível
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-3">
                      <select 
                        value={newExImageType}
                        onChange={e => setNewExImageType(e.target.value as any)}
                        className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                      >
                        <option value="url">Imagem (URL)</option>
                        <option value="icon">Ícone Padrão</option>
                        <option value="none">Nenhum</option>
                      </select>
                    </div>
                    {newExImageType === 'url' && (
                      <div className="md:col-span-12 flex gap-2">
                        <input 
                          type="text" 
                          placeholder="URL da Foto ou faça upload..."
                          value={newExImage}
                          onChange={e => setNewExImage(e.target.value)}
                          className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-500 transition-colors"
                        />
                        <label className="shrink-0 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-sky-400 cursor-pointer hover:bg-slate-700 hover:text-white transition-colors flex items-center justify-center font-bold">
                          Upload
                          <input 
                            type="file" 
                            accept="image/*"
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => setNewExImage(ev.target?.result as string);
                                reader.readAsDataURL(file);
                              }
                            }} 
                          />
                        </label>
                      </div>
                    )}
                    
                    <div className="md:col-span-12 border border-slate-800 rounded-xl p-3 bg-slate-900/50">
                      <div 
                        className="flex items-center justify-between cursor-pointer group"
                        onClick={() => setShowAdditionalEqs(!showAdditionalEqs)}
                      >
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-300 transition-colors">
                          Equipamentos Adicionais Obrigatórios
                          {newExAdditionalEqs.length > 0 && (
                            <span className="ml-2 bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full">
                              {newExAdditionalEqs.length} selecionado{newExAdditionalEqs.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        {showAdditionalEqs ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                      </div>
                      <AnimatePresence>
                        {showAdditionalEqs && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-wrap gap-2">
                              {allEquipments.filter(e => e.name !== activeEq.name).map(e => (
                                <button 
                                  key={e.id}
                                  onClick={(eClick) => {
                                    eClick.preventDefault();
                                    setNewExAdditionalEqs(prev => prev.includes(e.name) ? prev.filter(x => x !== e.name) : [...prev, e.name]);
                                  }}
                                  className={`px-3 py-1 rounded-md text-[10px] font-bold transition-colors uppercase tracking-wider ${newExAdditionalEqs.includes(e.name) ? 'bg-amber-500 text-black border border-amber-400' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-slate-300'}`}
                                >
                                  {e.name}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="md:col-span-6">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 mt-2">Modalidades do Exercício:</div>
                      <div className="flex flex-wrap gap-2">
                        {['musculacao', 'calistenia', 'crossfit', 'cardio'].map(m => (
                          <button 
                            key={m}
                            onClick={(eClick) => {
                              eClick.preventDefault();
                              toggleModality(m);
                            }}
                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-colors uppercase tracking-wider ${newExModalities.includes(m) ? 'bg-indigo-500 text-white border border-indigo-400' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-slate-300'}`}
                          >
                            {m === 'musculacao' ? 'Musculação' : m}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-6">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 mt-2">Locais Adequados:</div>
                      <div className="flex flex-wrap gap-2">
                        {['academia', 'casa', 'ar livre'].map(l => (
                          <button 
                            key={l}
                            onClick={(eClick) => {
                              eClick.preventDefault();
                              toggleLocation(l);
                            }}
                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-colors uppercase tracking-wider ${newExLocations.includes(l) ? 'bg-fuchsia-500 text-white border border-fuchsia-400' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-slate-300'}`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Muscles & Submit */}
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="flex-1 border border-slate-800 bg-slate-950/30 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Grupos Musculares Estimulados:</div>
                        {newExMuscles.length > 0 && (
                          <div className="text-[9px] text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">Ouro = Principal</div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {MUSCLE_GROUPS.map(m => (
                          <button 
                            key={m} 
                            onClick={() => toggleMuscle(m)}
                            className={`px-3 py-1 rounded-md text-[10px] font-bold transition-colors uppercase tracking-wider ${
                              newExMuscles[0] === m 
                                ? 'bg-amber-500 text-black border border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]' 
                                : newExMuscles.includes(m) 
                                  ? 'bg-sky-500 text-white border border-sky-400' 
                                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-slate-300'
                            }`}
                          >
                            {MUSCLE_LABELS[m]}
                          </button>
                        ))}
                      </div>
                    </div>
                      <button 
                        onClick={() => {
                          handleAddEx(activeEq.name);
                          setEditingExId(null);
                          setShowExFormForEq(null);
                        }}
                        disabled={!newExName.trim() || newExMuscles.length === 0}
                        className={`w-full md:w-auto shrink-0 text-white rounded-xl px-6 py-3 md:py-4 text-sm font-bold disabled:opacity-50 transition-colors flex items-center justify-center gap-2 h-full ${editingExId ? 'bg-sky-500 hover:bg-sky-400' : 'bg-emerald-500 hover:bg-emerald-400'}`}
                      >
                        {editingExId ? <><Edit2 size={18} /> Salvar</> : <><Plus size={18} /> Adicionar</>}
                      </button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
