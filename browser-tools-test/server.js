const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3025;

// Habilitar CORS para todas as origens
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (para a página HTML)
app.use(express.static(path.join(__dirname, 'public')));

// Log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Endpoint para verificar a identidade
app.get('/.identity', (req, res) => {
  res.json({
    signature: "mcp-browser-connector-24x7",
    version: "1.0.0",
    name: "MCP Browser Tools Connector",
    status: "active"
  });
});

// Endpoint para receber screenshots
app.post('/screenshot', (req, res) => {
  console.log('Screenshot recebido');
  
  // Simulação, já que não vamos salvar os screenshots
  setTimeout(() => {
    res.json({
      success: true,
      path: '/screenshots/test.png',
      message: 'Screenshot processado com sucesso'
    });
  }, 500);
});

// Endpoint para atualizar URL
app.post('/current-url', (req, res) => {
  const { url, tabId, timestamp, source } = req.body;
  console.log(`URL atual: ${url} (Tab: ${tabId}, Fonte: ${source})`);
  
  res.json({
    success: true,
    message: 'URL registrada com sucesso'
  });
});

// Endpoint para receber logs do console
app.post('/console-logs', (req, res) => {
  const { logs } = req.body;
  console.log(`Recebidos ${logs.length} logs de console`);
  
  res.json({
    success: true,
    count: logs.length
  });
});

// Rota para página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Criar diretório para arquivos estáticos
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor MCP Browser Tools rodando em http://localhost:${PORT}`);
}); 