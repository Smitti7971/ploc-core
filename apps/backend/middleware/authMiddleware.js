const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const JWT_SECRET = authConfig.jwtSecret;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.query.token;

    if (!token) {
      return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
    }

    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: [authConfig.algorithm] });
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido ou expirado." });
  }
};
