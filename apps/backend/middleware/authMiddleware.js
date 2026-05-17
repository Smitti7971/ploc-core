const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const JWT_SECRET = authConfig.jwtSecret;

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1] || req.query.token;

    if (!token) {
      console.warn('⚠️ [AuthMiddleware] Tentativa de acesso sem token:', req.method, req.url);
      return res.status(401).json({ message: "Acesso negado. Token não fornecido." });
    }

    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: [authConfig.algorithm] });
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ [AuthMiddleware] Erro ao validar token:', error.message);
    res.status(401).json({ message: `Token inválido ou expirado: ${error.message}` });
  }
};
