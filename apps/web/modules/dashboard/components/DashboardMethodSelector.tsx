import React from 'react';

interface DashboardMethodSelectorProps {
  METHODS: Array<{
    id: string;
    label: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    desc: string;
  }>;
  activeMethod: string;
  setActiveMethod: (id: string) => void;
  activeVicesList: any[];
  scrollToTab: (tabId: string, index: number) => void;
}

export function DashboardMethodSelector({
  METHODS,
  activeMethod,
  setActiveMethod,
  activeVicesList,
  scrollToTab
}: DashboardMethodSelectorProps) {
  const getColorClasses = (color: string, isActive: boolean) => {
    const map: Record<string, { active: string, inactive: string }> = {
      'white': { active: 'bg-white text-black shadow-white/20', inactive: 'text-white border-white/20 hover:bg-white/10' },
      'red-500': { active: 'bg-red-500 text-white shadow-red-500/20', inactive: 'text-red-500 border-red-500/20 hover:bg-red-500/10' },
      'emerald-400': { active: 'bg-emerald-400 text-black shadow-emerald-400/20', inactive: 'text-emerald-400 border-emerald-400/20 hover:bg-emerald-400/10' },
      'amber-400': { active: 'bg-amber-400 text-black shadow-amber-400/20', inactive: 'text-amber-400 border-amber-400/20 hover:bg-amber-400/10' },
      'indigo-400': { active: 'bg-indigo-400 text-white shadow-indigo-400/20', inactive: 'text-indigo-400 border-indigo-400/20 hover:bg-indigo-400/10' },
      'emerald-500': { active: 'bg-emerald-500 text-white shadow-emerald-500/20', inactive: 'text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10' },
      'purple-400': { active: 'bg-purple-400 text-white shadow-purple-400/20', inactive: 'text-purple-400 border-purple-400/20 hover:bg-purple-400/10' },
      'orange-400': { active: 'bg-orange-400 text-black shadow-orange-400/20', inactive: 'text-orange-400 border-orange-400/20 hover:bg-orange-400/10' },
      'cyan-400': { active: 'bg-cyan-400 text-black shadow-cyan-400/20', inactive: 'text-cyan-400 border-cyan-400/20 hover:bg-cyan-400/10' },
      'sky-500': { active: 'bg-sky-500 text-white shadow-sky-500/20', inactive: 'text-sky-500 border-sky-500/20 hover:bg-sky-500/10' },
    };
    const defaultClasses = isActive ? 'bg-white text-black shadow-lg shadow-white/20' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10';
    if (!map[color]) return defaultClasses;
    return isActive ? `${map[color].active} shadow-lg` : `bg-white/5 border ${map[color].inactive}`;
  };

  return (
    <div className="w-full px-4 mt-4 mb-2 z-10 shrink-0 border-b border-white/5 pb-4">
      <div className="flex gap-1.5 overflow-x-auto snap-x scrollbar-hide">
        {METHODS.map((method) => {
          const Icon = method.icon;
          return (
            <button
              key={method.id}
              onClick={() => {
                setActiveMethod(method.id);
                if (method.id === 'rotinas') {
                  if (activeVicesList.length > 0) {
                    setTimeout(() => scrollToTab('ativas', 0), 50);
                  } else {
                    setTimeout(() => scrollToTab('adote', 1), 50);
                  }
                }
              }}
              className={`shrink-0 snap-center px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[0.65rem] font-black tracking-wider transition-all duration-300 ${getColorClasses(method.color, activeMethod === method.id)}`}
            >
              {Icon && <Icon size={14} strokeWidth={2.5} />}
              {method.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
