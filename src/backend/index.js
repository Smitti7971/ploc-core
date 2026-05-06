const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve arquivos estáticos da pasta frontend
app.use(express.static(path.join(__dirname, '../frontend')));

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
