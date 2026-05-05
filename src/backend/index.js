const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    message: "Ploc Backend está ONLINE! 🚀",
    status: "Healthy",
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
