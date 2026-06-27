'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { apiService as api } from '@/services/api';
import { StoreModal } from '@/modules/store/components/StoreModal';
import { InventoryModal } from '@/modules/inventory/components/InventoryModal';

import { LabStatsPanel } from '@/modules/lab/components/LabStatsPanel';
import { LabItemEditor } from '@/modules/lab/components/LabItemEditor';
import { LabDatabaseList } from '@/modules/lab/components/LabDatabaseList';
import { ExerciseManagerOverlay } from '@/modules/lab/components/ExerciseManagerOverlay';
import { ConfirmActionModal } from '@/modules/dashboard/components/tracker/components/modals/ConfirmActionModal';

export default function LabPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { refreshProfile } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isExerciseManagerOpen, setIsExerciseManagerOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'ia' | 'mecanica' | 'gamificacao'>('home');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    type: 'CONSUMABLE',
    rarity: 'COMMON',
    priceFoco: 10,
    pricePremium: 0,
    effects: '{}',
    imageUrl: '',
    isAvailableInShop: true,
  });

  const loadItems = async () => {
    try {
      setLoading(true);
      const data: any = await api.get('/inventory/items');
      setItems(data || []);
    } catch (err) {
      console.error('Failed to load items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'auto'; // Permitir scroll aqui
    document.body.style.touchAction = 'auto';
    loadItems();
    return () => {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    };
  }, []);

  const handleFarmCoins = async () => {
    try {
      await api.post('/users/debug/foco-coins', { amount: 100 });
      await refreshProfile(); // Recarrega o user
    } catch (err) {
      console.error('Erro ao farmar:', err);
    }
  };

  const handleDecreaseStat = async (attribute: string) => {
    try {
      await api.post('/users/debug/ploc-attribute', { attribute, amount: 1 });
      await refreshProfile();
    } catch (err) {
      console.error(`Erro ao diminuir ${attribute}:`, err);
    }
  };

  const handleSubmitItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let effectsJson = {};
      try {
        effectsJson = JSON.parse(formData.effects);
      } catch (err) {
        alert('Effects precisa ser um JSON válido. Ex: {"body": 5}');
        return;
      }

      if (editingItemId) {
        await api.put(`/inventory/items/${editingItemId}`, {
          ...formData,
          effects: effectsJson,
          priceFoco: Number(formData.priceFoco),
          pricePremium: Number(formData.pricePremium)
        });
        alert('Item atualizado com sucesso!');
        setEditingItemId(null);
      } else {
        await api.post('/inventory/items', {
          ...formData,
          effects: effectsJson,
          priceFoco: Number(formData.priceFoco),
          pricePremium: Number(formData.pricePremium)
        });
        alert('Item criado com sucesso!');
      }
      
      loadItems();
      setFormData({
        name: '', slug: '', description: '', type: 'CONSUMABLE', rarity: 'COMMON', priceFoco: 10, pricePremium: 0, effects: '{}', imageUrl: '', isAvailableInShop: true
      });
    } catch (err: any) {
      console.error('Failed to save item:', err);
      alert('Erro ao salvar item: ' + (err.message || 'Verifique o console.'));
    }
  };

  const handleEditClick = (item: any) => {
    setEditingItemId(item.id);
    setFormData({
      name: item.name || '',
      slug: item.slug || '',
      description: item.description || '',
      type: item.type || 'CONSUMABLE',
      rarity: item.rarity || 'COMMON',
      priceFoco: item.priceFoco || 0,
      pricePremium: item.pricePremium || 0,
      effects: typeof item.effects === 'string' ? item.effects : JSON.stringify(item.effects || {}),
      imageUrl: item.imageUrl || '',
      isAvailableInShop: item.isAvailableInShop ?? true
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteItem = async (id: string) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await api.delete(`/inventory/items/${confirmDeleteId}`);
      loadItems();
    } catch (err) {
      console.error('Erro ao deletar', err);
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleToggleShop = async (id: string, currentState: boolean) => {
    try {
      await api.put(`/inventory/items/${id}`, { isAvailableInShop: !currentState });
      loadItems();
    } catch (err) {
      console.error('Erro ao dar toggle', err);
    }
  };

  const focoCoins = user?.stats?.focoCoins || 0;
  const stats = user?.stats || {};

  return (
    <div className="min-h-[100dvh] w-full bg-[#020617] text-white p-6 pt-24 overflow-y-auto">
      <StoreModal isOpen={isStoreOpen} onClose={() => setIsStoreOpen(false)} />
      <InventoryModal isOpen={isBagOpen} onClose={() => setIsBagOpen(false)} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">
            Test Page 2.0
          </h1>
          <p className="text-slate-400 text-sm mt-1">Debug Dashboard & Database Control</p>
        </div>
        <div className="flex gap-3">
          {activeTab !== 'home' && (
            <button 
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl transition-all font-bold"
            >
              <ArrowLeft size={16} /> Voltar ao Menu LAB
            </button>
          )}
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-all"
          >
            <ArrowLeft size={16} /> Voltar ao App
          </button>
        </div>
      </div>

      {activeTab === 'home' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <button 
            onClick={() => setActiveTab('ia')}
            className="bg-slate-800 hover:bg-slate-700 p-8 rounded-3xl border border-slate-700 flex flex-col items-center justify-center gap-4 transition-all hover:scale-105"
          >
            <div className="text-4xl">🤖</div>
            <h2 className="text-xl font-bold">I.A</h2>
            <p className="text-slate-400 text-sm text-center">Interações e funções relacionadas a Inteligência Artificial</p>
          </button>

          <button 
            onClick={() => setActiveTab('mecanica')}
            className="bg-slate-800 hover:bg-slate-700 p-8 rounded-3xl border border-slate-700 flex flex-col items-center justify-center gap-4 transition-all hover:scale-105"
          >
            <div className="text-4xl">⚙️</div>
            <h2 className="text-xl font-bold">MECÂNICA APP</h2>
            <p className="text-slate-400 text-sm text-center">Verificar lógicas e inserção de dados do core (ex: Equipamentos)</p>
          </button>

          <button 
            onClick={() => setActiveTab('gamificacao')}
            className="bg-slate-800 hover:bg-slate-700 p-8 rounded-3xl border border-slate-700 flex flex-col items-center justify-center gap-4 transition-all hover:scale-105"
          >
            <div className="text-4xl">🎮</div>
            <h2 className="text-xl font-bold">GAMIFICAÇÃO</h2>
            <p className="text-slate-400 text-sm text-center">Mecânicas de jogo, itens, loja e status do PLOC</p>
          </button>
        </div>
      )}

      {activeTab === 'ia' && (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-2xl font-bold mb-2">Painel de I.A</h2>
          <p className="text-slate-400 max-w-md">As funções voltadas a I.A ainda não estão focadas no momento. Elas aparecerão aqui no futuro.</p>
        </div>
      )}

      {activeTab === 'mecanica' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => setIsExerciseManagerOpen(true)}
              className="bg-sky-900/30 hover:bg-sky-800/40 border border-sky-500/50 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all"
            >
              <div className="text-3xl">🏋️</div>
              <h3 className="font-bold text-sky-400">Gerenciar Exercícios</h3>
              <p className="text-xs text-slate-400 text-center">Cadastre equipamentos e monte a base de exercícios</p>
            </button>
            {/* Outros botões de mecânica podem entrar aqui no futuro */}
          </div>
        </div>
      )}

      {activeTab === 'gamificacao' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Painel do PLOC */}
        <div className="col-span-1 space-y-6">
          <LabStatsPanel 
            focoCoins={focoCoins}
            stats={stats}
            onFarmCoins={handleFarmCoins}
            onDecreaseStat={handleDecreaseStat}
            onOpenStore={() => setIsStoreOpen(true)}
            onOpenBag={() => setIsBagOpen(true)}
          />
        </div>

        {/* Gerenciamento de Banco de Dados (CRUD Itens) */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          
          {/* Editor Area */}
          <LabItemEditor 
            editingItemId={editingItemId}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmitItem}
            onCancel={() => {
              setEditingItemId(null);
              setFormData({
                name: '', slug: '', description: '', type: 'CONSUMABLE', rarity: 'COMMON', priceFoco: 10, pricePremium: 0, effects: '{}', imageUrl: '', isAvailableInShop: true
              });
            }}
          />

          {/* Lista de Itens no Banco */}
          <LabDatabaseList 
            items={items}
            loading={loading}
            onToggleShop={handleToggleShop}
            onEditClick={handleEditClick}
            onDeleteItem={handleDeleteItem}
          />

        </div>
        </div>
      )}

      {isExerciseManagerOpen && (
        <ExerciseManagerOverlay onClose={() => setIsExerciseManagerOpen(false)} />
      )}

      <ConfirmActionModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={confirmDelete}
        title="Deletar Item"
        description="Deletar este item para sempre?"
        actionStyle="danger"
        confirmText="Deletar"
      />
    </div>
  );
}
