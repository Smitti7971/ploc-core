require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const prisma = require('./config/database'); // Unificado para o Singleton
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const healthRoutes = require('./routes/healthRoutes');
const trackerRoutes = require('./routes/trackerRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

const path = require('path');

const app = express();
app.use('/audio', express.static(path.join(__dirname, 'public/audio')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Proxy interno para contornar o erro 503 do MinIO no Coolify
const http = require('http');
app.get('/api/minio-proxy/*', (req, res) => {
  // Pega o caminho depois do /api/minio-proxy/
  const imagePath = req.url.replace('/api/minio-proxy/', '/');
  const minioUrl = `http://72.61.63.84:9000${imagePath}`;
  
  http.get(minioUrl, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  }).on('error', (err) => {
    res.status(500).send('Proxy Error');
  });
});

// Fallback para quando a imagem não existir no servidor (evita o erro de CORB e tenta no MinIO)
app.use('/uploads', (req, res) => {
  const bucket = process.env.STORAGE_BUCKET || 'ploc-assets';
  const minioUrl = `http://72.61.63.84:9000/${bucket}${req.url}`;
  
  http.get(minioUrl, (proxyRes) => {
    if (proxyRes.statusCode === 200) {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    } else {
      res.setHeader('Content-Type', 'image/svg+xml');
      res.status(404).send('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>');
    }
  }).on('error', (err) => {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(404).send('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>');
  });
});
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
  // Reativando o CSP (Content Security Policy) com configurações relaxadas para permitir imagens do MinIO
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "http://72.61.63.84:9000", "https://ploc.midializando.cloud"],
      connectSrc: ["'self'", "http://72.61.63.84:9000", "https://ploc.midializando.cloud"],
    },
  },
}));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://ploc.midializando.cloud',
  'http://localhost:5173',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://127.0.0.1:3001',
  'http://localhost:3001',
  'http://localhost:3000'
].filter(Boolean);

// --- CONFIGURAÇÃO DE CORS ---
app.use(cors({
  origin: function (origin, callback) {
    // Permite qualquer origem que contenha 'midializando.cloud', ou localhost
    if (!origin || origin.includes('midializando.cloud') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, origin || true);
    } else {
      console.warn(`Tentativa de acesso bloqueada por CORS da origem: ${origin}`);
      callback(null, false); // false = não permite, mas não quebra a app
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// --- LIMITADOR DE TAXA (RATE LIMIT) ---
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 150, // Limite de 150 requests por minuto por IP
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});
app.use(limiter);

// Limite aumentado para 1mb para suportar o Inventário do Ploc que pode crescer
app.use(express.json({ limit: '1mb' }));

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

// Rotas de Rastreador Universal (PROTEGIDAS)
app.use('/api/tracker', authMiddleware, trackerRoutes);

// Rotas de Admin do Inventario
app.use('/api/inventory', authMiddleware, inventoryRoutes);

// Rotas de IA (Proteção agora é interna por rota)
app.use('/api/ai', aiRoutes);

// Rotas de Upload e Storage
app.use('/api', uploadRoutes);
app.post('/api/test-post', (req, res) => res.json({ message: "POST Direto funcionando! 🚀" }));

console.log('✅ Rota de Upload Registrada em: /api/upload');

// --- GESTÃO DE ERROS GLOBAL (Rede de Proteção) ---
app.use((err, req, res, next) => {
  console.error('❌ Erro Não Tratado:', err.stack);
  require('fs').writeFileSync('global_error.log', err.stack || err.message);
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
