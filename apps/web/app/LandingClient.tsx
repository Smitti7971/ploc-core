'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import PlocAvatar from '../components/mascot/PlocAvatar';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { UserHeader } from '../components/layout/UserHeader';

const MOTIVATIONAL_PHRASES = [
  "FOCO NO AGORA.",
  "EVOLUA COM O PLOC.",
  "MENOS RUÍDO, MAIS VIDA.",
  "MENTE EM ESTADO LÍQUIDO.",
  "CRIE, ORGANIZE, RESPIRE.",
  "A FLUÍDEZ DO SUCESSO.",
  "SIMPLICIDADE É PODER.",
  "TRANSFORME IDEIAS EM AÇÃO.",
  "DOMINE SUA ROTINA.",
  "CLAREZA É O NOVO LUXO.",
  "O PLOC É SEU GUIA.",
  "RESPIRE. PLANEJE. EXECUTE.",
  "MINIMALISMO EM CADA CLICK.",
  "SINTA A LEVEZA DA ORGANIZAÇÃO."
];

export default function LandingClient() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authName, setAuthName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const { isAuthenticated, user } = useAuthStore();

  // Sincroniza cookie para o Middleware
  useEffect(() => {
    if (isAuthenticated) {
      document.cookie = `ploc-auth=true; path=/; max-age=${60 * 60 * 24 * 7}`;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % MOTIVATIONAL_PHRASES.length);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!isMounted) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { email: authEmail, password: authPass } 
        : { name: authName, email: authEmail, password: authPass };
      
      const { apiService } = await import('@/services/api');
      const response = await apiService.post<{ token: string; user: any }>(endpoint, payload);
      
      useAuthStore.getState().setAuth(response.token, response.user);
      setIsAuthOpen(false);
    } catch (err: any) {
      setAuthError(err.message || 'Erro ao autenticar');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEnterClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setIsAuthOpen(true);
    }
  };

  const renderAuthModal = () => (
    <AnimatePresence>
      {isAuthOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAuthOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            style={{
              position: 'relative',
              width: 'min(100%, 340px)',
              background: 'rgba(10, 15, 30, 0.8)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              borderRadius: '32px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              zIndex: 1
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ 
                margin: 0, 
                fontSize: '1.5rem', 
                fontWeight: 900, 
                fontFamily: 'Outfit, sans-serif', 
                textTransform: 'uppercase', 
                letterSpacing: '3px' 
              }}>
                {isLogin ? 'Login' : 'Cadastro'}
              </h2>
            </div>

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {!isLogin && (
                <input
                  type="text"
                  placeholder="NOME"
                  value={authName}
                  required
                  onChange={(e) => setAuthName(e.target.value)}
                  style={{ 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.08)', 
                    borderRadius: '16px', 
                    padding: '16px', 
                    color: '#fff', 
                    fontSize: '0.85rem', 
                    outline: 'none',
                    fontFamily: 'Outfit, sans-serif'
                  }}
                />
              )}
              <input
                type="email"
                placeholder="E-MAIL"
                value={authEmail}
                required
                onChange={(e) => setAuthEmail(e.target.value)}
                style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.08)', 
                  borderRadius: '16px', 
                  padding: '16px', 
                  color: '#fff', 
                  fontSize: '0.85rem', 
                  outline: 'none',
                  fontFamily: 'Outfit, sans-serif'
                }}
              />
              <input
                type="password"
                placeholder="SENHA"
                value={authPass}
                required
                onChange={(e) => setAuthPass(e.target.value)}
                style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.08)', 
                  borderRadius: '16px', 
                  padding: '16px', 
                  color: '#fff', 
                  fontSize: '0.85rem', 
                  outline: 'none',
                  fontFamily: 'Outfit, sans-serif'
                }}
              />
              
              {authError && (
                <p style={{ color: '#ef4444', fontSize: '0.7rem', margin: 0, textAlign: 'center' }}>
                  {authError}
                </p>
              )}

              <button 
                type="submit"
                disabled={authLoading}
                style={{ 
                  background: '#38bdf8', 
                  color: '#020617', 
                  border: 'none', 
                  borderRadius: '16px', 
                  padding: '18px', 
                  fontWeight: 900, 
                  cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif'
                }}
              >
                {authLoading ? '...' : isLogin ? 'ENTRAR' : 'CRIAR CONTA'}
              </button>
            </form>

            <button 
              onClick={() => setIsLogin(!isLogin)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'rgba(255,255,255,0.3)', 
                fontSize: '0.75rem', 
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre aqui'}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <main style={{ 
      height: '100vh', 
      width: '100vw', 
      background: '#020617',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'fixed',
      inset: 0,
      overflow: 'hidden'
    }}>
      
      {/* Top Navigation Bar (Right Side) */}
      <div style={{
        position: 'absolute',
        top: '25px',
        right: '25px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        {isAuthenticated ? (
          <UserHeader />
        ) : (
          <Link href="/dashboard" onClick={handleEnterClick}>
            <motion.div
              whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.12)' }}
              animate={{
                background: [
                  'linear-gradient(90deg, rgba(56, 189, 248, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                  'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(56, 189, 248, 0.1) 100%)',
                ]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                padding: '8px 22px',
                borderRadius: '100px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ 
                color: 'rgba(255,255,255,0.9)', 
                fontSize: '0.75rem', 
                fontWeight: 900, 
                letterSpacing: '2px',
                fontFamily: 'Outfit, sans-serif'
              }}>
                ENTRAR
              </span>
            </motion.div>
          </Link>
        )}
      </div>

      {/* ── Atmosfera Gelatinosa ─────────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1 }}>
        <motion.div
          animate={{
            x: [0, 150, -50, 0],
            y: [0, 80, 120, 0],
            scale: [1, 1.4, 0.8, 1],
            rotate: [0, 20, -20, 0]
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '80%',
            height: '80%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.07) 0%, transparent 75%)',
            filter: 'blur(100px)',
            borderRadius: '45%',
          }}
        />
        <motion.div
          animate={{
            x: [0, -120, 40, 0],
            y: [0, 150, -30, 0],
            scale: [1.3, 0.9, 1.5, 1.3],
            rotate: [0, -25, 25, 0]
          }}
          transition={{ duration: 50, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            bottom: '-25%',
            right: '-20%',
            width: '90%',
            height: '90%',
            background: 'radial-gradient(circle, rgba(3, 105, 161, 0.1) 0%, transparent 75%)',
            filter: 'blur(120px)',
            borderRadius: '40%',
          }}
        />
      </div>

      {/* ── Seção de Conteúdo (Centralização Absoluta) ────────────────── */}
      <section style={{ 
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        zIndex: 2,
        textAlign: 'center',
        padding: '20px',
        width: '100%',
        maxWidth: '1200px'
      }}>
        
      {/* ── Mascote no Centro Absoluto do Viewport ────────────────── */}
      <div style={{ 
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '350px',
        height: '350px'
      }}>
        {/* O Ploc */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        >
          <PlocAvatar 
            externalOpen={isAuthOpen} 
            onOpenChange={setIsAuthOpen} 
          />
        </motion.div>

        {/* ── Título Dinâmico (Posicionado Abaixo do Ploc Centrado) ── */}
        <div style={{ 
          position: 'absolute', 
          top: '250px', // Descido para não bater no Ploc
          width: '100vw',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          <AnimatePresence mode="wait">
            <motion.h1
              key={phraseIndex}
              initial={{ opacity: 0, y: 30, filter: 'blur(15px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -30, filter: 'blur(15px)' }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ 
                fontFamily: 'Outfit, sans-serif', 
                fontSize: 'clamp(2.5rem, 8vw, 6rem)', 
                margin: 0, 
                fontWeight: 900, 
                color: 'rgba(255, 255, 255, 0.9)',
                letterSpacing: '-4px',
                lineHeight: 0.9,
                textTransform: 'uppercase',
                maxWidth: '1000px',
                display: 'inline-block'
              }}
            >
              {MOTIVATIONAL_PHRASES[phraseIndex].split(' ').map((word, idx) => (
                <span key={idx} style={{ 
                  color: (
                    word.includes('PLOC') || 
                    word.includes('AGORA') || 
                    word.includes('SUCESSO') || 
                    word.includes('VIDA') ||
                    word.includes('FOCO') ||
                    word.includes('LUXO') ||
                    word.includes('GUIA') ||
                    word.includes('AÇÃO') ||
                    word.includes('PODER')
                  ) ? '#fbbf24' : 'inherit' 
                }}>
                  {word}{' '}
                </span>
              ))}
            </motion.h1>
          </AnimatePresence>
        </div>
      </div>

      </section>

      {/* Vinheta (Agora em tela cheia na Main) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        boxShadow: 'inset 0 0 200px rgba(0,0,0,1)',
        pointerEvents: 'none',
        zIndex: 10
      }} />
      {/* ── Modal de Autenticação ────────────────── */}
      {renderAuthModal()}
    </main>
  );
}
