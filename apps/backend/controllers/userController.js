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

exports.seedUsers = async (req, res) => {
  try {
    const result = await userService.seedTestData();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
