const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'ploc_secret_key_123';

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido ou expirado." });
  }
};
