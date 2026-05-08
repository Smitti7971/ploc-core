const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const prisma = require('./config/database'); // Unificado para o Singleton
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const healthRoutes = require('./routes/healthRoutes');

// Carregando variáveis de ambiente
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// --- MIDDLEWARES DE SEGURANÇA ---
app.use(helmet());
app.use(cors({
  origin: ['https://ploc.midializando.cloud', 'http://localhost:5173', 'http://127.0.0.1:5500', 'http://localhost:5500'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: { message: "Muitas requisições, tente novamente em 15 minutos.", status: "Error" }
});
app.use('/api/', limiter);

app.use(express.json());

// --- ROTAS DE SAÚDE (Redundância para Coolify) ---

const DEPLOY_ID = process.env.COOLIFY_DEPLOY_UUID || 'local-dev';

// Raiz (Muitos Health Checks batem aqui)
app.get('/', (req, res) => {
  res.json({ 
    message: "Ploc API is ALIVE! 🚀", 
    status: "Healthy", 
    deploy_id: DEPLOY_ID,
    timestamp: new Date() 
  });
});

// /health (Padrão Coolify/Docker)
app.get('/health', (req, res) => {
  res.json({ 
    message: "Ploc Backend está ONLINE! 🚀", 
    status: "Healthy",
    deploy_id: DEPLOY_ID
  });
});

// /api/health (Antiga)
app.get('/api/health', (req, res) => {
  res.json({ message: "Ploc Backend está ONLINE! 🚀", status: "Healthy" });
});

// Nova Rota de Saúde (Padrão Enterprise)
app.use('/api', healthRoutes);

// Rota de status do banco
app.get('/api/db-status', async (req, res) => {
  try {
    await prisma.$connect();
    const count = await prisma.user.count();
    res.json({ status: "Connected", database: "PostgreSQL", userCount: count });
  } catch (error) {
    res.status(500).json({ status: "Error", error: error.message });
  }
});

// Rotas de Autenticação (Login/Cadastro)
app.use('/api/auth', authRoutes);

// Rotas de Usuários (PROTEGIDAS)
app.use('/api/users', authMiddleware, userRoutes);

// Rotas de Tarefas e Rotinas (PROTEGIDAS)
app.use('/api/tasks', authMiddleware, taskRoutes);

// --- INICIALIZAÇÃO ---
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${port}`);
});
