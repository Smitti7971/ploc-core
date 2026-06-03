'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { apiService } from '@/services/api';
import { getAssetUrl } from '@/lib/config';
import { 
  User, 
  Mail, 
  Camera,
  Target,
  ShieldCheck
} from 'lucide-react';

export function ProfileSettings() {
  const { user, token, updateUser } = useAuthStore();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [username, setUsername] = useState(user?.username || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setUsername(user.username || '');
    }
  }, [user]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setImgError(false);
      const previewUrl = URL.createObjectURL(file);
      updateUser({ profilePhoto: previewUrl });

      const formData = new FormData();
      formData.append('file', file);

      const uploadData = await apiService.upload<{ url: string }>('/upload?type=avatar', formData);
      await apiService.put('/users/me', { profilePhoto: uploadData.url }, { token: token || undefined });
      updateUser({ profilePhoto: uploadData.url });
      
    } catch (error: any) {
      console.error('Erro ao fazer upload da foto:', error);
      alert(`Falha ao subir a imagem: ${error.message || 'Verifique a conexão.'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const response = await apiService.put<any>('/users/me', { name, email, username }, { token: token || undefined });
      updateUser(response.user);
      alert('Perfil atualizado! ✨');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar alterações.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Avatar Section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '30px',
            background: 'linear-gradient(135deg, #38bdf8 0%, #10b981 100%)',
            padding: '2px'
          }}>
            <div style={{
              width: '100%', height: '100%', borderRadius: '28px', background: '#0f172a',
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
            }}>
              {user?.profilePhoto && !imgError ? (
                <img 
                  src={getAssetUrl(user.profilePhoto)} 
                  onError={() => setImgError(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  alt="Profile"
                />
              ) : (
                <div style={{ fontSize: '2rem', fontWeight: 900 }}>{user?.name?.charAt(0).toUpperCase() || 'P'}</div>
              )}
              {isUploading && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⏳</div>}
            </div>
          </div>
          <button 
            onClick={() => document.getElementById('avatar-input')?.click()}
            style={{
              position: 'absolute', bottom: '-5px', right: '-5px', width: '32px', height: '32px',
              borderRadius: '10px', background: '#38bdf8', border: '3px solid #020617', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
          >
            <Camera size={14} />
          </button>
        </div>
        <input id="avatar-input" name="avatarInput" aria-label="Upload de Avatar" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
      </div>

      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="settings-name" style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Nome Completo</label>
          <div style={{ position: 'relative' }}>
            <User size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
            <input 
              id="settings-name"
              name="name"
              autoComplete="name"
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '12px', border: '1px solid #1e293b', background: '#0f172a', color: '#fff', fontSize: '0.9rem', outline: 'none', transition: 'border 0.2s', ...({ '&:focus': { border: '1px solid #38bdf8' } } as any) }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="settings-username" style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Username (@)</label>
          <div style={{ position: 'relative' }}>
            <Target size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
            <input 
              id="settings-username"
              name="username"
              autoComplete="username"
              type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '12px', border: '1px solid #1e293b', background: '#0f172a', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="settings-email" style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>E-mail</label>
          <div style={{ position: 'relative' }}>
            <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
            <input 
              id="settings-email"
              name="email"
              autoComplete="email"
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '12px', border: '1px solid #1e293b', background: '#0f172a', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>
        </div>

        <button 
          onClick={handleSaveChanges} disabled={isSaving}
          style={{
            marginTop: '1rem', background: isSaving ? '#1e293b' : 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
            border: 'none', borderRadius: '18px', padding: '18px', color: '#fff', fontSize: '0.9rem', fontWeight: 700,
            cursor: isSaving ? 'not-allowed' : 'pointer', boxShadow: isSaving ? 'none' : '0 10px 25px rgba(56, 189, 248, 0.3)'
          }}
        >
          {isSaving ? 'Sincronizando...' : 'Salvar Alterações'}
        </button>

      </div>

      {/* Footer Info */}
      <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '0.7rem' }}>
          <ShieldCheck size={14} /> Dados protegidos por criptografia PLOC
        </div>
      </div>
    </>
  );
}
