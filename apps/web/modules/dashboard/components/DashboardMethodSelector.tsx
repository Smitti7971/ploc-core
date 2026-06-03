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
              className={`shrink-0 snap-center px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[0.65rem] font-black tracking-wider transition-all duration-300 ${activeMethod === method.id
                ? 'bg-white text-black shadow-lg shadow-white/20'
                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                }`}
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
