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
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '4px',
        gap: isOpen ? '10px' : '0px',
        cursor: 'pointer',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '50px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        minHeight: '36px',
        pointerEvents: 'all'
      }}
    >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div 
              key="profile"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {/* Foto / Avatar */}
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '0.7rem',
                color: '#fff',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                {user?.profilePhoto && !imgError ? (
                  <img 
                    src={getAssetUrl(user.profilePhoto)} 
                    onError={() => setImgError(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    alt="Profile"
                  />
                ) : (
                  (user?.name || 'U').charAt(0).toUpperCase()
                )}
              </div>

              {/* Level e XP */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '2px',
                marginLeft: '6px',
                marginRight: '6px'
              }}>
                <span style={{ 
                  fontSize: '0.65rem', 
                  fontWeight: 800, 
                  color: '#fff', 
                  opacity: 0.9,
                  letterSpacing: '0.3px',
                  whiteSpace: 'nowrap',
                  maxWidth: '80px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {user?.name?.split(' ')[0] || 'Usuário'}
                </span>
                <div style={{ 
                  width: '40px', 
                  height: '3px', 
                  background: 'rgba(255,255,255,0.1)', 
                  borderRadius: '10px',
                  overflow: 'hidden' 
                }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(user?.stats?.xp || 0) % 100}%` }}
                    style={{ 
                      height: '100%', 
                      background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
                      borderRadius: '10px'
                    }} 
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="actions"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}
            >
              {/* SETTINGS (Esquerda: só icone engrenagem em uma capsula) */}
              <Link href="/settings" style={{ 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                opacity: 0.8, 
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                transition: 'all 0.2s'
              }}>
                <Settings size={15} />
              </Link>

              <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }} />

              {/* SAIR (Direita: capsula vermelha, texto branco, sem icone) */}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                onClick={(e) => {
                  e.stopPropagation();
                  logout();
                  router.push('/');
                }} 
                style={{ 
                  background: '#ef4444', 
                  border: 'none', 
                  color: '#fff', 
                  cursor: 'pointer', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50px',
                  padding: '4px 24px',
                  height: '28px'
                }}
              >
                <span style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '1px' }}>SAIR</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
}
