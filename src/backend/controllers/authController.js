const prisma = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');
const JWT_SECRET = authConfig.jwtSecret;

// Cadastro de novos usuários
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const cleanEmail = email?.trim().toLowerCase();
    const cleanName = name?.trim();

    if (!cleanEmail || !password || password.trim() === '') {
      return res.status(400).json({ error: "Email e senha válidos são obrigatórios" });
    }

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existingUser) {
      return res.status(400).json({ error: "Usuário já cadastrado com este e-mail" });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: { name: cleanName, email: cleanEmail, password: hashedPassword }
    });

    res.status(201).json({ message: "Usuário criado com sucesso! ✨" });
  } catch (error) {
    console.error('❌ Erro no Registro:', error);
    res.status(500).json({ error: 'Erro interno ao processar cadastro' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email?.trim().toLowerCase();

    // Buscar usuário
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (!user || !user.password) {
      return res.status(401).json({ error: "E-mail ou senha incorretos" });
    }

    // Comparar senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "E-mail ou senha incorretos" });
    }

    // Gerar Token JWT (Centralizado)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { 
        expiresIn: authConfig.jwtExpiration,
        algorithm: authConfig.algorithm 
      }
    );

    res.json({
      message: "Login realizado com sucesso! 🔓",
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('❌ Erro no Login:', error);
    res.status(500).json({ error: 'Erro interno ao processar login' });
  }
};
