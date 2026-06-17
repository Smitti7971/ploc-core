import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

interface LabDatabaseListProps {
  items: any[];
  loading: boolean;
  onToggleShop: (id: string, currentState: boolean) => void;
  onEditClick: (item: any) => void;
  onDeleteItem: (id: string) => void;
}

export function LabDatabaseList({ items, loading, onToggleShop, onEditClick, onDeleteItem }: LabDatabaseListProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
        <h2 className="font-bold text-slate-200">Itens no Banco de Dados</h2>
        <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-md">{items.length} itens</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/30 text-slate-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Ícone</th>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Na Loja?</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-500">Carregando itens...</td></tr>
            ) : items.map((item) => {
              return (
              <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-xl">
                  <DynamicIcon name={item.imageUrl} size={20} className="text-sky-400" />
                </td>
                <td className="px-4 py-3 font-medium text-white">{item.name}</td>
                <td className="px-4 py-3 text-slate-400 font-mono text-xs">{item.slug}</td>
                <td className="px-4 py-3 text-amber-400 font-bold">{item.priceFoco} FC</td>
                <td className="px-4 py-3">
                  <button 
                    onClick={() => onToggleShop(item.id, item.isAvailableInShop)}
                    className={`px-2 py-1 rounded text-xs font-bold transition-all ${item.isAvailableInShop ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}
                  >
                    {item.isAvailableInShop ? 'SIM' : 'NÃO'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onEditClick(item)} className="p-2 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 rounded-lg transition-all" title="Editar">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => onDeleteItem(item.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-all" title="Deletar">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
              );
            })}
            {items.length === 0 && !loading && (
              <tr><td colSpan={6} className="text-center py-8 text-slate-500">Nenhum item encontrado no banco.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
