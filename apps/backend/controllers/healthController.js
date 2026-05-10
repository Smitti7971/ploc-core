const healthService = require('../services/healthService');

/**
 * Chef de Saúde (Controller)
 * Ele recebe o pedido, coordena o ajudante e prepara a resposta.
 */
const getHealthStatus = async (req, res) => {
  try {
    const health = await healthService.checkSystemHealth();
    res.status(200).json(health);
  } catch (error) {
    res.status(500).json({
      status: 'Unhealthy',
      message: error.message
    });
  }
};

module.exports = { getHealthStatus };
