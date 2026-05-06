const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware para JSON (preparando para a API)
app.use(express.json());

// Endpoint de saúde movido para /api/health
app.get('/api/health', (req, res) => {
  res.json({
    message: "Ploc Backend está ONLINE! 🚀",
    status: "Healthy",
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
