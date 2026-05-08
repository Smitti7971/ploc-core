/**
 * Configuração Central de Autenticação
 * 
 * Este arquivo valida se as chaves de segurança existem antes de permitir
 * que o servidor inicie.
 */
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret && process.env.NODE_ENV === 'production') {
  console.error('❌ ERRO CRÍTICO: Variável JWT_SECRET não encontrada no ambiente de produção!');
  process.exit(1);
}

module.exports = {
  jwtSecret: jwtSecret || 'ploc_dev_secret_key_low_security',
  jwtExpiration: '24h',
  algorithm: 'HS256'
};
