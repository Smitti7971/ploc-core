import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { User, Palette, Bell, ChevronRight } from 'lucide-react';

export function SettingsMenu() {
  const router = useRouter();

  return (
    <>
      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px', color: '#f8fafc' }}>
        Geral
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Card: Perfil do Usuário */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/settings/profile')}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '12px', 
              background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <User size={20} color="#fff" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Perfil do Usuário</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Alterar foto, nome e email</span>
            </div>
          </div>
          <ChevronRight size={20} color="#64748b" />
        </motion.div>

        {/* Card: Aparência */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => alert('Em breve!')}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '12px', 
              background: 'linear-gradient(135deg, #f472b6 0%, #db2777 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Palette size={20} color="#fff" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Aparência</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Personalizar visual do app</span>
            </div>
          </div>
          <ChevronRight size={20} color="#64748b" />
        </motion.div>

        {/* Card: Notificações */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => alert('Em breve!')}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '12px', 
              background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Bell size={20} color="#fff" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Notificações</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Avisos e alertas</span>
            </div>
          </div>
          <ChevronRight size={20} color="#64748b" />
        </motion.div>
      </div>
    </>
  );
}
