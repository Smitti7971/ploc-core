const authService = require('../services/AuthService');

exports.register = async (req, res) => {
  try {
    await authService.registerUser(req.body);
    res.status(201).json({ message: "Usuário criado com sucesso! ✨" });
  } catch (error) {
    console.error('❌ Erro no Registro:', error.message);
    const status = error.message.includes('obrigatórios') || error.message.includes('cadastrado') ? 400 : 500;
    res.status(status).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.authenticateUser(email, password);
    
    res.json({
      message: "Login realizado com sucesso! 🔓",
      ...result
    });
  } catch (error) {
    console.error('❌ Erro no Login:', error.message);
    const status = error.message.includes('incorretos') ? 401 : 500;
    res.status(status).json({ error: error.message });
  }
};
