require('dotenv').config();
const prisma = require('../config/database');

async function migrateInventory() {
  console.log('🔄 Iniciando migração de Inventário (JSON -> Relacional)...');
  
  // 1. Garantir que os itens base existem no banco (InventoryItem)
  const defaultItems = [
    { slug: 'apple', name: 'Maçã', type: 'food' },
    { slug: 'water', name: 'Água', type: 'water' },
    { slug: 'medicine', name: 'Remédio', type: 'medicine' },
    { slug: 'coffee', name: 'Café', type: 'food' }
  ];

  for (const item of defaultItems) {
    await prisma.inventoryItem.upsert({
      where: { slug: item.slug },
      update: {},
      create: {
        slug: item.slug,
        name: item.name,
        type: item.type,
        rarity: 'COMMON'
      }
    });
  }
  
  const allInventoryItems = await prisma.inventoryItem.findMany();
  const itemMap = {};
  for (const item of allInventoryItems) {
    itemMap[item.slug] = item.id;
  }

  // 2. Extrair do JSON e salvar na tabela relacional
  const statsList = await prisma.userStats.findMany();
  
  for (const stats of statsList) {
    let plocState = stats.plocState;
    if (typeof plocState === 'string') {
      try { plocState = JSON.parse(plocState); } catch(e) {}
    }
    
    if (plocState && Array.isArray(plocState.inventory) && plocState.inventory.length > 0) {
      console.log(`👤 Migrando inventário de usuário: ${stats.userId} (${plocState.inventory.length} itens)`);
      
      for (const inv of plocState.inventory) {
        // Tentar mapear para um item existente (fallback para maçã)
        let slug = 'apple';
        if (inv.type === 'food' && inv.name?.toLowerCase().includes('caf')) slug = 'coffee';
        if (inv.type === 'water') slug = 'water';
        if (inv.type === 'medicine') slug = 'medicine';
        
        const inventoryItemId = itemMap[slug] || itemMap['apple'];
        
        try {
          await prisma.userInventory.create({
            data: {
              userId: stats.userId,
              inventoryItemId: inventoryItemId,
              quantity: 1,
              acquiredAt: new Date(inv.createdAt || Date.now())
            }
          });
        } catch (e) {
          // Ignora duplicações temporariamente se a constraint barrar
          console.log(`Aviso: falha ao inserir item ${slug} para ${stats.userId}.`);
        }
      }
      
      // Limpa do JSON (Opcional, mas vamos fazer para finalizar a migração)
      plocState.inventory = [];
      await prisma.userStats.update({
        where: { id: stats.id },
        data: { plocState: plocState }
      });
    }
  }

  console.log('🎉 Migração de Inventário concluída!');
  process.exit(0);
}

migrateInventory().catch(e => {
  console.error(e);
  process.exit(1);
});
