import React from 'react';
import { Shield, Zap, Eye, EyeOff } from 'lucide-react';

interface NotificationsVaultTabProps {
  unlockedVault: boolean;
  setUnlockedVault: (unlocked: boolean) => void;
  pinInput: string;
  setPinInput: (pin: string) => void;
  handleVaultUnlock: () => void;
  vulnerabilidades: any[];
  tarefas: any[];
  missoes: any[];
  formatDays: (startTime: number) => number;
  startConsumption: (id: string) => void;
  setItem: (item: any) => void;
}

export function NotificationsVaultTab({
  unlockedVault,
  setUnlockedVault,
  pinInput,
  setPinInput,
  handleVaultUnlock,
  vulnerabilidades,
  tarefas,
  missoes,
  formatDays,
  startConsumption,
  setItem
}: NotificationsVaultTabProps) {

  return (
    <div className="flex flex-col gap-3">
      {!unlockedVault ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <Shield size={40} className="text-purple-400/50" />
          <p className="text-white/60 text-xs text-center px-4 leading-relaxed">
            Esta área protege tarefas sensíveis de olhares de terceiros (ex: Pornografia, Drogas). Digite o PIN para acessar.
          </p>
          <div className="flex gap-2 w-full px-6">
            <label htmlFor="vault-pin" className="sr-only">PIN do Cofre</label>
            <input
              id="vault-pin"
              name="vaultPin"
              aria-label="PIN do Cofre"
              type="password"
              value={pinInput}
              onChange={e => setPinInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleVaultUnlock()}
              className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-center flex-1 outline-none focus:border-purple-400/50 transition-colors"
              placeholder="PIN (1234)"
            />
            <button onClick={handleVaultUnlock} className="bg-purple-400/20 text-purple-400 px-4 py-2 rounded-xl font-bold text-xs hover:bg-purple-400/40 transition-colors">
              ABRIR
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-purple-400 text-xs font-bold tracking-wider">VULNERABILIDADES</span>
            <button onClick={() => { setUnlockedVault(false); setPinInput(''); }} className="text-white/30 text-[10px] hover:text-white uppercase">Bloquear</button>
          </div>
          {vulnerabilidades.length === 0 && <p className="text-white/40 text-xs text-center py-4">O cofre está vazio.</p>}
          {vulnerabilidades.map(v => (
            <div key={v.id} className="bg-purple-900/20 border border-purple-400/20 rounded-xl p-3 flex items-center justify-between group hover:bg-purple-900/40 transition-colors">
              <div className="flex flex-col">
                <span className="text-purple-400 text-sm font-bold">{v.config?.customName || v.name.toUpperCase()}</span>
                <span className="text-purple-400/50 text-[10px] uppercase tracking-wider">{formatDays(v.startDate)} dias protegidos</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startConsumption(v.id)}
                  className="w-8 h-8 rounded-full bg-purple-400/10 text-purple-400 flex items-center justify-center hover:bg-purple-400/30 transition-colors"
                  title="Registro Rápido"
                >
                  <Zap size={14} />
                </button>
                <button
                  onClick={() => setItem({ ...v, config: { ...v.config, isHidden: !v.config?.isHidden } })}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${v.config?.isHidden ? 'bg-white/10 text-white/40 hover:text-white' : 'bg-purple-400/20 text-purple-400 hover:bg-purple-400/40'}`}
                  title={v.config?.isHidden ? "Mostrar no mapa" : "Ocultar do mapa"}
                >
                  {v.config?.isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  onClick={() => {
                    setItem({ ...v, config: { ...v.config, isVulnerability: false } });
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-purple-400/20 text-purple-400 hover:bg-purple-400/40"
                  title="Remover do Cofre"
                >
                  <Shield size={14} />
                </button>
              </div>
            </div>
          ))}

          <div className="mt-4 border-t border-white/10 pt-4">
            <span className="text-white/30 text-[10px] font-bold tracking-wider mb-2 block">ADICIONAR AO COFRE</span>
            <div className="flex flex-col gap-2">
              {tarefas.length === 0 && missoes.length === 0 && <p className="text-white/20 text-[10px] text-center py-2">Nenhuma tarefa disponível para proteger.</p>}
              {[...tarefas, ...missoes].map(t => (
                <div key={t.id} className="bg-white/5 rounded-lg p-2 flex items-center justify-between group hover:bg-white/10 transition-colors">
                  <span className="text-white/70 text-xs">{t.config?.customName || t.name.toUpperCase()}</span>
                  <button
                    onClick={() => {
                      setItem({ ...t, config: { ...t.config, isVulnerability: true } });
                    }}
                    className="w-6 h-6 rounded flex items-center justify-center bg-white/5 text-white/30 hover:text-purple-400 hover:bg-purple-400/10 transition-colors"
                    title="Proteger no Cofre"
                  >
                    <Shield size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
