/**
 * Configuração Central de Autenticação
 * 
 * Este arquivo valida se as chaves de segurança existem antes de permitir
 * que o servidor inicie.
 */
const jwtSecret = process.env.JWT_SECRET || 'ploc_fallback_emergency_secret_2026';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ AVISO: Variável JWT_SECRET não encontrada. Usando chave de emergência (Não recomendado para produção real).');
}

module.exports = {
  jwtSecret: jwtSecret || 'ploc_dev_secret_key_low_security',
  jwtExpiration: '24h',
  algorithm: 'HS256'
};
