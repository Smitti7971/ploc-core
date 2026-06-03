const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar todos os itens do inventário global (para a loja e admin)
exports.getAllItems = async (req, res) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(items);
  } catch (error) {
    console.error('[Inventory] Error getting items:', error);
    res.status(500).json({ error: 'Failed to fetch inventory items' });
  }
};

// Criar um novo item
exports.createItem = async (req, res) => {
  try {
    const { slug, name, description, type, rarity, priceFoco, pricePremium, effects, imageUrl, isAvailableInShop } = req.body;
    
    const newItem = await prisma.inventoryItem.create({
      data: {
        slug,
        name,
        description,
        type: type || 'CONSUMABLE',
        rarity: rarity || 'COMMON',
        priceFoco: priceFoco || null,
        pricePremium: pricePremium || null,
        effects: effects || {},
        imageUrl,
        isAvailableInShop: isAvailableInShop !== undefined ? isAvailableInShop : true,
      }
    });
    
    res.status(201).json(newItem);
  } catch (error) {
    console.error('[Inventory] Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item', details: error.message });
  }
};

// Atualizar um item existente (como toggle de visibilidade)
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedItem = await prisma.inventoryItem.update({
      where: { id },
      data: updateData
    });
    
    res.json(updatedItem);
  } catch (error) {
    console.error('[Inventory] Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
};

// Deletar um item
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.inventoryItem.delete({
      where: { id }
    });
    
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    console.error('[Inventory] Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
};
