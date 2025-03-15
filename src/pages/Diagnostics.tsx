import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  HardDrive,
  Radio,
  Server,
  RefreshCw,
  XCircle,
} from 'lucide-react';

interface ServiceWorkerStats {
  networkRequests: number;
  cacheHits: number;
  offlineTime: number;
  isOnline: boolean;
  error?: string;
}

// Interfaces para os logs
interface ConsoleLog {
  message: string;
  timestamp: number;
  type: 'log' | 'info' | 'warn' | 'error';
}

interface NetworkLog {
  url: string;
  method: string;
  status: number;
  timestamp: number;
  duration: number;
  size: number;
}

interface ConsoleError {
  message: string;
  stack?: string;
  timestamp: number;
}

const Diagnostics: React.FC = () => {
  const [swStats, setSwStats] = useState<ServiceWorkerStats | null>(null);
  const [swRegistration, setSwRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [logCount, setLogCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [networkRequestCount, setNetworkRequestCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [mcpConnected, setMcpConnected] = useState(false);

  // Função para buscar dados de diagnóstico
  const fetchDiagnosticData = async () => {
    setIsLoading(true);

    try {
      // Verifica o service worker
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        setSwRegistration(registration || null);

        // Busca estatísticas do service worker via API exposta pelo mcp-browser-tools.js
        if (window.mcpBrowserToolsAPI && registration?.active) {
          try {
            const stats =
              await window.mcpBrowserToolsAPI.getServiceWorkerStats();
            setSwStats(stats);
          } catch (error) {
            console.error(
              'Erro ao buscar estatísticas do Service Worker:',
              error
            );
          }
        }
      }

      // Verifica a conexão com MCP Browser Tools
      if (window.mcpBrowserToolsAPI) {
        setMcpConnected(window.mcpBrowserToolsAPI.isConnected());

        // Busca logs, erros e estatísticas de rede
        const logs = window.mcpBrowserToolsAPI.getLogs();
        const errors = window.mcpBrowserToolsAPI.getErrors();
        const networkLogs = window.mcpBrowserToolsAPI.getNetworkLogs();

        setLogCount(logs.length);
        setErrorCount(errors.length);
        setNetworkRequestCount(networkLogs.length);
      } else {
        setMcpConnected(false);
      }
    } catch (error) {
      console.error('Erro ao buscar dados de diagnóstico:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega dados ao montar o componente
  useEffect(() => {
    fetchDiagnosticData();

    // Atualiza dados a cada 5 segundos
    const interval = setInterval(fetchDiagnosticData, 5000);

    return () => clearInterval(interval);
  }, []);

  // Função para mostrar status do Service Worker
  const getSwStatus = () => {
    if (!swRegistration) return 'Não registrado';

    if (swRegistration.installing) return 'Instalando';
    if (swRegistration.waiting) return 'Aguardando ativação';
    if (swRegistration.active) return 'Ativo';

    return 'Desconhecido';
  };

  // Função para formatar tempo
  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Diagnósticos</h1>

      {/* Header com botão de atualização */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          Estatísticas e diagnósticos da aplicação
        </p>
        <button
          onClick={fetchDiagnosticData}
          disabled={isLoading}
          className={`flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
          />
          Atualizar
        </button>
      </div>

      {/* Status da integração MCP */}
      <div
        className={`p-4 rounded-md mb-6 ${mcpConnected ? 'bg-green-50' : 'bg-yellow-50'}`}
      >
        <div className="flex">
          <div
            className={`flex-shrink-0 ${mcpConnected ? 'text-green-400' : 'text-yellow-400'}`}
          >
            {mcpConnected ? (
              <Radio className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
          </div>
          <div className="ml-3">
            <h3
              className={`text-sm font-medium ${mcpConnected ? 'text-green-800' : 'text-yellow-800'}`}
            >
              {mcpConnected
                ? 'MCP Browser Tools conectado'
                : 'MCP Browser Tools não detectado'}
            </h3>
            <div
              className={`mt-2 text-sm ${mcpConnected ? 'text-green-700' : 'text-yellow-700'}`}
            >
              <p>
                {mcpConnected
                  ? 'A extensão está instalada e funcionando corretamente.'
                  : 'A extensão não foi detectada. Por favor, verifique se está instalada e ativada.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Service Worker */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Server className="h-8 w-8 text-blue-500 mr-3" />
            <h2 className="text-lg font-medium text-gray-900">
              Service Worker
            </h2>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  swRegistration?.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {getSwStatus()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Modo:</span>
              <span className="text-gray-900">
                {swStats?.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tempo offline:</span>
              <span className="text-gray-900">
                {swStats ? formatTime(swStats.offlineTime) : 'N/A'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Scope:</span>
              <span className="text-gray-900 text-sm">
                {swRegistration?.scope || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Cache */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <HardDrive className="h-8 w-8 text-purple-500 mr-3" />
            <h2 className="text-lg font-medium text-gray-900">Cache</h2>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Requisições totais:</span>
              <span className="text-gray-900 font-medium">
                {swStats?.networkRequests || 0}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cache hits:</span>
              <span className="text-gray-900 font-medium">
                {swStats?.cacheHits || 0}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Hit ratio:</span>
              <span className="text-gray-900 font-medium">
                {swStats && swStats.networkRequests > 0
                  ? `${Math.round((swStats.cacheHits / swStats.networkRequests) * 100)}%`
                  : '0%'}
              </span>
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-500 mr-3" />
            <h2 className="text-lg font-medium text-gray-900">Debug</h2>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Logs:</span>
              <span className="text-gray-900 font-medium">{logCount}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Erros:</span>
              <span
                className={`text-${errorCount > 0 ? 'red' : 'gray'}-900 font-medium`}
              >
                {errorCount}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Requisições de rede:</span>
              <span className="text-gray-900 font-medium">
                {networkRequestCount}
              </span>
            </div>

            <div className="mt-6">
              <button
                onClick={() => {
                  if (window.mcpBrowserToolsAPI) {
                    window.mcpBrowserToolsAPI.clearLogs();
                    fetchDiagnosticData();
                  }
                }}
                disabled={!mcpConnected}
                className={`w-full inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md ${
                  mcpConnected
                    ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                    : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                }`}
              >
                Limpar logs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Instruções */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">
            Usando MCP Browser Tools
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="space-y-4">
            <p className="text-gray-700">
              Recursos disponíveis na extensão MCP Browser Tools:
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Monitoramento de logs do console</li>
              <li>Rastreamento de erros e exceções</li>
              <li>Inspeção de requisições de rede</li>
              <li>Estatísticas do service worker</li>
              <li>Informações de cache</li>
              <li>Captura de screenshots</li>
            </ul>
            <p className="text-gray-700">
              Para acessar a extensão, clique no ícone do MCP Browser Tools na
              barra de extensões do navegador.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Adicionar tipagem para o objeto global Window
declare global {
  interface Window {
    mcpBrowserTools?: {
      version: string;
      extensionId: string;
    };
    mcpBrowserToolsAPI?: {
      getLogs: () => ConsoleLog[];
      getErrors: () => ConsoleError[];
      getNetworkLogs: () => NetworkLog[];
      clearLogs: () => void;
      getServiceWorkerStats: () => Promise<ServiceWorkerStats>;
      isConnected: () => boolean;
    };
  }
}

export default Diagnostics;
