import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3X3, Map, Activity as ActivityIcon } from "lucide-react";

interface BlackboardHUDProps {
  showGrid: boolean;
  setShowGrid: (val: boolean) => void;
  showMinimap: boolean;
  setShowMinimap: (val: boolean) => void;
  showStatusMenu: boolean;
  setShowStatusMenu: (val: boolean) => void;
  hasPendingPillars: boolean;
  userClosedMinimap: React.MutableRefObject<boolean>;
}

export function BlackboardHUD({
  showGrid,
  setShowGrid,
  showMinimap,
  setShowMinimap,
  showStatusMenu,
  setShowStatusMenu,
  hasPendingPillars,
  userClosedMinimap,
}: BlackboardHUDProps) {
  return (
    <div className="fixed top-[25px] left-0 w-full px-6 flex justify-between items-start z-hud pointer-events-none">
      {/* Botões à esquerda */}
      <div className="flex items-center bg-black/40 border border-white/10 backdrop-blur-md rounded-full p-1 shadow-[0_4px_20px_rgba(0,0,0,0.5)] pointer-events-auto gap-1 h-[46px]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => setShowGrid(!showGrid)}
          className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer shrink-0 transition-colors ${showGrid ? "bg-sky-400/20 text-sky-400" : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"}`}
          title="Grade"
        >
          <Grid3X3 size={16} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => {
            userClosedMinimap.current = showMinimap;
            setShowMinimap(!showMinimap);
          }}
          className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer shrink-0 transition-colors ${showMinimap ? "bg-sky-400/20 text-sky-400" : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"}`}
          title="Minimapa"
        >
          <Map size={16} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowStatusMenu(!showStatusMenu)}
          className={`w-9 h-9 rounded-full flex items-center justify-center relative cursor-pointer transition-colors ${showStatusMenu ? "bg-purple-400/20 text-purple-400" : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10"}`}
          title="Status"
        >
          <ActivityIcon size={16} />

          {/* Badge de atenção (Novidades/Ações necessárias) */}
          {hasPendingPillars && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-400 rounded-full border-[1.5px] border-black/80 flex items-center justify-center shadow-[0_0_8px_rgba(250,204,21,0.6)] animate-pulse">
              <span className="text-black text-[10px] font-black leading-none mt-[1px]">
                !
              </span>
            </span>
          )}
        </motion.button>
      </div>
    </div>
  );
}
