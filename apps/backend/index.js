require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const prisma = require('./config/database'); // Unificado para o Singleton
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const aiRoutes = require('./routes/aiRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const healthRoutes = require('./routes/healthRoutes');
const routineRoutes = require('./routes/routineRoutes');

const path = require('path');

const app = express();
app.use('/audio', express.static(path.join(__dirname, 'public/audio')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, '../frontend')));

const port = process.env.PORT || 3000;
console.log(`📡 Porta configurada: ${port} (Ambiente: ${process.env.NODE_ENV || 'development'})`);

// --- LOGGER DE ACESSO (DETALHADO PARA DEBUG) ---
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const authHeader = req.headers.authorization ? 'Enviado ✅' : 'Ausente ❌';
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl || req.url} - ${res.statusCode} (${duration}ms) | Auth: ${authHeader}`);
  });
  next();
});

// --- CONFIGURAÇÃO DE BORDA (Proxy/Coolify) ---
app.set('trust proxy', 1);

// --- MIDDLEWARES DE SEGURANÇA ---
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false, // Desativado temporariamente para facilitar o debug em sslip.io
}));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://ploc.midializando.cloud',
  'http://localhost:5173',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://127.0.0.1:3001',
  'http://localhost:3001'
].filter(Boolean);

// --- MIDDLEWARE DE CORS MANUAL (FORÇA BRUTA) ---
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Configuração de CORS (Fallback)
app.use(cors({
  origin: true,
  credentials: true
}));

// Limitador desativado para desenvolvimento

// Limite de 10kb para evitar payloads gigantes (DOS)
app.use(express.json({ limit: '10kb' }));

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

// Nova Rota de Saúde (Padrão Enterprise)
app.use('/api', healthRoutes);

// Rota de Diagnóstico Simplificada para o Frontend
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Healthy', 
    message: 'Ploc Backend está ONLINE! 🚀',
    timestamp: new Date().toISOString()
  });
});

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

app.use('/api/auth', authRoutes);

// Rotas de Usuários (PROTEGIDAS)
app.use('/api/users', authMiddleware, userRoutes);

// Rotas de Tarefas e Rotinas (PROTEGIDAS)
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/routines', authMiddleware, routineRoutes);
app.get('/api/ping-routines', (req, res) => res.json({ message: "Routine route is registered! 🚀" }));

// Rotas de IA (Proteção agora é interna por rota)
app.use('/api/ai', aiRoutes);

// Rotas de Upload e Storage
app.use('/api', uploadRoutes);
app.post('/api/test-post', (req, res) => res.json({ message: "POST Direto funcionando! 🚀" }));

console.log('✅ Rota de Upload Registrada em: /api/upload');

// --- GESTÃO DE ERROS GLOBAL (Rede de Proteção) ---
app.use((err, req, res, next) => {
  console.error('❌ Erro Não Tratado:', err.stack);
  res.status(500).json({ 
    message: "Ocorreu um erro interno no servidor 😭", 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${port}`);
});

// --- GRACEFUL SHUTDOWN (Desligamento Suave) ---
const gracefulShutdown = async (signal) => {
  console.log(`\nEncerrando servidor (Sinal: ${signal})... 🛑`);
  try {
    await prisma.$disconnect();
    console.log('✅ Banco de Dados: Desconectado com segurança.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro durante o desligamento:', err);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
