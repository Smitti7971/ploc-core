import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, TrendingDown, Ban, Edit, History, XCircle } from 'lucide-react';
import { useViceStore, ViceMode } from '../store/viceStore';

interface ViceOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  viceId: string | null;
  initialStep?: 'options' | 'active_options' | 'history' | 'form_acompanhe' | 'form_diminua' | 'confirm_end';
}

export function ViceOptionsModal({ isOpen, onClose, viceId, initialStep }: ViceOptionsModalProps) {
  const [step, setStep] = useState<'options' | 'form_acompanhe' | 'form_diminua' | 'active_options' | 'history' | 'confirm_end'>('options');
  const [customViceName, setCustomViceName] = useState('');
  const [expectedFrequency, setExpectedFrequency] = useState('');
  const [days, setDays] = useState('0');
  const [hours, setHours] = useState('1');
  const [minutes, setMinutes] = useState('0');
  
  const activeVice = useViceStore(state => state.activeVice);
  const setActiveVice = useViceStore(state => state.setActiveVice);
  const setStoreCostPerUse = useViceStore(state => state.setCostPerUse);
  const viceLogs = useViceStore(state => state.logs);
  
  // Local state initialized from store
  const [costPerUse, setCostPerUse] = useState<string>(activeVice?.costPerUse?.toString() || '');
  const [isEditingCost, setIsEditingCost] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const timeActiveText = React.useMemo(() => {
    if (!activeVice || activeVice.viceId !== viceId) return null;
    const startLog = [...viceLogs].reverse().find(l => l.viceId === viceId && l.type === 'start');
    if (!startLog) return null;
    const diffSeconds = Math.floor((Date.now() - startLog.timestamp) / 1000);
    const d = Math.floor(diffSeconds / 86400);
    const h = Math.floor((diffSeconds % 86400) / 3600);
    const m = Math.floor((diffSeconds % 3600) / 60);
    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }, [activeVice, viceLogs, viceId, tick]);

  useEffect(() => {
    if (isOpen) {
      setStep(initialStep || 'options');
      setCustomViceName(activeVice?.viceId === 'personalizado' ? (activeVice.customName || '') : '');
    }
  }, [isOpen, initialStep, activeVice]);

  useEffect(() => {
    if (isOpen && viceId) {
      if (initialStep) {
        setStep(initialStep);
      } else if (activeVice && activeVice.viceId === viceId) {
        setStep('active_options');
      } else {
        setStep('options');
      }
      setCostPerUse(activeVice?.costPerUse?.toString() || '');
    }
  }, [isOpen, viceId, activeVice, initialStep]);

  const handleStartAcompanhe = () => {
    if (!viceId) return;
    setActiveVice({
      viceId: viceId!,
      customName: viceId === 'personalizado' ? customViceName : undefined,
      mode: 'acompanhe',
      startTime: Date.now(),
      expectedFrequency
    });
    setStep('active_options');
  };

  const handleStartDiminua = () => {
    const totalSeconds = (parseInt(days || '0') * 86400) + (parseInt(hours || '0') * 3600) + (parseInt(minutes || '0') * 60);
    setActiveVice({
      viceId: viceId!,
      customName: viceId === 'personalizado' ? customViceName : undefined,
      mode: 'diminua',
      startTime: Date.now(),
      timerLimitSeconds: totalSeconds,
      reductionTarget: parseFloat(reductionTarget || '0')
    });
    handleClose();
  };

  const handleClose = () => {
    // Note: step is reset by useEffect when opened
    setExpectedFrequency('');
    setDays('0');
    setHours('1');
    setMinutes('0');
    onClose();
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && viceId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-4 pb-24 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: '100%', scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: '100%', scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#0f1115] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
          >
            <div className="p-5 flex justify-between items-center border-b border-white/5 bg-[#16181c]">
              <h3 className="text-white font-extrabold tracking-widest text-sm uppercase">
                {step === 'options' ? 'Escolha sua Estratégia' 
                 : step === 'active_options' ? 'Gerenciar Libertesse'
                 : step === 'history' ? 'Histórico de Consumo'
                 : 'Configurar Estratégia'}
              </h3>
              <button 
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto">
              {step === 'options' && (
                <div className="flex flex-col gap-3">
                  {viceId === 'personalizado' && (
                    <div className="mb-4">
                      <label className="text-white text-xs font-bold tracking-widest mb-2 block">NOME DO VÍCIO (EX: DOCES, REDES SOCIAIS)</label>
                      <input 
                        type="text"
                        value={customViceName}
                        onChange={e => setCustomViceName(e.target.value)}
                        placeholder="Nome personalizado..."
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all placeholder:text-white/20"
                      />
                    </div>
                  )}

                  <OptionCard 
                    title="ACOMPANHE"
                    desc="Apenas registre cada vez que usar, para ter ciência da realidade."
                    icon={Activity}
                    color="#3b82f6"
                    onClick={() => setStep('form_acompanhe')}
                  />
                  <OptionCard 
                    title="DIMINUA"
                    desc="Estipule reduções e intervalos de jejum para diminuir o consumo gradualmente."
                    icon={TrendingDown}
                    color="#f59e0b"
                    onClick={() => {
                      if (viceId === 'personalizado' && !customViceName.trim()) {
                        alert("Por favor, dê um nome ao seu vício personalizado.");
                        return;
                      }
                      setStep('form_diminua');
                    }}
                  />
                  <OptionCard 
                    title="PARE"
                    desc="Interrompa completamente o vício (Em breve)."
                    icon={Ban}
                    color="#ef4444"
                    onClick={() => {}}
                  />
                  {viceLogs.some(l => l.viceId === viceId) && (
                    <OptionCard 
                      title="VER HISTÓRICO"
                      desc="Consulte seus registros passados."
                      icon={History}
                      color="#94a3b8"
                      onClick={() => setStep('history')}
                    />
                  )}
                </div>
              )}

              {step === 'active_options' && (
                <div className="flex flex-col gap-3">
                  {timeActiveText && (
                    <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3 mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity size={16} className="text-emerald-500" />
                        <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">Libertesse Ativo</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 text-[0.6rem] font-bold tracking-widest uppercase block mb-0.5">Tempo Ativo</span>
                        <span className="text-white text-xs font-extrabold">{timeActiveText}</span>
                      </div>
                    </div>
                  )}
                  <OptionCard 
                    title="CONSULTAR HISTÓRICO"
                    desc="Veja o histórico de consumos e tempos de jejum registrados."
                    icon={History}
                    color="#10b981"
                    onClick={() => setStep('history')}
                  />
                  <OptionCard 
                    title="EDITAR ESTRATÉGIA"
                    desc="Altere os parâmetros da sua estratégia atual."
                    icon={Edit}
                    color="#f59e0b"
                    onClick={() => setStep('options')}
                  />
                  <OptionCard 
                    title="ENCERRAR"
                    desc="Pare de acompanhar este vício agora."
                    icon={XCircle}
                    color="#ef4444"
                    onClick={() => {
                      setStep('confirm_end');
                    }}
                  />
                </div>
              )}

              {step === 'history' && (() => {
                const myLogs = viceLogs.filter(l => l.viceId === viceId);
                const consumptionLogs = myLogs.filter(l => l.type === 'consumption');
                const totalHoje = consumptionLogs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length;
                const totalGeral = consumptionLogs.length;
                const maiorJejum = myLogs.reduce((acc, curr) => Math.max(acc, curr.fastingSeconds || 0), 0);
                
                const formatTime = (sec: number) => {
                  const h = Math.floor(sec / 3600);
                  const m = Math.floor((sec % 3600) / 60);
                  if (h > 0) return `${h}h ${m}m`;
                  return `${m}m`;
                };

                return (
                <div className="flex flex-col gap-4">
                  {/* Top Header com 4 Cards */}
                  <div className="grid grid-cols-4 gap-1.5">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-1.5 flex flex-col items-center justify-center text-center">
                      <span className="text-[0.5rem] text-slate-400 font-bold uppercase tracking-widest mb-1 leading-tight">Uso<br/>Hoje</span>
                      <span className="text-white text-xs font-extrabold">{totalHoje}</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-1.5 flex flex-col items-center justify-center text-center">
                      <span className="text-[0.5rem] text-slate-400 font-bold uppercase tracking-widest mb-1 leading-tight">Uso<br/>Geral</span>
                      <span className="text-white text-xs font-extrabold">{totalGeral}</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-1.5 flex flex-col items-center justify-center text-center">
                      <span className="text-[0.5rem] text-slate-400 font-bold uppercase tracking-widest mb-1 leading-tight">Maior<br/>Jejum</span>
                      <span className="text-white text-xs font-extrabold text-sky-400">{maiorJejum > 0 ? formatTime(maiorJejum) : '--'}</span>
                    </div>
                    <div 
                      onClick={() => setIsEditingCost(true)}
                      className={`border border-white/10 rounded-xl p-1.5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${!costPerUse ? 'bg-white/5 hover:bg-white/10' : 'bg-red-500/10 border-red-500/20'}`}
                    >
                      <span className="text-[0.5rem] text-slate-400 font-bold uppercase tracking-widest mb-1 leading-tight">Gasto<br/>Atual</span>
                      <span className={`text-xs font-extrabold ${costPerUse ? 'text-red-400' : 'text-slate-500 text-[0.6rem]'}`}>
                        {costPerUse ? `R$ ${costPerUse}` : 'Registrar'}
                      </span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isEditingCost && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3 mt-1">
                          <p className="text-slate-300 text-sm">
                            Qual foi o valor pago na sua última compra? <br/>
                            <span className="text-xs text-slate-500">Isso ativará o contador de economia gerada pelo jejum.</span>
                          </p>
                          <div className="flex gap-2">
                            <input
                              autoFocus
                              type="text"
                              value={costPerUse}
                              onChange={(e) => setCostPerUse(e.target.value.replace(/[^0-9,.]/g, ''))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') setIsEditingCost(false);
                              }}
                              placeholder="R$ 0,00"
                              className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-white/30"
                            />
                            <button
                              onClick={() => {
                                setIsEditingCost(false);
                                setStoreCostPerUse(parseFloat(costPerUse.replace(',', '.')));
                              }}
                              className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white font-bold px-4 py-2 rounded-xl transition-colors text-xs tracking-widest"
                            >
                              SALVAR
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <p className="text-slate-400 text-sm mt-2">
                    Aqui estão seus últimos registros para este vício.
                  </p>
                  
                  <div className="space-y-3">
                    {myLogs.length > 0 ? myLogs.map((log) => (
                      <div key={log.id} className={`border rounded-xl p-3 ${
                        log.type === 'start' ? 'bg-sky-500/10 border-sky-500/20' :
                        log.type === 'end' ? 'bg-slate-500/10 border-slate-500/20' :
                        'bg-white/5 border-white/10'
                      }`}>
                        <p className="text-xs text-slate-400 font-bold mb-1">
                          {new Date(log.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {log.type === 'start' && (
                          <p className="text-sky-400 text-sm font-medium">Libertesse Iniciado</p>
                        )}
                        {log.type === 'end' && (
                          <p className="text-slate-400 text-sm font-medium">Libertesse Encerrado</p>
                        )}
                        {log.type === 'consumption' && (
                          <>
                            <p className="text-white text-sm font-medium">Consumo registrado: {Math.ceil((log.durationSeconds || 0) / 60)} minutos</p>
                            {log.fastingSeconds ? (
                               <p className="text-xs text-sky-400 font-bold mt-1">Jejum anterior: {formatTime(log.fastingSeconds)}</p>
                            ) : null}
                            {log.motivator && (
                               <div className="mt-2 bg-black/20 rounded-lg p-2 border border-white/5">
                                 <p className="text-[0.6rem] text-slate-500 uppercase font-bold mb-0.5">Motivador</p>
                                 <p className="text-xs text-slate-300 italic">"{log.motivator}"</p>
                               </div>
                            )}
                          </>
                        )}
                      </div>
                    )) : (
                      <p className="text-slate-500 text-sm italic text-center py-4">Nenhum registro encontrado ainda.</p>
                    )}
                  </div>

                  {myLogs.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm('Tem certeza que deseja apagar todo o histórico deste vício? Esta ação não pode ser desfeita.')) {
                          useViceStore.getState().clearLogs(viceId);
                        }
                      }}
                      className="w-full bg-red-500/10 text-red-500 font-bold py-3 rounded-xl hover:bg-red-500/20 transition-colors mt-2 text-xs tracking-widest border border-red-500/20"
                    >
                      APAGAR TODOS OS REGISTROS
                    </button>
                  )}

                  <button 
                    onClick={() => {
                      if (activeVice && activeVice.viceId === viceId) {
                        setStep('active_options');
                      } else {
                        setStep('options');
                      }
                    }}
                    className="w-full bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors mt-2 text-xs tracking-widest"
                  >
                    VOLTAR
                  </button>
                </div>
              )})()}

              {step === 'form_acompanhe' && (
                <div className="flex flex-col gap-4">
                  <p className="text-slate-400 text-sm mb-2">
                    Qual é a sua prévia de expectativa? Quantas vezes você acha que faz isso por dia/semana?
                  </p>
                  <input
                    type="text"
                    value={expectedFrequency}
                    onChange={(e) => setExpectedFrequency(e.target.value)}
                    placeholder="Ex: 5 vezes ao dia"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-white/30"
                  />
                  <button 
                    onClick={handleStartAcompanhe}
                    disabled={!expectedFrequency}
                    className="w-full bg-[#3b82f6] text-white font-bold py-3 rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-colors mt-2"
                  >
                    INICIAR ACOMPANHAMENTO
                  </button>
                </div>
              )}

              {step === 'form_diminua' && (
                <div className="flex flex-col gap-4">
                  <p className="text-slate-400 text-sm mb-2">
                    Defina o tempo de jejum até a proibição acabar.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Dias</label>
                      <input
                        type="number"
                        min="0"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-white/30 text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Horas</label>
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-white/30 text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Min</label>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={minutes}
                        onChange={(e) => setMinutes(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-white/30 text-center"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleStartDiminua}
                    disabled={parseInt(days) === 0 && parseInt(hours) === 0 && parseInt(minutes) === 0}
                    className="w-full bg-[#f59e0b] text-white font-bold py-3 rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors mt-2"
                  >
                    INICIAR REDUÇÃO
                  </button>
                </div>
              )}
              {step === 'confirm_end' && (
                <div className="flex flex-col items-center justify-center gap-4 py-4">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
                    <XCircle size={32} />
                  </div>
                  <h3 className="text-white text-lg font-black text-center">Encerrar Libertesse?</h3>
                  <p className="text-slate-400 text-sm text-center mb-4">
                    Tem certeza que deseja encerrar o acompanhamento deste vício? Esta ação não excluirá o seu histórico, mas interromperá a contagem de tempo atual.
                  </p>
                  
                  <div className="w-full flex gap-3">
                    <button 
                      onClick={() => setStep('active_options')}
                      className="flex-1 bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors text-xs tracking-widest"
                    >
                      CANCELAR
                    </button>
                    <button 
                      onClick={() => {
                        setActiveVice(null);
                        handleClose();
                      }}
                      className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors text-xs tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                    >
                      SIM, ENCERRAR
                    </button>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function OptionCard({ title, desc, icon: Icon, color, onClick, disabled }: any) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={!disabled ? onClick : undefined}
      className={`w-full border rounded-2xl p-4 flex items-center gap-4 text-left transition-all ${
        disabled ? 'opacity-40 cursor-not-allowed bg-black/20 border-white/5' : 'bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer'
      }`}
    >
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
      >
        <Icon size={20} color={color} />
      </div>
      <div>
        <h4 className="text-white font-extrabold text-sm mb-1">{title}</h4>
        <p className="text-slate-400 text-[0.7rem] leading-tight">{desc}</p>
      </div>
    </motion.button>
  );
}
