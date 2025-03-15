const http = require('http');

// Criar um servidor HTTP simples
const server = http.createServer((req, res) => {
  console.log(`Requisição recebida: ${req.method} ${req.url}`);
  
  // Verificar se é a rota de identidade
  if (req.url === '/.identity') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      signature: "mcp-browser-connector-24x7",
      version: "1.0.0",
      name: "Browser Connector Server"
    }));
    return;
  }
  
  // Rota para screenshots
  if (req.url === '/screenshot' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        console.log('Screenshot recebido');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          path: '/screenshots/test.png',
          message: 'Screenshot recebido com sucesso'
        }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Erro ao processar screenshot' }));
      }
    });
    return;
  }
  
  // Rota para atualização de URL
  if (req.url === '/current-url' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log(`URL atualizada: ${data.url}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true,
          message: 'URL atualizada com sucesso'
        }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Erro ao processar URL' }));
      }
    });
    return;
  }
  
  // Rota padrão
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Servidor do MCP Browser Connector funcionando!');
});

// Iniciar o servidor na porta 3025
const PORT = 3025;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log('Pressione Ctrl+C para encerrar');
}); 