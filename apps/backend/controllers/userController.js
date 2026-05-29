const userService = require('../services/UserService');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.listAll();
    res.json(users);
  } catch (error) {
    console.error('❌ Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno ao buscar usuários' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user.id);
    res.json(user);
  } catch (error) {
    console.error('❌ Erro ao buscar perfil:', error.message);
    const status = error.message.includes('encontrado') ? 404 : 500;
    res.status(status).json({ error: error.message });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const updatedUser = await userService.updateProfile(req.user.id, req.body);
    res.json({
        message: "Perfil atualizado com sucesso! ✨",
        user: updatedUser
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar perfil:', error.message);
    res.status(500).json({ error: 'Erro ao atualizar configurações' });
  }
};

exports.deleteMe = async (req, res) => {
  try {
    await userService.deleteAccount(req.user.id);
    res.json({ message: "Conta excluída permanentemente. Sentiremos sua falta! 🫡" });
  } catch (error) {
    console.error('❌ Erro ao excluir conta:', error.message);
    res.status(500).json({ error: 'Erro ao processar exclusão' });
  }
};

exports.updatePlocState = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plocState } = req.body;
    
    const prisma = require('../config/database');
    await prisma.userStats.upsert({
      where: { userId },
      update: {
        plocState: plocState,
        lastPlocSync: new Date()
      },
      create: {
        userId,
        plocState: plocState,
        lastPlocSync: new Date()
      }
    });

    res.json({ message: "Estado do Ploc atualizado com sucesso!" });
  } catch (error) {
    console.error('❌ Erro ao sincronizar PlocState:', error.message);
    res.status(500).json({ error: 'Erro ao sincronizar estado do Mascote' });
  }
};

exports.addPlocInventoryItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { item } = req.body;
    
    if (!item || !item.type) {
      return res.status(400).json({ error: 'Item inválido ou ausente' });
    }

    const prisma = require('../config/database');
    
    // Tenta mapear o item do frontend para um slug do banco
    let slug = 'apple';
    if (item.type === 'food' && item.name?.toLowerCase().includes('caf')) slug = 'coffee';
    if (item.type === 'water') slug = 'water';
    if (item.type === 'medicine') slug = 'medicine';

    const dbItem = await prisma.inventoryItem.findUnique({
      where: { slug }
    });

    if (dbItem) {
      try {
        await prisma.userInventory.create({
          data: {
            userId: userId,
            inventoryItemId: dbItem.id,
            quantity: 1,
            acquiredAt: new Date(item.createdAt || Date.now())
          }
        });
      } catch (err) {
        // Ignora duplicidade caso já exista restrição (dependendo do banco)
        console.warn('Possível duplicidade no inventário ignorada');
      }
    }

    res.json({ message: "Item adicionado ao inventário relacional com sucesso!" });
  } catch (error) {
    console.error('❌ Erro ao adicionar item no UserInventory:', error.message);
    res.status(500).json({ error: 'Erro ao adicionar item na mochila do Mascote' });
  }
};

exports.seedUsers = async (req, res) => {
  try {
    const result = await userService.seedTestData();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
