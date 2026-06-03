import React from 'react';
import { Database } from 'lucide-react';
import { DynamicIcon } from '@/components/mascot/DynamicIcon';

interface LabItemEditorProps {
  editingItemId: string | null;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function LabItemEditor({ editingItemId, formData, setFormData, onSubmit, onCancel }: LabItemEditorProps) {
  return (
    <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Database className="text-sky-400" />
        {editingItemId ? 'Editar Item' : 'Criar Novo Item'}
      </h2>
      
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="item-name" className="text-xs text-slate-400 mb-1 block">Nome do Item</label>
          <input id="item-name" name="itemName" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-white" placeholder="Ex: Maçã Dourada" />
        </div>
        <div>
          <label htmlFor="item-slug" className="text-xs text-slate-400 mb-1 block">Slug (ID Único)</label>
          <input id="item-slug" name="itemSlug" required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-white" placeholder="Ex: macaa_dourada" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="item-desc" className="text-xs text-slate-400 mb-1 block">Descrição</label>
          <input id="item-desc" name="itemDesc" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-white" placeholder="Descreva o item" />
        </div>
        <div>
          <label htmlFor="item-price" className="text-xs text-slate-400 mb-1 block">Preço (Foco Coins)</label>
          <input id="item-price" name="itemPrice" type="number" required value={formData.priceFoco} onChange={e => setFormData({...formData, priceFoco: Number(e.target.value)})} className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-white" />
        </div>
        <div>
          <label htmlFor="item-effects" className="text-xs text-slate-400 mb-1 block">Efeitos (JSON)</label>
          <textarea id="item-effects" name="itemEffects" rows={3} value={formData.effects} onChange={e => setFormData({...formData, effects: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-white custom-scrollbar" placeholder='{"body": 10}' />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="item-icon" className="text-xs text-slate-400 mb-1 block">Nome do Ícone Lucide (ex: Sword, Shield, Pizza)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sky-400">
              <DynamicIcon name={formData.imageUrl} size={20} />
            </div>
            <input 
              id="item-icon" 
              name="itemIcon" 
              value={formData.imageUrl} 
              onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
              className="w-full bg-black/30 border border-white/10 rounded-lg py-2 pl-10 pr-3 text-sm text-white" 
              placeholder="Digite o nome em PascalCase (ex: MapPin) ou coloque um Emoji" 
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Veja todos os nomes em: <a href="https://lucide.dev/icons/" target="_blank" rel="noreferrer" className="text-sky-500 hover:underline">lucide.dev/icons</a> (use PascalCase)</p>
        </div>
        
        <div className="md:col-span-2 flex items-center justify-between">
          <label htmlFor="item-available" className="flex items-center gap-2 cursor-pointer">
            <input id="item-available" name="itemAvailable" type="checkbox" checked={formData.isAvailableInShop} onChange={e => setFormData({...formData, isAvailableInShop: e.target.checked})} className="accent-emerald-500 w-4 h-4" />
            <span className="text-sm text-slate-300">Disponível na Lojinha</span>
          </label>
        </div>
        
        <div className="md:col-span-2 pt-4 flex gap-4">
          <button type="submit" className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)]">
            {editingItemId ? 'Salvar Alterações' : 'Criar Item'}
          </button>
          {editingItemId && (
            <button 
              type="button" 
              onClick={onCancel}
              className="px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
