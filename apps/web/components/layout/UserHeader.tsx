'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Settings, LogOut, User } from 'lucide-react';

export function UserHeader() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated) return null;

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '6px',
        gap: isOpen ? '12px' : '0px',
        cursor: 'pointer',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '50px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        minHeight: '44px',
        pointerEvents: 'all'
      }}
    >
        {/* Foto / Avatar */}
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          fontSize: '0.75rem',
          color: '#fff',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          {user?.profilePhoto ? (
            <img src={user.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            (user?.name || 'U').charAt(0).toUpperCase()
          )}
        </div>

        {/* Menu Expandido */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '12px', overflow: 'hidden' }}
            >
              <Link href="/settings" style={{ color: '#fff', display: 'flex', opacity: 0.7 }}>
                <Settings size={18} />
              </Link>
              
              <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }} />

              <motion.button 
                whileHover={{ scale: 1.05, color: '#ef4444' }}
                onClick={(e) => {
                  e.stopPropagation();
                  logout();
                  router.push('/');
                }} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#ef4444', 
                  cursor: 'pointer', 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 8px'
                }}
              >
                <LogOut size={16} />
                <span style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '1px' }}>SAIR</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
}
