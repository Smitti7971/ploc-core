'use client';

/**
 * AuthModal.tsx — Modal de Login/Cadastro
 * Design fiel ao original: glassmorphism dark, gradiente azul.
 */

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { AuthModalType } from '../types/auth.types';

interface AuthModalProps {
  initialType?: AuthModalType;
  onClose: () => void;
}

export function AuthModal({ initialType = 'login', onClose }: AuthModalProps) {
  const [type, setType] = useState<AuthModalType>(initialType);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const { login, register, isLoading, error, setError } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);
  const isLogin = type === 'login';

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (cardRef.current) cardRef.current.style.transform = 'scale(1)';
    }, 10);
    return () => clearTimeout(timer);
  }, [type]);

  const handleSwitch = (newType: AuthModalType) => {
    setError(null);
    setType(newType);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await login({ email, password });
    } else {
      await register({ email, password, confirmPassword: confirm });
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10010] flex items-center justify-center"
      style={{
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(15px)',
        animation: 'fadeIn 0.3s ease',
        fontFamily: "'Inter', sans-serif",
      }}
      onClick={onClose}
    >
      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '90%',
          maxWidth: '400px',
          padding: '2.5rem',
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(40px) saturate(200%)',
          WebkitBackdropFilter: 'blur(40px) saturate(200%)',
          borderRadius: '28px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 40px 100px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          transform: 'scale(0.9)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors"
          style={{ fontFamily: 'Material Symbols Rounded' }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 900, letterSpacing: '1px', margin: 0 }}>
            PLOC <span style={{ color: '#38bdf8' }}>{isLogin ? 'LOGIN' : 'CADASTRO'}</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '4px' }}>
            {isLogin ? 'Sua produtividade inteligente começa aqui.' : 'Crie sua conta e comece agora.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {(['email', 'password', ...(!isLogin ? ['confirm'] : [])] as const).map((field) => (
            <input
              key={field}
              id={`modal-auth-${field}`}
              name={field}
              type={field === 'email' ? 'email' : 'password'}
              placeholder={field === 'email' ? 'E-mail' : field === 'password' ? 'Senha' : 'Confirmar Senha'}
              value={field === 'email' ? email : field === 'password' ? password : confirm}
              onChange={(e) => {
                if (field === 'email') setEmail(e.target.value);
                else if (field === 'password') setPassword(e.target.value);
                else setConfirm(e.target.value);
              }}
              required
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1.5px solid rgba(255,255,255,0.1)',
                padding: '1.1rem',
                borderRadius: '16px',
                color: '#fff',
                outline: 'none',
                fontSize: '0.95rem',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#38bdf8';
                e.target.style.background = 'rgba(56, 189, 248, 0.05)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                e.target.style.background = 'rgba(0,0,0,0.3)';
              }}
            />
          ))}

          {/* Error */}
          {error && (
            <div style={{
              color: '#ef4444', fontSize: '0.75rem', textAlign: 'center',
              padding: '0.8rem', background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)',
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: 'linear-gradient(135deg, #38bdf8, #1d4ed8)',
              color: '#fff',
              padding: '1.1rem',
              borderRadius: '18px',
              fontWeight: 900,
              fontSize: '0.95rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              border: 'none',
              marginTop: '0.5rem',
              boxShadow: '0 10px 25px rgba(29, 78, 216, 0.4)',
              letterSpacing: '1px',
              transition: 'all 0.3s',
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            {isLoading ? 'PROCESSANDO...' : isLogin ? 'ACESSAR' : 'CRIAR CONTA'}
          </button>
        </form>

        {/* Switch */}
        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <p
            onClick={() => handleSwitch(isLogin ? 'register' : 'login')}
            style={{ color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500 }}
          >
            {isLogin ? (
              <>Novo por aqui? <span style={{ color: '#38bdf8', fontWeight: 800 }}>Cadastre-se</span></>
            ) : (
              <>Já tem conta? <span style={{ color: '#38bdf8', fontWeight: 800 }}>Faça login</span></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
