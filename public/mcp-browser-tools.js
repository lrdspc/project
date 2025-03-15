/**
 * MCP Browser Tools Integration
 * 
 * Este script facilita a integração com a extensão MCP Browser Tools para
 * monitoramento e debugging da aplicação.
 */

(function() {
  // Estado de conexão com a extensão
  let isConnected = false;
  const logs = [];
  const errors = [];
  const networkLogs = [];
  
  // Verifica se a extensão está instalada
  function checkBrowserToolsExtension() {
    return new Promise((resolve) => {
      if (window.mcpBrowserTools) {
        isConnected = true;
        console.log('[MCP] Extensão MCP Browser Tools detectada');
        resolve(true);
      } else {
        // Tenta se comunicar com a extensão
        window.addEventListener('message', function extensionListener(event) {
          if (event.data && event.data.type === 'MCP_BROWSER_TOOLS_READY') {
            window.removeEventListener('message', extensionListener);
            isConnected = true;
            console.log('[MCP] Extensão MCP Browser Tools conectada');
            resolve(true);
          }
        });
        
        // Envia uma mensagem para verificar se a extensão está ativa
        window.postMessage({ type: 'MCP_BROWSER_TOOLS_CHECK' }, '*');
        
        // Timeout após 1 segundo
        setTimeout(() => {
          if (!isConnected) {
            console.warn('[MCP] Extensão MCP Browser Tools não detectada');
            resolve(false);
          }
        }, 1000);
      }
    });
  }
  
  // Intercepta logs do console
  const originalConsoleLog = console.log;
  console.log = function(...args) {
    const log = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    
    logs.push({
      type: 'log',
      timestamp: new Date().toISOString(),
      message: log
    });
    
    originalConsoleLog.apply(console, args);
  };
  
  // Intercepta erros do console
  const originalConsoleError = console.error;
  console.error = function(...args) {
    const error = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    
    errors.push({
      type: 'error',
      timestamp: new Date().toISOString(),
      message: error
    });
    
    originalConsoleError.apply(console, args);
  };
  
  // Intercepta requisições fetch
  const originalFetch = window.fetch;
  window.fetch = function(resource, options) {
    const startTime = performance.now();
    const url = typeof resource === 'string' ? resource : resource.url;
    
    const networkLog = {
      type: 'fetch',
      url,
      method: options?.method || 'GET',
      timestamp: new Date().toISOString(),
      startTime
    };
    
    networkLogs.push(networkLog);
    const logIndex = networkLogs.length - 1;
    
    return originalFetch.apply(this, arguments)
      .then(response => {
        networkLogs[logIndex].status = response.status;
        networkLogs[logIndex].duration = performance.now() - startTime;
        networkLogs[logIndex].success = response.ok;
        return response;
      })
      .catch(error => {
        networkLogs[logIndex].error = error.message;
        networkLogs[logIndex].duration = performance.now() - startTime;
        networkLogs[logIndex].success = false;
        throw error;
      });
  };
  
  // API para interagir com o service worker
  const swAPI = {
    getRegistration: async function() {
      if (!('serviceWorker' in navigator)) {
        return null;
      }
      return navigator.serviceWorker.getRegistration();
    },
    
    getStats: async function() {
      const reg = await this.getRegistration();
      if (!reg || !reg.active) {
        return { error: 'Service worker não está ativo' };
      }
      
      return new Promise((resolve) => {
        const messageChannel = new MessageChannel();
        
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data);
        };
        
        reg.active.postMessage(
          { type: 'GET_STATS' },
          [messageChannel.port2]
        );
        
        // Timeout para o caso de não receber resposta
        setTimeout(() => {
          resolve({ error: 'Timeout ao tentar obter estatísticas' });
        }, 3000);
      });
    }
  };
  
  // Expõe a API para a extensão
  window.mcpBrowserToolsAPI = {
    getLogs: () => [...logs],
    getErrors: () => [...errors],
    getNetworkLogs: () => [...networkLogs],
    clearLogs: () => {
      logs.length = 0;
      errors.length = 0;
      networkLogs.length = 0;
    },
    getServiceWorkerStats: () => swAPI.getStats(),
    isConnected: () => isConnected
  };
  
  // Inicializa a integração
  checkBrowserToolsExtension()
    .then(connected => {
      if (connected && window.mcpBrowserTools) {
        window.mcpBrowserTools.init();
      }
    });
  
  // Adiciona listener para erros não capturados
  window.addEventListener('error', (event) => {
    errors.push({
      type: 'uncaught',
      timestamp: new Date().toISOString(),
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });
  
  console.log('[MCP] Integração MCP Browser Tools inicializada');
})(); 