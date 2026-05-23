'use client';

// Bloco de imports: React, bibliotecas de UI, Zustand (store), serviços de API e roteamento
import React, { useState, useEffect } from 'react'; // React hooks para estado e ciclo de vida
import { motion } from 'framer-motion'; // Biblioteca de animações
import { AppShell } from '@/components/layout/AppShell'; // Casca de layout global
import { useAuthStore } from '@/store/authStore'; // Hook da store de autenticação
import { apiService } from '@/services/api'; // Serviço wrapper pro backend
import { config } from '@/lib/config'; // Variáveis de ambiente
import { useRouter } from 'next/navigation'; // Hook de navegação do Next.js
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Camera,
  ChevronRight,
  ShieldCheck,
  Target,
  Sparkles,
  Globe,
  Smile
} from 'lucide-react'; // Ícones da UI

// Componente da Página de Configurações do Usuário
export default function SettingsPage() {
  // Bloco de Inicialização e Hooks de Roteamento/Estado Global
  const { user, token, updateUser } = useAuthStore(); // Pega dados e funções da sessão
  const router = useRouter(); // Hook para navegação
  
  // Bloco de Estados Locais para o Formulário e Interface
  const [name, setName] = useState(user?.name || ''); // Nome atual no input
  const [email, setEmail] = useState(user?.email || ''); // Email atual no input
  const [username, setUsername] = useState(user?.username || ''); // Username atual no input
  const [isUploading, setIsUploading] = useState(false); // Flag de loading para upload de foto
  const [isSaving, setIsSaving] = useState(false); // Flag de loading para salvar dados

  const [isHydrated, setIsHydrated] = useState(false); // Flag para confirmar que a store do Zustand carregou no cliente
  
  // Debug para entender o que está acontecendo
  console.log('🛠️ [SettingsPage] Estado Atual:', { 
    isHydrated, 
    hasUser: !!user, 
    hasToken: !!token,
    tokenPreview: token ? `${token.substring(0, 10)}...` : 'NULLED'
  });

  // Bloco useEffect: Resolve problema de hidratação do Zustand (SSR vs CSR)
  useEffect(() => {
    // Inscreve no evento finishHydration do Zustand persist para saber que os dados do LocalStorage estão na store
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      console.log('✅ [SettingsPage] Hidratação Finalizada!');
      setIsHydrated(true); // Marca como carregado
    });

    // Se já estava hidratado antes do useEffect rodar, seta como true
    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    // Cleanup: desinscreve o listener
    return () => unsub();
  }, []);

  // Bloco useEffect: Proteção de Rota - Redireciona se não houver token (sessão perdida) APÓS HIDRATAÇÃO
  useEffect(() => {
    if (isHydrated && !token && typeof window !== 'undefined') {
      console.warn('⚠️ [SettingsPage] Sessão não encontrada. Redirecionando...');
      router.push('/'); // Chuta para home/login
    }
  }, [isHydrated, token, router]);


  // Bloco useEffect: Sincroniza os estados locais do formulário assim que o objeto `user` estiver disponível
  useEffect(() => {
    if (user) {
      setName(user.name || ''); // Atualiza o nome com os dados da store
      setEmail(user.email || ''); // Atualiza email
      setUsername(user.username || ''); // Atualiza username
    }
  }, [user]); // Roda sempre que o `user` mudar

  // Bloco de Função: Lida com a seleção e envio da imagem de perfil (Upload)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Pega o primeiro arquivo
    if (!file) return;

    try {
      setIsUploading(true); // Liga o loading de foto
      const previewUrl = URL.createObjectURL(file); // Cria URL temporária para mostrar no frontend imediatamente
      updateUser({ profilePhoto: previewUrl }); // Otimismo UI: Mostra a foto no Ploc/Store antes de confirmar no back

      const formData = new FormData(); // Cria form multipart
      formData.append('file', file);

      // Faz upload para a rota de upload do backend e recebe a URL final da CDN/Cloud
      const uploadData = await apiService.upload<{ url: string }>('/upload?type=avatar', formData);
      
      // Atualiza o perfil do usuário no DB com a URL nova da foto
      const response = await apiService.put<any>('/users/me', { profilePhoto: uploadData.url }, { token: token || undefined });

      // Atualiza a store com o usuário inteiro vindo do banco
      updateUser(response.user);
      
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar foto.'); // Feedback de erro
    } finally {
      setIsUploading(false); // Tira o loading
    }
  };

  // Bloco de Função: Envia as alterações de nome e email pro Backend
  const handleSaveChanges = async () => {
    setIsSaving(true); // Bloqueia o botão e mostra loading
    try {
      // Faz requisição PUT na API mandando os campos novos do input
      const response = await apiService.put<any>('/users/me', { name, email, username }, { token: token || undefined });
      updateUser(response.user); // Salva dados frescos na Store global
      alert('Perfil atualizado! ✨'); // Sucesso pro user
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar alterações.'); // Erro pro user
    } finally {
      setIsSaving(false); // Desbloqueia o botão
    }
  };

  return (
    <AppShell>
      <div style={{
        width: '100vw',
        height: '100dvh',
        overflowY: 'auto',
        background: 'radial-gradient(circle at top right, rgba(56, 189, 248, 0.05) 0%, transparent 40%)',
        paddingBottom: '120px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        color: '#fff'
      }}>
        {/* Header Glass */}
        <div style={{
          position: 'sticky',
          top: 0,
          background: 'rgba(2, 6, 23, 0.7)',
          backdropFilter: 'blur(30px)',
          zIndex: 1000,
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <motion.button
            whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.08)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={18} />
          </motion.button>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', margin: 0 }}>
            Configurações
          </h1>
        </div>

        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
          
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
                  {user?.profilePhoto ? (
                    <img src={user.profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ fontSize: '2rem', fontWeight: 900 }}>{user?.name?.charAt(0) || 'P'}</div>
                  )}
                  {isUploading && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⌛</div>}
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
            <input id="avatar-input" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Nome Completo</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input 
                  id="settings-name"
                  name="name"
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '14px 16px 14px 44px', color: '#fff', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Username (@)</label>
              <div style={{ position: 'relative' }}>
                <Target size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input 
                  id="settings-username"
                  name="username"
                  type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '14px 16px 14px 44px', color: '#fff', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>E-mail</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input 
                  id="settings-email"
                  name="email"
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '14px 16px 14px 44px', color: '#64748b', outline: 'none' }}
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

        </div>
      </div>
    </AppShell>
  );
}
