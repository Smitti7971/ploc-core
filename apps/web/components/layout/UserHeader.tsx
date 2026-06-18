'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { getAssetUrl } from '@/lib/config';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Settings, LogOut, User } from 'lucide-react';

export function UserHeader() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) return null;

  return (
    <div
      ref={headerRef}
      onClick={() => setIsOpen(!isOpen)}
      className={`flex items-center p-1 cursor-pointer bg-white/5 backdrop-blur-[20px] rounded-full border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] h-[46px] pointer-events-auto ${isOpen ? 'gap-[10px]' : 'gap-0'}`}
    >
        {/* PROFILE SECTION */}
        <motion.div 
          initial={false}
          animate={{ 
            width: !isOpen ? 'auto' : 0, 
            opacity: !isOpen ? 1 : 0,
            marginRight: !isOpen ? 0 : -10 // Compensate for gap when closed
          }}
          className="flex items-center overflow-hidden"
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Foto / Avatar */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-indigo-400 flex items-center justify-center font-black text-[0.7rem] text-white overflow-hidden shrink-0">
            {user?.profilePhoto && !imgError ? (
              <img 
                src={getAssetUrl(user.profilePhoto)} 
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
                alt="Profile"
              />
            ) : (
              (user?.name || 'U').charAt(0).toUpperCase()
            )}
          </div>

          {/* Level e XP */}
          <div className="flex flex-col justify-center gap-[2px] mx-[6px] shrink-0">
            <span className="text-[0.65rem] font-extrabold text-white/90 tracking-[0.3px] whitespace-nowrap max-w-[80px] overflow-hidden text-ellipsis">
              {user?.name?.split(' ')[0] || 'Usuário'}
            </span>
            <div className="w-[40px] h-[3px] bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(user?.stats?.xp || 0) % 100}%` }}
                className="h-full bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* ACTIONS SECTION */}
        <motion.div 
          initial={false}
          animate={{ 
            width: isOpen ? 'auto' : 0, 
            opacity: isOpen ? 1 : 0 
          }}
          className="flex items-center overflow-hidden"
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={`flex items-center gap-2 ${isOpen ? 'pl-1' : 'pl-0'}`}>
            {/* PROFILE (Esquerda) */}
            <Link href="/settings/profile" className="text-white flex items-center justify-center opacity-80 w-7 h-7 rounded-full bg-white/10 transition-all duration-200 hover:opacity-100 shrink-0">
              <User size={15} />
            </Link>

            {/* SETTINGS (Meio) */}
            <Link href="/settings" className="text-white flex items-center justify-center opacity-80 w-7 h-7 rounded-full bg-white/10 transition-all duration-200 hover:opacity-100 shrink-0">
              <Settings size={15} />
            </Link>

            <div className="w-[1px] h-4 bg-white/10 shrink-0" />

            {/* SAIR (Direita: capsula vermelha, texto branco, sem icone) */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              onClick={(e) => {
                e.stopPropagation();
                logout();
                router.push('/');
              }} 
              className="bg-red-500 border-none text-white cursor-pointer flex items-center justify-center rounded-full px-6 h-7 shrink-0"
            >
              <span className="text-[0.65rem] font-black tracking-[1px]">SAIR</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
  );
}
