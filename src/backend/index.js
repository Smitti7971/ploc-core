const express = require('express');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Carregando variáveis de ambiente da raiz
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const app = express();
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
    // Tenta uma operação simples no banco
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

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
