const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Carregando variáveis de ambiente
require('dotenv').config();

const app = express();

// --- BLINDAGEM DE SEGURANÇA ---
app.use(helmet()); // Protege os cabeçalhos HTTP

app.use(cors({
  origin: ['https://ploc.midializando.cloud', 'http://localhost:5173'], // Domínios autorizados
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Limitador de requisições: 100 pedidos a cada 15 minutos por IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: {
    message: "Muitas requisições vindas deste IP, tente novamente em 15 minutos.",
    status: "Error"
  }
});
app.use('/api/', limiter); // Aplica apenas nas rotas de API
// ------------------------------

const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(express.json());

// Endpoint de saúde da API
app.get('/api/health', (req, res) => {
  res.json({
    message: "Ploc Backend está ONLINE! 🚀",
    status: "Healthy",
    timestamp: new Date().toISOString()
  });
});

// Endpoint de teste de conexão com o Banco de Dados
app.get('/api/db-status', async (req, res) => {
  try {
    await prisma.$connect();
    const userCount = await prisma.user.count();
    
    res.json({
      message: "Conexão com o banco estabelecida com sucesso! 🗄️",
      status: "Connected",
      database: "PostgreSQL",
      currentUsers: userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro no banco:', error);
    res.status(500).json({
      message: "Falha ao conectar no banco de dados",
      status: "Error",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${port}`);
});
